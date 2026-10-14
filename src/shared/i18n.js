/**
 * In-app translations.
 *
 * Why not only chrome.i18n? chrome.i18n always follows the browser's UI
 * language and can't be switched at runtime. This starter lets people pick a
 * language in Options, so UI strings live here. Strings Chrome itself shows
 * (extension name, description, toolbar tooltip) use _locales/ as usual.
 */

export const LANGUAGES = {
  pt: { label: 'Português (Brasil)', htmlLang: 'pt-BR', dateLocale: 'pt-BR' },
  en: { label: 'English', htmlLang: 'en', dateLocale: 'en-US' },
};

const strings = {
  pt: {
    appTitle: 'MV3 Starter',
    settings: 'Configurações',
    darkTheme: 'Tema escuro',
    tabsLabel: 'Conteúdo',
    tabGeneral: 'Geral',
    tabTips: 'Dicas',
    tabAbout: 'Sobre',
    keyboardHint: 'Dica: use as setas para trocar de aba.',
    generalText:
      'Um ponto de partida para extensões Chrome Manifest V3 que funcionam offline, com acessibilidade, tema e idioma resolvidos.',
    tips: [
      'Abas com teclado: setas, Home e End',
      'Tema claro, escuro ou do sistema, salvo localmente',
      'Interface em português e inglês',
      'Lembrete diário com alarms e notifications',
      'Copiar e compartilhar com mensagens anunciadas ao leitor de tela',
    ],
    aboutText: 'Material de estudo sem dependências: HTML, CSS e JavaScript em módulos. Nada sai do seu dispositivo.',
    share: 'Compartilhar',
    copy: 'Copiar',
    shareText: 'Conheça o MV3 Starter, uma base acessível para extensões Chrome',
    shared: 'Compartilhado.',
    copied: 'Texto copiado.',
    actionError: 'Não foi possível concluir. Tente de novo.',

    optionsTitle: 'Configurações',
    language: 'Idioma',
    languageHelp: 'Idioma da interface da extensão.',
    theme: 'Tema',
    themeHelp: 'Aparência do popup e desta página.',
    themeSystem: 'Igual ao sistema',
    themeLight: 'Claro',
    themeDark: 'Escuro',
    reminder: 'Ativar lembrete diário',
    reminderHelp: 'Uma notificação por dia, no horário escolhido.',
    reminderTime: 'Horário do lembrete',
    save: 'Salvar configurações',
    saving: 'Salvando…',
    saved: 'Configurações salvas.',
    saveError: 'Não foi possível salvar. Tente de novo.',
    permissionsTitle: 'Por que a extensão pede estas permissões',
    permStorage: 'guarda suas preferências neste navegador.',
    permAlarms: 'agenda o lembrete diário, só se você ativar.',
    permNotifications: 'mostra o lembrete, só se você ativar.',
    privacy: 'Você pode desligar o lembrete quando quiser. Suas preferências nunca saem do seu dispositivo.',
    footer: 'MV3 Starter · material de estudo',

    notificationTitle: 'MV3 Starter',
    notificationMessage: 'Seu lembrete diário chegou.',
  },
  en: {
    appTitle: 'MV3 Starter',
    settings: 'Settings',
    darkTheme: 'Dark theme',
    tabsLabel: 'Content',
    tabGeneral: 'General',
    tabTips: 'Tips',
    tabAbout: 'About',
    keyboardHint: 'Tip: use the arrow keys to switch tabs.',
    generalText:
      'A starting point for offline Chrome Manifest V3 extensions, with accessibility, theming and language already handled.',
    tips: [
      'Keyboard tabs: arrows, Home and End',
      'Light, dark or system theme, saved locally',
      'Interface in Portuguese and English',
      'Daily reminder with alarms and notifications',
      'Copy and share with messages announced to screen readers',
    ],
    aboutText: 'Dependency-free study material: HTML, CSS and JavaScript modules. Nothing leaves your device.',
    share: 'Share',
    copy: 'Copy',
    shareText: 'Check out MV3 Starter, an accessible base for Chrome extensions',
    shared: 'Shared.',
    copied: 'Text copied.',
    actionError: "That didn't work. Please try again.",

    optionsTitle: 'Settings',
    language: 'Language',
    languageHelp: "The extension's interface language.",
    theme: 'Theme',
    themeHelp: 'Appearance of the popup and this page.',
    themeSystem: 'Match system',
    themeLight: 'Light',
    themeDark: 'Dark',
    reminder: 'Turn on daily reminder',
    reminderHelp: 'One notification a day, at the time you choose.',
    reminderTime: 'Reminder time',
    save: 'Save settings',
    saving: 'Saving…',
    saved: 'Settings saved.',
    saveError: "Couldn't save. Please try again.",
    permissionsTitle: 'Why the extension asks for these permissions',
    permStorage: 'keeps your preferences in this browser.',
    permAlarms: 'schedules the daily reminder, only if you turn it on.',
    permNotifications: 'shows the reminder, only if you turn it on.',
    privacy: 'You can turn the reminder off at any time. Your preferences never leave your device.',
    footer: 'MV3 Starter · study material',

    notificationTitle: 'MV3 Starter',
    notificationMessage: 'Your daily reminder is here.',
  },
};

/** Translate `key` into `lang`, falling back to Portuguese, then to the key itself. */
export function t(key, lang) {
  return strings[lang]?.[key] ?? strings.pt[key] ?? key;
}

/**
 * Fill every [data-i18n] element with its translation and set <html lang>, so
 * screen readers switch pronunciation along with the text (WCAG 3.1.1).
 */
export function translatePage(lang) {
  document.documentElement.lang = LANGUAGES[lang]?.htmlLang ?? 'pt-BR';
  for (const el of document.querySelectorAll('[data-i18n]')) {
    el.textContent = t(el.dataset.i18n, lang);
  }
  for (const el of document.querySelectorAll('[data-i18n-label]')) {
    el.setAttribute('aria-label', t(el.dataset.i18nLabel, lang));
  }
}

/** Today's date, written the way each language expects. */
export function formatToday(lang) {
  const locale = LANGUAGES[lang]?.dateLocale ?? 'pt-BR';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(new Date());
}
