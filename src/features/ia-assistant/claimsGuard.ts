import HeaderInfoInterface from '../../interfaces/header_Info.ts';
import DetailsInfoInterface from '../../interfaces/details_info.ts';

/**
 * Vocabulary of the whole CV, used to tell a legitimate cross reference apart
 * from an invention.
 *
 * A term that already appears anywhere in the CV, including in read only
 * fields, is not flagged: mentioning a technology declared under `abilities`
 * while rewriting an experience entry is exactly what we want to allow.
 */
export interface GuardContext {
  /** Lowercase word tokens found anywhere in the CV. */
  readonly vocabulary: ReadonlySet<string>;
}

/** Expansion factor above which the suggestion is considered too long. */
export const MAX_EXPANSION_RATIO = 2.5;

/** Reduction factor below which the suggestion is considered too short. */
export const MIN_EXPANSION_RATIO = 0.4;

/** Bullet marker used across the CV. */
export const BULLET = '•';

/** Numeric token pattern, shared by the figures check. */
const NUMBER_PATTERN = /\d+(?:[.,]\d+)?%?/g;

/** Word token pattern that keeps technology characters such as `+`, `#` or `.`. */
const WORD_PATTERN = /[\p{L}\p{N}][\p{L}\p{N}+#._-]*/gu;

/** Characters that mean the following word opens a sentence or a bullet. */
const SENTENCE_BOUNDARY = new Set(['•', '-', '*', '–', '—', '.', '!', '?', ':', ';']);

/**
 * Words that only appear in Spanish prose.
 *
 * The two lists must stay disjoint: a word present in both would inflate both
 * counters and the ratio could never show a clear winner.
 */
const ES_STOPWORDS = new Set([
  'de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'que', 'en', 'con',
  'por', 'para', 'al', 'es', 'son', 'como', 'más', 'pero', 'sus', 'mi', 'su', 'y', 'o',
  'se', 'lo', 'este', 'esta', 'esto', 'esta', 'del', 'entre', 'sobre', 'hasta', 'desde',
  'cada', 'todo', 'toda', 'todos', 'todas', 'muy', 'ya', 'si', 'nos', 'les', 'donde',
]);

/** Words that only appear in English prose. */
const EN_STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with', 'is', 'are', 'was',
  'were', 'be', 'been', 'as', 'at', 'by', 'from', 'that', 'this', 'it', 'its', 'my', 'our',
  'their', 'has', 'have', 'had', 'do', 'does', 'not', 'but', 'so', 'if', 'than', 'then',
  'each', 'every', 'all', 'into', 'during', 'which', 'who', 'while', 'through', 'over',
  'under', 'about', 'also', 'more', 'most', 'other', 'such', 'only', 'own', 'same', 'too',
  'very', 'can', 'will', 'just', 'should', 'now', 'they', 'them', 'we', 'us', 'our',
]);

/**
 * A word token found in a text, together with its position.
 */
interface Token {
  readonly raw: string;
  readonly index: number;
}

/**
 * Splits a text into word tokens, keeping the position of each one.
 *
 * @param text Text to tokenize.
 * @returns Every word token found, in order.
 */
function tokenizeWithIndex(text: string): Token[] {
  const tokens: Token[] = [];
  WORD_PATTERN.lastIndex = 0;
  let match = WORD_PATTERN.exec(text);
  while (match !== null) {
    tokens.push({ raw: match[0], index: match.index });
    match = WORD_PATTERN.exec(text);
  }
  return tokens;
}

/**
 * Whether the word at a given position opens a sentence or a bullet.
 *
 * Sentence opening words are excluded from the terminology check on purpose:
 * flagging the first word of every rewritten line would produce nothing but
 * noise.
 *
 * @param text Text the token belongs to.
 * @param index Position of the token.
 * @returns `true` when the token is sentence initial.
 */
function isSentenceInitial(text: string, index: number): boolean {
  const before = text.slice(0, index).replace(/\s+$/, '');
  if (before.length === 0) return true;
  return SENTENCE_BOUNDARY.has(before[before.length - 1]);
}

/**
 * Whether a token looks like a named entity worth checking.
 *
 * Three shapes qualify: all caps acronyms (`API`, `SQL`, `KPI`), words with an
 * internal capital (`FastAPI`, `PostgreSQL`, `TypeScript`) and plain
 * capitalised words such as `React` or `Kubernetes`. The last shape is only
 * reported when the token is absent from both the original field and the CV
 * vocabulary, which is what keeps false positives away.
 *
 * @param token Word token.
 * @returns `true` when the token should be checked against the vocabulary.
 */
function isCandidateTerm(token: string): boolean {
  if (token.length < 3) return false;
  if (/^[A-Z][A-Z0-9]+$/.test(token)) return true;
  if (/^[A-Z][a-z0-9]*[A-Z]/.test(token)) return true;
  return /^[A-Z][a-z]/.test(token);
}

/**
 * Counts the bullet markers of a text.
 *
 * @param text Text to inspect.
 * @returns Number of `•` markers found.
 */
function countBullets(text: string): number {
  return text.split(BULLET).length - 1;
}

/**
 * Guesses the dominant language of a text from its stop words.
 *
 * @param text Text to inspect.
 * @returns `'es'`, `'en'` or `null` when neither dominates.
 */
function detectLanguage(text: string): 'es' | 'en' | null {
  const words = tokenizeWithIndex(text).map((token) => token.raw.toLowerCase());
  let es = 0;
  let en = 0;
  for (const word of words) {
    if (ES_STOPWORDS.has(word)) es += 1;
    if (EN_STOPWORDS.has(word)) en += 1;
  }
  if (es + en === 0) return null;
  if (es >= 1 && es > en * 4) return 'es';
  if (en >= 1 && en > es * 4) return 'en';
  return null;
}

/**
 * Collects every string of an arbitrary value, guarding against cycles.
 *
 * @param value Value to walk.
 * @param out Accumulator of visited objects.
 * @param depth Current recursion depth.
 */
function collectStrings(value: unknown, out: Set<string>, depth = 0): void {
  if (depth > 8) return;

  if (typeof value === 'string') {
    for (const token of tokenizeWithIndex(value)) {
      out.add(token.raw.toLowerCase());
    }
    return;
  }

  if (typeof value === 'number') {
    out.add(String(value));
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out, depth + 1);
    return;
  }

  if (typeof value === 'object' && value !== null) {
    for (const item of Object.values(value as Record<string, unknown>)) {
      collectStrings(item, out, depth + 1);
    }
  }
}

/**
 * Builds the vocabulary of the whole CV.
 *
 * Every string of every field is tokenized, read only fields included, so a
 * legitimate reference to a term declared elsewhere is never reported as an
 * invention.
 *
 * @param header Header part of the CV.
 * @param details Details part of the CV.
 * @returns A context holding the lowercase vocabulary tokens.
 */
export function buildVocabulary(
  header: HeaderInfoInterface,
  details: DetailsInfoInterface,
): GuardContext {
  const tokens = new Set<string>();
  collectStrings(header, tokens);
  collectStrings(details, tokens);
  return { vocabulary: tokens };
}

/**
 * Detects claims in a suggestion that the original text does not support.
 *
 * The checks never block: they produce warnings that the review UI renders as
 * amber chips, and the user decides. Applying a suggestion is always an
 * explicit act.
 *
 * @param original Text currently stored in the CV.
 * @param suggestion Text proposed by the model.
 * @param ctx Vocabulary of the CV, from {@link buildVocabulary}.
 * @returns Human readable warnings, empty when nothing looks wrong.
 */
export function detectUnsupportedClaims(
  original: string,
  suggestion: string,
  ctx: GuardContext,
): string[] {
  const warnings: string[] = [];

  const originalNumbers = new Set(
    (original.match(NUMBER_PATTERN) ?? []).map((value) => value.replace(/[.,]/g, '')),
  );
  for (const number of suggestion.match(NUMBER_PATTERN) ?? []) {
    const normalized = number.replace(/[.,]/g, '');
    if (originalNumbers.has(normalized)) continue;
    warnings.push(`introduce la cifra "${number}"`);
  }

  const originalWords = new Set(
    tokenizeWithIndex(original).map((token) => token.raw.toLowerCase()),
  );
  const seenTerms = new Set<string>();
  for (const { raw, index } of tokenizeWithIndex(suggestion)) {
    if (!isCandidateTerm(raw)) continue;
    if (isSentenceInitial(suggestion, index)) continue;
    const lower = raw.toLowerCase();
    if (originalWords.has(lower)) continue;
    if (ctx.vocabulary.has(lower)) continue;
    if (seenTerms.has(lower)) continue;
    seenTerms.add(lower);
    warnings.push(`introduce el término "${raw}"`);
  }

  const ratio = suggestion.length / Math.max(original.length, 1);
  if (ratio > MAX_EXPANSION_RATIO) {
    warnings.push(`expande el texto ${ratio.toFixed(1)}x`);
  } else if (ratio < MIN_EXPANSION_RATIO) {
    warnings.push('recorta demasiado');
  }

  const originalBullets = countBullets(original);
  const suggestionBullets = countBullets(suggestion);
  if (originalBullets > 0 && suggestionBullets === 0) {
    warnings.push('cambia el formato de viñetas');
  } else if (Math.abs(originalBullets - suggestionBullets) > 1) {
    warnings.push(`cambia el número de viñetas (${originalBullets} -> ${suggestionBullets})`);
  }

  const originalLanguage = detectLanguage(original);
  const suggestionLanguage = detectLanguage(suggestion);
  if (
    originalLanguage !== null &&
    suggestionLanguage !== null &&
    originalLanguage !== suggestionLanguage
  ) {
    warnings.push('posible cambio de idioma');
  }

  return warnings;
}

/**
 * Convenience wrapper that attaches the warnings to a suggestion.
 *
 * @param original Text currently stored in the CV.
 * @param suggestion Text proposed by the model.
 * @param ctx Vocabulary of the CV.
 * @returns The warnings of the suggestion.
 */
export function warningsFor(
  original: string,
  suggestion: string,
  ctx: GuardContext,
): string[] {
  return detectUnsupportedClaims(original, suggestion, ctx);
}