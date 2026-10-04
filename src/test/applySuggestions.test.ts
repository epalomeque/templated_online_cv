import { describe, it, expect } from 'vitest';
import { applySuggestions } from '../features/ia-assistant/applySuggestions';
import { Suggestion } from '../features/ia-assistant/iaTypes';
import { loadRealCv } from './fixtures/realCv';

/** Builds a suggestion with the recorded original already set. */
function suggestion(path: string, value: string, original: string): Suggestion {
  return {
    path,
    value,
    original,
    label: 'test',
    policy: 'REWRITE',
    section: 'experience',
    warnings: [],
  };
}

describe('applySuggestions', () => {
  const { header, details } = loadRealCv();
  const headerSnapshot = JSON.stringify(header);
  const detailsSnapshot = JSON.stringify(details);

  it('should write into the header for about_info paths', () => {
    const original = header.about_info.description;
    const result = applySuggestions(header, details, [
      suggestion('about_info.description', 'rewritten', original),
    ]);

    expect(result.applied).toBe(1);
    expect(result.header.about_info.description).toBe('rewritten');
    expect(result.details).toEqual(details);
  });

  it('should write into the details for array paths', () => {
    const original = details.experience![0].job_name;
    const result = applySuggestions(header, details, [
      suggestion('experience[0].job_name', 'Renamed Co', original),
    ]);

    expect(result.applied).toBe(1);
    expect(result.details.experience![0].job_name).toBe('Renamed Co');
    expect(result.header).toEqual(header);
  });

  it('should support replacing a whole array element for interests', () => {
    const interests = details.interests!;
    const longer = 'A'.repeat(25);
    const padded = { ...details, interests: [...interests.slice(0, -1), longer] };
    const result = applySuggestions(header, padded, [
      suggestion(`interests[${interests.length - 1}]`, 'Improved interest', longer),
    ]);

    expect(result.applied).toBe(1);
    expect(result.details.interests![interests.length - 1]).toBe('Improved interest');
  });

  it('should never mutate its inputs', () => {
    applySuggestions(header, details, [
      suggestion('about_info.description', 'rewritten', header.about_info.description),
      suggestion('experience[0].job_name', 'Renamed Co', details.experience![0].job_name),
    ]);

    expect(JSON.stringify(header)).toBe(headerSnapshot);
    expect(JSON.stringify(details)).toBe(detailsSnapshot);
  });

  it('should copy every array it touches', () => {
    const result = applySuggestions(header, details, [
      suggestion('experience[0].job_name', 'Renamed Co', details.experience![0].job_name),
    ]);

    expect(result.details.experience).not.toBe(details.experience);
    expect(result.details.experience![0]).not.toBe(details.experience![0]);
    expect(result.details.experience![1]).toBe(details.experience![1]);
  });

  it('should discard a suggestion whose original is stale', () => {
    const result = applySuggestions(header, details, [
      suggestion('experience[0].job_name', 'Renamed Co', 'a value the user has since changed'),
    ]);

    expect(result.applied).toBe(0);
    expect(result.skipped).toEqual([
      { path: 'experience[0].job_name', reason: 'stale-original' },
    ]);
    expect(result.details.experience![0].job_name).toBe(details.experience![0].job_name);
  });

  it('should discard a path that is not whitelisted', () => {
    const result = applySuggestions(header, details, [
      suggestion('contact_info.email', 'attacker@example.com', ''),
    ]);

    expect(result.applied).toBe(0);
    expect(result.skipped[0].reason).toBe('not-whitelisted');
  });

  it('should discard a path whose index does not exist', () => {
    const result = applySuggestions(header, details, [
      suggestion('experience[99].job_name', 'Renamed Co', 'whatever'),
    ]);

    expect(result.applied).toBe(0);
    expect(result.skipped[0].reason).toBe('stale-original');
  });

  it('should keep the first of two suggestions pointing at the same field', () => {
    const original = details.experience![0].job_name;
    const result = applySuggestions(header, details, [
      suggestion('experience[0].job_name', 'First', original),
      suggestion('experience[0].job_name', 'Second', original),
    ]);

    expect(result.applied).toBe(1);
    expect(result.details.experience![0].job_name).toBe('First');
    expect(result.skipped[0].reason).toBe('conflicting-suggestion');
  });

  it('should apply two different fields of the same item', () => {
    const item = details.experience![0];
    const result = applySuggestions(header, details, [
      suggestion('experience[0].job_name', 'New Company', item.job_name),
      suggestion('experience[0].position_name', 'New Position', item.position_name),
    ]);

    expect(result.applied).toBe(2);
    expect(result.details.experience![0].job_name).toBe('New Company');
    expect(result.details.experience![0].position_name).toBe('New Position');
  });

  it('should apply the whole batch at once and report the count', () => {
    const fields = collectPaths();
    const result = applySuggestions(header, details, fields);

    expect(result.applied).toBe(fields.length);
    expect(result.skipped).toEqual([]);
  });

  it('should return the untouched pair for an empty batch', () => {
    const result = applySuggestions(header, details, []);
    expect(result.applied).toBe(0);
    expect(result.header.about_info.description).toBe(header.about_info.description);
  });

  /** Builds a valid suggestion for every field that really exists. */
  function collectPaths(): Suggestion[] {
    const batch: Suggestion[] = [];
    batch.push(
      suggestion('about_info.description', 'rewritten summary', header.about_info.description),
    );
    details.experience!.forEach((item, index) => {
      batch.push(suggestion(`experience[${index}].pos_description`, `• improved ${index}`, item.pos_description));
    });
    details.projects!.forEach((item, index) => {
      batch.push(suggestion(`projects[${index}].pos_description`, `improved ${index}`, item.pos_description));
    });
    return batch;
  }
});