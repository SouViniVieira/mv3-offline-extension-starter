/**
 * Daily reminder scheduling, shared by the service worker and the Options page.
 *
 * Each alarm is a one-shot for the next occurrence of "HH:MM" in local time,
 * rescheduled every time it fires. A repeating 24-hour alarm would drift by an
 * hour whenever daylight saving time starts or ends.
 */

export const ALARM_NAME = 'dailyReminder';

/** Timestamp of the next local occurrence of "HH:MM", strictly in the future. */
export function nextOccurrence(time, now = new Date()) {
  const [hours, minutes] = time.split(':').map(Number);
  const next = new Date(now);
  next.setHours(hours, minutes, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime();
}

export async function scheduleReminder(time) {
  await chrome.alarms.clear(ALARM_NAME);
  await chrome.alarms.create(ALARM_NAME, { when: nextOccurrence(time) });
}

export async function cancelReminder() {
  await chrome.alarms.clear(ALARM_NAME);
}

/** Make sure the alarm matches the saved settings (after install, update or browser restart). */
export async function syncReminder({ reminderEnabled, reminderTime }) {
  if (!reminderEnabled) return cancelReminder();
  const existing = await chrome.alarms.get(ALARM_NAME);
  if (existing === undefined) await scheduleReminder(reminderTime);
}
