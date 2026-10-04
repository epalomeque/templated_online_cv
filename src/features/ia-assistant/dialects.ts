import { ProviderDialect, ProviderId, StructuredOutputMode } from './iaTypes';

/** Base URL of the Google Generative Language API. */
export const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

/** Base URL of the OpenRouter public API. */
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/** Default model for each provider. Never hardcode a model in the request. */
export const DEFAULT_MODELS: Record<ProviderId, string> = {
  gemini: 'gemini-2.5-flash',
  openrouter: 'openrouter/free',
  'azure-openai': '',
  custom: '',
};

/**
 * Placeholder used by dialects whose base URL comes from the credentials.
 *
 * `connectionManager` replaces it before building the final URL, which keeps
 * the dialect table free of any user specific value.
 */
export const FROM_CREDENTIALS = 'from-credentials';

/** Gemini, spoken with its native protocol and its own auth header. */
export const GEMINI_DIALECT: ProviderDialect = {
  id: 'gemini',
  label: 'Gemini',
  wire: 'gemini',
  auth: 'x-goog-api-key',
  baseUrl: GEMINI_BASE_URL,
  structuredOutput: 'json_schema',
};

/**
 * OpenRouter, the universal fallback.
 *
 * `provider.require_parameters` is not cosmetic: without it OpenRouter may
 * route the request to a `:free` endpoint that does not support structured
 * output and answer with plain text.
 */
export const OPENROUTER_DIALECT: ProviderDialect = {
  id: 'openrouter',
  label: 'OpenRouter',
  wire: 'openai-compat',
  auth: 'bearer',
  baseUrl: OPENROUTER_BASE_URL,
  structuredOutput: 'json_schema',
  extraBody: { provider: { require_parameters: true } },
};

/**
 * Microsoft Foundry.
 *
 * The `v1` route uses implicit versioning, so **no `api-version` query
 * parameter must be added**. The model is the deployment name.
 */
export const AZURE_OPENAI_DIALECT: ProviderDialect = {
  id: 'azure-openai',
  label: 'Microsoft Foundry',
  wire: 'openai-compat',
  auth: 'api-key',
  baseUrl: FROM_CREDENTIALS,
  structuredOutput: 'json_schema',
};

/**
 * Any other OpenAI compatible endpoint (Groq, Cerebras, OpenAI, Together,
 * LM Studio, Ollama...).
 *
 * It degrades to `json_object` on purpose: we cannot assume the endpoint
 * honours a strict schema, so the schema is described in the system prompt and
 * `parseSuggestions` validates the answer anyway.
 */
export const CUSTOM_DIALECT: ProviderDialect = {
  id: 'custom',
  label: 'Otro (compatible con OpenAI)',
  wire: 'openai-compat',
  auth: 'bearer',
  baseUrl: FROM_CREDENTIALS,
  structuredOutput: 'json_object',
};

/** Every dialect indexed by provider id. */
export const DIALECTS: Record<ProviderId, ProviderDialect> = {
  gemini: GEMINI_DIALECT,
  'azure-openai': AZURE_OPENAI_DIALECT,
  openrouter: OPENROUTER_DIALECT,
  custom: CUSTOM_DIALECT,
};

/** Providers using the OpenAI dialect, in UI order. */
export const OPENAI_COMPAT_PROVIDERS: readonly ProviderId[] = [
  'openrouter',
  'azure-openai',
  'custom',
];

/**
 * Returns the dialect of a provider.
 *
 * @param provider Provider identifier.
 * @returns The immutable dialect definition.
 */
export function getDialect(provider: ProviderId): ProviderDialect {
  return DIALECTS[provider];
}

/**
 * Whether a provider is reached through the OpenAI compatible protocol.
 *
 * @param provider Provider identifier.
 * @returns `true` for every provider but Gemini.
 */
export function isOpenAiCompatible(provider: ProviderId): boolean {
  return DIALECTS[provider].wire === 'openai-compat';
}

/**
 * Whether the provider must receive a strict JSON schema in the request body.
 *
 * @param provider Provider identifier.
 * @returns `true` when `json_schema` structured output is supported.
 */
export function supportsJsonSchema(provider: ProviderId): boolean {
  return DIALECTS[provider].structuredOutput === 'json_schema';
}

/**
 * Structured output mode of a provider, exposed for the request builders.
 *
 * @param provider Provider identifier.
 * @returns The structured output capability.
 */
export function getStructuredOutput(provider: ProviderId): StructuredOutputMode {
  return DIALECTS[provider].structuredOutput;
}