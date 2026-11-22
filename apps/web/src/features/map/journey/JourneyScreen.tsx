'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useClock } from '@/hooks/use-clock';
import Link from 'next/link';
import { ArrowCounterClockwiseIcon, ArrowLeftIcon, CheckIcon, CornersOutIcon, PauseIcon, PlayIcon } from '@phosphor-icons/react/ssr';
import { chapterById } from '@shape/engine';
import { Segmented } from '@/components/inputs/Segmented';
import { FAMILIES, SKILL_META } from '@/lib/skills';
import { cx } from '@/utils/cx';
import { computeOutcome } from '../../onboarding/profile';
import { readProfile } from '../../onboarding/storage';
import { buildLayout, NODE_H, NODE_W, PAD, wrapTitle } from '../layout';
import { buildJourney, cameraAt, captionAt, easeOutBack, journeyFor, progress, stopAt, ZERO_PROFILE, type Journey, type Viewport } from './timeline';

const layout = buildLayout();

const C = {
  surface: 'var(--color-bg-primary)', line: 'var(--color-border-secondary)', lineStrong: 'var(--color-border-primary)',
  text: 'var(--color-text-primary)', textFaint: 'var(--color-text-quaternary)',
  brand: 'var(--color-bg-brand-solid)', mint: 'var(--color-mint-600)', mintBright: 'var(--color-mint-500)',
  mintFill: 'color-mix(in srgb, var(--color-mint-600) 22%, var(--color-bg-primary))',
};

function useViewport(ref: React.RefObject<HTMLDivElement | null>): Viewport {
  const [vp, setVp] = useState<Viewport>({ w: 1200, h: 700 });
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(() => setVp({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return vp;
}

/** Hides the controls while playing once the pointer has been still for a moment (clean screen recordings). */
function useIdle(ms: number) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let timer = setTimeout(() => setIdle(true), ms);
    const wake = () => { setIdle(false); clearTimeout(timer); timer = setTimeout(() => setIdle(true), ms); };
    window.addEventListener('pointermove', wake); window.addEventListener('keydown', wake);
    return () => { clearTimeout(timer); window.removeEventListener('pointermove', wake); window.removeEventListener('keydown', wake); };
  }, [ms]);
  return idle;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export default function JourneyScreen() {
  const [profile] = useState(readProfile);
  const [mode, setMode] = useState<'zero' | 'mine'>('zero');
  const journey = useMemo<Journey>(() => {
    if (mode === 'mine' && profile) { try { return buildJourney(computeOutcome(profile.answers).result); } catch { /* fall back */ } }
    return journeyFor(ZERO_PROFILE);
  }, [mode, profile]);

  const stage = useRef<HTMLDivElement>(null);
  const vp = useViewport(stage);
  const { t, playing, seek, toggle, replay } = useClock(journey.scenes.end);
  const idle = useIdle(2200);

  // A new story starts from the top.
  useEffect(() => { replay(); }, [journey, replay]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, button, [role=radio]')) return;
      if (e.key === ' ') { e.preventDefault(); toggle(); }
      else if (e.key === 'r') replay();
      else if (e.key === 'ArrowRight') seek(t + 2);
      else if (e.key === 'ArrowLeft') seek(t - 2);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, replay, seek, t]);

  const s = journey.scenes;
  const view = cameraAt(journey, t, layout, vp);
  const current = stopAt(journey, t);
  const caption = captionAt(journey, t, current);
  const onPath = (id: string) => journey.popAt[id] != null;
  const dimOthers = progress(t, s.reveal, 0.8);              // non-path chapters fade back once the path appears
  const travelling = t >= s.travel && t < s.finale + 0.6;
  const hideChrome = playing && idle;

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-secondary">
      <div ref={stage} className="absolute inset-0">
        <svg className="h-full w-full" role="img" aria-label={`Animated journey across the skill map: ${caption.title}. ${caption.body}`}>
          <g style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`, transformOrigin: '0 0' }}>
            {layout.families.map(f => <rect key={f.family} x={PAD / 2} y={f.y - 10} width={layout.width - PAD} height={f.height + 20} rx={20} fill={C.surface} opacity={0.6} />)}

            {/* Scan: a highlight sweeps down the skill rows while your skills are mapped. */}
            {layout.rows.map((r, i) => {
              const peak = s.scan + 0.3 + (i * 2.8) / layout.rows.length;
              const glow = Math.max(0, 1 - Math.abs(t - peak) / 0.45);
              return glow > 0 && <rect key={`scan-${r.domain}`} x={PAD} y={r.y + 4} width={layout.width - PAD * 2} height={r.height - 8} rx={14} fill={FAMILIES[r.family].color} opacity={glow * 0.18} />;
            })}
            {layout.rows.map(r => <line key={r.domain} x1={PAD + 186} x2={layout.width - PAD} y1={r.y + NODE_H / 2} y2={r.y + NODE_H / 2} stroke={C.line} strokeDasharray="2 6" />)}

            {/* Row labels */}
            {layout.rows.map(r => {
              const meta = SKILL_META[r.domain];
              return (
                <g key={`l-${r.domain}`} transform={`translate(${PAD}, ${r.y})`} aria-hidden>
                  <meta.icon x={0} y={NODE_H / 2 - 9} width={18} height={18} color={FAMILIES[r.family].color} weight="duotone" />
                  <text x={26} y={NODE_H / 2 + 5} fontSize={14} fontWeight={600} fill={C.text}>{meta.short}</text>
                </g>
              );
            })}

            {/* Prerequisite lines: path links draw themselves in as their chapter pops, then turn mint once done. */}
            {layout.edges.map(e => {
              const path = onPath(e.from) && onPath(e.to);
              if (!path) return <path key={`${e.from}-${e.to}`} d={e.d} fill="none" stroke={C.lineStrong} strokeWidth={1.25} opacity={0.6 - dimOthers * 0.48} />;
              const drawn = progress(t, journey.popAt[e.to], 0.5);
              const done = t >= journey.doneAt[e.to];
              return drawn > 0 && (
                <path key={`${e.from}-${e.to}`} d={e.d} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - drawn}
                  stroke={done ? C.mint : C.brand} strokeWidth={done ? 3.5 : 2.5} strokeLinecap="round" />
              );
            })}

            {/* Chapters */}
            {Object.values(layout.nodes).map(n => {
              const ch = chapterById[n.id];
              const idx = journey.path.findIndex(p => p.id === n.id);
              const isPath = idx >= 0;
              const known = journey.known.has(n.id) && t >= s.scan + 0.3 + (layout.rows.findIndex(r => r.domain === n.domain) * 2.8) / layout.rows.length;
              const pop = isPath ? easeOutBack(progress(t, journey.popAt[n.id], 0.45)) : 0;
              const done = isPath ? progress(t, journey.doneAt[n.id], 0.35) : 0;
              const isCurrent = travelling && idx === Math.min(journey.path.length - 1, current + 1);
              const opacity = isPath && pop > 0 ? 1 : known ? 0.75 : 0.55 - dimOthers * 0.4;
              // Grows from 85% with an overshoot past 100% (easeOutBack), then settles; the current stop sits slightly larger.
              const scale = isPath && pop > 0 ? 0.85 + 0.15 * pop + (isCurrent ? 0.04 : 0) : 1;
              const lines = wrapTitle(ch.title);
              const cx0 = NODE_W / 2, cy0 = NODE_H / 2;
              return (
                <g key={n.id} transform={`translate(${n.x}, ${n.y})`} opacity={opacity} aria-hidden>
                  <g transform={`translate(${cx0} ${cy0}) scale(${scale}) translate(${-cx0} ${-cy0})`}>
                    {isCurrent && <rect x={-8} y={-8} width={NODE_W + 16} height={NODE_H + 16} rx={18} fill="none" stroke={C.mintBright} strokeWidth={3} opacity={0.5 + 0.5 * Math.sin(t * 6)} />}
                    {/* Ring burst when a chapter is completed */}
                    {done > 0 && done < 1 && <rect x={-14 * done} y={-14 * done} width={NODE_W + 28 * done} height={NODE_H + 28 * done} rx={12 + 10 * done} fill="none" stroke={C.mintBright} strokeWidth={3} opacity={1 - done} />}
                    <rect width={NODE_W} height={NODE_H} rx={12} fill={done >= 1 ? C.mintFill : C.surface}
                      stroke={done > 0 ? C.mint : pop > 0 ? C.brand : known ? C.mint : C.line} strokeWidth={pop > 0 || known ? 2 : 1} strokeDasharray={known && !isPath ? '5 4' : undefined} />
                    <rect x={0} y={12} width={4} height={NODE_H - 24} rx={2} fill={FAMILIES[n.family].color} />
                    {lines.map((l, li) => <text key={li} x={14} y={22 + li * 16} fontSize={13} fontWeight={600} fill={C.text}>{l}</text>)}
                    <text x={14} y={NODE_H - 9} fontSize={11} fill={C.textFaint}>{known && !isPath ? 'You know this' : `${ch.lessons.length} lessons`}</text>
                    {pop > 0 && (
                      <g transform={`translate(${NODE_W - 14}, -8)`}>
                        <circle cx={0} cy={8} r={11} fill={done > 0 ? C.mint : C.brand} />
                        {done > 0
                          ? <CheckIcon x={-7} y={1} width={14} height={14} color="#fff" weight="bold" />
                          : <text x={0} y={12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">{idx + 1}</text>}
                      </g>
                    )}
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Top bar */}
      <div className={cx('relative z-10 flex items-center gap-3 px-4 py-3 transition-opacity duration-500 md:px-6', hideChrome && 'pointer-events-none opacity-0')}>
        <Link href="/map" className="inline-flex items-center gap-1.5 rounded-lg bg-primary/80 px-3 py-1.5 text-sm font-semibold text-secondary ring-1 ring-secondary backdrop-blur hover:text-primary">
          <ArrowLeftIcon className="size-4" weight="bold" />Skill map
        </Link>
        <span className="hidden text-sm font-semibold text-tertiary sm:inline">Your journey on Shape</span>
        {profile && (
          <div className="ml-auto w-56"><Segmented label="Story" value={mode} onChange={v => setMode(v as 'zero' | 'mine')} segments={[{ value: 'zero', label: 'From zero' }, { value: 'mine', label: 'My path' }]} /></div>
        )}
      </div>

      {/* Progress HUD while travelling (driven by t like the map, so scrubbing and recordings stay exact) */}
      {t >= s.travel && (() => {
        const a = easeOutBack(progress(t, s.travel, 0.5));
        return (
          <div style={{ opacity: Math.min(1, a), transform: `translate(-50%, ${(1 - a) * -12}px)` }}
            className="absolute top-16 left-1/2 z-10 w-[min(22rem,calc(100%-2rem))] rounded-2xl bg-primary/90 px-4 py-3 shadow-lg ring-1 ring-secondary backdrop-blur">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-semibold text-primary tabular-nums">{current + 1} of {journey.path.length} chapters</span>
              <span className="text-tertiary tabular-nums">Week {Math.max(1, Math.ceil(((current + 1) / journey.path.length) * journey.weeks))} of {journey.weeks}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-mint-600" style={{ width: `${((current + 1) / journey.path.length) * 100}%` }} />
            </div>
            <p className="mt-1.5 truncate text-xs text-tertiary">{current >= 0 ? `Just finished: ${journey.path[current].title}` : 'Starting out'}</p>
          </div>
        );
      })()}

      {/* Caption: pops in each time the story moves on */}
      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-10 flex justify-center px-4">
        {(() => {
          const a = easeOutBack(progress(t, caption.since, 0.5));
          return (
            <div key={caption.key} aria-live="polite" style={{ opacity: Math.min(1, progress(t, caption.since, 0.25)), transform: `translateY(${(1 - a) * 14}px) scale(${0.96 + 0.04 * a})` }}
              className="max-w-xl rounded-2xl bg-brand-solid px-6 py-4 text-center text-white shadow-xl">
              <h2 className="text-xl font-semibold md:text-display-xs">{caption.title}</h2>
              <p className="mt-1 text-sm text-brand-200 md:text-md">{caption.body}</p>
            </div>
          );
        })()}
      </div>

      {/* Controls */}
      <div className={cx('absolute inset-x-0 bottom-4 z-10 flex justify-center px-4 transition-opacity duration-500', hideChrome && 'pointer-events-none opacity-0')}>
        <div className="flex w-full max-w-xl items-center gap-3 rounded-xl bg-primary/90 px-3 py-2 shadow-md ring-1 ring-secondary backdrop-blur">
          <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="grid size-9 place-items-center rounded-lg bg-brand-solid text-white hover:bg-brand-solid_hover">
            {playing ? <PauseIcon className="size-4" weight="fill" /> : <PlayIcon className="size-4" weight="fill" />}
          </button>
          <button type="button" onClick={replay} aria-label="Replay from the start" className="grid size-9 place-items-center rounded-lg text-fg-secondary hover:bg-primary_hover">
            <ArrowCounterClockwiseIcon className="size-4" weight="bold" />
          </button>
          <input type="range" aria-label="Journey position" min={0} max={s.end} step={0.01} value={t} onChange={e => seek(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer accent-[var(--color-mint-600)]" />
          <span className="w-20 text-right text-xs text-tertiary tabular-nums">{fmt(t)} / {fmt(s.end)}</span>
          <button type="button" aria-label="Full screen" onClick={() => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen())}
            className="grid size-9 place-items-center rounded-lg text-fg-secondary hover:bg-primary_hover">
            <CornersOutIcon className="size-4" weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
