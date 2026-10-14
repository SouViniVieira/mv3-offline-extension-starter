import { formatToday, t, translatePage } from './src/shared/i18n.js';
import { applyTheme, effectiveTheme, getSettings, saveSettings } from './src/shared/settings.js';
import { announce } from './src/shared/announce.js';

const status = document.getElementById('status');
const themeToggle = document.getElementById('themeToggle');
const tabs = [...document.querySelectorAll('[role="tab"]')];

let settings = await getSettings();

function render() {
  applyTheme(settings.theme);
  translatePage(settings.lang);
  document.getElementById('today').textContent = formatToday(settings.lang);
  document.getElementById('tipsList').replaceChildren(
    ...t('tips', settings.lang).map((tip) => Object.assign(document.createElement('li'), { textContent: tip })),
  );
  themeToggle.setAttribute('aria-pressed', String(effectiveTheme(settings.theme) === 'dark'));
}

// Theme toggle: switches between light and dark explicitly.
themeToggle.addEventListener('click', async () => {
  const next = effectiveTheme(settings.theme) === 'dark' ? 'light' : 'dark';
  settings = { ...settings, theme: next };
  await saveSettings({ theme: next });
  render();
});

document.getElementById('optionsBtn').addEventListener('click', () => chrome.runtime.openOptionsPage());

// Tabs: only the selected tab is in the Tab order; arrows, Home and End move between tabs.
function selectTab(tab, { focus = true } = {}) {
  for (const other of tabs) {
    const selected = other === tab;
    other.setAttribute('aria-selected', String(selected));
    other.tabIndex = selected ? 0 : -1;
    document.getElementById(other.getAttribute('aria-controls')).hidden = !selected;
  }
  if (focus) tab.focus();
}

for (const tab of tabs) {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (event) => {
    const index = tabs.indexOf(tab);
    const target = {
      ArrowRight: tabs[(index + 1) % tabs.length],
      ArrowLeft: tabs[(index - 1 + tabs.length) % tabs.length],
      Home: tabs[0],
      End: tabs[tabs.length - 1],
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    selectTab(target);
  });
}

// Copy and share report back through the status region, which screen readers announce.
document.getElementById('copyBtn').addEventListener('click', async () => {
  const panel = document.querySelector('[role="tabpanel"]:not([hidden])');
  try {
    await navigator.clipboard.writeText(panel.innerText.trim());
    announce(status, t('copied', settings.lang));
  } catch {
    announce(status, t('actionError', settings.lang), { error: true });
  }
});

document.getElementById('shareBtn').addEventListener('click', async () => {
  const text = t('shareText', settings.lang);
  try {
    if (navigator.share) {
      await navigator.share({ title: t('appTitle', settings.lang), text });
      announce(status, t('shared', settings.lang));
    } else {
      await navigator.clipboard.writeText(text);
      announce(status, t('copied', settings.lang));
    }
  } catch (error) {
    if (error.name !== 'AbortError') announce(status, t('actionError', settings.lang), { error: true });
  }
});

// Keep in sync if settings change in the Options page while the popup is open.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  for (const [key, { newValue }] of Object.entries(changes)) settings = { ...settings, [key]: newValue };
  render();
});

render();
