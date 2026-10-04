import HeaderInfoInterface from '../../interfaces/header_Info.ts';
import DetailsInfoInterface from '../../interfaces/details_info.ts';
import { CvSection, ImprovableField } from './iaTypes';
import { describeSectionPolicy } from './fieldCatalog';

/**
 * System prompt, verbatim.
 *
 * It is written in English because instructions are followed more consistently
 * across models; absolute rule 2 then obliges every model to preserve the
 * language of each individual field, which matters because this CV mixes
 * English and Spanish.
 */
export const SYSTEM_PROMPT = `You are a senior CV editor. You rewrite the wording of a resume using ONLY the information already present in the input.

ABSOLUTE RULES
1. NEVER invent, infer, complete or embellish facts. No new technologies, tools, employers, clients, projects, metrics, percentages, dates, certifications, team sizes, titles or responsibilities. Every noun, number, skill and named entity in your output MUST already appear either in that field's own original text or in the CV CONTEXT block.
2. NEVER translate. Keep every field in the exact language it was written in. This CV mixes English and Spanish: preserve each field's language independently of the others.
3. NEVER merge, split, reorder, add or remove fields. You may only change the wording inside a field's own text. Return each "path" copied verbatim from the FIELDS block; never invent a path.
4. NEVER change the meaning, the seniority level, the scope or the tense of a position title, a company name, a degree status or a skill list.
5. NEVER change a completion status (for example "unfinished", "in progress") and never change any date.
6. Preserve the text format exactly. If a description uses "• " bullets with one bullet per line, keep the same bullet marker, one bullet per line, and the same number of bullets (max +/-1). Never turn a bulleted list into a paragraph. Never add markdown (no **, no #, no \`\`\`).
7. Keep the length within 25% of the original, except for short fields (title, company, degree, skill, interest), which must stay at 8 words or fewer and must not gain detail.
8. Write in a professional, direct register. Use the active voice. Do not use cliches such as "team player", "results-oriented", "passionate", "dynamic", and do not add filler adjectives.
9. If a field is already well written, OMIT it from the output. Do not return cosmetic rewrites.
10. Return valid JSON matching the provided schema, with no text before or after it.

OUTPUT SHAPE
{ "suggestions": [ { "path": "<path copied verbatim from FIELDS>", "value": "<improved text>" } ] }`;

/**
 * Read only summary of the CV, injected in every request.
 *
 * Having the vocabulary of the whole CV in the prompt is what makes the third
 * guard layer coherent: the model may use a term that appears in another
 * section without `claimsGuard` flagging it as an invention.
 */
export interface CvContext {
  readonly fullName: string;
  readonly headline: string;
  readonly declaredSkills: string[];
  readonly education: string[];
  readonly languages: string[];
}

/**
 * Builds the read only CV summary used by the prompt.
 *
 * @param header Header part of the CV.
 * @param details Details part of the CV.
 * @returns Plain text lines describing the candidate.
 */
export function buildCvContext(
  header: HeaderInfoInterface,
  details: DetailsInfoInterface,
): CvContext {
  const { name, lastname, second_lastname } = header.personal_info;

  const declaredSkills = (details.abilities ?? [])
    .filter((ability) => ability.name.trim().length > 0)
    .map((ability) => ability.name);

  const education = (details.education ?? [])
    .filter((entry) => entry.grade_name.trim().length > 0)
    .map((entry) => {
      const period =
        entry.duration_end.trim().length > 0 ? `, ${entry.duration_end.trim()}` : '';
      return `${entry.institute_name} - ${entry.grade_name}${period}`;
    });

  const languages = (details.languages ?? [])
    .filter((entry) => entry.name.trim().length > 0)
    .map((entry) => `${entry.name} (${entry.level})`);

  return {
    fullName: [name, lastname, second_lastname]
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .join(' '),
    headline: header.about_info.title.trim(),
    declaredSkills,
    education,
    languages,
  };
}

/**
 * Renders the `CV CONTEXT` block.
 *
 * @param context Summary produced by {@link buildCvContext}.
 * @param targetRole Optional target role, may be empty.
 * @returns The block, or an empty string when there is nothing to say.
 */
function renderContext(context: CvContext, targetRole: string): string {
  const lines: string[] = [];

  lines.push(
    'CV CONTEXT (read-only. Use it for tone, terminology and language reference. Never output it.)',
  );
  if (context.fullName.length > 0) lines.push(`Full name: ${context.fullName}`);
  if (context.headline.length > 0) lines.push(`Current headline: ${context.headline}`);

  const role = targetRole.trim();
  if (role.length > 0) lines.push(`Target role: ${role}`);

  if (context.declaredSkills.length > 0) {
    lines.push(`Declared skills: ${context.declaredSkills.join(', ')}`);
  }
  context.education.forEach((entry) => lines.push(`Education: ${entry}`));
  context.languages.forEach((entry) => lines.push(`Languages: ${entry}`));

  return lines.length > 1 ? lines.join('\n') : '';
}

/**
 * Builds the system prompt of a request.
 *
 * @returns The system prompt, without any dynamic part.
 */
export function buildSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

/**
 * Builds the user prompt of a single section request.
 *
 * One request per section keeps the output ordered and makes real progress
 * reporting possible. Every path appears exactly once, and the field text is
 * the only text the model may return for that path.
 *
 * @param section Section being improved.
 * @param fields Improvable fields of that section.
 * @param context Summary produced by {@link buildCvContext}.
 * @param targetRole Optional target role; an empty value emits no line at all.
 * @param maxSuggestions Upper bound of suggestions requested.
 * @returns The user prompt.
 */
export function buildUserPrompt(
  section: CvSection,
  fields: readonly ImprovableField[],
  context: CvContext,
  targetRole: string,
  maxSuggestions: number,
): string {
  const blocks: string[] = [];

  const renderedContext = renderContext(context, targetRole);
  if (renderedContext.length > 0) blocks.push(renderedContext);

  blocks.push(`SECTION TO IMPROVE: ${section}`);
  blocks.push(`SECTION POLICY: ${describeSectionPolicy(fields)}`);

  const fieldLines: string[] = [];
  const emitted = new Set<string>();
  for (const field of fields) {
    if (emitted.has(field.path)) continue;
    emitted.add(field.path);
    fieldLines.push(`- ${field.path}  [${field.policy}]`);
    fieldLines.push(field.value);
  }

  blocks.push(
    `FIELDS (each one is the only text you may return for that path)\n${fieldLines.join('\n')}`,
  );
  blocks.push(`Return at most ${Math.max(1, maxSuggestions)} suggestions.`);

  return blocks.join('\n\n');
}