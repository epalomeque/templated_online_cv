/**
 * Shared type vocabulary for the IA rewrite feature.
 *
 * This module contains **only types and constants**: no logic, no side effects
 * and no dependency on React or Redux. Every other module of the feature
 * (`dialects`, `fieldCatalog`, `providerResolver`, `promptBuilder`,
 * `claimsGuard`, `applySuggestions`) builds on top of these definitions.
 */

/** Identifiers of the language providers supported by the feature. */
export type ProviderId = 'gemini' | 'azure-openai' | 'openrouter' | 'custom';

/**
 * Wire protocol spoken by a provider.
 *
 * Only Gemini needs its own client; every other provider (OpenRouter, Azure
 * OpenAI, Groq, Cerebras, Mistral, OpenAI, Ollama...) speaks the OpenAI
 * dialect through the very same `POST {baseUrl}/chat/completions` route.
 */
export type Wire = 'gemini' | 'openai-compat';

/** How the API key travels in the request headers. */
export type AuthStyle = 'x-goog-api-key' | 'api-key' | 'bearer';

/** Where the API key is allowed to live. */
export type KeyPersistence = 'memory' | 'session' | 'local';

/** Transport strategy used to reach the provider. */
export type IaConnectionMode = 'byok-direct' | 'byok-relay' | 'project-proxy';

/**
 * Structured output support of a provider.
 *
 * - `json_schema`: a strict schema is sent and honoured by the provider.
 * - `json_object`: only `{"type":"json_object"}` is sent; the schema lives in
 *   the system prompt and `parseSuggestions` validates the result anyway.
 * - `none`: no structured output hints at all.
 */
export type StructuredOutputMode = 'json_schema' | 'json_object' | 'none';

/** Everything that is provider-specific and therefore configurable. */
export interface ProviderDialect {
  /** Provider this dialect belongs to. */
  readonly id: ProviderId;
  /** Human readable name, used by the UI. */
  readonly label: string;
  /** Wire protocol to speak. */
  readonly wire: Wire;
  /** Header used to carry the API key. */
  readonly auth: AuthStyle;
  /** Base URL, either literal or a placeholder resolved from credentials. */
  readonly baseUrl: string;
  /** Structured output capability. */
  readonly structuredOutput: StructuredOutputMode;
  /** Extra top level fields merged into the request body. */
  readonly extraBody?: Record<string, unknown>;
}

/**
 * Rewriting policy of a field.
 *
 * - `REWRITE`: the wording may be improved as long as the facts stay identical.
 * - `FORMAT_ONLY`: only spelling, capitalisation and punctuation may change.
 */
export type RewritePolicy = 'REWRITE' | 'FORMAT_ONLY';

/** Sections of the CV that can be improved, in processing order. */
export type CvSection =
  | 'about'
  | 'experience'
  | 'education'
  | 'projects'
  | 'abilities'
  | 'interests';

/** Reducer state of the IA feature. */
export type IaStatus = 'unconfigured' | 'ready' | 'probing';

/** A CV field that is allowed to be sent to the model. */
export interface ImprovableField {
  /** Redux-shaped path, e.g. `about_info.description` or `experience[2].job_name`. */
  readonly path: string;
  /** Human readable label taken from the catalog. */
  readonly label: string;
  /** Current text of the field. */
  readonly value: string;
  /** Rewriting policy that applies to this field. */
  readonly policy: RewritePolicy;
  /** Section the field belongs to. */
  readonly section: CvSection;
}

/** Result of a successful, structurally valid suggestion. */
export interface Suggestion {
  readonly path: string;
  readonly label: string;
  readonly original: string;
  readonly value: string;
  readonly policy: RewritePolicy;
  readonly section: CvSection;
  /** Non blocking warnings produced by `claimsGuard`. */
  readonly warnings: string[];
}

/** A suggestion discarded by `parseSuggestions`, kept for diagnostics. */
export interface RejectedSuggestion {
  readonly path: string;
  readonly value: string;
  /** Machine readable rejection reason, e.g. `unknown-path`. */
  readonly reason: string;
}

/** Outcome of validating a raw model answer. */
export interface ParseResult {
  readonly accepted: Suggestion[];
  readonly rejected: RejectedSuggestion[];
  /** Set when the answer could not be parsed at all. */
  readonly error: ParseErrorCode | null;
}

/** Reasons why a raw answer cannot be turned into suggestions. */
export type ParseErrorCode = 'INVALID_JSON' | 'INVALID_SHAPE';

/** Normalised answer of any provider, regardless of the wire protocol. */
export interface ProviderResponse {
  /** Raw text content, or `null` when the provider returned no candidate. */
  readonly text: string | null;
  /** `STOP`, `MAX_TOKENS`, `SAFETY`, `content_filter` or `null`. */
  readonly finishReason: string | null;
  /** Token accounting when the provider reports it. */
  readonly usage: { promptTokens: number; completionTokens: number } | null;
  /** Model / deployment that actually answered. */
  readonly model: string;
}

/** Classification of a connectivity probe. */
export type ProbeStatus =
  | 'ok'
  | 'cors-blocked'
  | 'invalid-key'
  | 'not-found'
  | 'rate-limited'
  | 'upstream-error';

/** Outcome of {@link probeConnection}. */
export type ProbeResult =
  | { status: 'ok'; model: string }
  | { status: 'cors-blocked' }
  | { status: 'invalid-key' }
  | { status: 'not-found' }
  | { status: 'rate-limited' }
  | { status: 'upstream-error' };

/** Catalogue of the error codes the feature can surface. */
export type AIErrorCode =
  | 'NOT_CONFIGURED'
  | 'CORS_BLOCKED'
  | 'RELAY_UNREACHABLE'
  | 'NO_PROVIDER'
  | 'INVALID_KEY'
  | 'NOT_FOUND'
  | 'RATE_LIMIT'
  | 'SAFETY_BLOCK'
  | 'INVALID_JSON'
  | 'NOTHING_TO_IMPROVE'
  | 'UPSTREAM';

/** Normalised error, ready to be stored in Redux or shown in the UI. */
export interface IaError {
  readonly code: AIErrorCode;
  readonly message: string;
}

/** Reasons that explain how a provider was chosen. */
export type ProviderResolutionReason =
  | 'gmail-domain'
  | 'microsoft-domain'
  | 'no-email'
  | 'override'
  | 'no-key-configured';

/** Outcome of {@link resolveProvider}. */
export interface ProviderResolution {
  /** `null` means a recognised domain without credentials loaded. */
  readonly provider: ProviderId | null;
  /** Why this provider was chosen. */
  readonly reason: ProviderResolutionReason;
  /** Email that decided the detection, shown in the UI so it is not a mystery. */
  readonly sourceEmail: string | null;
  /** Provider detected from the email, even when it has been overridden. */
  readonly detected: ProviderId | null;
}

/** Credentials of each supported provider. */
export type ProviderCredentials = {
  gemini?: GeminiCredentials;
  'azure-openai'?: AzureOpenAiCredentials;
  openrouter?: OpenRouterCredentials;
  custom?: CustomCredentials;
};

/** Gemini needs a key and a model. */
export interface GeminiCredentials {
  readonly apiKey: string;
  readonly model: string;
}

/** Azure OpenAI needs the resource endpoint, the key and the deployment name. */
export interface AzureOpenAiCredentials {
  readonly endpoint: string;
  readonly apiKey: string;
  readonly deployment: string;
}

/** OpenRouter needs a key and a model id such as `openrouter/free`. */
export interface OpenRouterCredentials {
  readonly apiKey: string;
  readonly model: string;
}

/** Any other OpenAI compatible endpoint. */
export interface CustomCredentials {
  readonly baseUrl: string;
  readonly apiKey: string;
  readonly model: string;
}

/** Mutable credential state kept outside of Redux. */
export interface CredentialState {
  credentials: ProviderCredentials;
  persistence: KeyPersistence;
  mode: IaConnectionMode;
  relayUrl: string;
}

/** Strategy used to reach a provider, hiding URL and auth header differences. */
export interface IaTransport {
  readonly mode: IaConnectionMode;
  /**
   * Performs the actual request.
   *
   * @param provider Provider the request is destined to.
   * @param body Already serialisable request body.
   * @param signal Optional abort signal.
   * @returns The raw `Response` so callers can classify HTTP statuses.
   */
  send(provider: ProviderId, body: unknown, signal?: AbortSignal): Promise<Response>;
}

/** Signature of the predicate that tells whether a provider has a key. */
export type HasCredentials = (provider: ProviderId) => boolean;