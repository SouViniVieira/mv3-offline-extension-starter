# Changelog

## 2.0.0 (2026-10-13)

A rewrite focused on accessibility, correct Manifest V3 usage and code that is easier to reuse.

### Added

- Language switch at runtime (Portuguese and English); on first run the language follows the browser.
- Theme option with three values: system, light and dark.
- Status region that announces copy, share, save and error messages to screen readers.
- Page `lang` updates when the language changes.
- Section in Options explaining each permission.
- Icons at 16, 32, 48 and 128 px, and localized name, description and toolbar tooltip in `_locales/`.
- Contrast-checked color tokens shared by the popup and Options, with `forced-colors` and `prefers-reduced-motion` support.
- English README, with the Portuguese version in `README.pt-BR.md`.

### Changed

- Service worker is now an ES module and shares code with the pages through `src/shared/`.
- Daily reminder uses one-shot alarms rescheduled after each run, so it stays at the chosen time across daylight saving changes. It is checked again when the browser starts.
- Tabs follow the ARIA Authoring Practices pattern (arrows, Home, End; only the active tab is focusable).
- Theme toggle keeps a fixed accessible name and uses `aria-pressed` for its state.
- Save button uses `aria-disabled` while saving, so focus stays in place.
- Options opens in a tab (`options_ui`), and the reminder time field only shows when the reminder is on.
- Minimum Chrome version is 116.

### Removed

- Unused utilities (`utils/share.js`, `utils/date.js`, `utils/i18n.js`) and `data/sample.json`.
- Emoji used as button labels.

## 1.0.0 (2025-10-10)

First version.
