import { t, translatePage } from './src/shared/i18n.js';
import { applyTheme, getSettings, saveSettings } from './src/shared/settings.js';
import { cancelReminder, scheduleReminder } from './src/shared/reminder.js';
import { announce } from './src/shared/announce.js';

const form = document.getElementById('settingsForm');
const language = document.getElementById('language');
const theme = document.getElementById('theme');
const reminderEnabled = document.getElementById('reminderEnabled');
const reminderTime = document.getElementById('reminderTime');
const timeField = document.getElementById('reminder-time-field');
const saveBtn = document.getElementById('saveBtn');
const status = document.getElementById('status');

let lang = 'pt';
let saving = false;

function showTimeField() {
  timeField.hidden = !reminderEnabled.checked;
}

async function load() {
  const settings = await getSettings();
  lang = settings.lang;
  language.value = settings.lang;
  theme.value = settings.theme;
  reminderEnabled.checked = settings.reminderEnabled;
  reminderTime.value = settings.reminderTime;
  document.getElementById('version').textContent = chrome.runtime.getManifest().version;

  applyTheme(settings.theme);
  translatePage(lang);
  showTimeField();
}

// Live preview: language and theme change as soon as they're picked.
language.addEventListener('change', () => {
  lang = language.value;
  translatePage(lang); // also updates <html lang>
});
theme.addEventListener('change', () => applyTheme(theme.value));
reminderEnabled.addEventListener('change', showTimeField);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (saving) return;
  // aria-disabled instead of disabled: a disabled button drops keyboard focus.
  saving = true;
  saveBtn.setAttribute('aria-disabled', 'true');
  saveBtn.textContent = t('saving', lang);

  try {
    const settings = {
      lang: language.value,
      theme: theme.value,
      reminderEnabled: reminderEnabled.checked,
      reminderTime: reminderTime.value || '09:00',
    };
    await saveSettings(settings);
    if (settings.reminderEnabled) await scheduleReminder(settings.reminderTime);
    else await cancelReminder();
    announce(status, t('saved', lang));
  } catch (error) {
    console.error(error);
    announce(status, t('saveError', lang), { error: true, duration: 8000 });
  } finally {
    saving = false;
    saveBtn.removeAttribute('aria-disabled');
    saveBtn.textContent = t('save', lang);
  }
});

load();
