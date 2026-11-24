// Pure statistics for the experimentation chapter (gr.3): the normal distribution, sample size for a two-proportion
// test, the two-proportion z-test with a confidence interval, the sample-ratio-mismatch check, and a peeking
// simulation. Everything is deterministic so it can be tested and drawn frame by frame.

/** Standard normal CDF, Φ(z). Uses the complementary error function (W. J. Cody's rational approximation via
 *  Numerical Recipes' erfc, accurate to about 1e-7), which is plenty for p-values shown to three places. */
export const normCdf = (z: number) => {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.5 * x);
  const erfc = t * Math.exp(-x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806
    + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return z >= 0 ? 1 - erfc / 2 : erfc / 2;
};

/** Inverse standard normal CDF, Φ⁻¹(p), by Acklam's algorithm (relative error below 1.2e-9). */
export const normInv = (p: number) => {
  if (p <= 0 || p >= 1) throw new RangeError('p must be between 0 and 1');
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const lo = 0.02425, hi = 1 - lo;
  if (p < lo) { const q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (p > hi) { const q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  const q = p - 0.5, r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
};

/** People needed in EACH version to detect a change in a rate from `p1` to `p2` with a two-sided two-proportion
 *  z-test at significance `alpha` and the given `power` (the standard normal-approximation formula, no continuity
 *  correction):  n = (z₁₋α/₂·√(2p̄(1−p̄)) + z₁₋β·√(p₁(1−p₁)+p₂(1−p₂)))² / (p₂−p₁)². Rounded up. */
export const sampleSize = (p1: number, p2: number, alpha = 0.05, power = 0.8) => {
  if (p1 === p2) return Infinity;
  const za = normInv(1 - alpha / 2), zb = normInv(power), pbar = (p1 + p2) / 2;
  const top = za * Math.sqrt(2 * pbar * (1 - pbar)) + zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
  return Math.ceil((top * top) / ((p2 - p1) * (p2 - p1)));
};

/** Lehr's rule of thumb for the same thing at α = 0.05 and 80% power: 16·p(1−p)/δ² per version. Close to
 *  `sampleSize` for small changes, and easy to do on paper. */
export const lehr = (p: number, delta: number) => Math.ceil((16 * p * (1 - p)) / (delta * delta));

/** One version of a test: people who saw it, and how many of them converted. */
export interface Arm { n: number; x: number }
export const rate = (a: Arm) => a.x / a.n;

/** Two-proportion z-test of B against A: the difference in rates (B − A), the pooled z, the two-sided p-value, and
 *  the unpooled (Wald) confidence interval for the difference. */
export const twoProp = (a: Arm, b: Arm, conf = 0.95) => {
  const pa = rate(a), pb = rate(b), diff = pb - pa;
  const pool = (a.x + b.x) / (a.n + b.n);
  const z = diff / Math.sqrt(pool * (1 - pool) * (1 / a.n + 1 / b.n));
  const p = 2 * (1 - normCdf(Math.abs(z)));
  const se = Math.sqrt((pa * (1 - pa)) / a.n + (pb * (1 - pb)) / b.n), half = normInv(1 - (1 - conf) / 2) * se;
  return { pa, pb, diff, lift: diff / pa, z, p, ci: [diff - half, diff + half] as const };
};

/** Sample ratio mismatch: the p-value of a chi-square test (1 df) that a split meant to put `share` of people in A
 *  really did. Below 0.001 the split is broken and the result can't be trusted, whatever it says. */
export const srmP = (nA: number, nB: number, share = 0.5) => {
  const N = nA + nB, z = (nA - N * share) / Math.sqrt(N * share * (1 - share));
  return 2 * (1 - normCdf(Math.abs(z)));
};
export const SRM_ALPHA = 0.001;

/** A small fast seeded PRNG (mulberry32), so simulations give the same answer every run. */
export const prng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** The false-positive rate of an A/A test (no real difference) when you check it `looks` times at equal intervals
 *  and stop the first time p < `alpha`, by simulation. One look gives `alpha`; Armitage, McPherson and Rowe (1969)
 *  worked out about 14% for five looks and 19% for ten. */
export const peekingFalsePositive = (looks: number, trials = 20000, seed = 7, alpha = 0.05) => {
  const rnd = prng(seed), crit = normInv(1 - alpha / 2);
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
  let hits = 0;
  for (let i = 0; i < trials; i++) {
    let s = 0;
    for (let k = 1; k <= looks; k++) { s += gauss(); if (Math.abs(s / Math.sqrt(k)) > crit) { hits++; break; } }
  }
  return hits / trials;
};
