/**
 * Funções de manipulação de data
 */

/**
 * Retorna a data atual no formato YYYY-MM-DD (fuso local)
 * @returns {string} Data no formato YYYY-MM-DD
 */
function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formata data para exibição conforme idioma
 * @param {string} dateKey - Data no formato YYYY-MM-DD
 * @param {string} lang - Idioma ('pt' ou 'en')
 * @returns {string} Data formatada
 */
function formatDateDisplay(dateKey, lang) {
  const [year, month, day] = dateKey.split('-');

  if (lang === 'en') {
    // Formato americano: MM/DD/YYYY
    return `${month}/${day}/${year}`;
  }

  // Formato brasileiro: DD/MM/YYYY
  return `${day}/${month}/${year}`;
}

/**
 * Verifica se duas datas são iguais (YYYY-MM-DD)
 * @param {string} date1 - Primeira data
 * @param {string} date2 - Segunda data
 * @returns {boolean}
 */
function isSameDate(date1, date2) {
  return date1 === date2;
}

/**
 * Retorna data de amanhã no formato YYYY-MM-DD
 * @returns {string}
 */
function getTomorrowKey() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

