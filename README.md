# MV3 Offline Extension Starter

[Português](README.pt-BR.md)

A small Chrome Manifest V3 extension with no dependencies and no build step. It works offline, and accessibility, theming, language switching and a daily reminder are already in place. Fork it and put your own idea on top.

I'm a product designer, and I wrote this starter to show how I handle the parts of an extension that usually get rushed: keyboard support, screen reader feedback, contrast in both themes, and permissions people can understand.

<p>
  <img src="docs/screenshots/popup-light.png" width="300" alt="Popup in the light theme, in Portuguese: today's date, three tabs (General, Tips, About) and the Share and Copy buttons.">
  <img src="docs/screenshots/popup-dark.png" width="300" alt="The same popup in the dark theme, with the theme button shown as pressed.">
</p>

<img src="docs/screenshots/options-dark.png" width="420" alt="Options page in English and in the dark theme: language, theme, daily reminder at 07:30, the Settings saved message and a section explaining each permission.">

## Try it

1. Download or clone this repository.
2. Open `chrome://extensions` (or `edge://extensions`) and turn on **Developer mode**.
3. Click **Load unpacked** and select the project folder.

Requires Chrome 116 or later.

## What's inside

- **Popup** with tabs, today's date in the chosen language, a theme toggle, Copy and Share.
- **Options page** for language, theme (system, light or dark) and an optional daily reminder.
- **Service worker** (ES module) that schedules the reminder and shows the notification.
- **Two languages**, Portuguese and English, switchable at runtime. On first run it follows the browser's language.

## Decisions worth explaining

### Accessibility (WCAG 2.2 AA)

- **Tabs follow the ARIA Authoring Practices pattern**: arrow keys, Home and End move between tabs, and Tab goes straight to the panel. Only the active tab is in the tab order.
- **One status region per page** (`role="status"`) announces "Copied", "Settings saved" and errors. Messages are cleared and set again, so screen readers repeat them even when the text is the same.
- **The theme toggle keeps a fixed name** ("Dark theme") and exposes its state through `aria-pressed`. A label that flips between "light" and "dark" leaves people guessing whether it describes the current state or the action.
- **The Save button uses `aria-disabled` while saving** instead of `disabled`, so keyboard focus is never thrown back to the top of the page.
- **The reminder time field only appears when the reminder is on**, and the checkbox points to it with `aria-controls`.
- **Contrast is checked for both themes**, including control borders (3:1). No text uses opacity, so the measured ratios hold on screen. The values are listed at the top of `src/shared/tokens.css`.
- **`lang` is updated on `<html>`** whenever the language changes, so screen readers switch pronunciation.
- Visible focus everywhere, `prefers-reduced-motion` and Windows high contrast (`forced-colors`) are respected.
- Every screen was checked with [axe-core](https://github.com/dequelabs/axe-core) in both themes and both languages, with zero violations.

### Two translation systems, on purpose

`chrome.i18n` always follows the browser's language and can't be changed at runtime. Since people can pick a language in Options, the interface strings live in `src/shared/i18n.js`. The strings Chrome itself displays (name, description, toolbar tooltip) stay in `_locales/`, as the platform expects.

### A reminder that survives daylight saving time

A repeating 24-hour alarm drifts by an hour when daylight saving starts or ends. Here each alarm is a one-shot for the next occurrence of the chosen time, rescheduled every time it fires. Alarms aren't guaranteed to survive a browser restart, so the service worker checks them again on startup. See `src/shared/reminder.js`.

### Permissions people can read

The extension asks only for `storage`, `alarms` and `notifications`, and the Options page explains each one in plain words. Nothing is sent anywhere; everything stays in `chrome.storage.local`.

## Structure

```
mv3-offline-extension-starter/
├── manifest.json          # MV3 manifest: popup, options, module service worker
├── background.js          # Service worker: reminder alarm and notification
├── popup.html/.css/.js    # Popup: tabs, theme toggle, copy and share
├── options.html/.css/.js  # Options: language, theme, daily reminder
├── _locales/              # Strings shown by Chrome (en, pt_BR)
├── icons/                 # 16, 32, 48 and 128 px
└── src/shared/
    ├── tokens.css         # Colors for both themes, buttons, focus, status
    ├── i18n.js            # Interface strings and date formatting
    ├── settings.js        # Saved preferences and theme handling
    ├── reminder.js        # DST-safe daily alarm
    └── announce.js        # Messages for the status region
```

## Adapting it

- Change the copy in `src/shared/i18n.js`, always in both languages.
- Change colors in `src/shared/tokens.css`. If you do, check the contrast again in both themes.
- Add a preference: add it to `DEFAULTS` in `settings.js`, then add a field in `options.html` with a visible label and help text.
- Don't need the reminder? Remove `reminder.js`, the alarm listeners in `background.js` and the `alarms` and `notifications` permissions.

## License

MIT, see [LICENSE](LICENSE).
