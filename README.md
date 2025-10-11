# MV3 Offline Extension Starter

Base didática de extensão Chrome (Manifest V3) feita para rodar 100% offline, com acessibilidade completa, tema persistente, i18n PT/EN e exemplos práticos de `alarms` + `notifications` + Web APIs (Clipboard, Web Share, Canvas).

Pensado para portfólio e como ponto de partida: faça fork, troque os textos e plugue sua própria lógica de negócio.

## Destaques (para portfólio)

- **Offline-first**: tudo roda no navegador, sem servidores.
- **A11y de verdade**: tabs com ARIA e navegação por teclado (← → Home/End).
- **Tema claro/escuro**: persistente via `chrome.storage.local`.
- **i18n PT/EN**: dicionário simples, pronto para expandir.
- **Lembrete diário**: exemplo com `chrome.alarms` + `chrome.notifications`.
- **Share/Clipboard/Canvas**: pronto para compartilhar texto e gerar PNGs.

> Ideal para demonstrar boas práticas de UX/A11y, uso das APIs do Chrome MV3 e organização de projeto sem frameworks.

## Como instalar (dev)

1. Abra `chrome://extensions/`
2. Ative "Modo do desenvolvedor"
3. Clique em "Carregar sem compactação"
4. Selecione a pasta deste projeto

## Estrutura

```
mv3-offline-extension-starter/
├── manifest.json              # Manifest V3 (action, background, options)
├── popup.html/.css/.js        # UI principal: tabs, tema, i18n, share/copy
├── options.html/.css/.js      # Configurações: idioma, tema e lembrete diário
├── background.js              # Service worker: alarms + notifications
├── data/                      # Dados de exemplo (não usados por padrão)
└── utils/                     # Helpers (date, i18n, share via Canvas/Web Share)
```

## Como funciona

- **Popup** (`popup.*`):
  - Tabs acessíveis com setas do teclado e ARIA.
  - Alterna tema e salva no `storage`.
  - Mostra a data do dia e permite compartilhar/copiar conteúdo.
- **Opções** (`options.*`):
  - Define idioma/tema e ativa um lembrete diário com horário.
  - Cria/limpa alarmes conforme o usuário salva.
- **Background** (`background.js`):
  - Inicializa defaults na instalação.
  - Recria alarmes após updates.
  - Dispara notificação diária e abre o popup ao clicar.
- **Utils** (`utils/*`):
  - `date.js`: formatação e chaves de data.
  - `i18n.js`: dicionário PT/EN e helper `t`.
  - `share.js`: render de cartão em Canvas + download/compartilhamento.

## Personalize para sua ideia

- Troque textos e labels no `popup.html`/`popup.js` e no `utils/i18n.js`.
- Use `data/` para seus dados e consuma no `popup.js`.
- Inclua `utils/share.js` no `popup.html` e gere uma imagem do conteúdo para compartilhar.
- Ajuste o fluxo de notificação diária para seu caso (ex.: “conteúdo do dia”).

## Permissões e privacidade

- **`storage`**: salva tema/idioma e preferências localmente.
- **`alarms`** e **`notifications`**: usados apenas se o lembrete diário for ativado.
- Nenhum dado sai do seu dispositivo. Funciona 100% offline.

## Checklist para publicar no GitHub (portfólio)

- Atualize o título/descrição do repositório para refletir o propósito do starter.
- Adicione tópicos: `chrome-extension`, `manifest-v3`, `offline-first`, `a11y`, `i18n`, `web-apis`.
- Inclua screenshots ou um GIF do popup e da página de opções.
- Preencha este README com capturas reais do seu caso de uso.
- Crie uma release `.zip` (opcional) para facilitar testes.

Sugestão de descrição curta (repo subtitle):

> Starter de extensão Chrome MV3 offline com A11y, tema, i18n, alarms/notifications e Web APIs – pronto para você plugar sua lógica.

## Testar rapidamente

1. Abra o popup, navegue com ← →, alterne tema e copie/compartilhe texto.
2. Em "Opções", ative o lembrete diário, defina um horário próximo e salve.
3. Acompanhe logs do service worker em `chrome://extensions`.

## Licença

MIT — veja `LICENSE`.

---

Feito como material educacional para extensões Chrome MV3 e como base de portfólio.

