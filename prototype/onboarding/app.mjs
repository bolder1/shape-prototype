// Onboarding as a conversation with Tee. Questions arrive as chat messages; answers are cards (or typed).
// Flow: name → dream → today → (interests) → learn the T → 14 skills → quiz round → pace
//       → creating your personality → character card → power-up → roadmap → start choice → pricing → dashboard
import { buildPath, ROLE_HOME } from '../../engine/personalize.mjs';
import { domains } from '../../curriculum/curriculum.mjs';
import { createT } from './t3d.mjs';
import * as C from './content.mjs';

const $ = s => document.querySelector(s);
const wait = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const html = s => { const t = document.createElement('template'); t.innerHTML = s.trim(); return t.content.firstElementChild; };
const order = domains.map(d => d.id);
const sum = o => Object.values(o).reduce((a, b) => a + b, 0);

// ---- state -----------------------------------------------------------------
const state = { name: '', aspiration: null, role: null, interests: [], selfRating: {}, calibration: {}, minutesPerDay: 20, fromZero: false, spineOverride: null, xp: 0 };
const asp = () => C.ASPIRATIONS.find(a => a.id === state.aspiration);

function profile(overrides = {}) {
  const s = { ...state, ...overrides };
  const a = C.ASPIRATIONS.find(x => x.id === s.aspiration);
  const home = ROLE_HOME[s.role] ?? null;
  const spine = s.spineOverride ?? (a.spine ? [a.spine] : a.goal === 'product-literate' && home ? [home] : []);
  return {
    goal: a.goal, spine, interests: s.interests,
    weeklyHours: Math.max(1, Math.round(s.minutesPerDay * 7 / 60)),
    selfRating: s.fromZero ? {} : s.selfRating, calibration: s.fromZero ? {} : s.calibration,
  };
}
function compute(overrides) {
  const r = buildPath(profile(overrides));
  const current = Object.fromEntries(r.tshape.columns.map(c => [c.domain, c.current]));
  const targets = Object.fromEntries(r.tshape.columns.map(c => [c.domain, c.target]));
  return { ...r, current, targets, spine: r.tshape.spine };
}
const personaOf = current => {
  const top = [...order].sort((a, b) => current[b] - current[a])[0];
  return current[top] > 0 ? C.PERSONA[top] : 'Fresh Explorer';
};

// ---- Tee (2D mascot for chat + cards) ---------------------------------------
function teeSvg(color = '#7C4DFF', size = 44) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true">
    <rect x="17" y="18" width="14" height="27" rx="6" fill="${color}"/><rect x="17" y="36" width="14" height="9" rx="5" fill="#000" opacity=".12"/>
    <rect x="3" y="5" width="42" height="16" rx="7" fill="${color}"/><rect x="3" y="15" width="42" height="6" rx="4" fill="#000" opacity=".1"/>
    <circle cx="18.5" cy="11.5" r="3.6" fill="#fff"/><circle cx="29.5" cy="11.5" r="3.6" fill="#fff"/>
    <circle cx="19.2" cy="12.2" r="1.8" fill="#1b1530"/><circle cx="30.2" cy="12.2" r="1.8" fill="#1b1530"/>
    <path d="M20.5 16 q3.5 2.6 7 0" stroke="#1b1530" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>`;
}
$('#logoTee').innerHTML = teeSvg('#7C4DFF', 30);

// ---- 3D T panel -------------------------------------------------------------
let T;
try {
  T = createT($('#tcanvas'), { order, colors: Object.fromEntries(order.map(id => [id, C.SKILLS[id].color])), onColumnClick: id => onColumn(id) });
} catch (e) {
  console.warn('3D unavailable', e);
  $('#tcanvas').innerHTML = '<p style="padding:20px;color:var(--muted)">3D needs WebGL, which this browser has turned off.</p>';
  T = { setState() {}, celebrate() {}, spin() {}, resize() {} };
}
$('#tlegend').classList.add('no-goal');
$('#toggleT').onclick = () => {
  const hidden = $('#app').classList.toggle('t-hidden');
  $('#toggleT').setAttribute('aria-pressed', !hidden);
  $('#toggleT b').textContent = hidden ? 'Show T' : 'Hide T';
};

// ---- chat primitives ----------------------------------------------------------
const thread = $('#thread');
let pending = null;
const scroll = () => requestAnimationFrame(() => { thread.scrollTop = thread.scrollHeight; });
const add = el => { thread.appendChild(el); scroll(); return el; };
let step = 0; const TOTAL = 23;
const progress = (n = ++step) => { $('#progressFill').style.width = `${Math.min(1, n / TOTAL) * 100}%`; };

async function say(content, { pause = 350 } = {}) {
  const m = add(html(`<div class="msg"><div class="avatar">${teeSvg()}</div><div class="bubble typing"><i></i><i></i><i></i></div></div>`));
  await wait(pause + Math.min(700, content.replace(/<[^>]+>/g, '').length * 5));
  const b = m.querySelector('.bubble'); b.className = 'bubble'; b.innerHTML = content;
  scroll();
}
function userSays(text) { add(html(`<div class="msg user"><div class="bubble">${esc(text)}</div></div>`)); }

/** Show answer cards; resolves with the chosen option's value. Typing part of a label also works. */
function choose(options, { cls = '', multi = 0, done = 'Done' } = {}) {
  return new Promise(resolve => {
    const box = add(html(`<div class="choices ${cls}"></div>`));
    options.forEach((o, i) => {
      const b = html(`<button class="opt" style="animation-delay:${i * 40}ms">${o.emoji ? `<span class="e">${o.emoji}</span>` : ''}<span><b>${o.label}</b>${o.sub ? `<small>${o.sub}</small>` : ''}</span>${o.key ? `<kbd>${o.key}</kbd>` : ''}</button>`);
      b.onclick = () => multi ? toggle(o, b) : pick(o, b);
      o.el = b; box.appendChild(b);
    });
    const chosen = new Set();
    let doneBtn;
    if (multi) {
      const row = html(`<div class="choices-actions"><button class="btn" disabled>${done}</button></div>`);
      doneBtn = row.querySelector('button'); box.appendChild(row);
      doneBtn.onclick = () => finish([...chosen].map(o => o.value), [...chosen].map(o => o.label).join(' + '));
    }
    function toggle(o, b) {
      if (chosen.has(o)) chosen.delete(o); else { chosen.add(o); if (chosen.size > multi) { const first = chosen.values().next().value; chosen.delete(first); first.el.classList.remove('on'); } }
      b.classList.toggle('on', chosen.has(o)); doneBtn.disabled = !chosen.size;
    }
    async function pick(o, b = o.el) {
      if (pending?.box !== box) return;
      b.classList.add('on'); navigator.vibrate?.(12);
      await wait(220); finish(o.value, o.label);
    }
    function finish(value, label) { pending = null; box.remove(); userSays(label); resolve(value); }
    pending = { box, options, multi, pick };
  });
}

function askText({ skip = 'Skip', placeholder = '' } = {}) {
  const input = $('#input'); const old = input.placeholder;
  input.placeholder = placeholder; input.focus();
  return new Promise(resolve => {
    const box = add(html(`<div class="choices"><button class="opt"><span class="e">⏭️</span><span><b>${skip}</b></span></button></div>`));
    const finish = (text, shown) => { pending = null; box.remove(); input.placeholder = old; if (shown) userSays(shown); resolve(text); };
    box.querySelector('button').onclick = () => finish('', skip);
    pending = { box, text: t => finish(t, t) };
  });
}

$('#composer').addEventListener('submit', async e => {
  e.preventDefault();
  const input = $('#input'), text = input.value.trim(); if (!text) return;
  input.value = '';
  if (pending?.text) return pending.text(text);
  if (pending?.options && !pending.multi) {
    const t = text.toLowerCase(), n = parseInt(t, 10);
    const words = l => l.toLowerCase().split(/[^a-z]+/).filter(w => w.length > 3);
    const opt = (Number.isInteger(n) && pending.options[n - 1])
      || pending.options.find(o => o.label.toLowerCase().includes(t))
      || pending.options.find(o => words(o.label).some(w => t.includes(w)));
    if (opt) return pending.pick(opt);
  }
  userSays(text);
  await say(pending
    ? "Hmm, I didn't catch that 🤔 Tap one of the cards, or type part of its name."
    : "Great question! 🧠 Soon I'll be your AI design coach and you can ask me anything. That's coming soon.");
});
document.addEventListener('keydown', e => {
  if (document.activeElement === $('#input') || !pending?.options) return;
  const o = pending.options.find(x => String(x.key) === e.key);
  if (o) pending.pick(o);
});

// ---- the conversation ---------------------------------------------------------
async function run() {
  progress(0);
  await say("Hi! I'm <b>Tee</b> 👋 I'll help you find your design shape and build a learning path that's made just for you.");
  await say('It takes about 3 minutes. First, <b>what should I call you?</b>');
  state.name = await askText({ placeholder: 'Type your first name' });
  progress();
  await say(state.name ? `Nice to meet you, ${esc(state.name)}! 🎉` : 'No problem, mystery designer 🕵️');

  await say("Let's start with the dream. <b>Who do you want to become?</b>");
  state.aspiration = await choose(C.ASPIRATIONS.map(a => ({ value: a.id, emoji: a.emoji, label: a.label, sub: a.sub })));
  progress();
  const a = asp();
  await say(a.id === 'literate' ? "Love that. You'll learn how a whole product comes together, without changing jobs. 🧩"
    : a.id === 'explore' ? "Totally fine! Most great designers found their thing by trying a few. We'll find yours. 🧭"
    : `${a.emoji} <b>${a.label}</b>. Great choice! Let's see how far you already are.`);

  await say('And today? <b>What do you do right now?</b>');
  state.role = await choose(C.ROLES.map(r => ({ value: r.id, emoji: r.emoji, label: r.label })));
  progress();

  if (a.id === 'explore') {
    await say('<b>Which of these sound fun?</b> Pick up to two. No wrong answers.');
    state.interests = await choose(C.INTERESTS.map(([v, label]) => ({ value: v, emoji: C.SKILLS[v].emoji, label })), { multi: 2, done: 'These ones' });
    progress();
  }

  await say('Quick idea before we start 💡 Great designers are <b>T-shaped</b>. They know a little about many skills (the top of the T) and a lot about one or two (the stem).');
  const where = matchMedia('(max-width: 860px)').matches ? 'up top 👆' : 'on the right 👉';
  await say(`That's <b>your T</b> ${where} Each coloured block is one skill. I'll describe 14 skills, and you tell me how much you've done each one. Every answer stacks blocks under that skill.`);
  await choose([{ value: 1, emoji: '🧱', label: "Let's build it" }], { cls: 'wide' });
  progress();

  for (const [i, id] of order.entries()) {
    const s = C.SKILLS[id];
    await say(`<div class="count">Skill ${i + 1} of ${order.length}</div>
      <div class="skill-head"><span class="chip-emoji" style="background:${s.color}">${s.emoji}</span>${s.name}</div>
      <p>${s.what}</p><div class="example">For example: ${s.example}</div><p><b>How much have you done this?</b></p>`, { pause: 200 });
    state.selfRating[id] = await choose(C.LEVELS.map((l, k) => ({ value: l.v, emoji: l.emoji, label: l.label, key: k + 1 })), { cls: 'levels' });
    T.setState({ current: state.selfRating });
    progress();
    if (i === 6) await say('Halfway there! Look at your T taking shape 👀');
  }

  // Quiz-show bonus round: checks the three skills rated highest.
  await say('🎤 <b>Bonus round!</b> Three quick questions about your strongest skills. Right answers prove your level. You have 20 seconds each, so no googling 😄');
  await choose([{ value: 1, emoji: '🎬', label: "I'm ready" }], { cls: 'wide' });
  const top3 = [...order].sort((x, y) => (state.selfRating[y] - state.selfRating[x]) || order.indexOf(x) - order.indexOf(y)).slice(0, 3);
  let score = 0;
  for (const [k, id] of top3.entries()) {
    const ok = await quizQuestion(id, k);
    state.calibration[id] = ok ? 1 : 0.5; score += ok; if (ok) state.xp += 100;
    progress();
  }
  const before = sum(state.selfRating), after = compute().current;
  T.setState({ current: after });
  await say(score === 3 ? '🏆 <b>Perfect score!</b> Your T is backed by proof now.'
    : sum(after) < before ? `<b>${score} of 3!</b> I've trimmed a block or two from your T, so your path starts at the right level.`
    : `<b>${score} of 3!</b> Nice. Your T stays as it is, and I'll check those skills again in your first lessons.`);

  await say('Last one! <b>How much time can you give each day?</b>');
  state.minutesPerDay = await choose(C.PACE.map(p => ({ value: p.min, emoji: p.emoji, label: p.label, sub: p.sub })), { cls: 'wide' });
  progress(TOTAL);
  await say(`Perfect${state.name ? `, ${esc(state.name)}` : ''}. Give me a second… ✨`);
  await wait(500);

  await creatingPersonality();
  await cardStage();
  await roadmapStage();
  await pricingStage();
  dashboard();
}

// ---- quiz show card -----------------------------------------------------------
function quizQuestion(id, k) {
  return new Promise(resolve => {
    const q = C.QUIZ[id], s = C.SKILLS[id];
    const el = add(html(`<div class="quiz">
      <div class="quiz-top"><span>Question ${k + 1} of 3 · ${s.emoji} ${s.name}</span><div class="timer"><span>20</span></div></div>
      <h3>${q.q}</h3>
      <div class="answers">${q.a.map((t, i) => `<button class="ans" data-i="${i}"><b>${'ABCD'[i]}</b>${t}</button>`).join('')}</div>
      <div class="quiz-foot"><span class="why">Tap an answer, then lock it in.</span></div></div>`));
    const btns = [...el.querySelectorAll('.ans')], foot = el.querySelector('.quiz-foot'), timer = el.querySelector('.timer');
    let left = 20, done = false;
    const tick = setInterval(() => {
      left--; timer.style.setProperty('--p', left / 20); timer.querySelector('span').textContent = left;
      if (left <= 0) reveal(null);
    }, 1000);
    btns.forEach(b => b.onclick = () => {
      if (done) return;
      btns.forEach(x => x.classList.toggle('picked', x === b));
      foot.innerHTML = '<span class="why">Final answer?</span><button class="btn gold">Lock it in</button>';
      foot.querySelector('button').onclick = () => reveal(+b.dataset.i);
      scroll();
    });
    async function reveal(i) {
      if (done) return; done = true; clearInterval(tick);
      btns.forEach(b => b.disabled = true);
      foot.innerHTML = '<span class="why">Let’s see…</span>';
      if (i != null) { btns[i].classList.add('suspense'); await wait(1400); btns[i].classList.remove('suspense'); }
      const ok = i === q.correct;
      btns[q.correct].classList.add('right');
      if (i != null && !ok) btns[i].classList.add('wrong');
      if (ok) { el.appendChild(html('<div class="coins">+100 XP</div>')); confetti(40); }
      foot.innerHTML = `<span class="why"><b>${ok ? 'Correct!' : i == null ? "Time's up!" : 'Not quite.'}</b> ${q.why}</span><button class="btn">${k < 2 ? 'Next' : 'Continue'}</button>`;
      foot.querySelector('button').onclick = e => { e.target.remove(); resolve(ok); };
      scroll();
    }
  });
}

// ---- full-screen stages ----------------------------------------------------------
const stage = $('#stage');
function showStage(markup, dark = false) {
  stage.hidden = false; stage.className = `stage${dark ? ' dark' : ''}`; stage.scrollTop = 0;
  stage.innerHTML = markup;
}

async function creatingPersonality() {
  const r = compute(), persona = personaOf(r.current);
  const pool = Object.values(C.PERSONA).filter(p => p !== persona).sort(() => Math.random() - 0.5);
  const reel = [...pool, ...pool.slice(0, 6), persona];
  showStage(`<h1>Creating your personality…</h1><p class="sub">Mixing your answers, your quiz and your dream.</p>
    <div class="reel"><ul>${reel.map(p => `<li>${p}</li>`).join('')}</ul></div>
    <ul class="checks"><li>Reading your 14 answers</li><li>Scoring your bonus round</li><li>Finding your deep skill</li><li>Picking ${r.path.length} of 60 chapters for you</li></ul>`, true);
  stage.querySelector('.reel ul').animate(
    [{ transform: 'translateY(0)' }, { transform: `translateY(-${(reel.length - 1) * 84}px)` }],
    { duration: 3400, easing: 'cubic-bezier(.12,.7,.18,1)', fill: 'forwards' });
  const checks = stage.querySelectorAll('.checks li');
  for (const li of checks) { await wait(700); li.classList.add('on'); }
  await wait(900);
}

function cardHtml({ future, color, title, rarity, lvl, stats, footL, footR }) {
  const sparks = future ? ['✨', '⭐', '💫', '✨'].map((s, i) => `<span class="spark" style="left:${[14, 78, 22, 70][i]}%;top:${[18, 14, 74, 70][i]}%;animation-delay:${i * .3}s">${s}</span>`).join('') : '';
  return `<div class="ccard ${future ? 'future' : ''}" style="--c:${color}">
    <div class="row"><span class="rarity" style="background:${rarity.color}">${rarity.name}</span><span class="lv">Lv ${lvl}</span></div>
    <div class="portrait" style="background:${color}22">${sparks}${future ? '<span class="spark" style="left:44%;top:2%;font-size:30px">👑</span>' : ''}${teeSvg(color, 150)}</div>
    <div class="name">${esc(state.name || 'You')}</div><div class="title">${title}</div>
    ${stats.map(([id, v]) => `<div class="stat"><span>${C.SKILLS[id].emoji}</span><span class="sname">${C.SKILLS[id].short}</span><div class="barline"><i data-w="${v / 5 * 100}" style="background:${C.SKILLS[id].color}"></i></div><b>${v}</b></div>`).join('')}
    <div class="foot"><span>${footL}</span><span>${footR}</span></div></div>`;
}
const topStats = levels => [...order].sort((a, b) => levels[b] - levels[a]).slice(0, 5).map(id => [id, levels[id]]);
const growBars = () => requestAnimationFrame(() => stage.querySelectorAll('.barline i').forEach(i => { i.style.width = i.dataset.w + '%'; }));
function tilt(wrap) {
  wrap.addEventListener('pointermove', e => {
    const card = wrap.querySelector('.ccard'), r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.style.setProperty('--ry', `${(x - .5) * 24}deg`); card.style.setProperty('--rx', `${(.5 - y) * 24}deg`);
    card.style.setProperty('--mx', `${x * 100}%`); card.style.setProperty('--my', `${y * 100}%`);
  });
  wrap.addEventListener('pointerleave', () => { const c = wrap.querySelector('.ccard'); c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
}
function shareText(title, lvl) {
  const t = `I'm a ${title} (Lv ${lvl}) on Shape. Find your design T-shape!`;
  navigator.clipboard?.writeText(t).then(() => toast('Card text copied. Paste it anywhere! 📋'), () => toast(t));
}

function cardStage() {
  return new Promise(resolve => {
    const r = compute(), spineColor = C.SKILLS[r.spine[0] ?? 'fd'].color;
    const strongest = [...order].sort((a, b) => r.current[b] - r.current[a])[0];
    const todayColor = C.SKILLS[r.current[strongest] > 0 ? strongest : 'fd'].color; // today = who you are now
    const lvl = sum(r.current), persona = personaOf(r.current);
    const rarity = [...C.RARITY].reverse().find(x => lvl / order.length >= x.min);
    showStage(`<h1>Meet ${esc(state.name || 'you')}, today ✨</h1><p class="sub">Your character card. Tilt it, share it, show it off.</p>
      <div class="card-wrap" id="cw"><div class="aura"></div>${cardHtml({ color: todayColor, title: persona, rarity, lvl, stats: topStats(r.current), footL: 'Today', footR: 'Shape · 2026' })}</div>
      <div class="stage-actions"><button class="btn ghost" id="share">Share my card</button><button class="btn gold" id="power">See who you can become ⚡</button></div>`);
    growBars(); const cw = $('#cw'); tilt(cw);
    $('#share').onclick = () => shareText(persona, lvl);
    $('#power').onclick = async () => {
      $('#power').disabled = true;
      stage.querySelector('h1').textContent = 'Powering up…';
      cw.classList.add('charging'); await wait(1500);
      document.body.appendChild(html('<div class="flash"></div>')); await wait(220);
      setTimeout(() => document.querySelector('.flash')?.remove(), 900);
      const lvlF = sum(r.targets), a = asp();
      cw.classList.remove('charging'); cw.classList.add('future');
      cw.innerHTML = `<div class="aura"></div>${cardHtml({ future: true, color: spineColor, title: a.future, rarity: C.RARITY[3], lvl: lvlF, stats: topStats(r.targets), footL: `In ~${r.estimate.weeks} weeks`, footR: 'Future you' })}`;
      growBars(); confetti(140);
      stage.querySelector('h1').innerHTML = `This is ${esc(state.name || 'you')} in ${r.estimate.weeks} weeks 🚀`;
      stage.querySelector('.sub').textContent = `${a.future}, Lv ${lvlF}. Every block on your goal T, filled in.`;
      stage.querySelector('.stage-actions').innerHTML = '<button class="btn ghost" id="share2">Share future me</button><button class="btn green" id="toRoad">Show me the roadmap</button>';
      $('#share2').onclick = () => shareText(a.future, lvlF);
      $('#toRoad').onclick = resolve;
    };
  });
}

function roadmapStage() {
  return new Promise(resolve => {
    const LEGS = [['🌱', 'Find your feet'], ['🧱', 'Build your bar'], ['⛏️', 'Go deep'], ['🏆', 'Final form']];
    const render = () => {
      const r = compute(), a = asp(), persona = personaOf(compute({ fromZero: false }).current);
      const size = Math.ceil(r.path.length / LEGS.length) || 1, perWeek = r.estimate.weeks / Math.max(1, r.path.length);
      const legs = LEGS.map((l, i) => ({ l, items: r.path.slice(i * size, (i + 1) * size), from: i * size })).filter(x => x.items.length);
      const zeroCount = compute({ fromZero: true }).path.length, pathCount = compute({ fromZero: false }).path.length;
      const legHtml = legs.map(({ l, items, from }) => {
        const dom = items.map(p => p.domain).sort((x, y) => items.filter(p => p.domain === y).length - items.filter(p => p.domain === x).length)[0];
        const w0 = Math.max(1, Math.round(from * perWeek) + 1), w1 = Math.max(w0, Math.round((from + items.length) * perWeek));
        return `<div class="leg"><div class="node" style="background:${C.SKILLS[dom].color}">${l[0]}</div><div class="body"><h3>${l[1]}</h3>
          <div class="meta">Week ${w0}${w1 > w0 ? `–${w1}` : ''} · ${items.length} chapters</div>
          ${items.slice(0, 4).map(p => `<span class="pill">${C.SKILLS[p.domain].emoji} ${p.title}</span>`).join('')}${items.length > 4 ? `<span class="pill">+${items.length - 4} more</span>` : ''}</div></div>`;
      }).join('');
      showStage(`<h1>Your roadmap 🗺️</h1><p class="sub">From <b>${persona}</b> to <b>${a.future}</b>: ${r.path.length} chapters, about ${r.estimate.weeks} weeks at ${state.minutesPerDay} min a day.</p>
        <div class="road">
          <div class="leg"><div class="node" style="background:var(--primary)">${teeSvg('#fff', 40)}</div><div class="body"><h3>Today</h3><div class="meta">${persona} · Lv ${sum(compute({ fromZero: false }).current)}</div></div></div>
          ${legHtml}
          <div class="leg future"><div class="node" style="background:var(--gold)">👑</div><div class="body"><h3>Future you</h3><div class="meta">${a.future} · Lv ${sum(r.targets)} · Legendary</div></div></div>
        </div>
        <h2 class="display" style="margin:6px 0 12px">Where do you want to start?</h2>
        <div class="starts">
          <button class="opt ${state.fromZero ? '' : 'on'}" data-z="0"><span class="e">🧭</span><span><b>Follow my path</b><small>Skip what you already know. ${pathCount} chapters.</small></span></button>
          <button class="opt ${state.fromZero ? 'on' : ''}" data-z="1"><span class="e">🌱</span><span><b>Start from zero</b><small>Every basic, from chapter one. ${zeroCount} chapters.</small></span></button>
        </div>
        <button class="btn green" id="toPricing">Continue</button>`);
      const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), { root: stage, threshold: 0.2 });
      stage.querySelectorAll('.leg').forEach((l, i) => { l.style.transitionDelay = `${i * 90}ms`; io.observe(l); });
      stage.querySelectorAll('.starts .opt').forEach(b => b.onclick = () => { const top = stage.scrollTop; state.fromZero = b.dataset.z === '1'; render(); stage.scrollTop = top; });
      $('#toPricing').onclick = resolve;
    };
    render();
  });
}

function pricingStage() {
  return new Promise(resolve => {
    showStage(`<h1>Pick your plan</h1><p class="sub">Everything you've seen is free while we're in early access. Paid plans come later, and we'll tell you before anything changes.</p>
      <div class="plans">${C.PLANS.map(p => `<div class="plan ${p.live ? 'live' : ''}">${p.live ? '<span class="badge">Start here</span>' : ''}
        <h3>${p.name}</h3><div class="price">${p.price} <small>${p.per}</small></div>
        <ul>${p.perks.map(x => `<li>${x}</li>`).join('')}</ul>
        <button class="btn ${p.live ? 'green' : ''}" data-plan="${p.id}" ${p.live ? '' : 'disabled'}>${p.cta}</button></div>`).join('')}</div>`);
    stage.querySelector('[data-plan="free"]').onclick = () => { confetti(80); resolve(); };
  });
}

// ---- dashboard -------------------------------------------------------------------
function dashboard() {
  stage.hidden = true;
  $('.progress').style.visibility = 'hidden';
  $('#input').placeholder = 'Ask Tee anything about design…';
  const r = compute();
  T.setState({ current: r.current, targets: r.targets, spine: r.spine, reset: true, stagger: true });
  setTimeout(() => T.celebrate(), 1300);
  $('#tlegend').classList.remove('no-goal');
  $('#tCaption').textContent = 'Tap a column to change your focus';
  renderDash(r);
}
function renderDash(r) {
  const next = r.path[0], ns = next ? C.SKILLS[next.domain] : C.SKILLS.fd;
  const nextCh = next && domains.find(d => d.id === next.domain).chapters.find(c => c.id === next.id);
  thread.innerHTML = `<div class="dash">
    <div class="msg"><div class="avatar">${teeSvg()}</div><div class="bubble">Welcome to your playground${state.name ? `, <b>${esc(state.name)}</b>` : ''}! 🎉 This is home now. Your T lives here and grows with every lesson.</div></div>
    <h2>Today</h2>
    <div class="stats"><span class="stat-chip">🔥 0-day streak</span><span class="stat-chip">⚡ ${state.xp} XP</span><span class="stat-chip">🏆 Sketch league</span><span class="stat-chip">🧊 Lv ${sum(r.current)}</span></div>
    ${next ? `<div class="next"><div class="node" style="background:${ns.color}">${ns.emoji}</div><div class="grow"><small>Up next · ${ns.name}</small><h3 class="display">${next.title}</h3><small>${nextCh.lessons.length} bite-size lessons · about ${nextCh.lessons.length * 5} min</small></div><button class="btn green" id="startLesson">Start</button></div>` : ''}
    <h3 class="display" style="margin-bottom:10px">Coming up</h3>
    <div class="minipath">${r.path.slice(1, 8).map(p => `<div><span>${C.SKILLS[p.domain].emoji}</span>${p.title}</div>`).join('')}</div></div>`;
  $('#startLesson')?.addEventListener('click', () => toast('Lessons are next on the build list 🛠️'));
}
function onColumn(id) {
  if ($('.progress').style.visibility !== 'hidden') return; // only after onboarding
  const goal = profile().goal;
  state.spineOverride = goal === 'pi' ? [...new Set([id, ...(state.spineOverride ?? [])])].slice(0, 2) : [id];
  const r = compute();
  T.setState({ current: r.current, targets: r.targets, spine: r.spine });
  renderDash(r);
  toast(`Focus is now ${C.SKILLS[id].name}. New path: ${r.path.length} chapters.`);
}

// ---- juice -----------------------------------------------------------------------
function confetti(n = 80) {
  const box = $('#confetti'), cols = Object.values(C.SKILLS).map(s => s.color);
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    p.style.cssText = `left:${Math.random() * 100}%;background:${cols[i % cols.length]};animation-duration:${1.6 + Math.random() * 1.4}s;animation-delay:${Math.random() * .3}s;transform:rotate(${Math.random() * 360}deg)`;
    box.appendChild(p); setTimeout(() => p.remove(), 3400);
  }
}
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2600); }

run().catch(e => { console.error(e); toast('Something broke in the prototype. See the console.'); });
