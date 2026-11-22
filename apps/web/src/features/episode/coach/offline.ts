// Offline Nib: answers from the lesson's own content when the AI coach isn't available (no API key, offline, or over
// the daily limit). It can't reason, but it never makes things up: every answer is a line the lesson already contains.
import type { Episode } from '@shape/content';

export interface Missed { prompt: string; answer: string; explanation: string }
export type QuickAsk = 'simple' | 'example' | 'why-wrong';

const STOP = new Set('a an and are as at be but by can do does for from how i if in is it its me my of on or so that the this to was what when where which who why will with you your'.split(' '));
const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP.has(w));

export function offlineAnswer(ep: Episode, question: string, missed: Missed | undefined, quick?: QuickAsk): string {
  if (quick === 'why-wrong' || (missed && /\b(wrong|why|mistake|missed)\b/i.test(question))) {
    if (missed) return `That one was “${missed.prompt}” The right answer is “${missed.answer}”. ${missed.explanation}`;
    return 'You haven’t missed anything yet in this episode. Nice! If something felt shaky, tell me which part.';
  }
  if (quick === 'example' || /\bexample|instance|real\b/i.test(question)) {
    const beat = ep.scene.beats.find(b => b.body && b.body.length > 40) ?? ep.scene.beats[0];
    return `Here’s the example from the story: ${beat.title}. ${beat.body ?? ''} Spot the same pattern next time you use an app you love.`;
  }
  if (quick === 'simple' || /\b(simple|simply|summar|explain|recap|eli5)\b/i.test(question)) {
    return `In short: ${ep.takeaways.map(t => `${t.title.toLowerCase()}: ${t.body.charAt(0).toLowerCase()}${t.body.slice(1)}`).join(' Also, ')}`;
  }
  // Otherwise: the lesson line that best overlaps the question.
  const q = new Set(words(question));
  const lines = [
    ...ep.takeaways.map(t => `${t.title}: ${t.body}`),
    ...ep.scene.beats.filter(b => b.body).map(b => `${b.title}: ${b.body}`),
    ...ep.game.lanes.map(l => `${l.label}: ${l.hint}.`),
    ...[...ep.check, ...ep.quiz.questions].map(x => x.explanation),
  ];
  const best = lines.map(line => ({ line, score: words(line).filter(w => q.has(w)).length })).sort((a, b) => b.score - a.score)[0];
  if (best && best.score > 0) return `From this lesson: ${best.line}`;
  return `I’m in offline mode, so I can only answer from this lesson. Try asking me to explain it simply, give an example, or why an answer was wrong.`;
}
