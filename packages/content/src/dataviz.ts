// Roshni's dashboards, for chapter ui.6. Roshni puts rooftop solar on homes, housing societies and schools in Jaipur,
// Pune, Coimbatore and five other cities, and monitors 1,400 systems from one ops console. Farah Qureshi, its lead
// product designer, is rebuilding the console's charts: the right form for each question, colour that does one job and
// survives colour blindness, and a morning dashboard for Manoj Yadav, the Jaipur service head, that answers the one
// question he opens it with. This is the data the ui.6 scenes and games draw, and the rules they score against.
import { contrastRatio } from './episode';

// ── Choosing the right chart (ui.6-1, `chart-pick`) ─────────────────────────────────────────────────────────────────

/** The chart forms Farah picks between (`chart-pick` lanes). `bar`: lengths from a zero baseline, for comparing
 *  categories, a few periods, or parts of a whole. `line`: change over many points in time. `distribution`: a
 *  histogram of many values, when the spread matters more than the average. `scatter`: two measures per thing, to see
 *  whether they move together. */
export const CHART_FORMS = ['bar', 'line', 'distribution', 'scatter'] as const;
export type ChartForm = (typeof CHART_FORMS)[number];

/** What the reader has to do with the numbers. */
export type ChartTask = 'compare' | 'trend' | 'part' | 'distribution' | 'relationship';

/** The data a question is answered with: named values, a pile of single values, or pairs of measures. */
export type ChartData =
  | { kind: 'values'; labels: readonly string[]; values: readonly number[]; unit: string }
  | { kind: 'samples'; values: readonly number[]; unit: string; width: number }
  | { kind: 'pairs'; points: readonly (readonly [number, number])[]; x: string; y: string };

/** A question someone at Roshni asks of the data. `periods`: for a trend, how many points in time it covers. */
export interface ChartQuestion { text: string; task: ChartTask; periods?: number; data: ChartData }

/** Below this many points in time a trend reads better as bars: each period is a thing to compare, not a slope. */
export const LINE_MIN_PERIODS = 7;

/** The form a question needs. The task decides it; for trends, so does how many periods there are. Part-to-whole
 *  goes to bars (one stacked bar, or sorted bars), because lengths on a common scale beat angles and areas. */
export const chartFor = (q: ChartQuestion): ChartForm =>
  q.task === 'trend' ? ((q.periods ?? 0) >= LINE_MIN_PERIODS ? 'line' : 'bar')
    : q.task === 'distribution' ? 'distribution'
      : q.task === 'relationship' ? 'scatter'
        : 'bar';

/** A round number at or above `x`: 1, 2, 2.5 or 5 times a power of ten. Axis tops and tick steps use it. */
export function niceCeil(x: number): number {
  if (x <= 0) return 0;
  const p = 10 ** Math.floor(Math.log10(x));
  const m = x / p;
  return ([1, 2, 2.5, 5, 10].find(n => m <= n + 1e-9) ?? 10) * p;
}

/** The value axis for a form. Bars encode value as length, so they always start at zero. Lines encode change as
 *  slope, so they may start near the data, as long as the axis is labelled. */
export function valueAxis(form: 'bar' | 'line', values: readonly number[]): { min: number; max: number } {
  const hi = Math.max(...values), lo = Math.min(...values);
  if (form === 'bar') return { min: 0, max: niceCeil(hi) };
  const pad = (hi - lo) * 0.1 || Math.abs(hi) * 0.1 || 1;
  const step = niceCeil((hi - lo + 2 * pad) / 4);
  return { min: Math.floor((lo - pad) / step) * step, max: Math.ceil((hi + pad) / step) * step };
}

/** Tufte's lie factor for two bars drawn from `floor`: how many times bigger the drawn difference is than the real
 *  one. 1 is honest; a cut axis makes 94% against 97% look like a landslide. */
export const lieFactor = (a: number, b: number, floor: number) => ((b - floor) / (a - floor) - 1) / (b / a - 1);

/** Counts of `values` in bins `width` wide, from the bin holding the smallest value to the one holding the largest. */
export function histogram(values: readonly number[], width: number): { from: number; count: number }[] {
  const lo = Math.floor(Math.min(...values) / width) * width;
  const n = Math.floor((Math.max(...values) - lo) / width) + 1;
  const bins = Array.from({ length: n }, (_, i) => ({ from: lo + i * width, count: 0 }));
  for (const v of values) bins[Math.floor((v - lo) / width)].count++;
  return bins;
}
export const mean = (vs: readonly number[]) => vs.reduce((s, v) => s + v, 0) / vs.length;
export const median = (vs: readonly number[]) => { const s = [...vs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/** A deterministic wobble, so the scenes and games draw the same "real" data every time. */
const wob = (i: number, k = 37) => ((i * k) % 11) - 5;

/** The questions on Farah's list (`chart-pick` cards). */
const QUESTIONS = {
  cities: { text: 'Which of our eight cities installed the most kilowatts last month?', task: 'compare',
    data: { kind: 'values', labels: ['Jaipur', 'Pune', 'Coimbatore', 'Indore', 'Nagpur', 'Surat', 'Mysuru', 'Kochi'], values: [612, 540, 488, 310, 274, 260, 198, 142], unit: 'kW' } },
  heights: { text: 'How has Sunshine Heights society’s daily generation moved over the last 90 days?', task: 'trend', periods: 90,
    data: { kind: 'values', labels: Array.from({ length: 90 }, (_, i) => `Day ${i + 1}`), values: Array.from({ length: 90 }, (_, i) => Math.round(430 + 40 * Math.sin(i / 8) - (i > 60 ? (i - 60) * 4 : 0) + wob(i) * 3)), unit: 'kWh' } },
  wait: { text: 'How long do customers wait from signing to switch-on?', task: 'distribution',
    data: { kind: 'samples', unit: 'days', width: 5, values: [9, 11, 12, 12, 13, 14, 14, 15, 15, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 21, 21, 22, 23, 24, 26, 28, 31, 35, 38, 44, 47, 52, 58, 63] } },
  size: { text: 'Do bigger systems get more support tickets?', task: 'relationship',
    data: { kind: 'pairs', x: 'System size (kW)', y: 'Tickets this year', points: [[3, 1], [3, 2], [4, 1], [5, 3], [5, 1], [6, 2], [8, 2], [10, 3], [10, 1], [12, 2], [15, 3], [20, 2], [25, 4], [30, 3], [40, 3], [50, 4], [60, 2], [80, 4]] } },
  mix: { text: 'What share of this year’s revenue came from homes, societies and schools?', task: 'part',
    data: { kind: 'values', labels: ['Homes', 'Societies', 'Schools'], values: [46, 38, 16], unit: '%' } },
  quarters: { text: 'How did installs move across this year’s four quarters?', task: 'trend', periods: 4,
    data: { kind: 'values', labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [820, 1140, 690, 1310], unit: 'installs' } },
  cloud: { text: 'Does cloud cover explain the days Gulmohar School under-generates?', task: 'relationship',
    data: { kind: 'pairs', x: 'Cloud cover (%)', y: 'Generation (kWh)', points: Array.from({ length: 20 }, (_, i) => [i * 5, Math.round(300 - i * 9 + wob(i, 23) * 6)] as const) } },
  hours: { text: 'When in the day do inverter fault calls come in, hour by hour?', task: 'trend', periods: 24,
    data: { kind: 'values', labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), values: Array.from({ length: 24 }, (_, i) => Math.max(0, Math.round(i >= 7 && i <= 18 ? 4 + 14 * Math.sin(((i - 7) / 11) * Math.PI) : 1) + (i % 3 === 0 ? 1 : 0))), unit: 'calls' } },
  savings: { text: 'How much do monthly bill savings vary across our 1,200 homes in Pune?', task: 'distribution',
    data: { kind: 'samples', unit: '₹', width: 500, values: [420, 610, 780, 900, 950, 1100, 1180, 1240, 1300, 1350, 1420, 1460, 1500, 1540, 1580, 1620, 1650, 1700, 1760, 1800, 1850, 1900, 1980, 2050, 2150, 2300, 2450, 2700, 3100, 3600] } },
  crews: { text: 'Which of our 12 technicians fixes the most faults on the first visit?', task: 'compare',
    data: { kind: 'values', labels: ['Anil', 'Bhavna', 'Chetan', 'Divya', 'Faisal', 'Gita', 'Harish', 'Imran', 'Jyoti', 'Kiran', 'Lalit', 'Meena'], values: [91, 88, 86, 84, 83, 81, 79, 76, 74, 71, 66, 58], unit: '%' } },
} as const satisfies Record<string, ChartQuestion>;
export type RoshniQuestion = keyof typeof QUESTIONS;
export const ROSHNI_QUESTIONS: Record<RoshniQuestion, ChartQuestion> = QUESTIONS;

// ── Colour in charts (ui.6-2, `palette-tune`) ───────────────────────────────────────────────────────────────────────

/** The job colour does in a chart (`palette-tune` lanes). `categorical`: tell a few unordered things apart.
 *  `sequential`: show more and less of one measure. `diverging`: show both sides of a meaningful middle. `highlight`:
 *  grey for everything, one colour for the thing the chart is about. */
export const PALETTE_JOBS = ['categorical', 'sequential', 'diverging', 'highlight'] as const;
export type PaletteJob = (typeof PALETTE_JOBS)[number];

/** A chart that needs colour. `scale`: whether the coloured thing is a set of names or an ordered amount.
 *  `midpoint`: an ordered amount with a middle that means something (zero, target, neutral). `series`: how many
 *  things get colours. `focus`: the chart exists to make one of them stand out. `form`: how the game draws it. */
export interface ColourCase { text: string; scale: 'nominal' | 'ordered'; midpoint?: boolean; series: number; focus?: boolean; form: 'lines' | 'stack' | 'grid' | 'diverge' }

/** Past this many categories nobody can match hues to a legend: grey them and colour only what matters. */
export const MAX_CATEGORIES = 6;

/** The job a chart's colour should do. A chart about one thing highlights it; too many names highlight too.
 *  Otherwise names get distinct hues, and amounts get one hue, or two around a meaningful middle. */
export const paletteFor = (c: ColourCase): PaletteJob =>
  c.focus || (c.scale === 'nominal' && c.series > MAX_CATEGORIES) ? 'highlight'
    : c.scale === 'nominal' ? 'categorical'
      : c.midpoint ? 'diverging' : 'sequential';

/** Roshni's chart colours. The categorical slots are used in this fixed order, never cycled: an entity keeps its
 *  colour when a filter removes others. Checked for colour-blind separation between neighbours. */
export const CHART_SERIES = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300'] as const;
/** One blue, light to dark, for amounts. */
export const CHART_RAMP = ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#184f95', '#0d366b'] as const;
/** Two arms around a grey middle: red below, blue above. Lightest steps nearest the middle. */
export const CHART_DIVERGING = { below: ['#f4b6ad', '#e57b6f', '#c2403a'], mid: '#d6d5d0', above: ['#9ec5f4', '#3987e5', '#184f95'] } as const;
/** The grey everything else wears in a highlight chart. */
export const CHART_GREY = '#b4b2ab';

/** A mark's colour under a job. `i`: which series (categorical); `v`: its amount, 0–1 (sequential) or −1–1
 *  (diverging); `focus`: the one the chart is about (highlight). */
export function markColour(job: PaletteJob, m: { i?: number; v?: number; focus?: boolean }): string {
  if (job === 'categorical') return CHART_SERIES[m.i ?? 0] ?? CHART_GREY;
  if (job === 'highlight') return m.focus ? CHART_SERIES[0] : CHART_GREY;
  const v = m.v ?? 0;
  if (job === 'sequential') return CHART_RAMP[Math.min(CHART_RAMP.length - 1, Math.max(0, Math.floor(v * CHART_RAMP.length)))];
  if (Math.abs(v) < 0.1) return CHART_DIVERGING.mid;
  const arm = v < 0 ? CHART_DIVERGING.below : CHART_DIVERGING.above;
  return arm[Math.min(arm.length - 1, Math.floor(Math.abs(v) * arm.length))];
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const rgb = (hex: string) => [1, 3, 5].map(i => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
const hex = (lin: readonly number[]) => '#' + lin.map(c => Math.round(Math.min(1, Math.max(0, toSrgb(Math.min(1, Math.max(0, c))))) * 255).toString(16).padStart(2, '0')).join('');

/** Colour vision deficiencies, simulated at full severity (Machado, Oliveira & Fernandes, 2009). Red-green
 *  deficiencies affect about 1 in 12 men. */
const CVD = {
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
} as const;
export type CvdKind = keyof typeof CVD;
/** How a #rrggbb colour looks to someone with a red-green deficiency. */
export const simulateCvd = (c: string, kind: CvdKind) => { const v = rgb(c); return hex(CVD[kind].map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2])); };

/** OKLab of a #rrggbb colour. */
function oklab(c: string): [number, number, number] {
  const [r, g, b] = rgb(c);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
/** Perceptual distance between two colours (OKLab ΔE × 100). Below about 8, two series start to look the same. */
export const colourDistance = (a: string, b: string) => { const [x, y] = [oklab(a), oklab(b)]; return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) * 100; };
/** The smallest distance two colours keep, for normal vision and both red-green deficiencies. */
export const cvdDistance = (a: string, b: string) => Math.min(colourDistance(a, b), ...(Object.keys(CVD) as CvdKind[]).map(k => colourDistance(simulateCvd(a, k), simulateCvd(b, k))));
/** Two series colours can sit side by side when they stay at least this far apart for everyone. */
export const CVD_MIN = 8;
/** Lines, bars and dots need 3:1 against the chart's background (WCAG 1.4.11), or a direct label to carry them. */
export const markVisible = (c: string, surface = '#ffffff') => contrastRatio(c, surface) >= 3;

/** The charts on Roshni's console that need colour (`palette-tune` cards). */
const CHARTS = {
  cities: { text: 'Daily generation for Jaipur, Pune, Coimbatore and Indore, one line each', scale: 'nominal', series: 4, form: 'lines' },
  mix: { text: 'Revenue split into homes, societies and schools, as one stacked bar per quarter', scale: 'nominal', series: 3, form: 'stack' },
  heat: { text: 'Generation at one site by hour of day and month of the year, as a grid', scale: 'ordered', series: 1, form: 'grid' },
  roof: { text: 'Panel temperature across a school roof, panel by panel', scale: 'ordered', series: 1, form: 'grid' },
  wards: { text: 'Installs per 1,000 homes in each of Pune’s wards', scale: 'ordered', series: 1, form: 'grid' },
  target: { text: 'Each site’s generation this week against its expected output, from −30% to +20%', scale: 'ordered', midpoint: true, series: 1, form: 'diverge' },
  yoy: { text: 'Change in installs since last year, city by city, some up and some down', scale: 'ordered', midpoint: true, series: 1, form: 'diverge' },
  survey: { text: 'Answers to “The install team kept me informed”, from strongly disagree to strongly agree', scale: 'ordered', midpoint: true, series: 1, form: 'stack' },
  society: { text: 'Twenty Jaipur societies’ generation, for a review of the one that fell behind', scale: 'nominal', series: 20, focus: true, form: 'lines' },
  skus: { text: 'Tickets for each of our 11 inverter models, month by month', scale: 'nominal', series: 11, form: 'lines' },
  pune: { text: 'Pune against the other seven cities, for the Pune team’s weekly review', scale: 'nominal', series: 8, focus: true, form: 'lines' },
} as const satisfies Record<string, ColourCase>;
export type RoshniChart = keyof typeof CHARTS;
export const ROSHNI_CHARTS: Record<RoshniChart, ColourCase> = CHARTS;

// ── Dashboards that answer questions (ui.6-3, `dash-critique`) ─────────────────────────────────────────────────────

/** What a tile on Manoj's morning dashboard needs (`dash-critique` lanes). `keep`: it answers his question as it is.
 *  `fix`: the right data, but without a comparison or in a form that hides the answer. `move`: real data, for someone
 *  else's dashboard. `cut`: it changes nobody's decision. */
export const TILE_VERDICTS = ['keep', 'fix', 'move', 'cut'] as const;
export type TileVerdict = (typeof TILE_VERDICTS)[number];

/** A tile on the old Jaipur ops dashboard. `owner`: whose decision it serves, if anyone's. `decision`: it changes
 *  what Manoj's crews do today. `context`: it shows a target, threshold or comparison to read the number against.
 *  `form`: its chart lets him make that comparison at a glance. */
export interface DashTile { text: string; title: string; owner: 'manoj' | 'finance' | 'marketing' | 'growth' | null; decision: boolean; context: boolean; form: boolean }

/** Nobody's decision: cut. Someone else's: move it to their board. Manoj's, but not today's decision: cut from this
 *  board. Today's decision with a comparison in a readable form: keep. Otherwise: fix it. */
export const tileVerdict = (t: DashTile): TileVerdict =>
  t.owner === null ? 'cut' : t.owner !== 'manoj' ? 'move' : !t.decision ? 'cut' : t.context && t.form ? 'keep' : 'fix';

/** A dashboard for one decision fits on one screen: this many tiles at most. */
export const TILE_BUDGET = 6;
/** The tiles that stay on Manoj's board after the critique: the kept ones and the fixed ones. */
export const boardAfter = <K extends string>(tiles: Record<K, DashTile>) => (Object.keys(tiles) as K[]).filter(k => ['keep', 'fix'].includes(tileVerdict(tiles[k])));

/** The tiles on the old Jaipur ops dashboard (`dash-critique` cards). */
const TILES = {
  under: { title: 'Under-generating today', text: 'Sites below 80% of expected output today, ranked by units lost', owner: 'manoj', decision: true, context: true, form: true },
  tickets: { title: 'Open faults by age', text: 'Open fault tickets by age, with the 48-hour promise drawn as a line', owner: 'manoj', decision: true, context: true, form: true },
  crews: { title: 'Crews today', text: 'Six crews on a map with their assigned visits and drive times', owner: 'manoj', decision: true, context: true, form: true },
  faultRate: { title: 'Fault rate', text: 'Inverter fault rate as one big number: 3.1%', owner: 'manoj', decision: true, context: false, form: true },
  gauges: { title: 'Site output', text: 'A speedometer gauge for each of Jaipur’s 140 sites', owner: 'manoj', decision: true, context: true, form: false },
  pie: { title: 'Faults by type', text: 'This month’s faults by type, as a nine-slice pie', owner: 'manoj', decision: true, context: true, form: false },
  revenue: { title: 'Revenue by city', text: 'Monthly revenue for all eight cities', owner: 'finance', decision: false, context: true, form: true },
  carbon: { title: 'CO₂ saved', text: 'A counter of tonnes of CO₂ saved, ticking up live', owner: 'marketing', decision: false, context: false, form: true },
  downloads: { title: 'App downloads', text: 'Customer app downloads this week', owner: 'growth', decision: false, context: true, form: true },
  lifetime: { title: 'Lifetime units', text: 'Total units generated since 2019: 48.2 million kWh', owner: null, decision: false, context: false, form: true },
  rating: { title: 'Average rating', text: 'Average rating of every service visit ever: 4.6 stars', owner: 'manoj', decision: false, context: false, form: true },
} as const satisfies Record<string, DashTile>;
export type RoshniTile = keyof typeof TILES;
export const ROSHNI_TILES: Record<RoshniTile, DashTile> = TILES;
