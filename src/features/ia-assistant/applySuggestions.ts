import HeaderInfoInterface from '../../interfaces/header_Info.ts';
import DetailsInfoInterface from '../../interfaces/details_info.ts';
import { Suggestion } from './iaTypes';
import { resolvePath, ResolvedPath } from './fieldCatalog';

/** Result of {@link applySuggestions}. */
export interface ApplyResult {
  readonly header: HeaderInfoInterface;
  readonly details: DetailsInfoInterface;
  /** How many suggestions actually reached the CV. */
  readonly applied: number;
  /** Human readable reasons for every suggestion that was skipped. */
  readonly skipped: { path: string; reason: string }[];
}

/** Identity key of a resolved path, used to detect conflicting suggestions. */
function pathKey(resolved: ResolvedPath): string {
  return `${resolved.container}:${resolved.arrayKey}:${resolved.index ?? '-'}:${resolved.key ?? '-'}`;
}

/**
 * Returns a copy of an array with one text value replaced.
 *
 * @param source Array holding the item.
 * @param index Position of the item.
 * @param key Property to replace, or `null` to replace the item itself.
 * @param value New text.
 * @returns A new array; `source` is never mutated.
 */
function withItemValue<T>(source: T[], index: number, key: string | null, value: string): T[] {
  const next = [...source];
  const item = next[index];
  if (key === null) {
    next[index] = value as unknown as T;
    return next;
  }
  next[index] = {
    ...(item as unknown as Record<string, unknown>),
    [key]: value,
  } as T;
  return next;
}

/**
 * Reads the current text of a resolved path out of a container.
 *
 * @param source Redux slice that owns the field.
 * @param resolved Path parts returned by {@link resolvePath}.
 * @returns The current value, or `undefined` when the path does not exist.
 */
function readCurrent(source: Record<string, unknown>, resolved: ResolvedPath): unknown {
  if (resolved.index === null) {
    const container = source[resolved.arrayKey] as Record<string, unknown> | undefined;
    if (!container || resolved.key === null) return undefined;
    return container[resolved.key];
  }

  const list = source[resolved.arrayKey] as unknown[] | undefined;
  if (!Array.isArray(list)) return undefined;
  const item = list[resolved.index];
  if (item === undefined || item === null) return undefined;
  return resolved.key === null ? item : (item as Record<string, unknown>)[resolved.key];
}

/**
 * Applies accepted suggestions to the CV data.
 *
 * Both containers are copied immutably on every change, so the thunk can
 * dispatch a single `setCVData` and React sees one coherent update. The inputs
 * are never mutated.
 *
 * A suggestion is discarded when its recorded `original` no longer matches the
 * current value of the CV, which protects the user from applying a rewrite on
 * top of an edit made while the model was working.
 *
 * @param header Current header of the CV.
 * @param details Current details of the CV.
 * @param suggestions Suggestions the user accepted.
 * @returns The new pair, the amount applied, and the reasons for the skips.
 */
export function applySuggestions(
  header: HeaderInfoInterface,
  details: DetailsInfoInterface,
  suggestions: readonly Suggestion[],
): ApplyResult {
  let nextHeader: HeaderInfoInterface = { ...header };
  let nextDetails: DetailsInfoInterface = { ...details };
  const skipped: { path: string; reason: string }[] = [];
  const touched = new Set<string>();
  let applied = 0;

  for (const suggestion of suggestions) {
    const resolved = resolvePath(suggestion.path);

    if (resolved === null) {
      skipped.push({ path: suggestion.path, reason: 'not-whitelisted' });
      continue;
    }

    const key = pathKey(resolved);
    if (touched.has(key)) {
      skipped.push({ path: suggestion.path, reason: 'conflicting-suggestion' });
      continue;
    }

    const isHeader = resolved.container === 'header';
    const source = (
      isHeader
        ? (nextHeader as unknown as Record<string, unknown>)
        : (nextDetails as unknown as Record<string, unknown>)
    );

    if (readCurrent(source, resolved) !== suggestion.original) {
      skipped.push({ path: suggestion.path, reason: 'stale-original' });
      continue;
    }

    if (isHeader && resolved.index === null) {
      const container = source[resolved.arrayKey] as Record<string, unknown> | undefined;
      nextHeader = {
        ...nextHeader,
        [resolved.arrayKey]: { ...(container ?? {}), [resolved.key as string]: suggestion.value },
      } as HeaderInfoInterface;
      applied += 1;
      touched.add(key);
      continue;
    }

    if (resolved.index === null) {
      skipped.push({ path: suggestion.path, reason: 'unsupported-path' });
      continue;
    }

    const list = source[resolved.arrayKey] as unknown[];
    nextDetails = {
      ...nextDetails,
      [resolved.arrayKey]: withItemValue(list, resolved.index, resolved.key, suggestion.value),
    } as DetailsInfoInterface;
    applied += 1;
    touched.add(key);
  }

  return { header: nextHeader, details: nextDetails, applied, skipped };
}