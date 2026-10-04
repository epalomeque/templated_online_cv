import { describe, it, expect } from 'vitest';
import {
  collectImprovableFields,
  findPattern,
  groupBySection,
  isImprovableValue,
  MIN_CHARS,
  resolvePath,
  EXCLUDED_PATHS,
  FIELD_PATTERNS,
} from '../features/ia-assistant/fieldCatalog';
import { loadRealCv } from './fixtures/realCv';

describe('fieldCatalog', () => {
  it('should expose the ten whitelisted patterns', () => {
    expect(FIELD_PATTERNS).toHaveLength(10);
  });

  it.each(
    FIELD_PATTERNS.map((pattern) => [pattern.pathPattern, pattern.label, pattern.policy] as const),
  )('should describe %s', (pathPattern, label, policy) => {
    expect(label.length).toBeGreaterThan(0);
    expect(['REWRITE', 'FORMAT_ONLY']).toContain(policy);
    expect(patternHasContainer(pathPattern)).toBe(true);
  });

  it('should keep read only fields out of the whitelist', () => {
    const concreteReadOnly = [
      'personal_info.name',
      'contact_info.email',
      'contact_info.address',
      'social_media[0].url',
      'experience[0].addr',
      'experience[0].duration_start',
      'experience[0].duration_end',
      'education[0].institute_name',
      'education[0].addr',
      'education[0].duration_start',
      'education[0].duration_end',
      'projects[0].name',
      'abilities[0].level',
      'languages[0].name',
      'picture',
    ];
    for (const path of concreteReadOnly) {
      expect(resolvePath(path), path).toBeNull();
    }
  });

  it('should document every excluded path', () => {
    expect(EXCLUDED_PATHS.length).toBeGreaterThan(0);
    expect(EXCLUDED_PATHS).toContain('projects[i].name');
    expect(EXCLUDED_PATHS).toContain('abilities[i].level');
    expect(EXCLUDED_PATHS).toContain('contact_info.*');
  });

  it('should never whitelist project names, which hold URLs', () => {
    const paths = FIELD_PATTERNS.map((pattern) => pattern.pathPattern);
    expect(paths).not.toContain('projects[i].name');
  });

  it('should never whitelist the skill level', () => {
    const paths = FIELD_PATTERNS.map((pattern) => pattern.pathPattern);
    expect(paths.some((path) => path.includes('level'))).toBe(false);
  });

  it('should filter values shorter than MIN_CHARS', () => {
    expect(MIN_CHARS).toBe(20);
    expect(isImprovableValue('a'.repeat(MIN_CHARS))).toBe(true);
    expect(isImprovableValue('a'.repeat(MIN_CHARS - 1))).toBe(false);
    expect(isImprovableValue('   ')).toBe(false);
    expect(isImprovableValue(undefined)).toBe(false);
    expect(isImprovableValue(42)).toBe(false);
  });

  it('should ignore padding when measuring the length', () => {
    expect(isImprovableValue(`   ${'a'.repeat(MIN_CHARS)}   `)).toBe(true);
  });

  it('should collect only whitelisted fields of the real CV', () => {
    const { header, details } = loadRealCv();
    const fields = collectImprovableFields(header, details);

    expect(fields.length).toBeGreaterThan(0);
    for (const field of fields) {
      expect(findPattern(field.path)).toBeDefined();
      expect(field.value.trim().length).toBeGreaterThanOrEqual(MIN_CHARS);
    }
  });

  it('should use redux shaped paths for the real CV', () => {
    const { header, details } = loadRealCv();
    const paths = collectImprovableFields(header, details).map((field) => field.path);

    expect(paths).toContain('about_info.description');
    expect(paths.some((path) => /^experience\[\d+\]\.pos_description$/.test(path))).toBe(true);
    expect(paths).not.toContain('about.description');
  });

  it('should omit fields that are empty', () => {
    const { header, details } = loadRealCv();
    const blank = {
      ...header,
      about_info: { ...header.about_info, description: '   ' },
    };
    const paths = collectImprovableFields(blank, details).map((field) => field.path);
    expect(paths).not.toContain('about_info.description');
  });

  it('should group fields by section and drop empty sections', () => {
    const { header, details } = loadRealCv();
    const fields = collectImprovableFields(header, details);
    const groups = groupBySection(fields);

    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) {
      expect(group.fields.length).toBeGreaterThan(0);
      expect(group.fields.every((field) => field.section === group.section)).toBe(true);
    }
    expect(groups.map((group) => group.section)).toContain('experience');
  });

  it('should resolve container from the catalog rather than hardcoding it', () => {
    expect(resolvePath('about_info.description')?.container).toBe('header');
    expect(resolvePath('about_info.description')?.index).toBeNull();
    expect(resolvePath('experience[2].job_name')?.container).toBe('details');
    expect(resolvePath('experience[2].job_name')?.index).toBe(2);
    expect(resolvePath('experience[2].job_name')?.key).toBe('job_name');
    expect(resolvePath('interests[0]')?.key).toBeNull();
  });

  it('should reject paths outside the whitelist', () => {
    expect(resolvePath('contact_info.email')).toBeNull();
    expect(resolvePath('projects[0].name')).toBeNull();
    expect(resolvePath('experience[x].job_name')).toBeNull();
    expect(resolvePath('experience[0]job_name')).toBeNull();
    expect(resolvePath('nonsense')).toBeNull();
  });

  it('should find the pattern that governs a concrete path', () => {
    expect(findPattern('education[0].grade_name')?.label).toBe('Titulación');
    expect(findPattern('interests[3]')?.label).toBe('Interés');
  });
});

/** Helper asserting a pattern declares a valid container. */
function patternHasContainer(pathPattern: string): boolean {
  const pattern = FIELD_PATTERNS.find((entry) => entry.pathPattern === pathPattern);
  return pattern?.container === 'header' || pattern?.container === 'details';
}