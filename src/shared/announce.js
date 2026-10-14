/**
 * Show a short message in a role="status" region so it's both visible and
 * announced by screen readers, without moving focus. Changing a button's own
 * text (the previous approach) is often not announced at all.
 */
export function announce(region, message, { error = false, duration = 4000 } = {}) {
  clearTimeout(region._timer);
  region.dataset.state = error ? 'error' : 'success';
  // Clear first so repeating the same message is announced again.
  region.textContent = '';
  requestAnimationFrame(() => {
    region.textContent = message;
  });
  region._timer = setTimeout(() => {
    region.textContent = '';
  }, duration);
}
