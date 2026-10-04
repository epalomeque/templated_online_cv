import { describe, it, expect } from 'vitest';
import {
  CV_REWRITE_SCHEMA,
  MAX_VALUE_CHARS,
  MAX_VALUE_LENGTH_RATIO,
  parseSuggestions,
  toGeminiSchema,
} from '../features/ia-assistant/responseSchema';
import { ImprovableField } from '../features/ia-assistant/iaTypes';

const FIELD: ImprovableField = {
  path: 'experience[0].pos_description',
  label: 'Logros',
  value: 'A'.repeat(100),
  policy: 'REWRITE',
  section: 'experience',
};

const OTHER_FIELD: ImprovableField = {
  path: 'about_info.description',
  label: 'Sobre mí',
  value: 'B'.repeat(100),
  policy: 'REWRITE',
  section: 'about',
};

describe('toGeminiSchema', () => {
  it('should uppercase every type name', () => {
    const gemini = toGeminiSchema(CV_REWRITE_SCHEMA);
    expect(gemini.type).toBe('OBJECT');
    expect(gemini.properties?.suggestions.type).toBe('ARRAY');
    expect(gemini.properties?.suggestions.items?.type).toBe('OBJECT');
    expect(gemini.properties?.suggestions.items?.properties?.path.type).toBe('STRING');
  });

  it('should drop additionalProperties everywhere', () => {
    expect(JSON.stringify(toGeminiSchema(CV_REWRITE_SCHEMA))).not.toContain(
      'additionalProperties',
    );
  });

  it('should preserve properties, items and required', () => {
    const gemini = toGeminiSchema(CV_REWRITE_SCHEMA);
    expect(gemini.required).toEqual(['suggestions']);
    expect(Object.keys(gemini.properties ?? {})).toEqual(['suggestions']);
    const item = gemini.properties?.suggestions.items;
    expect(item?.required).toEqual(['path', 'value']);
    expect(Object.keys(item?.properties ?? {}).sort()).toEqual(['path', 'value']);
  });

  it('should be serialisable', () => {
    const gemini = toGeminiSchema(CV_REWRITE_SCHEMA);
    expect(() => JSON.stringify(gemini)).not.toThrow();
    expect(JSON.parse(JSON.stringify(gemini))).toEqual(gemini);
  });

  it('should not mutate the canonical schema', () => {
    const before = JSON.stringify(CV_REWRITE_SCHEMA);
    toGeminiSchema(CV_REWRITE_SCHEMA);
    expect(JSON.stringify(CV_REWRITE_SCHEMA)).toBe(before);
  });
});

describe('parseSuggestions', () => {
  const fields = [FIELD, OTHER_FIELD];

  it('should report INVALID_JSON and no suggestions on malformed json', () => {
    const result = parseSuggestions('{not json', fields);
    expect(result.error).toBe('INVALID_JSON');
    expect(result.accepted).toEqual([]);
  });

  it('should report INVALID_SHAPE when suggestions is not an array', () => {
    expect(parseSuggestions('{"suggestions":{}}', fields).error).toBe('INVALID_SHAPE');
    expect(parseSuggestions('[]', fields).error).toBe('INVALID_SHAPE');
    expect(parseSuggestions('null', fields).error).toBe('INVALID_SHAPE');
  });

  it('should cross the answer with the field it targets', () => {
    const raw = JSON.stringify({
      suggestions: [{ path: 'experience[0].pos_description', value: 'C'.repeat(100) }],
    });
    const result = parseSuggestions(raw, fields);

    expect(result.error).toBeNull();
    expect(result.accepted).toHaveLength(1);
    expect(result.accepted[0].original).toBe(FIELD.value);
    expect(result.accepted[0].label).toBe('Logros');
    expect(result.accepted[0].policy).toBe('REWRITE');
    expect(result.accepted[0].section).toBe('experience');
    expect(result.accepted[0].warnings).toEqual([]);
  });

  it('should discard a path that was never presented', () => {
    const raw = JSON.stringify({
      suggestions: [{ path: 'contact_info.email', value: 'attacker@example.com' }],
    });
    const result = parseSuggestions(raw, fields);

    expect(result.accepted).toEqual([]);
    expect(result.rejected[0].reason).toBe('unknown-path');
  });

  it('should discard empty and whitespace values', () => {
    const raw = JSON.stringify({
      suggestions: [
        { path: FIELD.path, value: '' },
        { path: OTHER_FIELD.path, value: '   \n  ' },
      ],
    });
    const result = parseSuggestions(raw, fields);

    expect(result.accepted).toEqual([]);
    expect(result.rejected.map((entry) => entry.reason)).toEqual([
      'empty-value',
      'empty-value',
    ]);
  });

  it('should discard a value longer than the hard character cap', () => {
    const raw = JSON.stringify({
      suggestions: [{ path: FIELD.path, value: 'C'.repeat(MAX_VALUE_CHARS + 1) }],
    });
    const result = parseSuggestions(raw, fields);
    expect(result.accepted).toEqual([]);
    expect(result.rejected[0].reason).toBe('value-too-long');
  });

  it('should discard a value many times longer than the original', () => {
    const ratio = MAX_VALUE_LENGTH_RATIO + 1;
    const raw = JSON.stringify({
      suggestions: [{ path: FIELD.path, value: 'C'.repeat(Math.ceil(FIELD.value.length * ratio)) }],
    });
    const result = parseSuggestions(raw, fields);
    expect(result.accepted).toEqual([]);
    expect(result.rejected[0].reason).toBe('value-too-long');
  });

  it('should keep the first of two duplicated paths', () => {
    const raw = JSON.stringify({
      suggestions: [
        { path: FIELD.path, value: 'first-value' },
        { path: FIELD.path, value: 'second-value' },
      ],
    });
    const result = parseSuggestions(raw, fields);

    expect(result.accepted).toHaveLength(1);
    expect(result.accepted[0].value).toBe('first-value');
    expect(result.rejected[0].reason).toBe('duplicate-path');
  });

  it('should discard malformed entries without failing the whole answer', () => {
    const raw = JSON.stringify({
      suggestions: [
        { path: 42, value: 'x' },
        { path: FIELD.path },
        { path: FIELD.path, value: 'kept' },
      ],
    });
    const result = parseSuggestions(raw, fields);

    expect(result.accepted).toHaveLength(1);
    expect(result.accepted[0].value).toBe('kept');
    expect(result.rejected).toHaveLength(2);
  });

  it('should accept an empty suggestions array', () => {
    const result = parseSuggestions('{"suggestions":[]}', fields);
    expect(result.error).toBeNull();
    expect(result.accepted).toEqual([]);
    expect(result.rejected).toEqual([]);
  });
});