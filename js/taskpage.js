// Renders one task page from js/content.js. Each tasks/<id>.html is a small shell that calls render('<id>').
import './pwa.js';
import { TASKS, byId } from './tasks.js';
import { CONTENT } from './content.js';
import { CREDITS } from './credits.js';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const speaker = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
const printer = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/></svg>';
const down = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 21h16"/></svg>';

function credit(file) { const c = CREDITS[file]; return c ? `${esc(c.caption)} · ${esc(c.credit)}` : ''; }
function host(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }

export function render(id) {
  const t = byId(id), c = CONTENT[id];
  if (!t || !c) { document.body.innerHTML = '<p style="padding:40px">That task is not here.</p>'; return; }
  document.title = `${t.title} · Astra Victorians`;
  const i = TASKS.indexOf(t), prev = TASKS[i - 1], next = TASKS[i + 1];
  const hero = c.hero || t.img;
  const html = `
<div class="wrap">
  <header class="topbar">
    <a class="brand" href="../index.html"><img src="../assets/icons/icon-192.png" alt="">Astra Victorians</a>
    <nav class="nav"><a href="../index.html">Tasks</a><a href="../victorians.html">Meet the Victorians</a><a href="../grown-ups.html">Grown-ups</a></nav>
  </header>
  <section class="task-hero" data-task="${t.id}">
    <div>
      <div class="kicker"><span class="pts ${t.bonus ? 'bonus' : ''}">${t.bonus ? 'BONUS' : t.pts}</span><span>Task ${String(i + 1).padStart(2, '0')} · ${t.bonus ? 'Bonus task' : t.pts + ' points'} · ${esc(c.time || '')}</span></div>
      <h1>${esc(t.title)}</h1>
      <div class="brief"><b>The homework says:</b> ${esc(t.brief)}</div>
      <p><button class="btn say" data-say="${esc(c.intro)}">${speaker} Read aloud</button> <label class="tick"><input type="checkbox"> Done and in the green book</label></p>
      <p class="lede">${esc(c.intro)}</p>
    </div>
    <figure><img src="../assets/img/${hero}" alt="${esc((CREDITS[hero] || {}).alt || '')}"><figcaption>${credit(hero)}</figcaption></figure>
  </section>

  ${c.look ? `<section class="block look">
    <h2>Look closely</h2>
    <p class="idea"><b>The big idea</b>${esc(c.look.idea)}</p>
    <div class="look-grid">
      <figure><img src="../assets/img/${c.look.img}" alt="${esc((CREDITS[c.look.img] || {}).alt || c.look.what)}"><figcaption><b>${esc(c.look.what)}</b>${credit(c.look.img)}</figcaption></figure>
      <div class="stw">
        ${[['See', 'What do you see?', c.look.see], ['Think', 'What do you think?', c.look.think], ['Wonder', 'What do you wonder?', c.look.wonder]].map(([k, q, x]) => `
        <div class="stw-card"><span class="k">${k}</span><h3>${q}</h3><p>${esc(x)}</p><button class="btn say" data-say="${esc(q + ' ' + x)}">${speaker} Read</button></div>`).join('')}
      </div>
    </div>
  </section>` : ''}

  ${c.explore && c.explore.length ? `<section class="block"><h2>Look inside a real one</h2><div class="figs">${c.explore.map(e => `
      <a class="fig" href="../explore/${e.page}">
        <span class="pv"><img src="../assets/previews/${e.preview}" alt="" loading="lazy"></span>
        <span class="no">${esc(e.fig || 'Figure')} · spin it round and open it up</span>
        <h3>${esc(e.title)}</h3><p>${esc(e.desc)}</p>
      </a>`).join('')}</div></section>` : ''}

  ${c.app ? `<section class="block"><div class="note gold"><h3 style="margin:0 0 6px">${esc(c.app.title)}</h3><p style="margin:0 0 10px">${esc(c.app.text)}</p><a class="btn teal" href="${c.app.url}">${esc(c.app.button)}</a></div></section>` : ''}

  <section class="block">
    <h2>What to do</h2>
    <ol class="steps">${c.steps.map(s => `<li><div>${s}</div></li>`).join('')}</ol>
  </section>

  <section class="block">
    <h2>Printables</h2>
    <div class="printables">${c.printables.map(p => `
      <div class="printable">
        <div class="pv"><img src="../assets/previews/${p.preview}" alt="" loading="lazy"></div>
        <h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p><span class="pages">${esc(p.pages)}</span>
        <div class="acts"><a class="btn" href="../sheets/${p.sheet}">${printer} Open and print</a><a class="btn ghost" href="../pdf/${p.pdf}" download>${down} PDF</a></div>
      </div>`).join('')}</div>
  </section>

  <section class="block">
    <h2>${esc(c.factsTitle || 'Facts to read aloud')}</h2>
    <div class="facts">${c.facts.map(f => `<div class="fact"><p>${esc(f.kid)}</p><div class="foot"><span class="src">${f.src ? `<a href="${f.src}" target="_blank" rel="noopener">${esc(f.srcName || host(f.src))}</a>` : ''}</span><button class="btn say" data-say="${esc(f.kid)}">${speaker} Read</button></div></div>`).join('')}</div>
  </section>

  ${c.gallery && c.gallery.length ? `<section class="block"><h2>Pictures to look at</h2><div class="gallery">${c.gallery.map(g => `<figure><img src="../assets/img/${g}" alt="${esc((CREDITS[g] || {}).alt || '')}" loading="lazy"><figcaption>${credit(g)}</figcaption></figure>`).join('')}</div></section>` : ''}

  <section class="block">
    <h2>Ideas to make it yours</h2>
    <ul class="ideas">${c.ideas.map(x => `<li>${x}</li>`).join('')}</ul>
  </section>

  ${c.extra ? `<section class="block"><h2>${esc(c.extra.title)}</h2>${c.extra.html}</section>` : ''}

  <section class="block">
    <details class="notes"><summary>Grown-up notes and sources</summary>
      ${c.notes.map(n => `<p>${n}</p>`).join('')}
      <ul>${c.sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.name)}</a>${s.note ? ': ' + esc(s.note) : ''}</li>`).join('')}</ul>
    </details>
  </section>

  <nav class="pager">${prev ? `<a href="${prev.id}.html">← ${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a href="${next.id}.html">${esc(next.title)} →</a>` : '<span></span>'}</nav>
</div>
<footer class="site"><div class="wrap"><a href="../index.html">All tasks</a> · <a href="../grown-ups.html#credits">Picture credits</a> · Astra Victorians, autumn 2026</div></footer>`;
  document.body.innerHTML = html;
  import('./site.js');
}
