'use client';
// Mini-game for bz.2-3: each card is a sentence of Neha's long update (its `visual`, a key of `SAMAN_UPDATE`). Call
// where it goes in the exec summary: the ask, why it's worth it, what happens next, or cut. A right call writes it
// into the summary in `buildSummary` order (cut lines collect under "linked below"), and the email beside it updates
// live: the CFO's inbox preview (`inboxPreview`), the word count, the reading time (`readSeconds`) and whatever
// `summaryFlaws` still finds. First call scores; a miss explains and the sentence comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { SAMAN_UPDATE, SUMMARY_SECONDS, buildSummary, inboxPreview, readSeconds, summaryFlaws, summaryWords, type Episode, type SamanLine, type SummaryFlaw, type SummaryPart } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { PART_TONE } from '../scenes/BlufEmail';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const FLAW_TEXT: Record<SummaryFlaw, string> = {
  buried: 'The ask isn’t the first line',
  long: `Over ${SUMMARY_SECONDS} s to read`,
  jargon: 'Design jargon',
  vague: 'No numbers yet',
};

function Email({ keys, cut }: { keys: SamanLine[]; cut: SamanLine[] }) {
  const ordered = buildSummary(keys);
  const lines = ordered.map(k => SAMAN_UPDATE[k]);
  const text = lines.map(l => l.text).join(' ');
  const flaws = lines.length ? summaryFlaws(lines) : [];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5 rounded-xl bg-primary px-4 py-3 ring-1 ring-secondary" aria-label="Farah’s inbox preview">
        <span className="text-xs font-semibold text-tertiary">Farah’s inbox preview</span>
        <span className="text-sm font-bold text-primary">Neha Iyer</span>
        <span className="truncate text-sm text-tertiary">{text ? inboxPreview(text) : 'Nothing written yet'}</span>
      </div>
      <div className="flex flex-col gap-2 rounded-xl bg-primary p-4 ring-1 ring-secondary">
        {ordered.length === 0 && <span className="text-sm text-quaternary">The summary builds here.</span>}
        {ordered.map(k => (
          <motion.p key={k} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={springs.pop}
            className={cx('border-l-4 pl-3 text-md text-primary', SAMAN_UPDATE[k].part === 'ask' && 'font-bold')} style={{ borderColor: PART_TONE[SAMAN_UPDATE[k].part] }}>
            {SAMAN_UPDATE[k].text}
          </motion.p>
        ))}
        {cut.length > 0 && <span className="text-sm font-medium text-tertiary">Linked below: {cut.length} line{cut.length > 1 ? 's' : ''} of method and artefacts</span>}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold" aria-live="polite">
        <span className="rounded-full bg-secondary px-2 py-1 text-tertiary tabular-nums">{summaryWords(lines)} words</span>
        <span className={cx('rounded-full px-2 py-1 tabular-nums', readSeconds(text) > SUMMARY_SECONDS ? 'bg-error-primary text-error-primary' : 'bg-secondary text-tertiary')}>{readSeconds(text)} s to read</span>
        {flaws.map(f => <span key={f} className="rounded-full bg-error-primary px-2 py-1 text-error-primary">{FLAW_TEXT[f]}</span>)}
      </div>
    </div>
  );
}

export function SummaryBuild({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [kept, setKept] = useState<SamanLine[]>([]);
  const [cut, setCut] = useState<SamanLine[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const lines = buildSummary(kept).map(k => SAMAN_UPDATE[k]);
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="The summary, sent" title={`${n} of ${game.cards.length} placed first time`}>
          {`${summaryWords(lines)} words, ${readSeconds(lines.map(l => l.text).join(' '))} seconds to read, and the decision is in the preview.`}
        </StageTitle>
        <Email keys={kept} cut={cut} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Test it like a design: show someone outside the team the first two lines and ask what you need from them. If they can’t say it back, rewrite.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as SamanLine;
  const part = SAMAN_UPDATE[k].part;
  const owner = game.lanes.find(l => l.id === part)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === part;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setRight(true); if (part === 'cut') setCut(c => [...c, k]); else setKept(c => [...c, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(d => d.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">From Neha’s 600-word update</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('rounded-2xl bg-primary p-5 ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
            <p className="text-lg font-semibold text-primary">{card.label}</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Where it goes">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  right && l.id === part ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === part ? 'border-mint-600' : 'border-secondary')}>
                <span className="flex items-center gap-1.5 text-md font-bold text-primary">
                  <span className="size-2.5 rounded-full" style={{ background: PART_TONE[l.id as SummaryPart] }} aria-hidden />{l.label}
                </span>
                <span className="text-xs font-medium text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          <div className="min-h-14" aria-live="polite">
            {miss && <NibSays mood="sad">Not quite: it goes in <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
            {right && (
              <div className="flex flex-col gap-3">
                <NibSays mood="cheer">{card.note}</NibSays>
                <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next sentence' : 'Send it'}</Button></div>
              </div>
            )}
            {!miss && !right && <NibSays mood="think">Would Farah need this sentence to say yes on Friday? If not, it goes in the link.</NibSays>}
          </div>
        </div>
        <Email keys={kept} cut={cut} />
      </div>
    </div>
  );
}
