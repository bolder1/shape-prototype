'use client';
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import { CheckIcon, ArrowsInIcon, MinusIcon, PlusIcon } from '@phosphor-icons/react/ssr';
import { chapterById, domainById } from '@shape/engine';
import { FAMILIES, SKILL_META } from '@/lib/skills';
import { LABEL_W, NODE_H, NODE_W, PAD, wrapTitle, type MapLayout } from './layout';
import { TIER_NAME, type ChapterInfo } from './model';

export interface MapCanvasHandle { focusNode: (id: string) => void }

interface View { x: number; y: number; k: number }
const MIN_K = 0.3, MAX_K = 1.6;
const clampK = (k: number) => Math.min(MAX_K, Math.max(MIN_K, k));

// SVG can't use Tailwind classes for every fill, so colours come from the theme's CSS variables (they flip in dark mode).
const C = {
  surface: 'var(--color-bg-primary)', muted: 'var(--color-bg-secondary)', line: 'var(--color-border-secondary)', lineStrong: 'var(--color-border-primary)',
  text: 'var(--color-text-primary)', textMuted: 'var(--color-text-tertiary)', textFaint: 'var(--color-text-quaternary)',
  brand: 'var(--color-bg-brand-solid)', mint: 'var(--color-mint-600)', mintSoft: 'var(--color-mint-50)',
};

export function MapCanvas({ layout, info, selectedId, focusPath, onSelect, ref }: {
  layout: MapLayout; info: Record<string, ChapterInfo>; selectedId: string | null; focusPath: boolean;
  onSelect: (id: string) => void; ref?: Ref<MapCanvasHandle>;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 0.85 });
  const [animate, setAnimate] = useState(false);
  const drag = useRef<{ id: number; x: number; y: number; vx: number; vy: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; k: number } | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const centerOn = useCallback((id: string, k = 0.95) => {
    const n = layout.nodes[id], el = box.current;
    if (!n || !el) return;
    setAnimate(true);
    setView({ k, x: el.clientWidth / 2 - (n.x + NODE_W / 2) * k, y: el.clientHeight / 2 - (n.y + NODE_H / 2) * k });
    setTimeout(() => setAnimate(false), 450);
  }, [layout]);

  const fit = useCallback(() => {
    const el = box.current; if (!el) return;
    const k = clampK(Math.min(el.clientWidth / layout.width, el.clientHeight / layout.height));
    setAnimate(true);
    setView({ k, x: (el.clientWidth - layout.width * k) / 2, y: (el.clientHeight - layout.height * k) / 2 });
    setTimeout(() => setAnimate(false), 450);
  }, [layout]);

  useImperativeHandle(ref, () => ({ focusNode: id => centerOn(id) }), [centerOn]);

  // Start on the learner's next stop (or the first chapter), readable without zooming.
  const start = Object.values(info).filter(i => i.pathIndex != null && i.status !== 'done').sort((a, b) => a.pathIndex! - b.pathIndex!)[0]?.id ?? 'fd.1';
  useEffect(() => {
    const el = box.current, n = layout.nodes[start]; if (!el || !n) return;
    const k = el.clientWidth < 640 ? 0.7 : 0.85;
    // Stop sits just right of the pinned row labels.
    setView({ k, x: Math.min(24, Math.max(el.clientWidth * 0.3, LABEL_W * k) - n.x * k), y: el.clientHeight / 2 - (n.y + NODE_H / 2) * k });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wheel zooms around the cursor. Non-passive so the page doesn't scroll instead.
  useEffect(() => {
    const el = box.current; if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
      setView(v => { const k = clampK(v.k * Math.exp(-e.deltaY * 0.0015)); return { k, x: px - (px - v.x) * (k / v.k), y: py - (py - v.y) * (k / v.k) }; });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const zoomBy = (f: number) => {
    const el = box.current; if (!el) return;
    const px = el.clientWidth / 2, py = el.clientHeight / 2;
    setAnimate(true);
    setView(v => { const k = clampK(v.k * f); return { k, x: px - (px - v.x) * (k / v.k), y: py - (py - v.y) * (k / v.k) }; });
    setTimeout(() => setAnimate(false), 300);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as Element).closest('[data-node]')) return; // nodes handle their own clicks
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), k: view.k };
      drag.current = null;
    } else drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const k = clampK(pinch.current.k * Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.dist);
      const r = box.current!.getBoundingClientRect(), px = (a.x + b.x) / 2 - r.left, py = (a.y + b.y) / 2 - r.top;
      setView(v => ({ k, x: px - (px - v.x) * (k / v.k), y: py - (py - v.y) * (k / v.k) }));
    } else if (drag.current?.id === e.pointerId) {
      const d = drag.current;
      setView(v => ({ ...v, x: d.vx + e.clientX - d.x, y: d.vy + e.clientY - d.y }));
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (drag.current?.id === e.pointerId) drag.current = null;
  };

  const sel = selectedId ? chapterById[selectedId] : null;
  const related = new Set(sel ? [...sel.prereqs, selectedId!] : []);
  const onPath = (id: string) => info[id]?.pathIndex != null;

  return (
    <div ref={box} className="relative h-full w-full cursor-grab touch-none overflow-hidden bg-secondary select-none active:cursor-grabbing"
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <svg className="absolute inset-0 h-full w-full" role="group" aria-label="Skill map: chapters arranged by skill (rows) and by what they build on (left to right)">
        <g style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`, transformOrigin: '0 0', transition: animate ? 'transform 0.4s cubic-bezier(.2,.8,.2,1)' : 'none' }}>
          {/* Family bands and skill rows */}
          {layout.families.map(f => (
            <rect key={f.family} x={PAD / 2} y={f.y - 10} width={layout.width - PAD} height={f.height + 20} rx={20} fill={C.surface} opacity={0.6} />
          ))}
          {layout.rows.map(r => (
            <line key={r.domain} x1={PAD + LABEL_W - 24} x2={layout.width - PAD} y1={r.y + NODE_H / 2} y2={r.y + NODE_H / 2} stroke={C.line} strokeDasharray="2 6" />
          ))}

          {/* Prerequisite lines */}
          {layout.edges.map(e => {
            const pathEdge = onPath(e.from) && onPath(e.to);
            const hot = sel && (e.to === selectedId || e.from === selectedId);
            return (
              <path key={`${e.from}-${e.to}`} d={e.d} fill="none"
                stroke={hot ? C.brand : pathEdge ? C.mint : C.lineStrong} strokeWidth={hot || pathEdge ? 2.5 : 1.25}
                opacity={hot || pathEdge ? 1 : focusPath ? 0.25 : 0.7} />
            );
          })}

          {/* Chapters */}
          {Object.values(layout.nodes).map(n => {
            const ch = chapterById[n.id], i = info[n.id];
            const lines = wrapTitle(ch.title);
            const dim = focusPath && i.pathIndex == null && i.status !== 'done' && i.status !== 'progress' && !related.has(n.id) && selectedId !== n.id;
            const isSel = selectedId === n.id;
            const done = i.status === 'done';
            const stroke = isSel ? C.brand : i.pathIndex != null ? C.brand : done ? C.mint : C.line;
            const label = `${ch.title}. ${domainById[ch.domain].name}, ${TIER_NAME[ch.tier]}. ${
              done ? 'Done.' : i.locked.length ? `Locked until you finish ${i.locked.map(p => chapterById[p].title).join(' and ')}.` : i.status === 'progress' ? `In progress, ${i.doneLessons} of ${i.contentLessons} lessons.` : i.pathIndex != null ? `Stop ${i.pathIndex + 1} on your path.` : i.contentLessons ? 'Available.' : 'Coming later.'}`;
            return (
              <g key={n.id} data-node transform={`translate(${n.x}, ${n.y})`} opacity={dim ? 0.4 : 1}
                role="button" tabIndex={0} aria-label={label} aria-pressed={isSel} className="cursor-pointer outline-none"
                onClick={() => onSelect(n.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(n.id); } }}
                onFocus={() => setFocused(n.id)} onBlur={() => setFocused(f => (f === n.id ? null : f))}>
                {focused === n.id && <rect x={-5} y={-5} width={NODE_W + 10} height={NODE_H + 10} rx={16} fill="none" stroke={C.brand} strokeWidth={2} strokeDasharray="4 3" />}
                <rect width={NODE_W} height={NODE_H} rx={12} fill={done ? C.mintSoft : C.surface} stroke={stroke} strokeWidth={isSel ? 3 : i.pathIndex != null || done ? 2 : 1} />
                <rect x={0} y={12} width={4} height={NODE_H - 24} rx={2} fill={FAMILIES[n.family].color} />
                {lines.map((l, li) => <text key={li} x={14} y={22 + li * 16} fontSize={13} fontWeight={600} fill={(i.status === 'later' && i.pathIndex == null) || i.locked.length ? C.textMuted : C.text}>{l}</text>)}
                <text x={14} y={NODE_H - 9} fontSize={11} fill={C.textFaint}>{TIER_NAME[ch.tier]} · {ch.lessons.length} lessons</text>
                {i.status === 'progress' && i.contentLessons > 0 && (
                  <rect x={0} y={NODE_H - 3} width={(NODE_W * i.doneLessons) / i.contentLessons} height={3} rx={1.5} fill={C.mint} />
                )}
                {done ? (
                  <g transform={`translate(${NODE_W - 14}, -8)`}>
                    <circle cx={0} cy={8} r={11} fill={C.mint} />
                    <CheckIcon x={-7} y={1} width={14} height={14} color="#fff" weight="bold" aria-hidden />
                  </g>
                ) : i.pathIndex != null && (
                  <g transform={`translate(${NODE_W - 14}, -8)`}>
                    <circle cx={0} cy={8} r={11} fill={C.brand} />
                    <text x={0} y={12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">{i.pathIndex + 1}</text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Row labels: follow the map vertically, but pin to the left edge when panned past them. */}
        {(() => {
          const minX = 8 - PAD * view.k, pinned = view.x < minX;
          return (
            <g aria-hidden pointerEvents="none" style={{ transform: `translate(${pinned ? minX : view.x}px, ${view.y}px) scale(${view.k})`, transformOrigin: '0 0', transition: animate ? 'transform 0.4s cubic-bezier(.2,.8,.2,1)' : 'none' }}>
              {layout.families.map(f => (
                <text key={f.family} x={PAD} y={f.y + 4} fontSize={11} fontWeight={700} letterSpacing={1.2} fill={FAMILIES[f.family].color}>{FAMILIES[f.family].label.toUpperCase()}</text>
              ))}
              {layout.rows.map(r => {
                const meta = SKILL_META[r.domain];
                return (
                  <g key={r.domain} transform={`translate(${PAD}, ${r.y})`}>
                    {pinned && <rect x={-8} y={NODE_H / 2 - 16} width={40 + meta.short.length * 8} height={32} rx={10} fill={C.surface} stroke={C.line} />}
                    <meta.icon x={0} y={NODE_H / 2 - 9} width={18} height={18} color={FAMILIES[r.family].color} weight="duotone" />
                    <text x={26} y={NODE_H / 2 + 5} fontSize={14} fontWeight={600} fill={C.text}>{meta.short}</text>
                  </g>
                );
              })}
            </g>
          );
        })()}
      </svg>

      <div className="absolute right-4 bottom-4 flex flex-col overflow-hidden rounded-xl bg-primary shadow-md ring-1 ring-secondary" onPointerDown={e => e.stopPropagation()}>
        <button type="button" aria-label="Zoom in" onClick={() => zoomBy(1.25)} className="grid size-10 place-items-center text-fg-secondary hover:bg-primary_hover"><PlusIcon className="size-5" /></button>
        <button type="button" aria-label="Zoom out" onClick={() => zoomBy(0.8)} className="grid size-10 place-items-center border-t border-secondary text-fg-secondary hover:bg-primary_hover"><MinusIcon className="size-5" /></button>
        <button type="button" aria-label="Fit whole map" onClick={fit} className="grid size-10 place-items-center border-t border-secondary text-fg-secondary hover:bg-primary_hover"><ArrowsInIcon className="size-5" /></button>
      </div>
    </div>
  );
}
