/**
 * Typed list of IANA time zone IDs (e.g., "America/New_York").
 * Uses Intl.supportedValuesOf('timeZone') when available, with a safe fallback.
 * No `any` used to satisfy eslint rules.
 */

export type TimezoneId = string;

type IntlSupportedValues = {
  supportedValuesOf?: (key: "timeZone") => string[];
};

// Narrow `Intl` without using `any`
const intlMaybe = Intl as unknown as IntlSupportedValues;

const supportedTimeZones: ReadonlyArray<TimezoneId> =
  typeof intlMaybe.supportedValuesOf === "function"
    ? (intlMaybe.supportedValuesOf("timeZone") as ReadonlyArray<TimezoneId>)
    : ([] as ReadonlyArray<TimezoneId>); // fallback to empty; consumers can provide their own list

export const ZONES: ReadonlyArray<TimezoneId> = supportedTimeZones;

/**
 * Optional helper: validate a string looks like an IANA zone.
 * Very light check — keeps types narrow without depending on `any`.
 */
export function isTimezoneId(value: unknown): value is TimezoneId {
  return (
    typeof value === "string" && value.includes("/") && !value.endsWith("/")
  );
}

/**
 * Provide a default export for convenience:
 *   import timezones from "@/app/lib/timezones";
 * or use named:
 *   import { ZONES } from "@/app/lib/timezones";
 */
export default ZONES;
