// Ticks live in localStorage only. Points are the school's own system (four tasks a term, totals at the end of term).
import { TASKS } from './tasks.js';
const KEY = 'astravic.done';
export const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
export const save = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
export function isDone(id) { return !!load()[id]; }
export function setDone(id, on) { const d = load(); if (on) d[id] = new Date().toISOString().slice(0, 10); else delete d[id]; save(d); dispatchEvent(new Event('tasks-changed')); }
export function totals() {
  const d = load();
  const done = TASKS.filter(t => d[t.id]);
  return { count: done.length, points: done.reduce((s, t) => s + t.pts, 0), bonus: done.some(t => t.bonus) };
}
