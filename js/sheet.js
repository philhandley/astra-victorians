// Toolbar for a printable sheet: Print, PDF, back. ?only=<group> keeps one group of pages; ?name= fills the name line.
import './pwa.js';
import { CREDITS } from './credits.js';
// Reference pictures: <figure class="ref" data-img="penny-black.jpg" data-cap="..."> is filled with the picture and its credit.
document.querySelectorAll('figure.ref[data-img]').forEach(f => {
  const file = f.dataset.img, c = CREDITS[file] || {};
  const cap = f.dataset.cap || c.caption || '';
  f.innerHTML = `<img src="../assets/img/${file}" alt="${(c.alt || '').replace(/"/g, '')}"><figcaption>${cap}${c.credit ? ' · ' + c.credit : ''}</figcaption>`;
});
const bar = document.querySelector('.toolbar');
if (bar) bar.querySelector('[data-print]')?.addEventListener('click', () => print());
const q = new URLSearchParams(location.search);
if (q.get('name')) document.querySelectorAll('.pf .nm span:first-child').forEach(s => s.textContent = q.get('name'));
const only = q.get('only');
if (only) document.querySelectorAll('[data-group]').forEach(p => { if (p.dataset.group !== only) p.remove(); });
// A picker in the toolbar (poems) switches ?only=
bar?.querySelector('select[data-pick]')?.addEventListener('change', e => { const u = new URL(location.href); u.searchParams.set('only', e.target.value); location.href = u; });
if (only) { const s = bar?.querySelector('select[data-pick]'); if (s) s.value = only; }
if (q.has('preview')) { document.body.classList.add('preview'); document.querySelectorAll('.page').forEach((pg, i) => { if (i) pg.remove(); }); }
