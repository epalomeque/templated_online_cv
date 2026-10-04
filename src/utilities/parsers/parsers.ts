/**
 * Converts an environment variable string into a boolean.
 *
 * Vite may leave a `VITE_*` variable undefined when it is not present in the
 * environment files, so `undefined` is an accepted input. Any value other than
 * the case-insensitive literal `'true'` resolves to `false`.
 *
 * @param str Raw environment variable value, possibly undefined.
 * @returns `true` only when `str` equals `'true'` ignoring case.
 */
export function stringToBoolean(str: string | undefined): boolean {
    return str?.toLowerCase() === 'true';
}