// The kit as an app: a service worker (pages you have opened work offline afterwards) and our own Install button.
// On Android, Chrome's menu (Add to home screen) says "This app is already installed" whenever ANY app from the same
// site is installed, and every Astra app shares philhandley.github.io. Chrome's install offer to the page
// (beforeinstallprompt) checks this app's own address instead, so a button that uses it still installs Astra
// Victorians. index.html catches the offer in an inline script before this module loads.
const root = new URL('..', import.meta.url);
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  addEventListener('load', () => navigator.serviceWorker.register(new URL('sw.js', root), { scope: root.href }).catch(err => console.warn('service worker', String(err))));
}

const asApp = () => matchMedia('(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)').matches;
function refresh() {
  const can = !!window.__installOffer && !asApp();
  document.querySelectorAll('[data-install]').forEach(b => { b.hidden = !can; });
}
addEventListener('install-offer', refresh);
addEventListener('appinstalled', () => { window.__installOffer = null; refresh(); });
document.querySelectorAll('[data-install]').forEach(b => b.addEventListener('click', async () => {
  const offer = window.__installOffer;
  if (!offer) return;
  window.__installOffer = null;
  refresh();
  try { await offer.prompt(); await offer.userChoice; } catch (e) { /* an offer can only be used once */ }
}));
refresh();
