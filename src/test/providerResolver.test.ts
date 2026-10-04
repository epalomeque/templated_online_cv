import { describe, it, expect } from 'vitest';
import {
  detectProviderFromEmail,
  extractDomain,
  resolveProvider,
  DEFAULT_PROVIDER,
  GOOGLE_DOMAINS,
  MICROSOFT_DOMAINS,
} from '../features/ia-assistant/providerResolver';

describe('extractDomain', () => {
  it('should normalise casing and whitespace', () => {
    expect(extractDomain('  User@GMail.COM  ')).toBe('gmail.com');
  });

  it('should use the last separator', () => {
    expect(extractDomain('a@b@outlook.com')).toBe('outlook.com');
  });

  it('should return null for values without an at sign or a domain', () => {
    expect(extractDomain('not-an-email')).toBeNull();
    expect(extractDomain('')).toBeNull();
    expect(extractDomain('user@')).toBeNull();
  });
});

describe('detectProviderFromEmail', () => {
  it.each(GOOGLE_DOMAINS)('should map %s to gemini', (domain) => {
    expect(detectProviderFromEmail(`user@${domain}`)).toBe('gemini');
  });

  it.each(MICROSOFT_DOMAINS)('should map %s to azure-openai', (domain) => {
    expect(detectProviderFromEmail(`user@${domain}`)).toBe('azure-openai');
  });

  it('should match subdomains of the recognised domains', () => {
    expect(detectProviderFromEmail('user@x.outlook.com')).toBe('azure-openai');
    expect(detectProviderFromEmail('user@x.office365.com')).toBe('azure-openai');
    expect(detectProviderFromEmail('user@mail.gmail.com')).toBe('gemini');
  });

  it('should not over generalise to look alike domains', () => {
    expect(detectProviderFromEmail('user@notoutlook.com')).toBeNull();
    expect(detectProviderFromEmail('user@mygmail.com')).toBeNull();
  });

  it('should return null for unknown domains', () => {
    expect(detectProviderFromEmail('user@yahoo.com')).toBeNull();
    expect(detectProviderFromEmail('user@empresa.com')).toBeNull();
  });
});

describe('resolveProvider', () => {
  it('should choose gemini for a gmail address', () => {
    const result = resolveProvider(['epalomeque@gmail.com'], 'auto');
    expect(result.provider).toBe('gemini');
    expect(result.reason).toBe('gmail-domain');
    expect(result.sourceEmail).toBe('epalomeque@gmail.com');
    expect(result.detected).toBe('gemini');
  });

  it('should choose azure-openai for a hotmail address', () => {
    const result = resolveProvider(['user@hotmail.com'], 'auto');
    expect(result.provider).toBe('azure-openai');
    expect(result.reason).toBe('microsoft-domain');
  });

  it('should fall back to openrouter for an unknown domain', () => {
    const result = resolveProvider(['user@yahoo.com'], 'auto');
    expect(result.provider).toBe('openrouter');
    expect(result.provider).toBe(DEFAULT_PROVIDER);
    expect(result.detected).toBeNull();
    expect(result.sourceEmail).toBeNull();
  });

  it('should fall back to openrouter when there is no email at all', () => {
    const result = resolveProvider([], 'auto');
    expect(result.provider).toBe('openrouter');
    expect(result.reason).toBe('no-email');
  });

  it('should skip entries that are not emails', () => {
    const result = resolveProvider(['', 'nope', 'user@gmail.com'], 'auto');
    expect(result.provider).toBe('gemini');
    expect(result.sourceEmail).toBe('user@gmail.com');
  });

  it('should keep the first email that resolves, as in the real cvdata.json', () => {
    const result = resolveProvider(
      ['epalomeque@gmail.com', 'epalomeque@hotmail.com'],
      'auto',
    );
    expect(result.provider).toBe('gemini');
    expect(result.sourceEmail).toBe('epalomeque@gmail.com');
  });

  it('should honour a manual override and still report what was detected', () => {
    const result = resolveProvider(['user@gmail.com'], 'openrouter');
    expect(result.provider).toBe('openrouter');
    expect(result.reason).toBe('override');
    expect(result.detected).toBe('gemini');
    expect(result.sourceEmail).toBe('user@gmail.com');
  });

  it('should return null when the detected domain has no credentials', () => {
    const result = resolveProvider(['user@gmail.com'], 'auto', () => false);
    expect(result.provider).toBeNull();
    expect(result.reason).toBe('no-key-configured');
    expect(result.detected).toBe('gemini');
  });

  it('should still return openrouter without credentials when no domain matched', () => {
    const result = resolveProvider(['user@yahoo.com'], 'auto', () => false);
    expect(result.provider).toBe('openrouter');
    expect(result.reason).toBe('no-email');
  });

  it('should only consult the predicate for the detected provider', () => {
    const seen: string[] = [];
    resolveProvider(['user@hotmail.com'], 'auto', (provider) => {
      seen.push(provider);
      return true;
    });
    expect(seen).toEqual(['azure-openai']);
  });

  it('should let the first email of the shipped CV win, as in the real cvdata.json', async () => {
    const { loadRealCv } = await import('./fixtures/realCv');
    const { header } = loadRealCv();

    const result = resolveProvider(header.contact_info.email, 'auto');

    expect(header.contact_info.email.length).toBeGreaterThan(1);
    expect(result.provider).toBe('gemini');
    expect(result.sourceEmail).toBe(header.contact_info.email[0].trim().toLowerCase());
  });
});