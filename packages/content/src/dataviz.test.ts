import { describe, expect, it } from 'vitest';
import {
  CHART_DIVERGING, CHART_FORMS, CHART_GREY, CHART_RAMP, CHART_SERIES, CVD_MIN, LINE_MIN_PERIODS, MAX_CATEGORIES, PALETTE_JOBS,
  ROSHNI_CHARTS, ROSHNI_QUESTIONS, ROSHNI_TILES, TILE_BUDGET, TILE_VERDICTS, boardAfter, chartFor, colourDistance,
  cvdDistance, histogram, lieFactor, markColour, markVisible, mean, median, niceCeil, paletteFor, simulateCvd, tileVerdict, valueAxis,
  type RoshniChart, type RoshniQuestion, type RoshniTile,
} from './dataviz';

describe('Choosing a chart', () => {
  const keys = Object.keys(ROSHNI_QUESTIONS) as RoshniQuestion[];
  it('gives every question the form its task needs', () => {
    expect(Object.fromEntries(keys.map(k => [k, chartFor(ROSHNI_QUESTIONS[k])]))).toEqual({
      cities: 'bar', heights: 'line', wait: 'distribution', size: 'scatter', mix: 'bar', quarters: 'bar',
      cloud: 'scatter', hours: 'line', savings: 'distribution', crews: 'bar',
    });
    for (const f of CHART_FORMS) expect(keys.filter(k => chartFor(ROSHNI_QUESTIONS[k]) === f).length).toBeGreaterThanOrEqual(2);
  });
  it('turns a short trend into bars and a long one into a line', () => {
    const q = { text: 'x', task: 'trend', data: { kind: 'values', labels: [], values: [], unit: '' } } as const;
    expect(chartFor({ ...q, periods: LINE_MIN_PERIODS - 1 })).toBe('bar');
    expect(chartFor({ ...q, periods: LINE_MIN_PERIODS })).toBe('line');
  });
  it('matches each question’s data to its form', () => {
    for (const k of keys) {
      const q = ROSHNI_QUESTIONS[k], f = chartFor(q);
      expect(q.data.kind).toBe(f === 'scatter' ? 'pairs' : f === 'distribution' ? 'samples' : 'values');
      if (q.data.kind === 'values') { expect(q.data.labels).toHaveLength(q.data.values.length); if (q.periods) expect(q.data.values).toHaveLength(q.periods); }
      if (q.data.kind === 'values') for (const v of q.data.values) expect(v).toBeGreaterThanOrEqual(0);
    }
  });
  it('rounds axis tops to nice numbers', () => {
    expect(niceCeil(612)).toBe(1000); expect(niceCeil(480)).toBe(500); expect(niceCeil(91)).toBe(100); expect(niceCeil(18)).toBe(20);
    expect(niceCeil(2.2)).toBe(2.5); expect(niceCeil(0)).toBe(0);
  });
  it('starts bars at zero, and lets lines start near the data', () => {
    expect(valueAxis('bar', [94, 97])).toEqual({ min: 0, max: 100 });
    for (const k of keys) { const d = ROSHNI_QUESTIONS[k].data; if (d.kind === 'values') expect(valueAxis('bar', d.values).min).toBe(0); }
    const line = valueAxis('line', [380, 470]);
    expect(line.min).toBeGreaterThan(0); expect(line.min).toBeLessThanOrEqual(380); expect(line.max).toBeGreaterThanOrEqual(470);
  });
  it('measures how much a cut axis lies', () => {
    expect(lieFactor(94, 97, 0)).toBeCloseTo(1, 9);
    expect(lieFactor(94, 97, 93)).toBeGreaterThan(90);
  });
  it('bins a distribution, and the average hides its tail', () => {
    const w = ROSHNI_QUESTIONS.wait.data;
    if (w.kind !== 'samples') throw new Error('wait is a distribution');
    const bins = histogram(w.values, w.width);
    expect(bins.reduce((s, b) => s + b.count, 0)).toBe(w.values.length);
    expect(bins[0].from).toBe(5);
    expect(median(w.values)).toBeLessThan(mean(w.values));   // skewed right
    expect(w.values.filter(v => v > 40).length).toBeGreaterThanOrEqual(4);   // the people the average forgets
    expect(histogram([1, 2, 3], 2)).toEqual([{ from: 0, count: 1 }, { from: 2, count: 2 }]);
  });
});

describe('Colour in charts', () => {
  const keys = Object.keys(ROSHNI_CHARTS) as RoshniChart[];
  it('gives every chart the job its colour should do', () => {
    expect(Object.fromEntries(keys.map(k => [k, paletteFor(ROSHNI_CHARTS[k])]))).toEqual({
      cities: 'categorical', mix: 'categorical', heat: 'sequential', roof: 'sequential', wards: 'sequential',
      target: 'diverging', yoy: 'diverging', survey: 'diverging', society: 'highlight', skus: 'highlight', pune: 'highlight',
    });
    for (const j of PALETTE_JOBS) expect(keys.some(k => paletteFor(ROSHNI_CHARTS[k]) === j)).toBe(true);
    expect(paletteFor({ text: 'x', scale: 'nominal', series: MAX_CATEGORIES, form: 'lines' })).toBe('categorical');
    expect(paletteFor({ text: 'x', scale: 'nominal', series: MAX_CATEGORIES + 1, form: 'lines' })).toBe('highlight');
  });
  it('keeps neighbouring series apart for colour-blind readers', () => {
    for (let i = 1; i < CHART_SERIES.length; i++) expect(cvdDistance(CHART_SERIES[i - 1], CHART_SERIES[i])).toBeGreaterThanOrEqual(CVD_MIN);
    // The classic red/green pair is distinct for most people and nearly the same for deuteranopes.
    expect(colourDistance('#d63b3b', '#2e9e44')).toBeGreaterThan(20);
    expect(cvdDistance('#d63b3b', '#2e9e44')).toBeLessThan(CVD_MIN);
  });
  it('simulates colour blindness without touching greys', () => {
    expect(simulateCvd('#808080', 'deutan')).toBe('#808080');
    expect(simulateCvd('#ffffff', 'protan')).toBe('#ffffff');
    expect(simulateCvd('#ff0000', 'deutan')).not.toBe('#ff0000');
  });
  it('makes the ramp and arms ordered by lightness, with a grey middle', () => {
    const L = (c: string) => colourDistance(c, '#000000');
    for (let i = 1; i < CHART_RAMP.length; i++) expect(L(CHART_RAMP[i])).toBeLessThan(L(CHART_RAMP[i - 1]));
    for (const arm of [CHART_DIVERGING.below, CHART_DIVERGING.above]) for (let i = 1; i < arm.length; i++) expect(L(arm[i])).toBeLessThan(L(arm[i - 1]));
    expect(markColour('diverging', { v: 0 })).toBe(CHART_DIVERGING.mid);
    expect(markColour('diverging', { v: -1 })).toBe(CHART_DIVERGING.below[2]);
    expect(markColour('diverging', { v: 0.5 })).toBe(CHART_DIVERGING.above[1]);
    expect(markColour('sequential', { v: 0 })).toBe(CHART_RAMP[0]);
    expect(markColour('sequential', { v: 1 })).toBe(CHART_RAMP.at(-1));
  });
  it('colours by entity in a fixed order, and greys all but the focus', () => {
    expect(markColour('categorical', { i: 2 })).toBe(CHART_SERIES[2]);
    expect(markColour('categorical', { i: 9 })).toBe(CHART_GREY);
    expect(markColour('highlight', { focus: true })).toBe(CHART_SERIES[0]);
    expect(markColour('highlight', {})).toBe(CHART_GREY);
    expect(markVisible(CHART_SERIES[0])).toBe(true);
    expect(markVisible('#f4e04d')).toBe(false);   // a pale yellow line disappears on white
  });
});

describe('Dashboards', () => {
  const keys = Object.keys(ROSHNI_TILES) as RoshniTile[];
  it('critiques every tile by whose decision it serves and whether it can be read', () => {
    expect(Object.fromEntries(keys.map(k => [k, tileVerdict(ROSHNI_TILES[k])]))).toEqual({
      under: 'keep', tickets: 'keep', crews: 'keep', faultRate: 'fix', gauges: 'fix', pie: 'fix',
      revenue: 'move', carbon: 'move', downloads: 'move', lifetime: 'cut', rating: 'cut',
    });
    for (const v of TILE_VERDICTS) expect(keys.some(k => tileVerdict(ROSHNI_TILES[k]) === v)).toBe(true);
  });
  it('leaves a board that fits on one screen', () => {
    const left = boardAfter(ROSHNI_TILES);
    expect(left.length).toBeLessThanOrEqual(TILE_BUDGET);
    expect(keys.length).toBeGreaterThan(TILE_BUDGET);
    expect(left).toContain('under');
  });
});
