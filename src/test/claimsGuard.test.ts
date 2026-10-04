import { describe, it, expect } from 'vitest';
import {
  buildVocabulary,
  detectUnsupportedClaims,
  MAX_EXPANSION_RATIO,
} from '../features/ia-assistant/claimsGuard';
import { collectImprovableFields } from '../features/ia-assistant/fieldCatalog';
import { conservativeRewrite, countBullets, loadRealCv } from './fixtures/realCv';

const ctx = buildVocabulary(
  {
    about_info: { title: '', description: '' },
    contact_info: {
      email: [],
      phone_number: [],
      address: { street_name: '', ext_number: '', city: '', state: '', country: '' },
    },
    personal_info: { name: '', lastname: '', second_lastname: '', birthdate: '' },
  },
  {
    abilities: [{ id: 1, name: 'Python (Django, FastAPI, Flask)', level: 9 }],
    experience: [
      {
        id: 0,
        job_name: 'IT Seekers',
        addr: '',
        duration_start: '',
        duration_end: '',
        position_name: 'UI Developer',
        pos_description: '• Delivered features for the Grupo Aeroméxico platform with FastAPI and React.',
      },
    ],
  },
);

/** Convenience: run the guard and return the warning texts joined. */
function warnings(original: string, suggestion: string): string {
  return detectUnsupportedClaims(original, suggestion, ctx).join(' | ');
}

describe('buildVocabulary', () => {
  it('should index every token of the whole CV, read only fields included', () => {
    expect(ctx.vocabulary.has('aeroméxico')).toBe(true);
    expect(ctx.vocabulary.has('fastapi')).toBe(true);
    expect(ctx.vocabulary.has('django')).toBe(true);
    expect(ctx.vocabulary.has('seekers')).toBe(true);
  });

  it('should index terms that only appear inside a sentence', () => {
    const { header, details } = loadRealCv();
    const real = buildVocabulary(header, details);
    expect(real.vocabulary.has('kpis')).toBe(true);
    expect(real.vocabulary.has('travelhub')).toBe(true);
  });
});

describe('figures check', () => {
  it('should flag a figure that the original does not contain', () => {
    expect(warnings('Managed a team of engineers', 'Managed a team of 18 engineers')).toContain(
      'introduce la cifra "18"',
    );
  });

  it('should accept a figure already present in the original', () => {
    expect(warnings('Reduced errors by 30%', 'Cut errors by 30%')).not.toContain('cifra');
  });

  it('should accept a figure that only the CV context knows about', () => {
    const { header, details } = loadRealCv();
    const real = buildVocabulary(header, details);
    const original = 'I am a Software Engineer with +15 years of experience.';
    expect(detectUnsupportedClaims(original, original, real).filter((w) => w.includes('cifra'))).toEqual([]);
  });
});

describe('terminology check', () => {
  it('should flag a technology that appears nowhere in the CV', () => {
    expect(warnings('Built services for the platform', 'Built services with Kubernetes')).toContain(
      'introduce el término "Kubernetes"',
    );
  });

  it('should accept a technology present in the original field and flag one that is not', () => {
    const result = detectUnsupportedClaims(
      'Built services with Webpack',
      'Built services with Webpack and Redis',
      ctx,
    );
    expect(result.filter((warning) => warning.includes('Webpack'))).toEqual([]);
    expect(result).toContain('introduce el término "Redis"');
  });

  it('should accept a technology declared in another section of the CV', () => {
    expect(
      warnings('Delivered features for the platform', 'Delivered features with FastAPI'),
    ).not.toContain('Kubernetes');
  });

  it('should accept an acronym already present in the original field', () => {
    expect(warnings('Worked on the API layer', 'Worked on the API layer and SQL')).not.toContain(
      '"API"',
    );
  });

  it('should accept a technology declared under abilities, in another section', () => {
    expect(warnings('Worked on the API layer', 'Worked on the API layer with Django')).not.toContain(
      'término',
    );
  });

  it('should still flag an acronym the CV never mentions', () => {
    expect(warnings('Worked on the API layer', 'Worked on the API layer with SQL')).toContain(
      'introduce el término "SQL"',
    );
  });

  it('should not report the first word of every sentence', () => {
    expect(warnings('Built services', 'Delivered services')).not.toContain('término');
  });

  it('should not report the word that opens each bullet', () => {
    const original = '• Built services for the platform';
    expect(warnings(original, '• Delivered services for the platform')).not.toContain('término');
  });

  it('should report each unknown term only once', () => {
    const result = warnings(
      'Built services for the platform',
      'Built services with Kubernetes, Kubernetes, Kubernetes',
    );
    expect(result.split('Kubernetes').length - 1).toBe(1);
  });
});

describe('length check', () => {
  it('should flag a suggestion far longer than the original', () => {
    const original = 'Delivered features.';
    const suggestion = original + ' '.repeat(0) + 'x'.repeat(Math.ceil(original.length * (MAX_EXPANSION_RATIO + 0.5)));
    expect(warnings(original, suggestion)).toContain('expande el texto');
  });

  it('should flag a suggestion far shorter than the original', () => {
    expect(
      warnings('Delivered a very long and detailed description of the work', 'Short.'),
    ).toContain('recorta demasiado');
  });

  it('should stay silent for a rewrite of similar length', () => {
    const original = 'Delivered new functionality components for the web platform.';
    const suggestion = 'Built new functionality components for the web platform.';
    expect(warnings(original, suggestion)).not.toContain('expande');
  });
});

describe('bullets check', () => {
  const fourBullets =
    '• First item here\n• Second item here\n• Third item here\n• Fourth item here';

  it('should flag bullets turned into a paragraph', () => {
    expect(warnings(fourBullets, 'First item here. Second item here.')).toContain(
      'cambia el formato de viñetas',
    );
  });

  it('should flag a change of more than one bullet', () => {
    expect(warnings(fourBullets, '• First item\n• Second item')).toContain('número de viñetas');
  });

  it('should accept a difference of one bullet', () => {
    expect(warnings(fourBullets, '• First\n• Second\n• Third')).not.toContain('viñetas');
  });

  it('should accept a field that never used bullets', () => {
    expect(warnings('A plain paragraph of text.', 'Another plain paragraph of text.')).not.toContain(
      'viñetas',
    );
  });
});

describe('language check', () => {
  it('should flag an English rewrite of a Spanish field', () => {
    const original =
      'Desarrollo de nuevos componentes funcionales para la plataforma web de la empresa, con especial foco en los flujos de reserva.';
    const suggestion =
      'Development of new functional components for the company web platform, with a strong focus on the booking flows.';
    expect(warnings(original, suggestion)).toContain('posible cambio de idioma');
  });

  it('should accept a rewrite that keeps the language', () => {
    const original =
      'Desarrollo de nuevos componentes funcionales para la plataforma web de la empresa, con foco en los flujos de reserva.';
    const suggestion =
      'Desarrollo de nuevos componentes funcionales para la plataforma web de la empresa, con foco en los flujos de reserva.';
    expect(warnings(original, suggestion)).not.toContain('idioma');
  });
});

describe('no false positives on the shipped CV', () => {
  const { header, details, source } = loadRealCv();
  const real = buildVocabulary(header, details);
  const fields = collectImprovableFields(header, details);

  it('should prefer the real cvdata.json when it is available', () => {
    expect(['cvdata.json', 'fallback']).toContain(source);
    expect(fields.length).toBeGreaterThan(0);
  });

  it('should stay quiet on a conservative rewrite of every improvable field', () => {
    for (const field of fields) {
      const suggestion = conservativeRewrite(field.value);
      const result = detectUnsupportedClaims(field.value, suggestion, real);
      expect({ path: field.path, warnings: result }).toEqual({
        path: field.path,
        warnings: [],
      });
    }
  });

  it('should stay quiet when a field is left untouched', () => {
    for (const field of fields) {
      expect(detectUnsupportedClaims(field.value, field.value, real)).toEqual([]);
    }
  });

  it('should keep the experience bullets intact when only rewording them', () => {
    const field = fields.find((entry) => entry.path === 'experience[0].pos_description');
    expect(field).toBeDefined();
    expect(countBullets(field!.value)).toBeGreaterThan(1);

    const suggestion = conservativeRewrite(field!.value);

    expect(countBullets(suggestion)).toBe(countBullets(field!.value));
    expect(detectUnsupportedClaims(field!.value, suggestion, real)).toEqual([]);
  });
});