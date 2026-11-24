import { describe, expect, it } from 'vitest';
import { EPISODES, Episode, Exercise, FRAME_LEAD, JOURNEY_STAGES, NIELSEN_10, SAFAR_PARTS, SEVERITY, findingOf, flawSpan, severityOf, studyCost, taskWords, KOSH_PARTS, TOOL_PARTS, findExercise, insightParts, journeyFeelings, journeyLow, participantOf, themeReach, contrastLane, contrastRatio, unitHealth, unitNumbers, foggMissing, foggPoint, funnelCounts, funnelRates, leakiestStep, hslChange, hslDial, lessonById, measureSetting, measureVerdict, riceIdeas, riceScore } from './index';

describe('findExercise', () => {
  it('turns episode questions and game cards into valid review picks', () => {
    for (const id of ['quiz.q1', 'ladder.l3', 'gap.gap', 'check.c2', 'game.g5']) {
      const ex = findExercise('fd.1-2', id);
      expect(ex?.type).toBe('pick');
      expect(() => Exercise.parse(ex)).not.toThrow();
    }
    expect(findExercise('fd.1-2', 'o1')?.type).toBe('order');   // classic steps still resolve
    const forged = findExercise('rs.1-3', 'game.r1');
    expect(() => Exercise.parse(forged)).not.toThrow();
    expect(forged?.type === 'pick' && forged.options.find(o => o.id === forged.correct)?.label).toBe('How do people remember to pay bills today, and where does that break down?');
    const button = findExercise('cw.1-2', 'game.r2');
    expect(() => Exercise.parse(button)).not.toThrow();
    expect(button?.type === 'pick' && button.options.find(o => o.id === button.correct)?.label).toBe('Pay ₹450');
    expect(button?.type === 'pick' && button.explanation).toContain('names the action');
    const job = findExercise('rs.2-3', 'game.r1');
    expect(() => Exercise.parse(job)).not.toThrow();
    expect(job?.type === 'pick' && job.prompt).toContain('job story');
    expect(job?.type === 'pick' && job.explanation).toContain('progress wanted');
    const voice = findExercise('br.1-2', 'game.r1');
    expect(voice?.type === 'pick' && voice.explanation).toContain('the alternative it beats');
    const scope = findExercise('pr.1-2', 'game.r1');
    expect(() => Exercise.parse(scope)).not.toThrow();
    expect(scope?.type === 'pick' && scope.options.find(o => o.id === scope.correct)?.label).toBe('Can first-time users change the delivery address after ordering, without help?');
    expect(scope?.type === 'pick' && scope.explanation).toContain('how you’d know it worked');
    expect(findExercise('fd.1-2', 'quiz.nope')).toBeUndefined();
  });
});

describe('episodes', () => {
  for (const [id, ep] of Object.entries(EPISODES)) {
    it(`${id}: valid schema and matches a real lesson`, () => {
      expect(() => Episode.parse(ep)).not.toThrow();
      expect(ep.lessonId).toBe(id);
      expect(lessonById(id)).toBeDefined();
    });
    it(`${id}: every answer and card points at something that exists`, () => {
      const questions = [...ep.check, ep.gap, ...ep.quiz.questions, ...ep.ladder];
      for (const q of questions) expect(q.options.map(o => o.id)).toContain(q.correct);
      const lanes = ep.game.lanes.map(l => l.id);
      for (const c of ep.game.cards) expect(lanes).toContain(c.lane);
      // Every lane gets at least one card, so the game can fill every part of the diamond.
      for (const l of lanes) expect(ep.game.cards.some(c => c.lane === l)).toBe(true);
      if (['swipe-sort', 'myth-pop', 'squint-test', 'chunk-lab', 'flashlight', 'scale-sort', 'question-forge', 'red-pen', 'jargon-swap', 'line-cut', 'glance-test', 'button-forge', 'chat-probe', 'job-forge', 'ask-watch'].includes(ep.game.id)) expect(lanes).toHaveLength(2);   // two-way games
      if (['question-forge', 'button-forge', 'job-forge', 'proto-scope', 'voice-fit'].includes(ep.game.id)) expect(ep.game.rounds?.length).toBeGreaterThan(0);   // the forges need tiles
      if (ep.game.id === 'red-pen') for (const c of ep.game.cards) expect(c.note).toBeTruthy();   // every line gets its explanation
      if (ep.game.id === 'jargon-swap') for (const c of ep.game.cards) if (c.lane === lanes[0]) expect(c.note).toBeTruthy();   // every system label gets its rewrite
      if (ep.game.id === 'crowd-sort') for (const c of ep.game.cards) expect(c.agree).toBeGreaterThan(50);   // the answer is the majority's lane
      if (ep.game.id === 'pattern-fit') for (const l of lanes) expect(['tab', 'side', 'hub', 'step']).toContain(l);   // lanes the game can draw
      if (ep.game.id === 'tree-test') for (const c of ep.game.cards) expect(c.note).toBeTruthy();   // every task shows its path
      if (ep.game.id === 'line-cut') for (const c of ep.game.cards) expect(c.note).toBeTruthy();   // every line gets its reason
      if (ep.game.id === 'spacing-fix') expect(lanes).toEqual(['t', 'm', 'l']);   // the sizes the game animates to
      if (ep.game.id === 'column-span') for (const l of lanes) expect(12 % Number(l)).toBe(0);   // spans that tile a 12-column row
      if (ep.game.id === 'glance-test') for (const c of ep.game.cards) if (c.lane === lanes[0]) expect(c.note).toBeTruthy();   // every unclear line gets a rewrite
      if (ep.game.id === 'error-doctor') { expect(lanes).toEqual(['vague', 'nofix', 'blame', 'good']); for (const c of ep.game.cards) if (c.lane !== 'good') expect(c.note).toBeTruthy(); }   // every bad error gets a better one
      if (ep.game.id === 'empty-match') expect(lanes).toEqual(['first', 'done', 'noresults', 'error']);   // the screens the game draws
      if (ep.game.id === 'script-builder') expect(lanes).toEqual(['open', 'broad', 'deep', 'close']);   // script parts, in order
      if (ep.game.id === 'chat-probe') for (const c of ep.game.cards) { expect(c.visual).toBeTruthy(); if (c.lane === lanes[0]) expect(c.note).toBeTruthy(); }   // a quote to answer; weak follow-ups get a better one
      if (ep.game.id === 'ask-watch') expect(lanes).toEqual(['ask', 'watch']);
      if (ep.game.id === 'rung-sort') expect(lanes).toEqual(['problem', 'outcome', 'output']);   // the three rungs
      if (ep.game.id === 'rice-duel') {   // two well-formed ideas, and the marked lane really wins on RICE
        expect(lanes).toEqual(['a', 'b']);
        for (const c of ep.game.cards) {
          const ideas = riceIdeas(c.visual ?? '');
          expect(ideas).toHaveLength(2);
          for (const i of ideas) for (const n of [i.reach, i.impact, i.confidence, i.effort]) expect(n).toBeGreaterThan(0);
          const [a, b] = ideas.map(riceScore);
          expect(a).not.toBe(b);
          expect(c.lane).toBe(a > b ? 'a' : 'b');
        }
      }
      if (ep.game.id === 'anatomy-pin') expect(lanes).toEqual(['cap', 'x', 'base', 'desc']);   // the lines the game draws
      if (ep.game.id === 'size-it') { expect(lanes).toEqual(['display', 'heading', 'body', 'small']); for (const c of ep.game.cards) expect(['title', 'byline', 'caption', 'section1', 'para1', 'section2', 'para2', 'tabs']).toContain(c.visual); }   // pieces of the screen it draws
      if (ep.game.id === 'pair-judge') {   // fonts the game can set, and a reason for every verdict
        expect(lanes).toEqual(['works', 'clash']);
        for (const c of ep.game.cards) {
          expect(c.note).toBeTruthy();
          if (c.visual === 'five') continue;
          const [h, hw, b, bw] = (c.visual ?? '').split('|');
          for (const f of [h, b]) expect(['serif', 'times', 'sans', 'verdana', 'tahoma', 'script', 'display', 'mono']).toContain(f);
          for (const w of [hw, bw]) expect(Number(w)).toBeGreaterThan(0);
        }
      }
      if (ep.game.id === 'measure-tune') {   // the marked lane is what the numbers say, and only one thing is wrong
        expect(lanes).toEqual(['measure', 'leading', 'ok']);
        for (const c of ep.game.cards) {
          const s = measureSetting(c.visual ?? '');
          expect(c.lane).toBe(measureVerdict(s));
          if (c.lane === 'measure') expect(measureVerdict({ ...s, chars: 60 })).toBe('ok');
        }
      }
      if (ep.game.id === 'hsl-dial') { expect(lanes).toEqual(['h', 's', 'l']); for (const c of ep.game.cards) expect(hslDial(hslChange(c.visual ?? ''))).toBe(c.lane); }   // only the marked dial moves
      if (ep.game.id === 'ramp-pick') { expect(lanes).toEqual(['tint', 'border', 'solid', 'ink']); for (const c of ep.game.cards) expect(['row', 'button', 'badge', 'input', 'banner', 'link', 'heading', 'divider']).toContain(c.visual); }   // zones and elements the game draws
      if (ep.game.id === 'token-route') expect(lanes).toEqual(['error', 'success', 'warning', 'info']);   // the tokens the toast can take
      if (ep.game.id === 'contrast-check') {   // the marked lane is what WCAG says, and no pair sits on a threshold
        expect(lanes).toEqual(['pass', 'large', 'fail']);
        for (const c of ep.game.cards) {
          const [fg, bg] = (c.visual ?? '').split('|');
          for (const hex of [fg, bg]) expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
          const r = contrastRatio(fg, bg);
          expect(c.lane).toBe(contrastLane(r));
          for (const edge of [3, 4.5]) expect(Math.abs(r - edge)).toBeGreaterThan(0.2);
        }
      }
      if (ep.game.id === 'atom-stack') { expect(lanes).toEqual(['atom', 'molecule', 'organism', 'template']); for (const c of ep.game.cards) expect(['icon', 'button', 'label', 'search', 'field', 'avatar', 'header', 'grid', 'layout', 'checkout']).toContain(c.visual); }   // levels and parts the game draws
      if (ep.game.id === 'token-swap') { expect(lanes).toEqual(['color', 'space', 'text', 'radius']); for (const c of ep.game.cards) expect(['button-fill', 'link', 'gap', 'padding', 'title', 'title2', 'button-radius', 'card-radius']).toContain(c.visual); }   // elements the mock binds
      if (ep.game.id === 'debt-hunt') {   // every "matches" button is the same style; every drift really differs and says how
        expect(lanes).toEqual(['debt', 'ok']);
        const style = (c: { visual?: string }) => (c.visual ?? '').split('|').slice(0, 4).join('|');
        const system = new Set(ep.game.cards.filter(c => c.lane === 'ok').map(style));
        expect(system.size).toBe(1);
        for (const c of ep.game.cards) if (c.lane === 'debt') { expect(system.has(style(c))).toBe(false); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'fidelity-pick') expect(lanes).toEqual(['paper', 'wire', 'hifi', 'code']);   // rungs, cheapest first
      if (ep.game.id === 'proto-scope') { expect(lanes).toEqual(['cut', 'keep']); for (const c of ep.game.cards) expect(c.note).toBeTruthy(); }   // every call explained
      if (ep.game.id === 'wire-flow') expect(lanes).toEqual(['navigate', 'overlay', 'back', 'change']);   // actions the game animates
      if (ep.game.id === 'persona-spectrum') {   // a full 3 × 3 matrix: one person per sense and lane
        expect(lanes).toEqual(['perm', 'temp', 'sit']);
        const cells = ep.game.cards.map(c => `${c.visual}:${c.lane}`);
        expect(new Set(cells).size).toBe(9);
        for (const c of ep.game.cards) expect(['touch', 'see', 'hear']).toContain(c.visual);
      }
      if (ep.game.id === 'pour-sort') expect(lanes).toEqual(['p', 'o', 'u', 'r']);   // the four pillars
      if (ep.game.id === 'cvd-fix') { expect(lanes).toEqual(['broken', 'clear']); for (const c of ep.game.cards) { expect(['chart-rg', 'chart-labels', 'dots', 'dots-icons', 'error-border', 'error-message', 'link-colour', 'link-underline', 'heat-rg', 'heat-blue']).toContain(c.visual); expect(c.note).toBeTruthy(); } }
      if (ep.game.id === 'target-spot') { expect(lanes).toEqual(['problem', 'ok']); for (const c of ep.game.cards) { expect(['close-small', 'pay-button', 'links-close', 'focus-ring', 'no-focus', 'stepper', 'tiny-check', 'tabs']).toContain(c.visual); expect(c.note).toBeTruthy(); } }
      if (ep.game.id === 'funnel-leak') {   // the marked step really leaks most, by a clear margin
        expect(lanes).toEqual(['acq', 'act', 'ret', 'rev']);
        for (const c of ep.game.cards) {
          const counts = funnelCounts(c.visual ?? '');
          expect(counts).toHaveLength(5);
          for (let i = 1; i < 5; i++) expect(counts[i]).toBeLessThanOrEqual(counts[i - 1]);
          expect(c.lane).toBe(leakiestStep(counts));
          const r = [...funnelRates(counts)].sort((x, y) => x - y);
          expect(r[1] - r[0]).toBeGreaterThanOrEqual(0.03);
        }
      }
      if (ep.game.id === 'aha-path') { expect(lanes).toEqual(['before', 'later', 'cut']); for (const c of ep.game.cards) expect(c.note).toBeTruthy(); }
      if (ep.game.id === 'fogg-fix') {   // exactly one factor is missing, and it's the marked one
        expect(lanes).toEqual(['motivation', 'ability', 'prompt']);
        for (const c of ep.game.cards) {
          const pt = foggPoint(c.visual ?? '');
          expect(c.lane).toBe(foggMissing(pt));
          const weak = [pt.m <= 3, pt.a <= 3, pt.p === 0].filter(Boolean).length;
          expect(weak).toBe(1);
        }
      }
      if (ep.game.id === 'dark-spot') { expect(lanes).toEqual(['dark', 'fair']); for (const c of ep.game.cards) { expect(['confirmshame', 'decline-plain', 'preticked', 'optin', 'fake-timer', 'real-deadline', 'cancel-call', 'cancel-easy', 'hidden-fee', 'total-upfront']).toContain(c.visual); expect(c.note).toBeTruthy(); } }
      if (ep.game.id === 'brand-layer') expect(lanes).toEqual(['logo', 'identity', 'brand']);   // rings, inside out
      if (ep.game.id === 'voice-fit') { expect(lanes).toEqual(['off', 'on']); for (const c of ep.game.cards) expect(c.note).toBeTruthy(); }
      if (ep.game.id === 'mood-build') { expect(lanes).toEqual(['drop', 'keep']); for (const c of ep.game.cards) { expect(['palette-warm', 'palette-neon', 'type-serif', 'type-grunge', 'photo-sunrise', 'photo-crowd', 'texture-paper', 'texture-glitch', 'icon-line', 'icon-3d']).toContain(c.visual); expect(c.note).toBeTruthy(); } }
      if (ep.game.id === 'model-match') expect(lanes).toEqual(['sub', 'mkt', 'ads', 'free']);
      if (ep.game.id === 'unit-calc') {   // the marked health is what the maths says, and no card sits on a threshold
        expect(lanes).toEqual(['losing', 'risky', 'healthy']);
        for (const c of ep.game.cards) {
          const n = unitNumbers(c.visual ?? '');
          for (const v of [n.price, n.months, n.margin, n.cac]) expect(v).toBeGreaterThan(0);
          const ratio = n.ltv / n.cac;
          expect(c.lane).toBe(unitHealth(ratio));
          for (const edge of [1, 3]) expect(Math.abs(ratio - edge)).toBeGreaterThan(0.15);
        }
      }
      if (ep.game.id === 'buyer-role') expect(lanes).toEqual(['user', 'buyer', 'it', 'proc']);
      if (ep.game.id === 'tag-match') expect(lanes).toEqual(['header', 'nav', 'main', 'footer']);   // page regions
      if (ep.game.id === 'flex-tune') {   // the answer's CSS uses the property its lane names
        expect(lanes).toEqual(['direction', 'justify', 'align', 'gap']);
        const prop: Record<string, string> = { direction: 'flex-direction', justify: 'justify-content', align: 'align-items', gap: 'gap' };
        for (const c of ep.game.cards) expect((c.visual ?? '').startsWith(`${prop[c.lane]}: `)).toBe(true);
      }
      if (ep.game.id === 'fe-flow') expect(lanes).toEqual(['design', 'component', 'data', 'ship']);
      if (ep.game.id === 'case-order') expect(lanes).toEqual(['context', 'process', 'solution', 'outcome']);   // case study sections, in order
      if (ep.game.id === 'portfolio-crit') { expect(lanes).toEqual(['weak', 'strong']); for (const c of ep.game.cards) expect(c.note).toBeTruthy(); }
      if (ep.game.id === 'whiteboard-step') expect(lanes).toEqual(['clarify', 'users', 'ideas', 'measure']);
      if (ep.game.id === 'edge-branch') { expect(lanes).toEqual(['email', 'code', 'password', 'done']); for (const c of ep.game.cards) expect(c.note).toBeTruthy(); }   // flow steps, in order; every branch has a recovery
      if (ep.game.id === 'step-trim') { expect(lanes).toEqual(['cut', 'merge', 'defer', 'keep']); for (const c of ep.game.cards) { expect(c.note).toBeTruthy(); expect((c.visual ?? '').length).toBeGreaterThan(0); expect((c.visual ?? '').length).toBeLessThanOrEqual(10); } expect(ep.game.cards.filter(c => c.lane === 'merge').length).toBeGreaterThanOrEqual(2); }   // a merge needs a partner; strip labels fit
      if (ep.game.id === 'state-pick') {   // the phone draws every state; empty and error need a title, a line and a button, success a title and a line
        expect(lanes).toEqual(['empty', 'loading', 'error', 'success']);
        for (const c of ep.game.cards) {
          expect(c.note).toBeTruthy();
          const parts = (c.visual ?? '').split('|');
          if (c.lane === 'empty' || c.lane === 'error') expect(parts).toHaveLength(3);
          if (c.lane === 'success') expect(parts).toHaveLength(2);
          parts.forEach((x, k) => expect(x.length).toBeLessThanOrEqual([26, 32, 24][k]));   // title (16px bold), line (12px), button: each fits the 240-wide phone
        }
      }
      if (ep.game.id === 'taste-filter') {   // every comment points at a part of the screen the game draws, and both kinds touch more than one part
        expect(lanes).toEqual(['taste', 'reason']);
        for (const c of ep.game.cards) { expect(KOSH_PARTS).toContain(c.visual); expect(c.note).toBeTruthy(); }
        for (const l of lanes) expect(new Set(ep.game.cards.filter(c => c.lane === l).map(c => c.visual)).size).toBeGreaterThan(1);
      }
      if (ep.game.id === 'frame-feedback') {   // every kept thought is rewritten in its frame; binned ones only explain why
        expect(lanes).toEqual(['like', 'wish', 'whatif', 'bin']);
        for (const c of ep.game.cards) {
          expect(c.note).toBeTruthy();
          if (c.lane === 'bin') expect(c.visual).toBeUndefined();
          else expect((c.visual ?? '').startsWith(`${FRAME_LEAD[c.lane as keyof typeof FRAME_LEAD]} `)).toBe(true);
          if (c.lane === 'whatif') expect(c.visual?.endsWith('?')).toBe(true);
        }
      }
      if (ep.game.id === 'calm-reply') { expect(lanes).toEqual(['ask', 'note', 'context']); for (const c of ep.game.cards) { expect(c.visual).toBeTruthy(); expect(c.note).toBeTruthy(); expect(c.note?.startsWith('“')).toBe(true); } }   // a reflex to strike and the words to say instead
      if (ep.game.id === 'affinity-wall') {   // every note is tagged with a real participant, no one twice in a group, and every group holds more than one person
        for (const c of ep.game.cards) { expect(c.visual).toMatch(/^P([1-9]|1[0-2])$/); expect(c.note).toBeTruthy(); }
        for (const l of lanes) {
          const who = ep.game.cards.filter(c => c.lane === l).map(c => c.visual ?? '');
          expect(themeReach(who)).toBe(who.length);
          expect(themeReach(who)).toBeGreaterThan(1);
        }
        expect(participantOf('P12')).toBe(12);
      }
      if (ep.game.id === 'insight-sharpen') {   // every draft is rebuilt as who · what · because; a sharp draft already is that sentence
        expect(lanes).toEqual(['why', 'who', 'fix', 'good']);
        for (const c of ep.game.cards) {
          expect(c.note).toBeTruthy();
          const { who, what, why } = insightParts(c.visual ?? '');
          for (const x of [who, what, why]) expect(x?.trim()).toBeTruthy();
          expect(why.startsWith('because ')).toBe(true);
          if (c.lane === 'good') expect(c.label).toBe(`${who} ${what} ${why}.`);
          else expect(c.label).not.toContain(why);
        }
      }
      if (ep.game.id === 'tool-fit') {   // each card lights a line its tool draws, and every line gets used
        expect(lanes).toEqual(['persona', 'job', 'arch']);
        for (const c of ep.game.cards) { expect(TOOL_PARTS[c.lane as keyof typeof TOOL_PARTS]).toContain(c.visual); expect(c.note).toBeTruthy(); }
        for (const l of lanes) expect(new Set(ep.game.cards.filter(c => c.lane === l).map(c => c.visual))).toEqual(new Set(TOOL_PARTS[l as keyof typeof TOOL_PARTS]));
      }
      if (ep.game.id === 'journey-plot') {   // feelings the curve can plot, and one clear low point
        expect(lanes).toEqual([...JOURNEY_STAGES]);
        for (const c of ep.game.cards) { expect(Number.isInteger(Number(c.visual))).toBe(true); expect(Math.abs(Number(c.visual))).toBeLessThanOrEqual(2); expect(c.note).toBeTruthy(); }
        const f = journeyFeelings(ep.game.cards) as number[];
        const low = journeyLow(ep.game.cards)!, lowF = f[JOURNEY_STAGES.indexOf(low)];
        for (const v of f) if (v !== lowF) expect(v - lowF).toBeGreaterThan(0.3);
        expect(journeyLow([])).toBeNull();
      }
      if (ep.game.id === 'task-fix') {   // a flawed task points at the words that spoil it and gets a quoted rewrite; a fair task has nothing to tap
        expect(lanes).toEqual(['leak', 'steps', 'vague', 'good']);
        for (const c of ep.game.cards) {
          expect(c.note).toBeTruthy();
          if (c.lane === 'good') { expect(c.visual).toBeUndefined(); continue; }
          const span = flawSpan(c.label, c.visual ?? '');
          expect(span).not.toBeNull();
          expect(span![1] - span![0] + 1).toBeLessThan(taskWords(c.label).length);   // never the whole task
          expect(c.note?.startsWith('“')).toBe(true);
        }
        expect(flawSpan('Tap Search now', 'Search later')).toBeNull();
      }
      if (ep.game.id === 'method-pick') {   // headcounts the cost model can price, and the split the lesson teaches: few to moderate, many to measure
        expect(lanes).toEqual(['person', 'remote', 'unmod']);
        for (const c of ep.game.cards) {
          const n = Number(c.visual);
          expect(Number.isInteger(n) && n > 0).toBe(true);
          expect(c.note).toBeTruthy();
          if (c.lane === 'unmod') expect(n).toBeGreaterThanOrEqual(20); else expect(n).toBeLessThanOrEqual(8);
        }
        expect(studyCost('person', 5)).toEqual({ days: 5.5, rupees: 10000 });
        expect(studyCost('unmod', 40).days).toBeLessThan(studyCost('person', 40).days);
      }
      if (ep.game.id === 'severity-rate') {   // the marked rating is what frequency × impact says
        expect(lanes).toEqual([...SEVERITY]);
        for (const c of ep.game.cards) {
          const { users, impact } = findingOf(c.visual ?? '');
          expect(users).toBeGreaterThanOrEqual(1); expect(users).toBeLessThanOrEqual(5);
          expect([1, 2, 3]).toContain(impact);
          expect(c.lane).toBe(severityOf(users, impact));
          expect(c.note).toBeTruthy();
        }
      }
      if (ep.game.id === 'heuristic-sweep') {   // real heuristics, and every screen part used once
        for (const l of lanes) expect(NIELSEN_10.map(h => h.id)).toContain(l);
        const parts = ep.game.cards.map(c => c.visual);
        for (const p of parts) expect(SAFAR_PARTS).toContain(p);
        expect(new Set(parts).size).toBe(parts.length);
        for (const c of ep.game.cards) expect(c.note).toBeTruthy();
      }
      if (ep.game.id === 'align-snap') expect(lanes).toEqual(['left', 'center', 'right']);   // the three snap lines
      if (['gestalt-hunt', 'squint-test', 'spacing-fix'].includes(ep.game.id)) for (const c of ep.game.cards) expect(c.visual).toBeTruthy();   // visual games draw every card
    });
    it(`${id}: beats and the story gap fit inside the scene`, () => {
      const at = ep.scene.beats.map(b => b.at);
      expect(at).toEqual([...at].sort((a, b) => a - b));
      expect(at.at(-1)!).toBeLessThan(ep.scene.duration);
      expect(ep.gap.from).toBeLessThan(ep.gap.at);
      expect(ep.gap.at).toBeLessThan(ep.scene.duration);
    });
    it(`${id}: quiz answers aren’t always in the same slot`, () => {
      const slots = new Set(ep.quiz.questions.map(q => q.options.findIndex(o => o.id === q.correct)));
      expect(slots.size).toBeGreaterThan(1);
    });
  }
});
