import HeaderInfoInterface from '../../interfaces/header_Info.ts';
import DetailsInfoInterface from '../../interfaces/details_info.ts';
import { CvSection, ImprovableField, RewritePolicy } from './iaTypes';

/**
 * Minimum amount of characters a field must have to be worth sending.
 *
 * Short strings (a job title, a skill name) give the model nothing to rewrite
 * and cost quota, so they are filtered out before any request is built.
 */
export const MIN_CHARS = 20;

/** Which part of the CV state owns a field. */
export type PathContainer = 'header' | 'details';

/**
 * Declarative description of one improvable field.
 *
 * The catalog is the single source of truth: the prompt, the validation, the
 * apply step and the UI all derive from it, so adding a field is a one line
 * change and cannot desynchronise the layers.
 */
export interface FieldPattern {
  /** Human readable path pattern, `experience[i].job_name` style. */
  readonly pathPattern: string;
  /** Label shown in the review UI. */
  readonly label: string;
  /** Rewriting policy enforced on this field. */
  readonly policy: RewritePolicy;
  /** Section used to group requests. */
  readonly section: CvSection;
  /** Redux slice owning the field. */
  readonly container: PathContainer;
  /** Property holding the array, `null` when the value is a plain property. */
  readonly arrayKey: string;
  /** Property holding the text, `null` when the array element is the text. */
  readonly key: string | null;
  /** Instruction appended to the prompt and shown in the UI. */
  readonly restriction: string;
}

/**
 * Whitelist of every field the model is allowed to touch.
 *
 * Anything not listed here is unreachable for the feature. Fields holding
 * contact data, dates, completion statuses, URLs or skill levels are
 * deliberately absent: a "formatting" pass must never corrupt them.
 */
export const FIELD_PATTERNS: readonly FieldPattern[] = [
  {
    pathPattern: 'about_info.title',
    label: 'Titular',
    policy: 'FORMAT_ONLY',
    section: 'about',
    container: 'header',
    arrayKey: 'about_info',
    key: 'title',
    restriction: 'Max 8 words. Do not invent seniority or scope.',
  },
  {
    pathPattern: 'about_info.description',
    label: 'Sobre mí',
    policy: 'REWRITE',
    section: 'about',
    container: 'header',
    arrayKey: 'about_info',
    key: 'description',
    restriction: 'Keep the original language. Stay within 25% of the length.',
  },
  {
    pathPattern: 'experience[i].position_name',
    label: 'Puesto',
    policy: 'FORMAT_ONLY',
    section: 'experience',
    container: 'details',
    arrayKey: 'experience',
    key: 'position_name',
    restriction: 'Do not change seniority, scope or temporality.',
  },
  {
    pathPattern: 'experience[i].job_name',
    label: 'Empresa',
    policy: 'FORMAT_ONLY',
    section: 'experience',
    container: 'details',
    arrayKey: 'experience',
    key: 'job_name',
    restriction: 'Spelling only. Do not rename, translate or expand abbreviations.',
  },
  {
    pathPattern: 'experience[i].pos_description',
    label: 'Logros',
    policy: 'REWRITE',
    section: 'experience',
    container: 'details',
    arrayKey: 'experience',
    key: 'pos_description',
    restriction:
      'Preserve the "• " bullets, one per line, same count (+/-1). Never turn them into a paragraph.',
  },
  {
    pathPattern: 'education[i].grade_name',
    label: 'Titulación',
    policy: 'FORMAT_ONLY',
    section: 'education',
    container: 'details',
    arrayKey: 'education',
    key: 'grade_name',
    restriction: 'Never change the completion status, for example "Unfinished".',
  },
  {
    pathPattern: 'education[i].pos_description',
    label: 'Carrera',
    policy: 'REWRITE',
    section: 'education',
    container: 'details',
    arrayKey: 'education',
    key: 'pos_description',
    restriction: 'Keep the original language. Stay within 25% of the length.',
  },
  {
    pathPattern: 'projects[i].pos_description',
    label: 'Descripción del proyecto',
    policy: 'REWRITE',
    section: 'projects',
    container: 'details',
    arrayKey: 'projects',
    key: 'pos_description',
    restriction: 'Do not add stack, metrics or technologies.',
  },
  {
    pathPattern: 'abilities[i].name',
    label: 'Habilidad',
    policy: 'FORMAT_ONLY',
    section: 'abilities',
    container: 'details',
    arrayKey: 'abilities',
    key: 'name',
    restriction:
      'Do not add or remove technologies inside parentheses. The level is untouchable.',
  },
  {
    pathPattern: 'interests[i]',
    label: 'Interés',
    policy: 'FORMAT_ONLY',
    section: 'interests',
    container: 'details',
    arrayKey: 'interests',
    key: null,
    restriction: 'Same topic, better spelling. Do not add interests.',
  },
];

/**
 * Fields that must never be modified, kept as documentation and as a guard
 * used by the tests. `projects[i].name` is excluded on purpose because it
 * holds URLs a model could easily "reformat" and break.
 */
export const EXCLUDED_PATHS: readonly string[] = [
  'personal_info.*',
  'contact_info.*',
  'social_media.*',
  'experience[i].addr',
  'experience[i].duration_start',
  'experience[i].duration_end',
  'education[i].institute_name',
  'education[i].addr',
  'education[i].duration_start',
  'education[i].duration_end',
  'projects[i].name',
  'abilities[i].level',
  'languages.*',
  'picture',
];

/** Sections processed by the rewrite run, in order. */
export const SECTIONS: readonly CvSection[] = [
  'about',
  'experience',
  'education',
  'projects',
  'abilities',
  'interests',
];

/** A path already split into the parts needed to read and write the value. */
export interface ResolvedPath {
  /** Redux slice owning the field. */
  readonly container: PathContainer;
  /** Property holding the array or the object. */
  readonly arrayKey: string;
  /** Position inside the array, `null` for non indexed fields. */
  readonly index: number | null;
  /** Property holding the text, `null` when the array element is the text. */
  readonly key: string | null;
}

/**
 * Whether a value is worth sending to the model.
 *
 * @param value Candidate text.
 * @returns `true` when it is a string long enough to be improvable.
 */
export function isImprovableValue(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length >= MIN_CHARS;
}

/**
 * Reads a single field out of the CV state.
 *
 * @param header Header part of the CV.
 * @param details Details part of the CV.
 * @param resolved Path parts returned by {@link resolvePath}.
 * @returns The current text, or `undefined` when the path does not exist.
 */
function readValue(
  header: HeaderInfoInterface,
  details: DetailsInfoInterface,
  resolved: ResolvedPath,
): unknown {
  const source: unknown =
    resolved.container === 'header'
      ? (header as unknown as Record<string, unknown>)[resolved.arrayKey]
      : (details as unknown as Record<string, unknown>)[resolved.arrayKey];

  if (source === undefined || source === null) return undefined;

  if (resolved.index === null) {
    return resolved.key === null
      ? undefined
      : (source as Record<string, unknown>)[resolved.key];
  }

  const item = (source as unknown[])[resolved.index];
  if (item === undefined || item === null) return undefined;

  return resolved.key === null ? item : (item as Record<string, unknown>)[resolved.key];
}

/**
 * Enumerates every improvable field of the CV.
 *
 * Pure function: it never mutates its arguments and only returns fields
 * declared in {@link FIELD_PATTERNS} whose current value survives
 * {@link isImprovableValue}. Paths use the shape of the Redux state, so
 * `about_info.description` lives in `header` and `experience[2].job_name`
 * lives in `details`.
 *
 * @param header Header part of the CV.
 * @param details Details part of the CV.
 * @returns Fields ready to be rendered in the prompt.
 */
export function collectImprovableFields(
  header: HeaderInfoInterface,
  details: DetailsInfoInterface,
): ImprovableField[] {
  const fields: ImprovableField[] = [];

  for (const pattern of FIELD_PATTERNS) {
    const base: ResolvedPath = {
      container: pattern.container,
      arrayKey: pattern.arrayKey,
      index: null,
      key: pattern.key,
    };

    const indexed = readValue(header, details, base);

    if (indexed !== undefined) {
      if (isImprovableValue(indexed)) {
        fields.push({
          path: pattern.pathPattern.replace('[i]', ''),
          label: pattern.label,
          value: indexed,
          policy: pattern.policy,
          section: pattern.section,
        });
      }
      continue;
    }

    const source: unknown =
      pattern.container === 'header'
        ? (header as unknown as Record<string, unknown>)[pattern.arrayKey]
        : (details as unknown as Record<string, unknown>)[pattern.arrayKey];

    if (!Array.isArray(source)) continue;

    for (let index = 0; index < source.length; index += 1) {
      const value = readValue(header, details, { ...base, index });
      if (!isImprovableValue(value)) continue;
      fields.push({
        path: pattern.pathPattern.replace('[i]', `[${index}]`),
        label: pattern.label,
        value,
        policy: pattern.policy,
        section: pattern.section,
      });
    }
  }

  return fields;
}

/**
 * Groups fields by section, preserving {@link SECTIONS} order and dropping
 * empty sections so no request is built for them.
 *
 * @param fields Fields returned by {@link collectImprovableFields}.
 * @returns One entry per section that actually has improvable fields.
 */
export function groupBySection(
  fields: readonly ImprovableField[],
): { section: CvSection; fields: ImprovableField[] }[] {
  return SECTIONS.map((section) => ({
    section,
    fields: fields.filter((field) => field.section === section),
  })).filter((group) => group.fields.length > 0);
}

/** A path pattern already split into head, index marker and key. */
interface ParsedPattern {
  readonly head: string;
  /** `true` when the pattern carries an `[i]` placeholder. */
  readonly indexed: boolean;
  /** Property after the index, `null` when the element itself is the text. */
  readonly key: string | null;
}

/**
 * Splits a path pattern such as `experience[i].job_name` into its parts.
 *
 * @param pathPattern Pattern declared in the catalog.
 * @returns The head, whether it is indexed, and the trailing key.
 */
function parsePattern(pathPattern: string): ParsedPattern {
  const marker = pathPattern.indexOf('[i]');
  if (marker === -1) return { head: pathPattern, indexed: false, key: null };

  const head = pathPattern.slice(0, marker);
  const rest = pathPattern.slice(marker + '[i]'.length);
  return { head, indexed: true, key: rest.startsWith('.') ? rest.slice(1) : null };
}

/**
 * Builds the matcher for a catalog pattern.
 *
 * @param pathPattern Pattern declared in the catalog.
 * @returns A regular expression accepting only paths produced by the pattern.
 */
function patternMatcher(pathPattern: string): RegExp {
  const parsed = parsePattern(pathPattern);
  if (!parsed.indexed) {
    return new RegExp(`^${parsed.head.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
  }
  const suffix = parsed.key === null ? '' : `\\.${parsed.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`;
  return new RegExp(`^${parsed.head.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[\\d+\\]${suffix}$`);
}

/**
 * Extracts the index out of a concrete path.
 *
 * @param path Concrete path such as `experience[2].job_name`.
 * @param parsed Pattern parts.
 * @returns The index, or `null` when the path does not carry one.
 */
function parseIndex(path: string, parsed: ParsedPattern): number | null {
  if (!path.startsWith(`${parsed.head}[`)) return null;
  const closing = path.indexOf(']', parsed.head.length);
  if (closing === -1) return null;
  const digits = path.slice(parsed.head.length + 1, closing);
  return /^\d+$/.test(digits) ? Number(digits) : null;
}

/**
 * Finds the catalog entry that governs a concrete path.
 *
 * @param path Concrete path such as `experience[0].job_name`.
 * @returns The matching pattern, or `undefined` when the path is not allowed.
 */
export function findPattern(path: string): FieldPattern | undefined {
  return FIELD_PATTERNS.find((pattern) => patternMatcher(pattern.pathPattern).test(path));
}

/**
 * Splits a concrete path into the parts needed to read and write it.
 *
 * The container is derived from the catalog, never hardcoded by the caller, so
 * the apply step cannot disagree with the whitelist.
 *
 * @param path Concrete path such as `experience[0].job_name`.
 * @returns Path parts, or `null` when the path is not whitelisted.
 */
export function resolvePath(path: string): ResolvedPath | null {
  const pattern = findPattern(path);
  if (!pattern) return null;

  const parsed = parsePattern(pattern.pathPattern);

  return {
    container: pattern.container,
    arrayKey: pattern.arrayKey,
    index: parsed.indexed ? parseIndex(path, parsed) : null,
    key: pattern.key,
  };
}

/**
 * Groups the restrictions of a section, so the prompt can state the policy of
 * the whole section at once.
 *
 * @param fields Fields belonging to the section.
 * @returns A single sentence describing the rules that apply.
 */
export function describeSectionPolicy(fields: readonly ImprovableField[]): string {
  const hasRewrite = fields.some((field) => field.policy === 'REWRITE');
  const bullets = fields.some((field) => field.value.includes('• '));

  if (!hasRewrite) {
    return 'FORMAT_ONLY: fix spelling, capitalisation and punctuation only. Do not add, remove or change any meaning.';
  }
  if (bullets) {
    return 'rewrite wording only; bullet lists must keep their "• " markers and their bullet count.';
  }
  return 'rewrite wording only; keep the meaning and the original language of every field.';
}