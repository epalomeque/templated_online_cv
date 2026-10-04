import { HasCredentials, ProviderId, ProviderResolution } from './iaTypes';

/** Domains that default to Gemini, the most generous free tier. */
export const GOOGLE_DOMAINS: readonly string[] = ['gmail.com', 'googlemail.com'];

/** Domains that default to Microsoft Foundry, which the user already pays for. */
export const MICROSOFT_DOMAINS: readonly string[] = [
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'office365.com',
];

/**
 * Fallback used when no provider can be detected.
 *
 * OpenRouter is the universal fallback: free tier without a card, and it also
 * covers Microsoft users whose endpoint blocks CORS.
 */
export const DEFAULT_PROVIDER: ProviderId = 'openrouter';

/**
 * Normalises an email and extracts the domain that decides the provider.
 *
 * @param email Raw email, possibly with surrounding whitespace and any casing.
 * @returns The lowercase domain, or `null` when the value is not an email.
 */
export function extractDomain(email: string): string | null {
  const normalized = email.trim().toLowerCase();
  const separator = normalized.lastIndexOf('@');
  if (separator === -1) return null;
  const domain = normalized.slice(separator + 1);
  return domain.length > 0 ? domain : null;
}

/**
 * Whether a domain matches a base domain either exactly or as a subdomain.
 *
 * `outlook.com` matches `outlook.com` and `x.outlook.com`, but not
 * `notoutlook.com`.
 *
 * @param domain Domain extracted from the email.
 * @param baseDomains Candidate base domains.
 * @returns `true` when the domain belongs to one of the base domains.
 */
function matchesDomain(domain: string, baseDomains: readonly string[]): boolean {
  return baseDomains.some(
    (base) => domain === base || domain.endsWith(`.${base}`),
  );
}

/**
 * Detects the provider suggested by an email domain.
 *
 * @param email Raw email.
 * @returns The detected provider, or `null` when the domain is unknown.
 */
export function detectProviderFromEmail(email: string): ProviderId | null {
  const domain = extractDomain(email);
  if (domain === null) return null;
  if (matchesDomain(domain, GOOGLE_DOMAINS)) return 'gemini';
  if (matchesDomain(domain, MICROSOFT_DOMAINS)) return 'azure-openai';
  return null;
}

/**
 * Chooses the provider to use for a rewrite run.
 *
 * The rules, in order of precedence:
 *
 * 1. A manual override always wins, and `detected` is preserved so the UI can
 *    show that a choice was forced.
 * 2. Emails are walked **in order** and the first recognised one wins. This
 *    matters: a real `cvdata.json` carries both a Gmail and a Hotmail address,
 *    and the UI must show which one decided.
 * 3. A recognised domain with no credentials yields `provider: null` with
 *    reason `no-key-configured`, so the panel can show the form of the detected
 *    provider plus OpenRouter as a free alternative.
 * 4. An unknown domain, or no email at all, falls back to OpenRouter instead of
 *    asking the user to choose. That is the difference between a flow that works
 *    and a flow that gets stuck on a configuration screen.
 *
 * @param emails Contact emails, in the order they appear in the CV.
 * @param override Manual provider choice, or `auto` to use the detection.
 * @param hasCredentials Predicate telling whether a provider has a key loaded.
 * @returns The resolution, including which email decided it.
 */
export function resolveProvider(
  emails: readonly string[],
  override: ProviderId | 'auto',
  hasCredentials: HasCredentials = () => true,
): ProviderResolution {
  let detected: ProviderId | null = null;
  let sourceEmail: string | null = null;
  let reason: ProviderResolution['reason'] = 'no-email';

  for (const email of emails) {
    if (typeof email !== 'string') continue;
    const candidate = detectProviderFromEmail(email);
    if (candidate !== null) {
      detected = candidate;
      sourceEmail = email.trim().toLowerCase();
      reason = candidate === 'gemini' ? 'gmail-domain' : 'microsoft-domain';
      break;
    }
  }

  if (override !== 'auto') {
    return { provider: override, reason: 'override', sourceEmail, detected };
  }

  if (detected === null) {
    return {
      provider: DEFAULT_PROVIDER,
      reason: 'no-email',
      sourceEmail: null,
      detected: null,
    };
  }

  if (!hasCredentials(detected)) {
    return { provider: null, reason: 'no-key-configured', sourceEmail, detected };
  }

  return { provider: detected, reason, sourceEmail, detected };
}