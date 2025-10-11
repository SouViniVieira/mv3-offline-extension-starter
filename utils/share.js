/**
 * Funções de compartilhamento e geração de imagens
 * Canvas API para criar PNG
 */

/**
 * Renderiza conteúdo em um canvas e retorna o elemento
 * @param {object} options - Opções de renderização
 * @returns {HTMLCanvasElement}
 */
function renderCardToCanvas(options) {
  const {
    title = 'MV3 Starter',
    date = getTodayKey(),
    content = 'Demo de extensão MV3',
    theme = 'dark'
  } = options;

  // Criar canvas
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  // Cores baseadas no tema
  const colors = theme === 'dark'
    ? { bg: '#0f0b1e', text: '#edeaff', accent: '#7a50ff' }
    : { bg: '#f5f3ff', text: '#2c1f4a', accent: '#9d4edd' };

  // Background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Título
  ctx.fillStyle = colors.text;
  ctx.font = 'bold 48px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(title, canvas.width / 2, 100);

  // Data
  ctx.fillStyle = colors.text;
  ctx.globalAlpha = 0.7;
  ctx.font = '24px system-ui';
  ctx.fillText(date, canvas.width / 2, 150);
  ctx.globalAlpha = 1;

  // Linha decorativa
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(200, 180);
  ctx.lineTo(600, 180);
  ctx.stroke();

  // Conteúdo (quebrar texto em linhas)
  ctx.fillStyle = colors.text;
  ctx.font = '28px system-ui';
  ctx.textAlign = 'left';

  const maxWidth = 600;
  const lineHeight = 40;
  const words = content.split(' ');
  let line = '';
  let y = 250;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, 100, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 100, y);

  // Footer
  ctx.fillStyle = colors.text;
  ctx.globalAlpha = 0.5;
  ctx.font = '18px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('MV3 Starter - Material educacional', canvas.width / 2, canvas.height - 30);
  ctx.globalAlpha = 1;

  return canvas;
}

/**
 * Baixa canvas como PNG
 * @param {HTMLCanvasElement} canvas
 * @param {string} filename - Nome do arquivo (sem extensão)
 */
function downloadCanvasPng(canvas, filename = 'mv3-starter') {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Compartilha canvas usando Web Share API (com fallback)
 * @param {HTMLCanvasElement} canvas
 * @param {string} text - Texto para compartilhar
 * @returns {Promise<boolean>} true se compartilhou com sucesso
 */
async function webShareCanvas(canvas, text) {
  try {
    // Converter canvas para blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'mv3-starter.png', { type: 'image/png' });

    // Verificar se Web Share API está disponível
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        text: text,
        files: [file]
      });
      return true;
    } else {
      // Fallback: apenas baixar
      downloadCanvasPng(canvas, 'mv3-starter');
      return false;
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error);
    }
    // Em caso de erro, baixar como fallback
    downloadCanvasPng(canvas, 'mv3-starter');
    return false;
  }
}

