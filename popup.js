/**
 * Popup Principal
 * Demonstra tabs acessíveis, tema persistente e i18n
 */

// Estado da aplicação
let currentLang = 'pt';
let currentTheme = 'dark';
let activeTab = 'general';

// Elementos DOM
let elements = {};

/**
 * Inicializa a aplicação
 */
async function init() {
  // Capturar elementos DOM
  elements = {
    appTitle: document.getElementById('appTitle'),
    dateDisplay: document.getElementById('dateDisplay'),
    themeToggle: document.getElementById('themeToggle'),
    optionsBtn: document.getElementById('optionsBtn'),
    tabGeneral: document.getElementById('tabGeneral'),
    tabTips: document.getElementById('tabTips'),
    tabAbout: document.getElementById('tabAbout'),
    tabLabelGeneral: document.getElementById('tabLabelGeneral'),
    tabLabelTips: document.getElementById('tabLabelTips'),
    tabLabelAbout: document.getElementById('tabLabelAbout'),
    panelGeneral: document.getElementById('panelGeneral'),
    panelTips: document.getElementById('panelTips'),
    panelAbout: document.getElementById('panelAbout'),
    shareBtn: document.getElementById('shareBtn'),
    copyBtn: document.getElementById('copyBtn'),
    shareLabel: document.getElementById('shareLabel'),
    copyLabel: document.getElementById('copyLabel'),
    keyboardHint: document.getElementById('keyboardHint')
  };

  // Event listeners
  elements.themeToggle.addEventListener('click', toggleTheme);
  elements.optionsBtn.addEventListener('click', openOptions);
  elements.shareBtn.addEventListener('click', shareCard);
  elements.copyBtn.addEventListener('click', copyText);

  // Tab navigation
  const tabs = [elements.tabGeneral, elements.tabTips, elements.tabAbout];
  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.id.replace('tab', '').toLowerCase()));
    tab.addEventListener('keydown', handleTabKeyboard);
  });

  // Carregar configurações
  const storage = await chrome.storage.local.get(['lang', 'theme']);
  currentLang = storage.lang || 'pt';
  currentTheme = storage.theme || 'dark';

  // Aplicar tema
  applyTheme(currentTheme, false);

  // Atualizar textos
  updateUITexts();

  // Exibir data
  elements.dateDisplay.textContent = formatDateDisplay(getTodayKey(), currentLang);
}

/**
 * Alterna entre abas (segmented control)
 */
function switchTab(tabName) {
  const tabNames = ['general', 'tips', 'about'];
  const tabs = [elements.tabGeneral, elements.tabTips, elements.tabAbout];
  const panels = [elements.panelGeneral, elements.panelTips, elements.panelAbout];

  // Atualizar ARIA attributes e visibilidade
  tabs.forEach((tab, index) => {
    const isSelected = tabNames[index] === tabName;
    tab.setAttribute('aria-selected', isSelected);
    tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    panels[index].classList.toggle('hidden', !isSelected);

    // Foco no tab selecionado se foi navegação por teclado
    if (isSelected && document.activeElement.getAttribute('role') === 'tab') {
      tab.focus();
    }
  });

  activeTab = tabName;
}

/**
 * Gerencia navegação por teclado nas tabs
 */
function handleTabKeyboard(e) {
  const tabs = [elements.tabGeneral, elements.tabTips, elements.tabAbout];
  const tabNames = ['general', 'tips', 'about'];
  const currentIndex = tabNames.indexOf(activeTab);

  let newIndex = currentIndex;

  if (e.key === 'ArrowRight') {
    e.preventDefault();
    newIndex = (currentIndex + 1) % tabs.length;
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (e.key === 'Home') {
    e.preventDefault();
    newIndex = 0;
  } else if (e.key === 'End') {
    e.preventDefault();
    newIndex = tabs.length - 1;
  } else {
    return;
  }

  switchTab(tabNames[newIndex]);
}

/**
 * Alterna tema claro/escuro
 */
async function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  await applyTheme(currentTheme, true);
}

/**
 * Aplica o tema
 */
async function applyTheme(theme, persist = true) {
  const html = document.documentElement;
  const themeIcon = elements.themeToggle.querySelector('.theme-icon');

  if (theme === 'light') {
    html.classList.add('theme-light');
    themeIcon.textContent = '☀️';
    elements.themeToggle.setAttribute('aria-pressed', 'true');
    elements.themeToggle.setAttribute('aria-label', t('toggleThemeLight', currentLang));
  } else {
    html.classList.remove('theme-light');
    themeIcon.textContent = '🌙';
    elements.themeToggle.setAttribute('aria-pressed', 'false');
    elements.themeToggle.setAttribute('aria-label', t('toggleThemeDark', currentLang));
  }

  if (persist) {
    await chrome.storage.local.set({ theme });
  }
}

/**
 * Atualiza textos da interface
 */
function updateUITexts() {
  elements.appTitle.textContent = '🔧 ' + t('appTitle', currentLang);
  elements.shareLabel.textContent = t('shareButton', currentLang);
  elements.copyLabel.textContent = t('copyButton', currentLang);
  elements.tabLabelGeneral.textContent = t('tabs.general', currentLang);
  elements.tabLabelTips.textContent = t('tabs.tips', currentLang);
  elements.tabLabelAbout.textContent = t('tabs.about', currentLang);
  elements.keyboardHint.textContent = t('keyboardHint', currentLang);
  elements.optionsBtn.setAttribute('aria-label', t('optionsButton', currentLang));
}

/**
 * Compartilha usando Web Share API (com fallback)
 */
async function shareCard() {
  const text = t('shareText', currentLang) + ' - ' + formatDateDisplay(getTodayKey(), currentLang);
  
  try {
    // Tentar Web Share API (se disponível)
    if (navigator.share) {
      await navigator.share({ 
        title: t('appTitle', currentLang),
        text: text 
      });
      showFeedback('shareLabel', 'shareSuccess');
    } else {
      // Fallback: copiar para clipboard
      await navigator.clipboard.writeText(text);
      showFeedback('shareLabel', 'shareSuccess');
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error);
      showFeedback('shareLabel', 'shareError');
    }
  }
}

/**
 * Copia texto do painel ativo
 */
async function copyText() {
  const activePanel = document.querySelector('.panel:not(.hidden)');
  const text = activePanel ? activePanel.innerText : '';

  try {
    await navigator.clipboard.writeText(text);
    showFeedback('copyLabel', 'copiedSuccess');
  } catch (error) {
    console.error('Error copying:', error);
    showFeedback('copyLabel', 'copyError');
  }
}

/**
 * Mostra feedback temporário no botão
 */
function showFeedback(elementId, messageKey, duration = 1500) {
  const element = elements[elementId];
  const originalText = element.textContent;
  element.textContent = t(messageKey, currentLang);
  setTimeout(() => {
    element.textContent = originalText;
  }, duration);
}

/**
 * Abre a página de opções
 */
function openOptions() {
  chrome.runtime.openOptionsPage();
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

