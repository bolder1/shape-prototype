'use client';
// Watch and Finish-the-story: the lesson's animated scene in a video player.
// "watch" plays the whole scene. "gap" replays part of it, pauses at the gap and asks what happens next,
// then plays the rest so the learner sees the outcome of the right call.
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowCounterClockwiseIcon, CornersInIcon, CornersOutIcon, DeviceRotateIcon, PauseIcon, PlayIcon } from '@phosphor-icons/react/ssr';
import { cx } from '@/utils/cx';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { useClock } from '@/hooks/use-clock';
import { Choice, NibSays, StageTitle, choiceState } from '../kit';
import { DoubleDiamondScene } from '../scenes/DoubleDiamond';
import { ProblemSolutionScene } from '../scenes/ProblemSolution';
import { DesignThinkingScene } from '../scenes/DesignThinking';
import { ProductTeamScene } from '../scenes/ProductTeam';
import { GestaltScene } from '../scenes/Gestalt';
import { HierarchyScene } from '../scenes/Hierarchy';
import { UxLawsScene } from '../scenes/UxLaws';
import { CognitiveLoadScene } from '../scenes/CognitiveLoad';
import { ExploreCheckScene } from '../scenes/ExploreCheck';
import { QualQuantScene } from '../scenes/QualQuant';
import { ResearchQuestionScene } from '../scenes/ResearchQuestion';
import { BiasScene } from '../scenes/Bias';
import { MentalModelsScene } from '../scenes/MentalModels';
import { CardSortScene } from '../scenes/CardSort';
import { NavPatternsScene } from '../scenes/NavPatterns';
import { SitemapScene } from '../scenes/Sitemap';
import { SpacingScaleScene } from '../scenes/SpacingScale';
import { ResponsiveGridScene } from '../scenes/ResponsiveGrid';
import { WhitespaceScene } from '../scenes/Whitespace';
import { AlignmentScene } from '../scenes/Alignment';
import { ClearCleverScene } from '../scenes/ClearClever';
import { ButtonLabelsScene } from '../scenes/ButtonLabels';
import { ErrorMessagesScene } from '../scenes/ErrorMessages';
import { EmptyStatesScene } from '../scenes/EmptyStates';
import { OutcomeOutputScene } from '../scenes/OutcomeOutput';
import { OpportunityTreeScene } from '../scenes/OpportunityTree';
import { PrioritizationScene } from '../scenes/Prioritization';
import { ScriptShapeScene } from '../scenes/ScriptShape';
import { ProbingScene } from '../scenes/Probing';
import { JobsScene } from '../scenes/Jobs';
import { ContextVisitScene } from '../scenes/ContextVisit';
import { TypeAnatomyScene } from '../scenes/TypeAnatomy';
import { TypeScaleScene } from '../scenes/TypeScale';
import { FontPairingScene } from '../scenes/FontPairing';
import { MeasureScene } from '../scenes/Measure';
import { ColourModelsScene } from '../scenes/ColourModels';
import { PaletteBuildScene } from '../scenes/PaletteBuild';
import { SemanticColourScene } from '../scenes/SemanticColour';
import { ContrastDarkScene } from '../scenes/ContrastDark';
import { AtomicScene } from '../scenes/Atomic';
import { TokensScene } from '../scenes/Tokens';
import { InconsistencyScene } from '../scenes/Inconsistency';
import { FidelityScene } from '../scenes/Fidelity';
import { QuestionProtoScene } from '../scenes/QuestionProto';
import { ProtoLinksScene } from '../scenes/ProtoLinks';
import { SpectrumScene } from '../scenes/Spectrum';
import { PourScene } from '../scenes/Pour';
import { ColourBlindScene } from '../scenes/ColourBlind';
import { TargetsScene } from '../scenes/Targets';
import { FunnelScene } from '../scenes/Funnel';
import { AhaScene } from '../scenes/Aha';
import { FoggScene } from '../scenes/Fogg';
import { DarkPatternsScene } from '../scenes/DarkPatterns';
import { BrandLayersScene } from '../scenes/BrandLayers';
import { PositioningScene } from '../scenes/Positioning';
import { MoodboardScene } from '../scenes/Moodboard';
import { BusinessModelsScene } from '../scenes/BusinessModels';
import { UnitEconomicsScene } from '../scenes/UnitEconomics';
import { BuyingJourneyScene } from '../scenes/BuyingJourney';
import { DomTreeScene } from '../scenes/DomTree';
import { BoxModelScene } from '../scenes/BoxModel';
import { FrontendBuildScene } from '../scenes/FrontendBuild';
import { CaseStudyScene } from '../scenes/CaseStudy';
import { PortfolioCritScene } from '../scenes/PortfolioCrit';
import { WhiteboardScene } from '../scenes/Whiteboard';
import { HappyPathScene } from '../scenes/HappyPath';
import { FewerStepsScene } from '../scenes/FewerSteps';
import { UiStatesScene } from '../scenes/UiStates';
import { play } from '@/lib/sound';

/** One scene per episode, chosen by the episode's `scene.id`. */
const SCENES: Record<Episode['scene']['id'], React.ComponentType<{ t: number }>> = {
  'double-diamond': DoubleDiamondScene,
  'problem-solution': ProblemSolutionScene,
  'design-thinking': DesignThinkingScene,
  'product-team': ProductTeamScene,
  gestalt: GestaltScene,
  hierarchy: HierarchyScene,
  'ux-laws': UxLawsScene,
  'cognitive-load': CognitiveLoadScene,
  'explore-check': ExploreCheckScene,
  'qual-quant': QualQuantScene,
  'research-question': ResearchQuestionScene,
  bias: BiasScene,
  'mental-models': MentalModelsScene,
  'card-sort': CardSortScene,
  'nav-patterns': NavPatternsScene,
  sitemap: SitemapScene,
  'spacing-scale': SpacingScaleScene,
  'responsive-grid': ResponsiveGridScene,
  whitespace: WhitespaceScene,
  alignment: AlignmentScene,
  'clear-clever': ClearCleverScene,
  'button-labels': ButtonLabelsScene,
  'error-messages': ErrorMessagesScene,
  'empty-states': EmptyStatesScene,
  'outcome-output': OutcomeOutputScene,
  'opportunity-tree': OpportunityTreeScene,
  prioritization: PrioritizationScene,
  'script-shape': ScriptShapeScene,
  probing: ProbingScene,
  jobs: JobsScene,
  'context-visit': ContextVisitScene,
  'type-anatomy': TypeAnatomyScene,
  'type-scale': TypeScaleScene,
  'font-pairing': FontPairingScene,
  measure: MeasureScene,
  'colour-models': ColourModelsScene,
  'palette-build': PaletteBuildScene,
  'semantic-colour': SemanticColourScene,
  'contrast-dark': ContrastDarkScene,
  atomic: AtomicScene,
  tokens: TokensScene,
  inconsistency: InconsistencyScene,
  fidelity: FidelityScene,
  'question-proto': QuestionProtoScene,
  'proto-links': ProtoLinksScene,
  spectrum: SpectrumScene,
  pour: PourScene,
  'colour-blind': ColourBlindScene,
  targets: TargetsScene,
  funnel: FunnelScene,
  aha: AhaScene,
  fogg: FoggScene,
  'dark-patterns': DarkPatternsScene,
  'brand-layers': BrandLayersScene,
  positioning: PositioningScene,
  moodboard: MoodboardScene,
  'business-models': BusinessModelsScene,
  'unit-economics': UnitEconomicsScene,
  'buying-journey': BuyingJourneyScene,
  'dom-tree': DomTreeScene,
  'box-model': BoxModelScene,
  'frontend-build': FrontendBuildScene,
  'case-study': CaseStudyScene,
  'portfolio-crit': PortfolioCritScene,
  whiteboard: WhiteboardScene,
  'happy-path': HappyPathScene,
  'fewer-steps': FewerStepsScene,
  'ui-states': UiStatesScene,
};

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export function Watch({ episode, mode, onDone }: { episode: Episode; mode: 'watch' | 'gap'; onDone: (correct?: boolean) => void }) {
  const { scene, beats, gap } = { scene: episode.scene, beats: episode.scene.beats, gap: episode.gap };
  const Scene = SCENES[scene.id];
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  // In gap mode the clock stops at the gap until the learner answers.
  const end = mode === 'gap' && !revealed ? gap.at : scene.duration;
  const { t, playing, seek, toggle, setPlaying } = useClock(end, { autoplay: false });
  const [watched, setWatched] = useState(false);

  useEffect(() => { seek(mode === 'gap' ? gap.from : 0); setPlaying(true); }, [mode, gap.from, seek, setPlaying]);
  // Remember reaching the end once, even after scrubbing back (state update during render, React's "derived state" pattern).
  if (!watched && t >= scene.duration - 0.05) setWatched(true);

  const beat = [...beats].reverse().find(b => t >= b.at) ?? beats[0];
  const atGap = mode === 'gap' && !revealed && t >= gap.at - 0.05;
  const start = mode === 'gap' ? gap.from : 0;

  // Full screen: native where the browser allows it (with a landscape lock on phones), otherwise a CSS full-screen view
  // (iPhone Safari can't full-screen an element). The gap question lives outside the player, so the gap leaves full screen.
  const player = useRef<HTMLDivElement>(null);
  const [full, setFull] = useState(false);
  const isFull = full && !atGap;
  useEffect(() => {
    const onChange = () => { if (!document.fullscreenElement) setFull(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFull(false); };
    document.addEventListener('fullscreenchange', onChange);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('fullscreenchange', onChange); window.removeEventListener('keydown', onKey); };
  }, []);
  useEffect(() => { if (atGap && document.fullscreenElement) document.exitFullscreen().catch(() => {}); }, [atGap]);
  const enterFull = async () => {
    setFull(true);
    try {
      await player.current?.requestFullscreen?.();
      await (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }).lock?.('landscape');
    } catch { /* the CSS full-screen view still works */ }
  };
  const exitFull = () => { setFull(false); if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); };

  /** The current beat as a subtitle; its fade follows the scene clock. */
  const subtitle = (className: string) => {
    const k = Math.min(1, Math.max(0, (t - beat.at) / 0.4));
    return (
      <div aria-live="polite" className={cx('rounded-xl px-4 text-white shadow-sm', className)} style={{ opacity: atGap ? 0.4 : 0.35 + 0.65 * k }}>
        <p className="text-md font-bold" style={{ transform: `translateY(${(1 - k) * 6}px)` }}>{beat.title}</p>
        {beat.body && <p className={cx('text-sm text-brand-200', isFull && 'line-clamp-1')}>{beat.body}</p>}
      </div>
    );
  };

  const answer = (id: string) => { if (revealed) return; setPicked(id); };
  const lockIn = () => { play(picked === gap.correct ? 'correct' : 'wrong'); setRevealed(true); };
  const continueStory = () => setPlaying(true);

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow={mode === 'watch' ? 'Watch' : 'Finish the story'}
        title={mode === 'watch' ? 'See it happen' : 'You make the call'}>
        {mode === 'watch' ? episode.hook : 'Here’s the scene again. It stops at the big decision, and you decide what the team does.'}
      </StageTitle>

      {/* the player: picture, subtitles and controls go full screen together */}
      <div ref={player} className={cx('flex flex-col gap-3', isFull && 'fixed inset-0 z-50 gap-2 bg-[#05081A] p-2 sm:p-4')}>
        <div className={cx(isFull && 'flex min-h-0 flex-1 items-center justify-center')}>
          <div className="relative overflow-hidden rounded-2xl bg-secondary shadow-lg ring-1 ring-secondary"
            style={isFull ? { width: 'min(100%, calc((100dvh - 4.5rem) * 16 / 9))' } : undefined}>
            <div className="aspect-video w-full"><Scene t={t} /></div>
            {/* in full screen the subtitles ride on the picture, like video captions, so the picture gets the height */}
            {isFull && subtitle('absolute inset-x-2 bottom-2 bg-brand-solid/85 py-1.5 backdrop-blur-sm')}
            {/* the gap: the scene freezes and asks */}
            {atGap && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-start justify-center bg-brand-950/25 p-4">
                <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
                  className="rounded-full bg-white px-4 py-1.5 text-sm font-bold tracking-wide text-brand-950 uppercase">Paused · your call</motion.p>
              </motion.div>
            )}
            {/* full screen on a phone held upright: the picture is still small, so suggest turning it */}
            {isFull && (
              <p className="pointer-events-none absolute inset-x-0 top-2 mx-auto hidden w-max items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white portrait:flex">
                <DeviceRotateIcon className="size-4" weight="bold" />Turn your phone sideways
              </p>
            )}
          </div>
        </div>

        {/* subtitles: under the picture so they never cover the scene */}
        {!isFull && subtitle('-mt-2 min-h-[4.5rem] bg-brand-solid py-3')}

        {/* player controls */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={toggle} disabled={atGap} aria-label={playing ? 'Pause' : 'Play'}
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-solid text-white transition hover:bg-brand-solid_hover disabled:opacity-40">
            {playing ? <PauseIcon className="size-5" weight="fill" /> : t >= end - 0.05 && !atGap ? <ArrowCounterClockwiseIcon className="size-5" weight="bold" /> : <PlayIcon className="size-5" weight="fill" />}
          </button>
          <input type="range" aria-label="Scene position" min={start} max={end} step={0.01} value={t} disabled={atGap}
            onChange={e => seek(Number(e.target.value))} className="h-1.5 min-w-0 flex-1 cursor-pointer accent-[var(--color-mint-600)]" />
          <span className={cx('shrink-0 text-right text-sm tabular-nums', isFull ? 'text-white/70' : 'text-tertiary')}>{fmt(t)} / {fmt(scene.duration)}</span>
          <button type="button" onClick={isFull ? exitFull : enterFull} disabled={atGap} aria-label={isFull ? 'Exit full screen' : 'Full screen'}
            className={cx('grid size-10 shrink-0 place-items-center rounded-xl transition disabled:opacity-40', isFull ? 'text-white hover:bg-white/10' : 'text-fg-secondary hover:bg-primary_hover')}>
            {isFull ? <CornersInIcon className="size-5" weight="bold" /> : <CornersOutIcon className="size-5" weight="bold" />}
          </button>
        </div>
      </div>
      {!isFull && <p className="-mt-2 text-xs text-tertiary sm:hidden">Small screen? Tap full screen and turn your phone sideways.</p>}

      {atGap && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={springs.gentle} className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-primary">{gap.prompt}</h2>
          {gap.options.map((o, i) => <Choice key={o.id} index={i} label={o.label} state={choiceState(o.id, picked, gap.correct, false)} onPress={() => answer(o.id)} />)}
          <div className="flex justify-end"><Button size="lg" isDisabled={!picked} onPress={lockIn}>Lock it in</Button></div>
        </motion.section>
      )}

      {mode === 'gap' && revealed && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={springs.gentle} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {gap.options.map((o, i) => <Choice key={o.id} index={i} label={o.label} state={choiceState(o.id, picked, gap.correct, true)} onPress={() => {}} disabled />)}
          </div>
          <NibSays mood={picked === gap.correct ? 'cheer' : 'think'}>{picked === gap.correct ? 'Exactly what they did. ' : 'Here’s what the team actually did. '}{gap.explanation}</NibSays>
          <div className="flex justify-end gap-3">
            {t < scene.duration - 0.05
              ? <Button size="lg" onPress={continueStory} isDisabled={playing}>{playing ? 'Watching…' : 'See what happened'}</Button>
              : <Button size="lg" onPress={() => onDone(picked === gap.correct)}>Continue</Button>}
          </div>
        </motion.section>
      )}

      {mode === 'watch' && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-tertiary">{watched ? 'Nice. Ready to check what stuck?' : 'Pause or scrub any time.'}</p>
          <Button size="lg" color={watched ? 'primary' : 'secondary'} onPress={() => onDone()}>{watched ? 'Continue' : 'Skip ahead'}</Button>
        </div>
      )}
    </div>
  );
}
