import { describe, it, expect } from 'vitest';
import {
  SYSTEM_PROMPT,
  buildCvContext,
  buildSystemPrompt,
  buildUserPrompt,
} from '../features/ia-assistant/promptBuilder';
import { collectImprovableFields, groupBySection } from '../features/ia-assistant/fieldCatalog';
import { loadRealCv } from './fixtures/realCv';

describe('system prompt', () => {
  it('should carry the ten absolute rules', () => {
    const rules = SYSTEM_PROMPT.match(/^\d+\. /gm) ?? [];
    expect(rules).toHaveLength(10);
  });

  it('should forbid invention, translation and format changes explicitly', () => {
    expect(SYSTEM_PROMPT).toContain('NEVER invent');
    expect(SYSTEM_PROMPT).toContain('NEVER translate');
    expect(SYSTEM_PROMPT).toContain('completion status');
    expect(SYSTEM_PROMPT).toContain('"• " bullets');
    expect(SYSTEM_PROMPT).toContain('verbatim from the FIELDS');
  });

  it('should document the output shape for providers without json_schema', () => {
    expect(SYSTEM_PROMPT).toContain('OUTPUT SHAPE');
    expect(SYSTEM_PROMPT).toContain('"suggestions"');
  });

  it('should be returned unchanged by buildSystemPrompt', () => {
    expect(buildSystemPrompt()).toBe(SYSTEM_PROMPT);
  });
});

describe('buildCvContext', () => {
  it('should summarise the loaded CV', () => {
    const { header, details } = loadRealCv();
    const context = buildCvContext(header, details);

    const expectedName = [header.personal_info.name, header.personal_info.lastname, header.personal_info.second_lastname]
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .join(' ');

    expect(context.fullName).toBe(expectedName);
    expect(context.headline).toBe(header.about_info.title.trim());
    expect(context.declaredSkills).toContain('Python (Django, FastAPI, Flask)');
    expect(context.languages).toContain('Spanish (Native)');
    expect(context.education.join(' ')).toContain('Bachelors Degree, Unfinished');
  });

  it('should survive a CV with no optional sections', () => {
    const { header } = loadRealCv();
    const context = buildCvContext(header, {});
    expect(context.declaredSkills).toEqual([]);
    expect(context.education).toEqual([]);
    expect(context.languages).toEqual([]);
  });
});

describe('buildUserPrompt', () => {
  const { header, details } = loadRealCv();
  const context = buildCvContext(header, details);
  const experience = groupBySection(collectImprovableFields(header, details)).find(
    (group) => group.section === 'experience',
  );
  const abilities = groupBySection(collectImprovableFields(header, details)).find(
    (group) => group.section === 'abilities',
  );

  it('should include the read only CV context', () => {
    const prompt = buildUserPrompt('experience', experience?.fields ?? [], context, '', 10);
    expect(prompt).toContain('CV CONTEXT');
    expect(prompt).toContain(context.fullName);
    expect(prompt).toContain('Never output it');
    expect(context.fullName.length).toBeGreaterThan(0);
  });

  it('should name the section and state its policy', () => {
    const prompt = buildUserPrompt('experience', experience?.fields ?? [], context, '', 10);
    expect(prompt).toContain('SECTION TO IMPROVE: experience');
    expect(prompt).toContain('SECTION POLICY:');
  });

  it('should state the bullet rule for rewrite sections that use bullets', () => {
    const prompt = buildUserPrompt('experience', experience?.fields ?? [], context, '', 10);
    expect(prompt).toContain('"• " markers');
  });

  it('should state a format only policy when no field allows rewriting', () => {
    const prompt = buildUserPrompt('abilities', abilities?.fields ?? [], context, '', 10);
    expect(prompt).toContain('FORMAT_ONLY');
    expect(prompt).not.toContain('rewrite wording only');
  });

  it('should include each path exactly once', () => {
    const fields = experience?.fields ?? [];
    const prompt = buildUserPrompt('experience', fields, context, '', 10);
    for (const field of fields) {
      const occurrences = prompt.split(`- ${field.path}  [`).length - 1;
      expect(occurrences).toBe(1);
    }
  });

  it('should include the policy tag of every field', () => {
    const prompt = buildUserPrompt(
      'experience',
      experience?.fields ?? [],
      context,
      '',
      10,
    );
    expect(prompt).toContain('[REWRITE]');
    expect(prompt).toContain('[FORMAT_ONLY]');
  });

  it('should include the original text of every field', () => {
    const fields = experience?.fields ?? [];
    const prompt = buildUserPrompt('experience', fields, context, '', 10);
    for (const field of fields) {
      expect(prompt).toContain(field.value);
    }
  });

  it('should include the target role only when it is not empty', () => {
    const fields = experience?.fields ?? [];
    const withRole = buildUserPrompt('experience', fields, context, 'Backend Lead', 10);
    const withoutRole = buildUserPrompt('experience', fields, context, '   ', 10);

    expect(withRole).toContain('Target role: Backend Lead');
    expect(withoutRole).not.toContain('Target role');
    expect(withoutRole).not.toMatch(/^Target role/m);
  });

  it('should ask for a bounded number of suggestions', () => {
    const prompt = buildUserPrompt('experience', experience?.fields ?? [], context, '', 4);
    expect(prompt).toContain('Return at most 4 suggestions.');
  });

  it('should never repeat a path when the caller passes duplicates', () => {
    const fields = experience?.fields ?? [];
    const duplicated = [...fields, ...fields];
    const prompt = buildUserPrompt('experience', duplicated, context, '', 10);
    const occurrences = prompt.split(`- ${fields[0].path}  [`).length - 1;
    expect(occurrences).toBe(1);
  });

  it('should build a prompt for every section that has fields', () => {
    const groups = groupBySection(collectImprovableFields(header, details));
    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) {
      const prompt = buildUserPrompt(group.section, group.fields, context, '', group.fields.length);
      expect(prompt).toContain(`SECTION TO IMPROVE: ${group.section}`);
      expect(prompt.length).toBeGreaterThan(0);
    }
  });
});