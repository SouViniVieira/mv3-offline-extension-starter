/**
 * Página de Configurações
 * Gerencia preferências: idioma, tema e lembrete diário
 */

// Estado da aplicação
let currentLang = 'pt';
let currentTheme = 'dark';

// Elementos DOM
let elements = {};

/**
 * Inicializa a página de opções
 */
async function init() {
  // Capturar elementos DOM
  elements = {
    pageTitle: document.getElementById('pageTitle'),
    successMessage: document.getElementById('successMessage'),
    successText: document.getElementById('successText'),
    settingsForm: document.getElementById('settingsForm'),
    languageSelect: document.getElementById('languageSelect'),
    themeSelect: document.getElementById('themeSelect'),
    reminderToggle: document.getElementById('reminderToggle'),
    reminderTime: document.getElementById('reminderTime'),
    reminderTimeContainer: document.getElementById('reminderTimeContainer'),
    saveBtn: document.getElementById('saveBtn'),
    saveBtnLabel: document.getElementById('saveBtnLabel'),
    // Labels for i18n
    labelLanguage: document.getElementById('labelLanguage'),
    labelTheme: document.getElementById('labelTheme'),
    labelReminder: document.getElementById('labelReminder'),
    labelReminderTime: document.getElementById('labelReminderTime'),
    optionThemeLight: document.getElementById('optionThemeLight'),
    optionThemeDark: document.getElementById('optionThemeDark'),
    descLanguage: document.getElementById('descLanguage'),
    descTheme: document.getElementById('descTheme'),
    descReminder: document.getElementById('descReminder'),
    infoTitle: document.getElementById('infoTitle'),
    infoStorage: document.getElementById('infoStorage'),
    infoAlarms: document.getElementById('infoAlarms'),
    infoNotifications: document.getElementById('infoNotifications'),
    infoNote: document.getElementById('infoNote'),
    footerText: document.getElementById('footerText')
  };

  // Event listeners
  elements.settingsForm.addEventListener('submit', saveSettings);
  elements.reminderToggle.addEventListener('change', toggleReminderTime);
  elements.languageSelect.addEventListener('change', onLanguageChange);
  elements.themeSelect.addEventListener('change', onThemeChange);

  // Carregar configurações atuais
  await loadSettings();
}

/**
 * Carrega configurações salvas do storage
 */
async function loadSettings() {
  try {
    const storage = await chrome.storage.local.get([
      'lang',
      'theme',
      'reminderEnabled',
      'reminderTime'
    ]);

    // Aplicar configurações
    currentLang = storage.lang || 'pt';
    currentTheme = storage.theme || 'dark';

    elements.languageSelect.value = currentLang;
    elements.themeSelect.value = currentTheme;
    elements.reminderToggle.checked = storage.reminderEnabled || false;
    elements.reminderTime.value = storage.reminderTime || '09:00';

    // Aplicar tema
    applyTheme(currentTheme);

    // Atualizar textos
    updateUITexts();

    // Mostrar/esconder container de horário
    if (elements.reminderToggle.checked) {
      elements.reminderTimeContainer.classList.remove('hidden');
    }

  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

/**
 * Salva as configurações
 */
async function saveSettings(e) {
  e.preventDefault();

  try {
    // Desabilitar botão
    elements.saveBtn.disabled = true;
    elements.saveBtnLabel.textContent = t('saving', currentLang);

    // Coletar valores
    const settings = {
      lang: elements.languageSelect.value,
      theme: elements.themeSelect.value,
      reminderEnabled: elements.reminderToggle.checked,
      reminderTime: elements.reminderTime.value
    };

    // Salvar no storage
    await chrome.storage.local.set(settings);

    // Gerenciar alarme
    if (settings.reminderEnabled) {
      await createDailyAlarm(settings.reminderTime);
    } else {
      await clearDailyAlarm();
    }

    // Feedback de sucesso
    showSuccessMessage();

    // Atualizar estado atual
    currentLang = settings.lang;
    currentTheme = settings.theme;

  } catch (error) {
    console.error('Error saving settings:', error);
    alert(t('saveError', currentLang));
  } finally {
    elements.saveBtn.disabled = false;
    updateUITexts();
  }
}

/**
 * Cria um alarme diário para o lembrete
 */
async function createDailyAlarm(time) {
  try {
    // Limpar alarme existente
    await chrome.alarms.clear('dailyReminder');

    // Calcular quando o alarme deve disparar
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Se o horário já passou hoje, agendar para amanhã
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    // Criar alarme que se repete a cada 24 horas (1440 minutos)
    await chrome.alarms.create('dailyReminder', {
      when: scheduledTime.getTime(),
      periodInMinutes: 1440 // 24 horas
    });

    console.log('Daily alarm created for:', time);
  } catch (error) {
    console.error('Error creating alarm:', error);
  }
}

/**
 * Remove o alarme diário
 */
async function clearDailyAlarm() {
  try {
    await chrome.alarms.clear('dailyReminder');
    console.log('Daily alarm cleared');
  } catch (error) {
    console.error('Error clearing alarm:', error);
  }
}

/**
 * Mostra/esconde o container de horário do lembrete
 */
function toggleReminderTime() {
  if (elements.reminderToggle.checked) {
    elements.reminderTimeContainer.classList.remove('hidden');
  } else {
    elements.reminderTimeContainer.classList.add('hidden');
  }
}

/**
 * Handler para mudança de idioma (preview imediato)
 */
function onLanguageChange() {
  currentLang = elements.languageSelect.value;
  updateUITexts();
}

/**
 * Handler para mudança de tema (preview imediato)
 */
function onThemeChange() {
  currentTheme = elements.themeSelect.value;
  applyTheme(currentTheme);
}

/**
 * Aplica o tema
 */
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}

/**
 * Atualiza todos os textos da interface
 */
function updateUITexts() {
  elements.pageTitle.textContent = '⚙️ ' + t('optionsTitle', currentLang);
  elements.successText.textContent = '✓ ' + t('savedMessage', currentLang);
  elements.saveBtnLabel.textContent = t('saveButton', currentLang);

  elements.labelLanguage.textContent = '🌐 ' + t('language', currentLang);
  elements.labelTheme.textContent = '🎨 ' + t('theme', currentLang);
  elements.labelReminderTime.textContent = '⏰ ' + t('reminderTime', currentLang);

  elements.optionThemeLight.textContent = t('themeLight', currentLang);
  elements.optionThemeDark.textContent = t('themeDark', currentLang);

  // Descriptions
  if (currentLang === 'pt') {
    elements.labelReminder.innerHTML = '<input type="checkbox" id="reminderToggle" class="setting-checkbox"> 🔔 Ativar lembrete diário';
    elements.descLanguage.textContent = 'Idioma da interface.';
    elements.descTheme.textContent = 'Aparência da extensão.';
    elements.descReminder.textContent = 'Receba uma notificação no horário escolhido.';
    elements.infoTitle.textContent = 'ℹ️ Sobre as Permissões';
    elements.infoStorage.textContent = 'Armazena preferências localmente no navegador.';
    elements.infoAlarms.textContent = 'Agenda o lembrete diário no horário escolhido (apenas se ativado).';
    elements.infoNotifications.textContent = 'Exibe notificação do lembrete (apenas se ativado).';
    elements.infoNote.textContent = '💡 Você pode desativar o lembrete a qualquer momento. Suas preferências são privadas e nunca saem do seu dispositivo.';
    elements.footerText.textContent = 'MV3 Starter v1.0.0 - Material educacional';
  } else {
    elements.labelReminder.innerHTML = '<input type="checkbox" id="reminderToggle" class="setting-checkbox"> 🔔 Enable daily reminder';
    elements.descLanguage.textContent = 'Interface language.';
    elements.descTheme.textContent = 'Extension appearance.';
    elements.descReminder.textContent = 'Receive a notification at the chosen time.';
    elements.infoTitle.textContent = 'ℹ️ About Permissions';
    elements.infoStorage.textContent = 'Stores preferences locally in the browser.';
    elements.infoAlarms.textContent = 'Schedules the daily reminder at the chosen time (only if enabled).';
    elements.infoNotifications.textContent = 'Displays reminder notification (only if enabled).';
    elements.infoNote.textContent = '💡 You can disable the reminder at any time. Your preferences are private and never leave your device.';
    elements.footerText.textContent = 'MV3 Starter v1.0.0 - Educational material';
  }

  // Re-bind listener (innerHTML destroys event listeners)
  elements.reminderToggle = document.getElementById('reminderToggle');
  elements.reminderToggle.checked = elements.reminderToggle.checked; // preserve state
  elements.reminderToggle.addEventListener('change', toggleReminderTime);
}

/**
 * Mostra mensagem de sucesso temporária
 */
function showSuccessMessage() {
  elements.successMessage.classList.remove('hidden');

  setTimeout(() => {
    elements.successMessage.classList.add('hidden');
  }, 3000);
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

