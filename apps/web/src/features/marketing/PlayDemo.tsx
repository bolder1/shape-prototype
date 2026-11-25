'use client';
import { useState } from 'react';
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react/ssr';
import { EPISODES } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { NibSays, StageHeading } from '@/features/episode/kit';
import { SquintTest } from '@/features/episode/games/SquintTest';
import type { GameResult } from '@/features/episode/games/DiamondSort';

// The real mini-game from episode fd.2-2 (Visual hierarchy), not a recording of it.
const game = EPISODES['fd.2-2'].game;

export function PlayDemo() {
  const [run, setRun] = useState(0);
  const [results, setResults] = useState<GameResult[] | null>(null);
  const right = results?.filter(r => r.correct).length ?? 0;

  return (
    <div className="rounded-2xl bg-primary p-4 shadow-lg ring-1 ring-secondary sm:p-6">
      {results ? (
        <div className="flex flex-col items-start gap-5 py-6">
          <NibSays mood={right === results.length ? 'cheer' : 'think'}>
            {right} of {results.length} right. {right === results.length ? 'Your eye for hierarchy is sharp.' : 'Every miss comes back in your review deck until it sticks.'}
          </NibSays>
          <p className="text-md text-tertiary">That was one game from one episode. Your path is built from episodes like this, in the order your answers call for.</p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" href="/onboarding">Find my starting point</Button>
            <Button size="lg" color="secondary" onClick={() => { setResults(null); setRun(r => r + 1); }}
              iconLeading={<ArrowCounterClockwiseIcon data-icon weight="bold" />}>Play again</Button>
          </div>
        </div>
      ) : (
        <StageHeading.Provider value="h3">
          <SquintTest key={run} game={game} onDone={setResults} />
        </StageHeading.Provider>
      )}
    </div>
  );
}
