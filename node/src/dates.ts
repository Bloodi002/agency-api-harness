// Record timestamps come without an offset (for example 2026-07-09T04:35:53.583) and are UTC. Wall-clock shift times are plain strings and never reach this.
const WITHOUT_OFFSET = /T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/;

/** Reads an API date or date-time; one without an offset is UTC, never the caller's local time. */
export function parseApiDate(value: string): Date {
  return new Date(WITHOUT_OFFSET.test(value) ? `${value}Z` : value);
}
