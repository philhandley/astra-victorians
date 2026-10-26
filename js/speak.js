// Read aloud with the browser's own voices. Prefers a British English voice. Tap again to stop.
let voice = null;
function pick() {
  const vs = speechSynthesis.getVoices();
  if (!vs.length) return;
  const score = v => (v.lang === 'en-GB' ? 4 : v.lang.startsWith('en') ? 2 : 0) + (/Google UK English Female|Hazel|Sonia|Libby|Susan|George|Ryan/i.test(v.name) ? 3 : 0) + (v.localService ? 0 : 1);
  voice = vs.slice().sort((a, b) => score(b) - score(a))[0];
}
if ('speechSynthesis' in window) { pick(); speechSynthesis.addEventListener('voiceschanged', pick); }

export function say(text, btn) {
  if (!('speechSynthesis' in window)) return;
  const wasThis = btn && btn.classList.contains('on');
  if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel();
  document.querySelectorAll('.say.on').forEach(b => b.classList.remove('on'));
  if (wasThis) return;
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.lang = 'en-GB'; u.rate = 0.92; u.pitch = 1;
  if (btn) { btn.classList.add('on'); u.onend = u.onerror = () => btn.classList.remove('on'); }
  speechSynthesis.speak(u);
}

// Any button with data-say becomes a Read aloud button. Empty data-say reads the nearest card's text.
export function wire(root = document) {
  root.querySelectorAll('[data-say]').forEach(b => {
    if (b.__wired) return; b.__wired = true;
    b.addEventListener('click', () => {
      const own = b.dataset.say;
      const text = own || (b.closest('.fact, .card, li, section, .brief')?.querySelector('p, h3, h2')?.textContent || '');
      say(text.trim(), b);
    });
  });
}
wire();
