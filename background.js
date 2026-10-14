/**
 * Service worker (ES module, via "type": "module" in manifest.json).
 * Keeps the daily reminder alarm in sync with the saved settings and shows the
 * notification when it fires.
 */
import { t } from './src/shared/i18n.js';
import { DEFAULTS, getSettings } from './src/shared/settings.js';
import { ALARM_NAME, scheduleReminder, syncReminder } from './src/shared/reminder.js';

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === 'install') {
    await chrome.storage.local.set(DEFAULTS);
  }
  await syncReminder(await getSettings());
});

// Alarms aren't guaranteed to survive a browser restart, so check again on startup.
chrome.runtime.onStartup.addListener(async () => {
  await syncReminder(await getSettings());
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;

  const { lang, reminderEnabled, reminderTime } = await getSettings();
  if (!reminderEnabled) return;

  await chrome.notifications.create(ALARM_NAME, {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/icon-128.png'),
    title: t('notificationTitle', lang),
    message: t('notificationMessage', lang),
    priority: 0,
  });

  // One-shot alarms: schedule tomorrow's from the saved time (DST-safe).
  await scheduleReminder(reminderTime);
});

chrome.notifications.onClicked.addListener(async (notificationId) => {
  if (notificationId !== ALARM_NAME) return;
  await chrome.notifications.clear(notificationId);
  try {
    // Needs a focused browser window; fall back to the Options page otherwise.
    await chrome.action.openPopup();
  } catch {
    await chrome.runtime.openOptionsPage();
  }
});
