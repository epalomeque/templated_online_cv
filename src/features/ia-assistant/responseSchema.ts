import { ImprovableField, ParseErrorCode, ParseResult, RejectedSuggestion, Suggestion } from './iaTypes';

/** A JSON schema node, restricted to the keywords this feature uses. */
export interface JsonSchemaNode {
  type?: string;
  description?: string;
  properties?: Record<string, JsonSchemaNode>;
  items?: JsonSchemaNode;
  required?: string[];
  additionalProperties?: boolean;
  enum?: string[];
}

/**
 * Canonical response schema, written in the OpenAI style.
 *
 * An array of `{ path, value }` pairs is used instead of a
 * `Record<path, string>` because the Gemini subset of JSON schema does not
 * support `additionalProperties`, so dynamic keys cannot be typed with
 * structured output. The array shape works on every provider and leaves room to
 * extend the contract without changing its form.
 */
export const CV_REWRITE_SCHEMA: JsonSchemaNode = {
  type: 'object',
  additionalProperties: false,
  required: ['suggestions'],
  properties: {
    suggestions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['path', 'value'],
        properties: {
          path: { type: 'string' },
          value: { type: 'string' },
        },
      },
    },
  },
};

/** A suggestion value longer than this is discarded as a runaway generation. */
export const MAX_VALUE_CHARS = 2000;

/** A value longer than this multiple of the original is discarded. */
export const MAX_VALUE_LENGTH_RATIO = 4;

/**
 * Converts a schema into the subset accepted by Gemini.
 *
 * Gemini expects type names in uppercase and does not know
 * `additionalProperties`; `properties`, `items` and `required` are preserved.
 *
 * @param schema Schema in canonical, OpenAI style.
 * @returns An equivalent schema using only Gemini keywords.
 */
export function toGeminiSchema(schema: JsonSchemaNode): JsonSchemaNode {
  const converted: JsonSchemaNode = {};

  if (schema.type !== undefined) converted.type = schema.type.toUpperCase();
  if (schema.description !== undefined) converted.description = schema.description;
  if (schema.enum !== undefined) converted.enum = [...schema.enum];

  if (schema.required !== undefined) converted.required = [...schema.required];

  if (schema.properties !== undefined) {
    const properties: Record<string, JsonSchemaNode> = {};
    for (const [key, node] of Object.entries(schema.properties)) {
      properties[key] = toGeminiSchema(node);
    }
    converted.properties = properties;
  }

  if (schema.items !== undefined) converted.items = toGeminiSchema(schema.items);

  return converted;
}

/**
 * Type guard for the shape produced by the model.
 *
 * @param value Unknown parsed value.
 * @returns `true` when the value is an object with a `suggestions` array.
 */
function hasSuggestionsShape(value: unknown): value is { suggestions: unknown[] } {
  if (typeof value !== 'object' || value === null) return false;
  if (!('suggestions' in value)) return false;
  const suggestions = (value as { suggestions: unknown }).suggestions;
  return Array.isArray(suggestions);
}

/**
 * Reads `{ path, value }` out of an untrusted array entry.
 *
 * @param entry Unknown array entry.
 * @returns The pair when both members are strings, `null` otherwise.
 */
function readSuggestionPair(entry: unknown): { path: string; value: string } | null {
  if (typeof entry !== 'object' || entry === null) return null;
  const candidate = entry as { path?: unknown; value?: unknown };
  if (typeof candidate.path !== 'string') return null;
  if (typeof candidate.value !== 'string') return null;
  return { path: candidate.path, value: candidate.value };
}

/**
 * Validates the raw answer of the model and turns it into suggestions.
 *
 * The validation is the second of the three layers that prevent invention:
 * a suggestion whose `path` was not literally presented to the model is
 * discarded here, before it can reach the UI.
 *
 * @param rawText Raw text content returned by the provider.
 * @param fields Fields that were sent to the model, the exact allowed set.
 * @returns Accepted and rejected suggestions, plus a parse error when the
 *          answer could not be read at all.
 */
export function parseSuggestions(
  rawText: string,
  fields: readonly ImprovableField[],
): ParseResult {
  const rejected: RejectedSuggestion[] = [];
  const error: ParseErrorCode | null = null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return { accepted: [], rejected, error: 'INVALID_JSON' };
  }

  if (!hasSuggestionsShape(parsed)) {
    return { accepted: [], rejected, error: 'INVALID_SHAPE' };
  }

  const allowed = new Map<string, ImprovableField>();
  for (const field of fields) allowed.set(field.path, field);

  const accepted: Suggestion[] = [];
  const seen = new Set<string>();

  parsed.suggestions.forEach((entry, position) => {
    const pair = readSuggestionPair(entry);
    if (pair === null) {
      rejected.push({
        path: '',
        value: '',
        reason: `malformed-entry-at-${position}`,
      });
      return;
    }

    const field = allowed.get(pair.path);
    if (field === undefined) {
      rejected.push({ path: pair.path, value: pair.value, reason: 'unknown-path' });
      return;
    }

    if (seen.has(pair.path)) {
      rejected.push({ path: pair.path, value: pair.value, reason: 'duplicate-path' });
      return;
    }

    if (pair.value.trim().length === 0) {
      rejected.push({ path: pair.path, value: pair.value, reason: 'empty-value' });
      return;
    }

    if (pair.value.length > MAX_VALUE_CHARS) {
      rejected.push({ path: pair.path, value: pair.value, reason: 'value-too-long' });
      return;
    }

    const ratio = pair.value.length / Math.max(field.value.length, 1);
    if (ratio > MAX_VALUE_LENGTH_RATIO) {
      rejected.push({ path: pair.path, value: pair.value, reason: 'value-too-long' });
      return;
    }

    seen.add(pair.path);
    accepted.push({
      path: pair.path,
      label: field.label,
      original: field.value,
      value: pair.value,
      policy: field.policy,
      section: field.section,
      warnings: [],
    });
  });

  return { accepted, rejected, error };
}