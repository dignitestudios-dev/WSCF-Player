/**
 * Dates that are days, not moments.
 *
 * A birth date is 23 June wherever you are standing. It has no time and no
 * timezone. The database stores it as a Date, which makes it an instant —
 * midnight UTC — and `new Date("2018-06-23")` follows the same rule.
 *
 * Rendering that instant with the browser's timezone is where it breaks: at
 * UTC-6, midnight UTC on the 23rd is 18:00 on the **22nd**, so a parent in the
 * United States picked the 23rd and saw the 22nd. It looked correct in
 * Pakistan (UTC+5) only because the shift happened to land on the same day.
 *
 * The fix is to stop converting. Both shapes we ever receive —
 *
 *   "2018-06-23"                  from the date picker
 *   "2018-06-23T00:00:00.000Z"    from the API
 *
 * — begin with the calendar date we want, so it is read straight off the front
 * of the string and rebuilt as local midnight. No offset is ever applied, so
 * no offset can ever move the day.
 */

const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})/;

/** The calendar day a stored value means, as a local Date. Null if unusable. */
export function parseCalendarDate(value?: string | Date | null): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const match = String(value).match(CALENDAR_DATE);
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * The wire format the API expects: the calendar day, no time, no offset.
 * `toISOString()` is deliberately avoided — it converts to UTC and can move
 * the day for anyone west of Greenwich.
 */
export function toCalendarDateString(date?: Date | null): string {
  if (!date || Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
