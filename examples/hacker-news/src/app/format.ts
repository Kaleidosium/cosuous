import { Temporal } from "temporal-polyfill-lite";

/**
 * Distance from `time` to now in the single largest non-zero unit, e.g.
 * "32 minutes" or "2 days". Replaces date-fns' formatDistanceStrict using
 * Temporal: a ZonedDateTime difference balances cleanly across calendar units.
 */
export const formatTime = (time: Date): string => {
  const now = Temporal.Now.zonedDateTimeISO();
  const then = Temporal.Instant
    .fromEpochMilliseconds(time.getTime())
    .toZonedDateTimeISO(now.timeZoneId);
  const d = now.since(then, { largestUnit: "year", smallestUnit: "second" });

  const units: ReadonlyArray<readonly [number, string]> = [
    [d.years, "year"],
    [d.months, "month"],
    [d.days, "day"],
    [d.hours, "hour"],
    [d.minutes, "minute"],
    [d.seconds, "second"],
  ];

  for (const [amount, unit] of units) {
    if (amount > 0) return `${amount} ${unit}${amount === 1 ? "" : "s"}`;
  }
  return "0 seconds";
};
