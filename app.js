/* Legal Lab — engine
 * Content lives in lessons.js. This file should rarely need changing.
 * Principles built into the flow:
 *  - Direct Instruction: pre-training of terms, rule → examples → NON-examples, tight sequence
 *  - Cognitive load theory: segmenting, worked examples → completion (faded) → independent → check
 *  - Mastery learning: next lesson locked until the check is passed (CONFIG.mastery)
 *  - Retrieval + spaced practice: mastered items join a review queue with expanding intervals
 */
'use strict';

const CONFIG = {
  mastery: 0.8,                  // proportion correct on lesson check to unlock the next lesson
  reviewCap: 20,                 // max review items per day
  intervals: [1, 3, 7, 14, 30, 60], // days between reviews as an item climbs boxes
  storageKey: 'legal-lab-progress-v1',
  // Future: AI marking for short/extended answers. Leave null until a secure endpoint exists.
  // Items with type:'short' are skipped while this is null.
  aiEndpoint: null
};

/* ---------- utilities ---------- */
const $ = s => document.querySelector(s);
const app = () => $('#app');
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function today() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
function addDays(iso, n) { const [y,m,d] = iso.split('-').map(Number); const t = new Date(y, m-1, d + n); return t.getFullYear() + '-' + String(t.getMonth()+1).padStart(2,'0') + '-' + String(t.getDate()).padStart(2,'0'); }

/* ---------- storage ---------- */
let S;
function load() {
  try { S = JSON.parse(localStorage.getItem(CONFIG.storageKey)) || {}; } catch (e) { S = {}; }
  S.lessons = S.lessons || {};   // id -> {mastered: iso, attempts: n, best: pct}
  S.items = S.items || {};       // itemId -> {box, due, right, wrong}
  S.lastNew = S.lastNew || null; // iso date a new lesson was last mastered
  S.days = S.days || [];         // iso dates with activity (for streak)
}
function save() { localStorage.setItem(CONFIG.storageKey, JSON.stringify(S)); }
function markActive() { const t = today(); if (!S.days.includes(t)) { S.days.push(t); S.days = S.days.slice(-400); } }
function streak() { let n = 0, d = today(); if (!S.days.includes(d)) d = addDays(d, -1); while (S.days.includes(d)) { n++; d = addDays(d, -1); } return n; }

/* ---------- content ---------- */
const LESSONS = (window.LESSONS || []).filter(l => l.released !== false);
const ITEM_INDEX = {};
LESSONS.forEach(l => {
  const all = [...(l.practice||[]), ...(l.check||[]), ...(l.faded||[]).map(f => f.item).filter(Boolean)];
  all.forEach(it => { it._lesson = l.id; ITEM_INDEX[it.id] = it; });
});
const usable = it => it && (it.type !== 'short' || CONFIG.aiEndpoint);

function lessonState(i) {
  const l = LESSONS[i];
  if (S.lessons[l.id] && S.lessons[l.id].mastered) return 'done';
  if (i === 0) return 'open';
  const prev = LESSONS[i-1];
  return (S.lessons[prev.id] && S.lessons[prev.id].mastered) ? 'open' : 'locked';
}
function nextLessonIndex() { for (let i = 0; i < LESSONS.length; i++) if (lessonState(i) === 'open') return i; return -1; }
function dueItems() {
  const t = today();
  return Object.keys(S.items).filter(id => ITEM_INDEX[id] && usable(ITEM_INDEX[id]) && S.items[id].due <= t)
    .sort((a,b) => S.items[a].due < S.items[b].due ? -1 : 1);
}

/* ---------- marking ---------- */
function norm(s) {
  return String(s).toLowerCase().replace(/[’‘`]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/'/g, '')
    .replace(/\s+/g, ' ').trim().replace(/^(the|a|an) /, '');
}
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({length: n+1}, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
function tolerance(len) { return len <= 4 ? 0 : len <= 8 ? 1 : 2; }
// Returns {ok, exact, matched}
function markText(item, given) {
  const g = norm(given); if (!g) return {ok:false};
  for (const a of item.accept) {
    const n = norm(a);
    if (g === n) return {ok:true, exact:true, matched:a};
  }
  for (const a of item.accept) {
    const n = norm(a);
    if (lev(g, n) <= tolerance(n.length)) return {ok:true, exact:false, matched:a};
  }
  return {ok:false};
}
// Placeholder for future AI marking (type:'short'). Not used while CONFIG.aiEndpoint is null.
async function markShortWithAI(item, response) {
  const r = await fetch(CONFIG.aiEndpoint, {method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({question:item.q, rubric:item.rubric, marks:item.marks, response})});
  return r.json(); // expected: {score, max, feedback}
}

/* ---------- SRS ---------- */
function enrolItems(lesson) {
  const t = today();
  [...(lesson.practice||[]), ...(lesson.check||[])].forEach(it => {
    if (!usable(it)) return;
    if (!S.items[it.id]) S.items[it.id] = {box: 0, due: addDays(t, 1), right: 0, wrong: 0};
  });
}
function scheduleResult(id, correct) {
  const r = S.items[id]; if (!r) return;
  if (correct) { r.right++; r.box = Math.min(r.box + 1, CONFIG.intervals.length - 1); r.due = addDays(today(), CONFIG.intervals[r.box]); }
  else { r.wrong++; r.box = 0; r.due = addDays(today(), 1); }
}

/* ---------- item rendering (shared by practice, check, review, faded) ---------- */
// opts: {hint:bool, onDone(correct)}
function renderItem(el, item, opts) {
  const src = item.src ? `<span class="chip">Exam link: ${esc(item.src)}</span>` : '';
  let html = `${src}<p><b>${item.q}</b></p>`;
  let answered = false;
  const finish = (correct, extra) => {
    if (answered) return; answered = true;
    const fb = document.createElement('div');
    fb.className = 'fb ' + (correct ? 'good' : 'bad');
    fb.innerHTML = `<h4>${correct ? '✓ Correct' : '✗ Not quite'}</h4>${extra || ''}${item.explain ? `<p>${item.explain}</p>` : ''}`;
    el.querySelector('.itembody').appendChild(fb);
    const hb = el.querySelector('.hintbtn'); if (hb) hb.remove();
    opts.onDone(correct);
  };

  if (item.type === 'mc' || item.type === 'tf') {
    const options = item.type === 'tf' ? ['True', 'False'] : item.options;
    const correctIdx = item.type === 'tf' ? (item.answer ? 0 : 1) : item.answer;
    const order = item.type === 'tf' ? [0,1] : shuffle(options.map((_, i) => i));
    html += `<div class="itembody">` + order.map((oi, k) =>
      `<button class="opt" data-oi="${oi}"><span class="n">${k+1}</span>${options[oi]}</button>`).join('');
    if (opts.hint && item.hint) html += `<button class="btn ghost hintbtn">Show a hint</button>`;
    html += `</div>`;
    el.innerHTML = html;
    el.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (answered) return;
      const oi = +b.dataset.oi, ok = oi === correctIdx;
      el.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (+x.dataset.oi === correctIdx) x.classList.add('correct'); });
      if (!ok) b.classList.add('wrong');
      finish(ok);
    });
    el._keys = e => { const k = parseInt(e.key, 10); const bs = el.querySelectorAll('.opt'); if (k >= 1 && k <= bs.length && !answered) bs[k-1].click(); };
  } else if (item.type === 'text') {
    html += `<div class="itembody"><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type your answer">
      <button class="btn submit">Check</button>`;
    if (opts.hint && item.hint) html += `<button class="btn ghost hintbtn">Show a hint</button>`;
    html += `</div>`;
    el.innerHTML = html;
    const inp = el.querySelector('input'), sb = el.querySelector('.submit');
    const go = () => {
      if (answered || !inp.value.trim()) return;
      const r = markText(item, inp.value);
      inp.disabled = true; sb.disabled = true;
      let extra = '';
      if (r.ok && !r.exact) extra = `<p class="muted">Accepted — check spelling: <b>${esc(item.accept[0])}</b></p>`;
      if (!r.ok) extra = `<p>Answer: <b>${esc(item.accept[0])}</b></p>`;
      finish(r.ok, extra);
    };
    sb.onclick = go;
    inp.onkeydown = e => { if (e.key === 'Enter') { e.stopPropagation(); go(); } };
    setTimeout(() => inp.focus(), 50);
  }
  const hb = el.querySelector('.hintbtn');
  if (hb) hb.onclick = () => { hb.insertAdjacentHTML('afterend', `<div class="hint">💡 ${item.hint}</div>`); hb.remove(); };
}

/* ---------- global keyboard ---------- */
let keyHandler = null;
document.addEventListener('keydown', e => {
  if (keyHandler) keyHandler(e);
  if (e.key === 'Enter' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    const n = document.querySelector('.nextbtn:not([disabled])'); if (n) { e.preventDefault(); n.click(); }
  }
});

/* ---------- HOME ---------- */
function home() {
  keyHandler = null;
  const due = dueItems();
  const ni = nextLessonIndex();
  const doneToday = S.lastNew === today();
  const mastered = LESSONS.filter(l => S.lessons[l.id] && S.lessons[l.id].mastered).length;

  let html = `<div class="card"><h2>Today</h2>
    <p class="muted">Do your review first, then one new lesson. ${streak() ? `🔥 ${streak()}-day streak` : ''}</p>
    <div class="today"><div class="num">${Math.min(due.length, CONFIG.reviewCap)}</div>
      <div style="flex:1"><b>Review</b><br><span class="muted">${due.length ? 'Questions from earlier lessons, spaced out over time.' : 'Nothing due — great.'}</span></div></div>
    ${due.length ? `<button class="btn block" id="goReview">Start review</button>` : ''}
    <hr style="border:0;border-top:1px solid var(--line);margin:16px 0">`;
  if (ni === -1) {
    html += `<p><b>All released lessons mastered.</b> More will appear as the course moves on. Keep up your reviews.</p>`;
  } else {
    const l = LESSONS[ni];
    html += `<div class="today"><div class="num">${ni+1}</div><div style="flex:1"><b>New lesson: ${esc(l.title)}</b><br>
      <span class="muted">${esc(l.area)}</span></div></div>`;
    if (doneToday) {
      html += `<p class="muted">✓ You've mastered today's new lesson. The plan is one per day — spacing helps it stick.</p>
        <button class="btn secondary block" id="goLesson">Start the next one anyway</button>`;
    } else {
      html += `<button class="btn block" id="goLesson" ${due.length ? 'style="background:#5f8f9a"' : ''}>${due.length ? 'Start lesson (after review)' : 'Start lesson'}</button>`;
    }
  }
  html += `</div>`;

  html += extraCard();
  html += `<div class="card"><h2>Course map</h2><p class="muted">${mastered} of ${LESSONS.length} released lessons mastered.</p>`;
  let lastArea = '';
  LESSONS.forEach((l, i) => {
    if (l.area !== lastArea) { html += `<h3>${esc(l.area)}</h3>`; lastArea = l.area; }
    const st = lessonState(i);
    const best = S.lessons[l.id] && S.lessons[l.id].best != null ? ` · best check ${S.lessons[l.id].best}%` : '';
    html += `<div class="lesson-row"><div class="dot ${st}">${st === 'done' ? '✓' : st === 'locked' ? '🔒' : i+1}</div>
      <div class="t">${esc(l.title)}<small>${esc(l.kk || '')}${best}</small></div>
      ${st !== 'locked' ? `<button class="btn ghost" data-open="${i}">${st === 'done' ? 'Revisit' : 'Open'}</button>` : ''}</div>`;
  });
  html += `</div>`;

  html += `<div class="card"><h2>Your progress file</h2>
    <p class="muted">Progress is stored on this device only. Save a backup code to move to another device.</p>
    <button class="btn secondary" id="exp">Back up</button><button class="btn secondary" id="imp">Restore</button>
    <button class="btn ghost" id="rst">Reset everything</button><div id="io"></div></div>`;
  app().innerHTML = html;

  const gr = $('#goReview'); if (gr) gr.onclick = review;
  const gl = $('#goLesson'); if (gl) gl.onclick = () => startLesson(ni);
  wireExtra();
  document.querySelectorAll('[data-open]').forEach(b => b.onclick = () => startLesson(+b.dataset.open));
  $('#exp').onclick = () => {
    const code = btoa(unescape(encodeURIComponent(JSON.stringify(S))));
    $('#io').innerHTML = `<p class="muted">Copy this code and keep it somewhere safe:</p><textarea rows="4" readonly>${code}</textarea>`;
    const ta = $('#io textarea'); ta.select(); try { navigator.clipboard.writeText(code); } catch (e) {}
  };
  $('#imp').onclick = () => {
    $('#io').innerHTML = `<textarea rows="4" placeholder="Paste your backup code"></textarea><button class="btn" id="doImp">Restore</button>`;
    $('#doImp').onclick = () => {
      try { const d = JSON.parse(decodeURIComponent(escape(atob($('#io textarea').value.trim())))); localStorage.setItem(CONFIG.storageKey, JSON.stringify(d)); load(); home(); }
      catch (e) { alert('That code did not work. Check you copied all of it.'); }
    };
  };
  $('#rst').onclick = () => { if (confirm('Delete all progress on this device? This cannot be undone.')) { localStorage.removeItem(CONFIG.storageKey); load(); home(); } };
  window.scrollTo(0, 0);
}

/* ---------- LESSON FLOW ---------- */
let L; // current lesson run
function startLesson(i) {
  const lesson = LESSONS[i];
  const steps = [];
  if (lesson.pretrain && lesson.pretrain.length) steps.push({kind:'pretrain'});
  (lesson.teach || []).forEach(c => steps.push({kind:'teach', card:c}));
  (lesson.worked || []).forEach(w => steps.push({kind:'worked', w}));
  (lesson.faded || []).forEach(f => steps.push({kind:'faded', f}));
  steps.push({kind:'practice'});
  steps.push({kind:'check'});
  L = {i, lesson, steps, pos: 0, firstTeach: steps.findIndex(s => s.kind === 'teach')};
  S.lessons[lesson.id] = S.lessons[lesson.id] || {attempts: 0};
  renderStep();
}
const STEP_LABEL = {pretrain:'Key terms first', teach:'Learn', worked:'Worked example', faded:'Your turn — with support', practice:'Practice', check:'Mastery check'};

function frame(inner, step) {
  const pct = Math.round(100 * L.pos / L.steps.length);
  return `<div class="progress"><div style="width:${pct}%"></div></div>
    <div class="steplabel">Lesson ${L.i+1} · ${STEP_LABEL[step.kind]}</div>
    <div class="card">${inner}</div>
    <button class="btn ghost" id="quit">← Back to home</button>`;
}
function nextBtn(label, disabled) { return `<button class="btn block nextbtn" ${disabled ? 'disabled' : ''}>${label || 'Next →'}</button>`; }
function wireNext(fn) { const b = document.querySelector('.nextbtn'); if (b) b.onclick = fn || (() => { L.pos++; renderStep(); }); }

function renderStep() {
  keyHandler = null; markActive(); save();
  const step = L.steps[L.pos];
  const les = L.lesson;
  let inner = '';
  if (step.kind === 'pretrain') {
    inner = `<h2>${esc(les.title)}</h2><p class="muted">${esc(les.kk || '')}</p>
      <p>Before the lesson, read these terms carefully. Every one of them will be used.</p>` +
      les.pretrain.map(t => `<div class="term"><b>${t.term}</b> — ${t.def}</div>`).join('') + nextBtn('I\'ve read these →');
    app().innerHTML = frame(inner, step); wireNext();
  } else if (step.kind === 'teach') {
    const c = step.card;
    inner = `<h2>${c.title}</h2>`;
    if (c.type === 'rule') inner += c.html;
    if (c.type === 'diagram') inner += `${c.svg}${c.caption ? `<p class="muted">${c.caption}</p>` : ''}`;
    if (c.type === 'contrast') {
      inner += c.rule ? `<p>${c.rule}</p>` : '';
      inner += (c.examples || []).map(x => `<div class="ex"><b>Example</b>${x.text || x}${x.why ? `<div class="why">${x.why}</div>` : ''}</div>`).join('');
      inner += (c.nonexamples || []).map(x => `<div class="nonex"><b>Not an example</b>${x.text}${x.why ? `<div class="why">${x.why}</div>` : ''}</div>`).join('');
    }
    if (c.type === 'pairs') {
      inner += c.rule ? `<p>${c.rule}</p>` : '';
      inner += (c.rows || []).map(r => `<div class="pair">${r.topic ? `<div class="pt">${r.topic}</div>` : ''}<div class="pg">
        <div class="pf"><b>Fairness</b>${r.fair.text}${r.fair.why ? `<div class="why">${r.fair.why}</div>` : ''}</div>
        <div class="pe"><b>Equality</b>${r.equal.text}${r.equal.why ? `<div class="why">${r.equal.why}</div>` : ''}</div></div></div>`).join('');
    }
    inner += nextBtn();
    app().innerHTML = frame(inner, step); wireNext();
  } else if (step.kind === 'worked') {
    const w = step.w; let shown = 0;
    const draw = () => {
      let h = `<h2>${w.title || 'Worked example'}</h2><p>${w.prompt}</p><p class="muted">Read each step. Ask yourself why it follows.</p>`;
      w.steps.forEach((s, k) => { if (k < shown) h += `<div class="step shown"><span class="sn">Step ${k+1}</span>${s}</div>`; });
      if (shown < w.steps.length) h += `<button class="btn nextbtn" id="more">Show step ${shown+1} of ${w.steps.length}</button>`;
      else h += `<div class="fb good"><h4>Answer</h4>${w.answer}</div>` + nextBtn();
      app().innerHTML = frame(h, step);
      const m = $('#more'); if (m) m.onclick = () => { shown++; draw(); }; else wireNext();
      $('#quit').onclick = home;
    };
    draw(); return;
  } else if (step.kind === 'faded') {
    const f = step.f;
    inner = `<h2>${f.title || 'Your turn'}</h2><p>${f.prompt}</p>` +
      f.given.map((s, k) => `<div class="step shown"><span class="sn">Step ${k+1}</span>${s}</div>`).join('') +
      `<div class="step"><span class="sn">Step ${f.given.length+1}</span>Now you finish it.</div><div id="it"></div>` + nextBtn('Next →', true);
    app().innerHTML = frame(inner, step);
    const el = $('#it');
    renderItem(el, f.item, {hint:true, onDone: () => { const b = document.querySelector('.nextbtn'); b.disabled = false; }});
    keyHandler = el._keys || null; wireNext();
  } else if (step.kind === 'practice') { runPractice(); return; }
  else if (step.kind === 'check') { runCheck(); return; }
  $('#quit').onclick = home;
  window.scrollTo(0, 0);
}

function runQueue(items, {label, hint, requeueWrong, onAnswer, onFinish}) {
  const queue = items.slice(); const retried = new Set(); let n = 0; const total = items.length;
  const next = () => {
    if (!queue.length) return onFinish();
    const it = queue.shift(); n++;
    const step = L ? L.steps[L.pos] : {kind:'practice'};
    const counter = `<p class="muted">${label} · ${Math.min(n, total)}${n > total ? ' (retry)' : ` of ${total}`}</p>`;
    const inner = `${counter}<div id="it"></div>${nextBtn('Next →', true)}`;
    app().innerHTML = L ? frame(inner, step) : reviewFrame(inner, n, total);
    const el = $('#it');
    renderItem(el, it, {hint, onDone: ok => {
      if (onAnswer) onAnswer(it, ok, retried.has(it.id));
      if (!ok && requeueWrong && !retried.has(it.id)) { retried.add(it.id); queue.push(it); }
      document.querySelector('.nextbtn').disabled = false;
    }});
    keyHandler = el._keys || null;
    wireNext(next);
    $('#quit').onclick = home;
    window.scrollTo(0, 0);
  };
  next();
}

function runPractice() {
  const items = shuffle((L.lesson.practice || []).filter(usable));
  runQueue(items, {label:'Practice — hints allowed, wrong answers come back once', hint:true, requeueWrong:true,
    onFinish: () => {
      const inner = `<h2>Practice done</h2><p>Next is the <b>mastery check</b>: ${(L.lesson.check||[]).length} questions, no hints.
        You need ${Math.round(CONFIG.mastery*100)}% to unlock the next lesson.</p>` + nextBtn('Start mastery check →');
      L.pos++; app().innerHTML = frame(inner, L.steps[L.pos]); wireNext(() => renderStep()); $('#quit').onclick = home;
    }});
}

function runCheck() {
  const items = shuffle((L.lesson.check || []).filter(usable));
  let right = 0; const missed = [];
  runQueue(items, {label:'Mastery check — no hints', hint:false, requeueWrong:false,
    onAnswer: (it, ok) => { if (ok) right++; else missed.push(it); },
    onFinish: () => {
      const pct = Math.round(100 * right / items.length);
      const rec = S.lessons[L.lesson.id]; rec.attempts = (rec.attempts || 0) + 1; rec.best = Math.max(rec.best || 0, pct);
      const pass = right / items.length >= CONFIG.mastery;
      let inner = `<div class="score">${pct}%</div>`;
      if (pass) {
        const firstTime = !rec.mastered;
        if (firstTime) { rec.mastered = today(); S.lastNew = today(); }
        enrolItems(L.lesson); save();
        inner += `<h2 style="text-align:center">Mastered ✓</h2><p>These questions now join your review queue. You'll see them again tomorrow, then at longer and longer gaps.</p>`;
        if (missed.length) inner += `<h3>Worth another look</h3>` + missed.map(m => `<div class="nonex">${m.q}<div class="why">${m.explain || ''}</div></div>`).join('');
        inner += nextBtn('Back to home');
        L.pos = L.steps.length; app().innerHTML = frame(inner, {kind:'check'}); wireNext(home);
      } else {
        save();
        inner += `<h2 style="text-align:center">Not yet</h2><p>You need ${Math.round(CONFIG.mastery*100)}%. That's normal — mastery means going back over the part that didn't land. Here's what to fix:</p>` +
          missed.map(m => `<div class="nonex">${m.q}<div class="why">${m.explain || ''}</div></div>`).join('') +
          `<button class="btn block nextbtn">Re-teach, then retry the check</button>`;
        app().innerHTML = frame(inner, {kind:'check'});
        wireNext(() => { L.pos = L.firstTeach >= 0 ? L.firstTeach : 0; renderStep(); });
      }
      $('#quit').onclick = home;
    }});
}

/* ---------- REVIEW ---------- */
let frameLabel = 'Spaced review';
function reviewFrame(inner, n, total) {
  const pct = Math.round(100 * Math.min(n-1, total) / Math.max(total,1));
  return `<div class="progress"><div style="width:${pct}%"></div></div><div class="steplabel">${frameLabel}</div>
    <div class="card">${inner}</div><button class="btn ghost" id="quit">← Back to home</button>`;
}
function review() {
  L = null; frameLabel = 'Spaced review';
  const ids = shuffle(dueItems().slice(0, CONFIG.reviewCap)); // shuffled = interleaved across lessons
  const items = ids.map(id => ITEM_INDEX[id]);
  let right = 0;
  runQueue(items, {label:'Review — mixed topics', hint:false, requeueWrong:true,
    onAnswer: (it, ok, isRetry) => { if (!isRetry) { scheduleResult(it.id, ok); if (ok) right++; save(); } },
    onFinish: () => {
      markActive(); save();
      app().innerHTML = reviewFrame(`<div class="score">${right}/${items.length}</div><h2 style="text-align:center">Review done</h2>
        <p>Items you got right are spaced further out. Items you missed come back tomorrow.</p>${nextBtn('Back to home')}`, items.length+1, items.length);
      wireNext(home); $('#quit').onclick = home;
    }});
}


/* ---------- EXTRA PRACTICE (optional, between lessons) ----------
 * Draws only on lessons already mastered. Weighted toward weaker items.
 * Does NOT move items further out in the spaced schedule (that's the review's job),
 * but a miss brings that item back into tomorrow's review.
 */
const EXTRA_SIZE = 10;
function masteredLessons() { return LESSONS.filter(l => S.lessons[l.id] && S.lessons[l.id].mastered); }
function lessonItems(l) { return [...(l.practice||[]), ...(l.check||[])].filter(usable); }
function weight(id) {
  const r = S.items[id]; if (!r) return 3;
  return 1 + Math.max(0, 4 - r.box) + Math.min(r.wrong, 4);   // low box / many misses → more likely
}
function weightedPick(ids, n) {
  const pool = ids.map(id => ({id, w: weight(id)})), out = [];
  while (out.length < n && pool.length) {
    let t = pool.reduce((a, p) => a + p.w, 0) * Math.random(), k = 0;
    while (k < pool.length - 1 && (t -= pool[k].w) > 0) k++;
    out.push(pool.splice(k, 1)[0].id);
  }
  return out;
}
function extraCard() {
  const ms = masteredLessons();
  if (!ms.length) return '';
  const doneToday = S.extraDay === today() ? S.extraCount || 0 : 0;
  let h = `<div class="card"><h2>Extra practice <span class="chip">optional</span></h2>
    <p class="muted">For any time between lessons. Mixed questions from lessons you've mastered, weighted towards the ones you find harder. About 5 minutes per set.${doneToday ? ` You've done ${doneToday} set${doneToday > 1 ? 's' : ''} today.` : ''}</p>
    <button class="btn block" id="xMixed">Mixed practice — ${EXTRA_SIZE} questions</button>
    <button class="btn secondary block" id="xWeak">My trickiest questions</button>
    <details style="margin-top:10px"><summary class="muted" style="cursor:pointer">Practise one topic…</summary>`;
  let area = '';
  ms.forEach(l => {
    if (l.area !== area) { h += `<h3>${esc(l.area)}</h3>`; area = l.area; }
    h += `<button class="btn ghost" style="display:block;text-align:left" data-xtopic="${l.id}">${LESSONS.indexOf(l)+1}. ${esc(l.title)}</button>`;
  });
  return h + `</details></div>`;
}
function wireExtra() {
  const m = $('#xMixed'); if (!m) return;
  const all = masteredLessons().flatMap(l => lessonItems(l).map(i => i.id));
  m.onclick = () => extraPractice(weightedPick(all, EXTRA_SIZE), 'Extra practice — mixed');
  $('#xWeak').onclick = () => {
    const tricky = all.filter(id => S.items[id] && (S.items[id].wrong > 0 || S.items[id].box === 0))
      .sort((a, b) => (S.items[b].wrong - S.items[a].wrong) || (S.items[a].box - S.items[b].box)).slice(0, EXTRA_SIZE);
    if (tricky.length < 3) { alert('Not enough tricky questions yet — nice work. Try mixed practice instead.'); return; }
    extraPractice(shuffle(tricky), 'Extra practice — trickiest');
  };
  document.querySelectorAll('[data-xtopic]').forEach(b => b.onclick = () => {
    const l = LESSONS.find(x => x.id === b.dataset.xtopic);
    extraPractice(shuffle(lessonItems(l).map(i => i.id)).slice(0, EXTRA_SIZE), 'Extra practice — ' + l.title);
  });
}
function extraPractice(ids, label) {
  L = null; frameLabel = label;
  const items = ids.map(id => ITEM_INDEX[id]).filter(Boolean);
  let right = 0;
  runQueue(items, {label:'Hints allowed · misses come back once', hint:true, requeueWrong:true,
    onAnswer: (it, ok, isRetry) => {
      if (isRetry) return;
      if (ok) right++;
      else if (S.items[it.id]) { S.items[it.id].box = 0; S.items[it.id].wrong++; S.items[it.id].due = addDays(today(), 1); }
      save();
    },
    onFinish: () => {
      if (S.extraDay !== today()) { S.extraDay = today(); S.extraCount = 0; }
      S.extraCount++; markActive(); save();
      app().innerHTML = reviewFrame(`<div class="score">${right}/${items.length}</div><h2 style="text-align:center">Set done</h2>
        <p>${right === items.length ? 'Perfect set.' : 'Anything you missed will come back in tomorrow’s review.'}</p>
        <button class="btn block" id="again">Another set</button>${nextBtn('Back to home')}`, items.length+1, items.length);
      $('#again').onclick = () => { home(); const b = $('#xMixed'); if (b) b.click(); };
      wireNext(home); $('#quit').onclick = home;
    }});
}

/* ---------- boot ---------- */
load();
// Content updates: if a lesson the student has already mastered gains new questions,
// add those questions to their review queue (due tomorrow). Progress is never reset.
LESSONS.forEach(l => { if (S.lessons[l.id] && S.lessons[l.id].mastered) enrolItems(l); });
save();
$('#ver').textContent = 'v' + (window.CONTENT_VERSION || '?');
$('#homeLink').onclick = home;
home();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw && nw.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) {
          const b = document.createElement('div'); b.className = 'banner';
          b.innerHTML = 'New lessons available. <button class="btn">Update now</button>';
          b.querySelector('button').onclick = () => location.reload();
          document.body.appendChild(b);
        }
      });
    });
  }).catch(() => {});
}
