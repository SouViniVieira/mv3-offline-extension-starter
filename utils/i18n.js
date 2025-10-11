/**
 * Sistema de internacionalização (i18n)
 * Suporta PT-BR e EN
 */

/**
 * Dicionário de traduções
 */
const translations = {
  pt: {
    // App
    appTitle: 'MV3 Starter',

    // Tabs
    tabs: {
      general: 'Geral',
      tips: 'Dicas',
      about: 'Sobre'
    },

    // Buttons
    shareButton: '📤 Compartilhar',
    copyButton: '📋 Copiar',
    saveButton: 'Salvar Configurações',
    optionsButton: 'Configurações',

    // Feedback
    shareText: 'Demo MV3 Starter',
    shareSuccess: 'Compartilhado!',
    shareError: 'Erro ao compartilhar',
    copiedSuccess: 'Copiado!',
    copyError: 'Erro ao copiar',
    savedMessage: 'Configurações salvas com sucesso!',
    saving: 'Salvando...',
    saveError: 'Erro ao salvar. Tente novamente.',

    // Theme
    toggleTheme: 'Alternar tema',
    toggleThemeLight: 'Alternar para tema escuro',
    toggleThemeDark: 'Alternar para tema claro',

    // Keyboard
    keyboardHint: 'Use ← → para navegar',

    // Options
    optionsTitle: 'Configurações',
    language: 'Idioma',
    theme: 'Tema',
    themeLight: 'Claro',
    themeDark: 'Escuro',
    reminder: 'Lembrete diário',
    reminderTime: 'Horário',

    // Date
    loading: 'Carregando...'
  },

  en: {
    // App
    appTitle: 'MV3 Starter',

    // Tabs
    tabs: {
      general: 'General',
      tips: 'Tips',
      about: 'About'
    },

    // Buttons
    shareButton: '📤 Share',
    copyButton: '📋 Copy',
    saveButton: 'Save Settings',
    optionsButton: 'Settings',

    // Feedback
    shareText: 'Demo MV3 Starter',
    shareSuccess: 'Shared!',
    shareError: 'Share error',
    copiedSuccess: 'Copied!',
    copyError: 'Copy error',
    savedMessage: 'Settings saved successfully!',
    saving: 'Saving...',
    saveError: 'Error saving. Try again.',

    // Theme
    toggleTheme: 'Toggle theme',
    toggleThemeLight: 'Switch to dark theme',
    toggleThemeDark: 'Switch to light theme',

    // Keyboard
    keyboardHint: 'Use ← → to navigate',

    // Options
    optionsTitle: 'Settings',
    language: 'Language',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    reminder: 'Daily reminder',
    reminderTime: 'Time',

    // Date
    loading: 'Loading...'
  }
};

/**
 * Traduz uma chave para o idioma especificado
 * @param {string} key - Chave da tradução (pode usar notação de ponto: 'tabs.general')
 * @param {string} lang - Idioma ('pt' ou 'en')
 * @returns {string} Tradução ou a própria chave se não encontrada
 */
function t(key, lang = 'pt') {
  const langDict = translations[lang] || translations.pt;

  // Suportar notação de ponto (ex: 'tabs.general')
  const keys = key.split('.');
  let result = langDict;

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return key; // Retorna a chave se não encontrar
    }
  }

  return result || key;
}

/**
 * Retorna o nome do idioma por extenso
 * @param {string} lang - Código do idioma ('pt' ou 'en')
 * @returns {string}
 */
function getLanguageName(lang) {
  const names = {
    pt: 'Português (PT-BR)',
    en: 'English (EN)'
  };
  return names[lang] || names.pt;
}

