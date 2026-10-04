import { describe, it, expect } from 'vitest';
import {
  DIALECTS,
  FROM_CREDENTIALS,
  GEMINI_BASE_URL,
  OPENROUTER_BASE_URL,
  getDialect,
  isOpenAiCompatible,
  supportsJsonSchema,
} from '../features/ia-assistant/dialects';
import { ProviderId } from '../features/ia-assistant/iaTypes';

const PROVIDERS: ProviderId[] = ['gemini', 'azure-openai', 'openrouter', 'custom'];

describe('dialects', () => {
  it('should define a dialect for every provider', () => {
    expect(Object.keys(DIALECTS).sort()).toEqual([...PROVIDERS].sort());
  });

  it.each(PROVIDERS)('%s should declare an auth style and a base URL', (provider) => {
    const dialect = getDialect(provider);
    expect(dialect.auth).toBeTruthy();
    expect(dialect.baseUrl).toBeTruthy();
  });

  it('should send gemini through its own wire protocol', () => {
    const dialect = DIALECTS.gemini;
    expect(dialect.wire).toBe('gemini');
    expect(dialect.auth).toBe('x-goog-api-key');
    expect(dialect.baseUrl).toBe(GEMINI_BASE_URL);
    expect(dialect.structuredOutput).toBe('json_schema');
  });

  it('should make openrouter the strict openai compatible provider', () => {
    const dialect = DIALECTS.openrouter;
    expect(dialect.wire).toBe('openai-compat');
    expect(dialect.auth).toBe('bearer');
    expect(dialect.baseUrl).toBe(OPENROUTER_BASE_URL);
    expect(dialect.structuredOutput).toBe('json_schema');
  });

  it('should require structured output parameters on openrouter', () => {
    expect(DIALECTS.openrouter.extraBody).toEqual({
      provider: { require_parameters: true },
    });
  });

  it('should never add require_parameters to another provider', () => {
    for (const provider of ['gemini', 'azure-openai', 'custom'] as ProviderId[]) {
      expect(DIALECTS[provider].extraBody).toBeUndefined();
    }
  });

  it('should use the api-key header for azure and resolve its URL from credentials', () => {
    const dialect = DIALECTS['azure-openai'];
    expect(dialect.auth).toBe('api-key');
    expect(dialect.baseUrl).toBe(FROM_CREDENTIALS);
    expect(dialect.extraBody).toBeUndefined();
  });

  it('should not carry an api-version anywhere, since v1 is implicitly versioned', () => {
    for (const provider of PROVIDERS) {
      expect(JSON.stringify(DIALECTS[provider])).not.toContain('api-version');
    }
  });

  it('should degrade the custom provider to json_object', () => {
    expect(DIALECTS.custom.structuredOutput).toBe('json_object');
    expect(supportsJsonSchema('custom')).toBe(false);
  });

  it('should treat every provider but gemini as openai compatible', () => {
    expect(isOpenAiCompatible('gemini')).toBe(false);
    expect(isOpenAiCompatible('openrouter')).toBe(true);
    expect(isOpenAiCompatible('azure-openai')).toBe(true);
    expect(isOpenAiCompatible('custom')).toBe(true);
  });

  it('should expose a human readable label per provider', () => {
    for (const provider of PROVIDERS) {
      expect(DIALECTS[provider].label.length).toBeGreaterThan(0);
    }
  });
});