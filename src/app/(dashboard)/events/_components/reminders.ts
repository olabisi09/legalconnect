export const REMINDER_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "At start time" },
  { value: 5, label: "5 min before" },
  { value: 15, label: "15 min before" },
  { value: 30, label: "30 min before" },
  { value: 60, label: "1 hour before" },
  { value: 1440, label: "1 day before" },
  { value: 10080, label: "1 week before" },
];

/**
 * `Event.reminders` is typed as a string on read but sent as `number[]` on write — this
 * parses either shape defensively so display code doesn't need to care which one it got.
 */
export function parseReminders(
  value: string | number[] | null | undefined,
): number[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function reminderLabel(minutes: number): string {
  return (
    REMINDER_OPTIONS.find((o) => o.value === minutes)?.label ??
    `${minutes} min before`
  );
}
