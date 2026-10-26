// Shared page behaviour: read-aloud buttons, done ticks, the tracker line, print buttons.
import { wire } from './speak.js';
import { TASKS } from './tasks.js';
import { isDone, setDone, totals } from './tracker.js';

function paintTracker() {
  const el = document.getElementById('tracker');
  if (!el) return;
  const t = totals();
  const left = Math.max(0, 4 - t.count);
  el.querySelector('.big').innerHTML = `${t.points} <small>points so far</small>`;
  el.querySelector('p').textContent = t.count === 0
    ? 'Tick a task once it is in the green homework book. The homework sheet asks for four tasks a term, and more are welcome.'
    : left > 0 ? `${t.count} task${t.count === 1 ? '' : 's'} done. ${left} more make this term's four, and extras are welcome.`
    : `${t.count} tasks done: that is this term's four and more. Brilliant.`;
}
function paintTicks() {
  document.querySelectorAll('[data-task]').forEach(card => {
    const id = card.dataset.task; const on = isDone(id);
    card.classList.toggle('done', on);
    const box = card.querySelector('input[type=checkbox]'); if (box) box.checked = on;
  });
}
document.querySelectorAll('[data-task] input[type=checkbox]').forEach(box => {
  box.addEventListener('change', () => { setDone(box.closest('[data-task]').dataset.task, box.checked); });
});
addEventListener('tasks-changed', () => { paintTicks(); paintTracker(); });
paintTicks(); paintTracker(); wire();

// "Print" on a task page opens the sheet in a new tab and prints it once it has loaded.
document.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => {
  const w = open(b.dataset.print, '_blank');
  if (w) w.addEventListener('load', () => setTimeout(() => w.print(), 800));
}));
export { TASKS };
