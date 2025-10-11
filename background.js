/**
 * Service Worker (Background Script)
 * Gerencia alarmes e notificações do lembrete diário
 */

/**
 * Listener para instalação da extensão
 * Inicializa configurações padrão
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Extension installed/updated:', details.reason);

  // Inicializar configurações padrão na primeira instalação
  if (details.reason === 'install') {
    await chrome.storage.local.set({
      lang: 'pt',
      theme: 'dark',
      reminderEnabled: false,
      reminderTime: '09:00'
    });
    console.log('Default settings initialized');
  }

  // Verificar se há lembrete ativo e recriar alarme se necessário
  if (details.reason === 'update') {
    const { reminderEnabled, reminderTime } = await chrome.storage.local.get(['reminderEnabled', 'reminderTime']);

    if (reminderEnabled && reminderTime) {
      await recreateDailyAlarm(reminderTime);
    }
  }
});

/**
 * Listener para alarmes
 * Dispara quando o alarme do lembrete diário é acionado
 */
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'dailyReminder') {
    console.log('Daily reminder alarm triggered');
    await handleDailyReminder();
  }
});

/**
 * Listener para cliques na notificação
 * Abre o popup da extensão quando o usuário clica na notificação
 */
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === 'dailyReminder') {
    // Abrir popup da extensão
    chrome.action.openPopup();
    // Limpar notificação
    chrome.notifications.clear(notificationId);
  }
});

/**
 * Gerencia o lembrete diário
 * Exibe notificação genérica
 */
async function handleDailyReminder() {
  try {
    // Obter configurações
    const storage = await chrome.storage.local.get(['lang']);
    const lang = storage.lang || 'pt';

    // Exibir notificação
    await showDailyNotification(lang);

  } catch (error) {
    console.error('Error handling daily reminder:', error);
  }
}

/**
 * Exibe notificação do lembrete diário com fallback silencioso
 * @param {string} lang - Idioma da notificação
 */
async function showDailyNotification(lang) {
  // Verificar se a API de notificações está disponível
  if (!chrome.notifications) {
    console.warn('Notifications API not available, skipping notification');
    return;
  }

  const title = lang === 'en' ? '🔧 MV3 Starter' : '🔧 MV3 Starter';
  const message = lang === 'en'
    ? 'Your daily reminder is ready!'
    : 'Seu lembrete diário está pronto!';

  try {
    await chrome.notifications.create('dailyReminder', {
      type: 'basic',
      iconUrl: 'assets/icons/icon128.png', // Opcional: remova se não tiver ícones
      title: title,
      message: message,
      priority: 1,
      requireInteraction: false
    });
    console.log('Daily notification displayed');
  } catch (error) {
    // Fallback silencioso: se notificações não estão disponíveis ou permissão negada,
    // apenas registrar no console sem interromper o fluxo
    console.warn('Notification not displayed (permission may be denied or API unavailable):', error.message);
  }
}

/**
 * Recria o alarme diário após atualização da extensão
 * @param {string} time - Horário no formato HH:MM
 */
async function recreateDailyAlarm(time) {
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

    // Criar alarme que se repete a cada 24 horas
    await chrome.alarms.create('dailyReminder', {
      when: scheduledTime.getTime(),
      periodInMinutes: 1440 // 24 horas
    });

    console.log('Daily alarm recreated for:', time);
  } catch (error) {
    console.error('Error recreating alarm:', error);
  }
}

/**
 * Retorna a data atual no formato YYYY-MM-DD (fuso local)
 * Duplicado de utils/date.js pois service workers não podem importar módulos facilmente
 * @returns {string} Data no formato YYYY-MM-DD
 */
function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

