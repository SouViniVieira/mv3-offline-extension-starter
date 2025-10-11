# MV3 Offline Extension Starter

Eu criei esta base (starter) de extensão Chrome Manifest V3 para quem quiser construir rapidamente uma extensão 100% offline, acessível, com tema persistente e conteúdo em PT/EN. A ideia é simples: você foca na sua lógica, e eu te entrego a fundação pronta (UX/A11y, storage, i18n, alarms/notifications e Web APIs).

Repositório: `https://github.com/SouViniVieira/mv3-offline-extension-starter`

## O que eu entreguei

- **Arquitetura MV3 pronta**: `action` com popup, `options_page` e `background` service worker.
- **Acessibilidade de verdade (A11y)**: tabs com ARIA, foco visível e navegação por teclado (← → Home/End).
- **Tema claro/escuro persistente**: salva no `chrome.storage.local` e aplica na UI.
- **i18n PT/EN**: dicionário simples (`utils/i18n.js`) e helper `t()` para textos.
- **Lembrete diário** (opcional): configuração em `options`, agendamento com `chrome.alarms` e notificação com `chrome.notifications`.
- **Web APIs úteis**: copiar para clipboard e compartilhar (Web Share) com fallback; util de Canvas pronto para gerar PNG (`utils/share.js`).

## Por que criei essa base

- Para acelerar protótipos de extensão MV3 sem frameworks e sem dependências.
- Para mostrar, no meu portfólio, boas práticas de UX/A11y, organização e uso das APIs do Chrome.
- Para qualquer pessoa poder forkar e plugar sua própria ideia por cima.

## Como testar em 30s

1. Abra `chrome://extensions/`
2. Ative "Modo do desenvolvedor"
3. Clique em "Carregar sem compactação"
4. Selecione a pasta deste projeto

## Como adaptar para o seu projeto

- Troque textos no `popup.html`/`popup.js` e traduções em `utils/i18n.js`.
- Se quiser dados próprios, coloque em `data/` e consuma no `popup.js`.
- Quer compartilhar como imagem? Inclua `utils/share.js` no `popup.html` e use o Canvas para gerar um PNG do seu conteúdo.
- Use a página de `options` para preferências (tema/idioma) e, se fizer sentido, ative o lembrete diário.

## Stack e decisões

- **Sem frameworks**: HTML/CSS/JS puro para facilitar leitura e reuso.
- **Offline-first**: nada sai do seu dispositivo; funciona sem internet.
- **Manifest V3**: service worker (`background.js`) gerencia alarmes e notificações.
- **Código organizado**: UI no `popup`, preferências em `options`, utilitários em `utils/`.

## Estrutura

```
mv3-offline-extension-starter/
├── manifest.json              # Manifest V3 (popup, background, options)
├── popup.html/.css/.js        # UI principal: tabs, tema, i18n, share/copy
├── options.html/.css/.js      # Configurações: idioma, tema e lembrete diário
├── background.js              # Service worker: alarms + notifications
├── data/                      # Dados de exemplo (opcional)
└── utils/                     # date, i18n e share via Canvas/Web Share
```

## Permissões e privacidade

- **`storage`**: salva tema/idioma e preferências localmente.
- **`alarms`** e **`notifications`**: usados apenas se você ativar o lembrete diário.
- **Privacidade**: 100% offline; nenhum dado é enviado para servidores.

## Licença

MIT — veja `LICENSE`.

—

Feito por mim como base reutilizável para projetos de extensão Chrome MV3. Se te ajudar, deixa uma estrela no repositório! ⭐

