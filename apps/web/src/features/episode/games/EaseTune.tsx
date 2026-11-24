'use client';
// Mini-game for pr.2-1: each card is a moment in Dabba, and its `visual` says where the thing starts and ends. Pick the
// easing curve. The motion then plays on your curve (from `bezierAt`), with its frames drawn as a trail so the spacing
// shows even when still, and if the pick is wrong the right curve plays beside it. With reduced motion on, nothing loops:
// a Play button plays it once. The end lists every moment with its curve.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, PlayIcon, XIcon } from '@phosphor-icons/react/ssr';
import { bezierAt, bezierCss, EASE_CURVES, type Ease, type Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { CurvePlot, DABBA, DABBA_SOFT, EASE_NAME, EASE_TONE, INK, loopX } from '../scenes/EaseCurves';
import { useMotionDemo } from './useMotionDemo';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const DW = 320, DH = 110;

/** The motion a path describes, on `ease`, `k` (0 → 1) through it, with nine frames drawn faintly behind. */
function PathDemo({ path, ease, k }: { path: string; ease: Ease; k: number }) {
  const c = EASE_CURVES[ease];
  const xAt = (u: number) => {
    const v = bezierAt(c, u);
    return path === 'off>on' ? DW + 10 - v * (DW - 110) : path === 'on>off' ? 110 + v * (DW - 100) : 30 + v * 160;
  };
  if (path === 'loop') {
    const turn = bezierAt(c, k) * 360;
    return (
      <g>
        {Array.from({ length: 9 }, (_, i) => { const a = (bezierAt(c, i / 8) * 360 - 90) * (Math.PI / 180); return <circle key={i} cx={DW / 2 + Math.cos(a) * 34} cy={DH / 2 + Math.sin(a) * 34} r={3} fill={EASE_TONE[ease]} opacity={0.5} />; })}
        <g transform={`translate(${DW / 2} ${DH / 2}) rotate(${turn})`}>
          <circle r={24} fill="none" stroke={DABBA_SOFT} strokeWidth={6} />
          <path d="M0 -24 A24 24 0 0 1 24 0" fill="none" stroke={DABBA} strokeWidth={6} strokeLinecap="round" />
        </g>
      </g>
    );
  }
  if (path === 'finger') {
    const fy = 16 + k * 60, sy = 16 + bezierAt(c, k) * 60;
    return (
      <g>
        <rect x={60} y={sy + 6} width={200} height={DH} rx={14} fill="#FFFFFF" stroke="#D0D5DD" strokeWidth={1.5} />
        <rect x={140} y={sy + 12} width={40} height={4} rx={2} fill="#D0D5DD" />
        <circle cx={160} cy={fy} r={13} fill={INK} opacity={0.22} />
        <circle cx={160} cy={fy} r={5} fill={INK} />
        <text x={270} y={fy + 4} fontSize={11} fontWeight={800} fill={INK}>thumb</text>
        {Math.abs(fy - sy) > 4 && <text x={10} y={sy + 22} fontSize={10.5} fontWeight={800} fill="#B42318">{fy > sy ? 'lags' : 'runs ahead'}</text>}
      </g>
    );
  }
  return (
    <g>
      {path === 'on>on' && [30, 190].map(x => <rect key={x} x={x} y={30} width={100} height={50} rx={10} fill="none" stroke="#D0D5DD" strokeWidth={1.5} strokeDasharray="4 3" />)}
      {path === 'on>on' && <><text x={80} y={98} textAnchor="middle" fontSize={10.5} fontWeight={800} fill="#475467">Tue</text><text x={240} y={98} textAnchor="middle" fontSize={10.5} fontWeight={800} fill="#475467">Wed</text></>}
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={xAt(i / 8)} x2={xAt(i / 8)} y1={24} y2={86} stroke={EASE_TONE[ease]} strokeWidth={2} opacity={0.45} />)}
      <g transform={`translate(${xAt(k)} 30)`}>
        <rect width={100} height={50} rx={10} fill={DABBA_SOFT} stroke={DABBA} strokeWidth={1.5} />
        <circle cx={20} cy={25} r={10} fill={DABBA} opacity={0.75} />
        <rect x={36} y={20} width={52} height={10} rx={5} fill={DABBA} opacity={0.5} />
      </g>
    </g>
  );
}

function Demo({ path, ease, k, wrong }: { path: string; ease: Ease; k: number; wrong?: boolean }) {
  return (
    <figure className={cx('flex flex-col gap-2 rounded-2xl bg-primary p-3 ring-2 ring-inset', wrong ? 'ring-error' : 'ring-mint-600')}>
      <figcaption className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-semibold text-primary">{wrong ? 'Your pick: ' : 'It needs: '}{EASE_NAME[ease]}</span>
        <code className="truncate text-xs text-tertiary">{bezierCss(ease)}</code>
      </figcaption>
      <div className="flex items-center gap-3">
        <svg viewBox={`-4 -4 ${DW + 8} ${DH + 8}`} className="min-w-0 flex-1 overflow-hidden rounded-xl bg-secondary" role="img" aria-label={`${EASE_NAME[ease]}: the motion played on this curve`}>
          <clipPath id={`ease-demo-${ease}-${wrong ? 'w' : 'r'}`}><rect width={DW} height={DH} rx={10} /></clipPath>
          <g clipPath={`url(#ease-demo-${ease}-${wrong ? 'w' : 'r'})`}><PathDemo path={path} ease={ease} k={k} /></g>
        </svg>
        <svg viewBox="-6 -6 92 92" className="w-20 shrink-0" aria-hidden><CurvePlot ease={ease} x={0} y={0} size={80} k={k} handles={false} label={false} /></svg>
      </div>
    </figure>
  );
}

export function EaseTune({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, Ease>>({});
  const clock = useMotionDemo(1.2);
  const card = game.cards[i];
  const picked = card ? picks[card.id] : undefined;
  const k = clock.still ? 1 : loopX(clock.t, 0.2, 0.9, 1.7);

  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Every moment eased" title={`${right} of ${game.cards.length} curves right`}>
          Arriving eases out, leaving eases in, moving across eases in and out. Only loops and fingers stay linear.
        </StageTitle>
        <ul className="grid w-full gap-1.5 text-left text-sm">
          {game.cards.map(c => (
            <li key={c.id} className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-2">
              <svg viewBox="-3 -3 46 46" className="size-9 shrink-0" aria-hidden><CurvePlot ease={c.lane as Ease} x={0} y={0} size={40} handles={false} label={false} /></svg>
              <span className="min-w-0 flex-1 text-primary">{c.label}</span>
              <span className={cx('shrink-0 font-semibold', picks[c.id] === c.lane ? 'text-tertiary' : 'text-error-primary')}>{EASE_NAME[c.lane as Ease]}</span>
            </li>
          ))}
        </ul>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Ask where it starts and where it ends. Off screen to on screen decelerates; on screen to off accelerates; on to on does both.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, path = card.visual ?? 'off>on';
  const pick = (e: Ease) => { if (picked) return; play(e === card.lane ? 'correct' : 'wrong'); setPicks(p => ({ ...p, [card.id]: e })); if (clock.reduce) clock.play(); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The moment</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('flex flex-col gap-1 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <span className="text-lg font-semibold text-primary">{card.label}</span>
        <span className="text-sm text-tertiary">{path === 'off>on' ? 'Starts off screen, ends on screen' : path === 'on>off' ? 'Starts on screen, ends off screen' : path === 'on>on' ? 'Starts and ends on screen' : path === 'loop' ? 'Never starts or stops' : 'Driven by a finger'}</span>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {game.lanes.map(l => {
          const e = l.id as Ease;
          return (
            <motion.button key={l.id} type="button" onClick={() => pick(e)} disabled={!!picked} whileTap={{ scale: 0.96 }}
              className={cx('flex items-center gap-2.5 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
                !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
              <svg viewBox="-3 -3 42 42" className="size-9 shrink-0" aria-hidden><CurvePlot ease={e} x={0} y={0} size={36} handles={false} label={false} /></svg>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-bold text-primary">{l.label}</span>
                <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
      {picked && (
        <>
          <div className={cx('grid gap-3', !ok && 'sm:grid-cols-2')}>
            {!ok && <Demo path={path} ease={picked} k={k} wrong />}
            <Demo path={path} ease={card.lane as Ease} k={k} />
          </div>
          {clock.reduce && (
            <div className="flex items-center justify-between gap-3 text-sm text-tertiary">
              <span>Your device asks for less motion, so the frames are drawn instead.</span>
              <Button size="sm" color="secondary" iconLeading={<PlayIcon data-icon weight="bold" />} onPress={clock.play}>Play once</Button>
            </div>
          )}
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{EASE_NAME[card.lane as Ease]}.</span>{' '}{card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => setI(n => n + 1)}>{i + 1 < game.cards.length ? 'Next moment' : 'See every curve'}</Button></div>
        </>
      )}
    </div>
  );
}
