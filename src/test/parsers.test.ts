import { describe, it, expect } from 'vitest';
import { stringToBoolean } from '../utilities/parsers/parsers';

describe('stringToBoolean', () => {
  it('should return true for the literal "true"', () => {
    expect(stringToBoolean('true')).toBe(true);
  });

  it('should be case insensitive', () => {
    expect(stringToBoolean('TRUE')).toBe(true);
    expect(stringToBoolean('True')).toBe(true);
    expect(stringToBoolean('tRuE')).toBe(true);
  });

  it('should return false for any other string', () => {
    expect(stringToBoolean('false')).toBe(false);
    expect(stringToBoolean('1')).toBe(false);
    expect(stringToBoolean('yes')).toBe(false);
    expect(stringToBoolean('')).toBe(false);
    expect(stringToBoolean(' true')).toBe(false);
    expect(stringToBoolean('true ')).toBe(false);
  });

  it('should return false instead of throwing when the variable is undefined', () => {
    expect(() => stringToBoolean(undefined)).not.toThrow();
    expect(stringToBoolean(undefined)).toBe(false);
  });

  it('should accept an undefined environment variable the way Vite provides it', () => {
    const env: Record<string, string | undefined> = {};
    expect(stringToBoolean(env.VITE_CONFIG_SHOW_NOT_SET)).toBe(false);
  });
});