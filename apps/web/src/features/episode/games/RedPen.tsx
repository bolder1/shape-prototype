'use client';
// Mini-game for rs.1-4: an interview script. Strike every biased question with the red pen (cards in the first lane),
// then hand it in. Each line is marked, with its note: why it's fair, or a fairer rewrite.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, PencilSimpleIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function RedPen({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const strikeLane = game.lanes[0].id;
  const [struck, setStruck] = useState<Set<string>>(new Set());
  const [handedIn, setHandedIn] = useState(false);
  const correct = (c: Game['cards'][number]) => struck.has(c.id) === (c.lane === strikeLane);
  const right = game.cards.filter(correct).length;

  const toggle = (id: string) => { if (handedIn) return; play('tap'); setStruck(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="relative rounded-2xl bg-[#FFFDF5] p-5 shadow-lg ring-1 ring-[#E7E1CF] ring-inset" style={{ backgroundImage: 'repeating-linear-gradient(transparent 0 47px, #EDE7D3 47px 48px)' }}>
        {handedIn && right === game.cards.length && <Burst count={36} />}
        <p className="mb-2 flex items-center gap-2 text-sm font-bold tracking-wide text-[#8A7F63] uppercase"><PencilSimpleIcon className="size-4" weight="bold" />Interview script · draft</p>
        <ol className="flex flex-col">
          {game.cards.map((c, i) => {
            const isStruck = struck.has(c.id), ok = correct(c);
            return (
              <li key={c.id}>
                <button type="button" onClick={() => toggle(c.id)} aria-pressed={isStruck} disabled={handedIn}
                  className="group relative flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-black/[0.03] disabled:cursor-default">
                  <span className="w-6 shrink-0 pt-0.5 text-sm font-bold text-[#8A7F63] tabular-nums">{i + 1}.</span>
                  {/* the red pen stroke: a real line-through, so it crosses every wrapped line; it inks in by fading the colour */}
                  <span className={cx('text-md font-medium text-[#1F2937] line-through decoration-[3px] transition-[text-decoration-color] duration-300',
                    isStruck ? 'decoration-[#DC2626]' : 'decoration-transparent')}>
                    {c.label}
                  </span>
                  {handedIn && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...springs.pop, delay: i * 0.06 }}
                      className={cx('ml-auto grid size-7 shrink-0 place-items-center rounded-full text-white', ok ? 'bg-[#139E6F]' : 'bg-[#DC2626]')}>
                      {ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}
                    </motion.span>
                  )}
                </button>
                {handedIn && c.note && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ delay: 0.2 + i * 0.06 }}
                    className={cx('mb-1 ml-11 rounded-lg px-3 py-1.5 text-sm font-medium', c.lane === strikeLane ? 'bg-[#FEE2E2] text-[#991B1B]' : 'bg-[#DCFCE7] text-[#166534]')}>{c.note}</motion.p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      {!handedIn ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-tertiary">{struck.size} struck. Tap a line again to un-strike it.</p>
          <Button size="lg" onPress={() => { play('reveal'); setHandedIn(true); }} isDisabled={!struck.size}>Hand it in</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <NibSays mood={right === game.cards.length ? 'cheer' : 'think'}>{right} of {game.cards.length} lines marked right. {right === game.cards.length ? 'Sharp ears.' : 'Leading, hypothetical, priming and two-in-one questions all hide the truth.'}</NibSays>
          <div className="flex justify-end"><Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: correct(c) })))}>Continue the story</Button></div>
        </div>
      )}
    </div>
  );
}
