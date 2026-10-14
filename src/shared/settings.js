/** Preferences stored in chrome.storage.local, with their defaults. */
export const DEFAULTS = {
  // First run follows the browser's language; people can change it in Options.
  lang: chrome.i18n.getUILanguage().toLowerCase().startsWith('pt') ? 'pt' : 'en',
  theme: 'system', // 'system' | 'light' | 'dark'
  reminderEnabled: false,
  reminderTime: '09:00',
};

/** Read all preferences, filling in defaults for anything not saved yet. */
export async function getSettings() {
  const saved = await chrome.storage.local.get(Object.keys(DEFAULTS));
  return { ...DEFAULTS, ...saved };
}

export async function saveSettings(partial) {
  await chrome.storage.local.set(partial);
}

/**
 * Apply a theme to the page. "system" removes the override so CSS follows
 * prefers-color-scheme; light and dark force one palette.
 */
export function applyTheme(theme) {
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.dataset.theme = theme;
  } else {
    delete document.documentElement.dataset.theme;
  }
}

/** The palette actually on screen right now. */
export function effectiveTheme(theme) {
  if (theme === 'light' || theme === 'dark') return theme;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
