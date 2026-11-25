# Review notes: chapters built 2026-11-24/25

41 chapters were added: fd.3 → ld.4, one commit each, after 25fdd98. All 60 curriculum chapters now have episodes and a boss. `npm test` (1,586 tests) and `npm run typecheck` pass.

**None of the new scenes or games has been looked at in a browser.** Layouts were placed from coordinates, so the most likely bugs are overlapping or clipped text, especially at 375px. Play: `/learn/<chapter>/<n>`. Boss: `/boss/<chapter>`.

## Layout check of the scenes (done 2026-11-25)
All 132 new scenes were stepped through every 0.25 s in a browser and measured for text that runs off the frame or sits on other text. 12 had real problems, now fixed in 382547e. The other flags were intentional: overlays, stamps, slide-ins, a desktop screen deliberately crammed onto a phone. Still not checked:
- **The mini-games (partly checked):** all 132 were opened at phone width and auto-clicked, and none crashed. Two real bugs were fixed in 4a88926: ds.3-1 showed whole labels as prop names plus a garbled ∞, and fd.4-1 was 169px wider than a phone. The auto-clicker only played 37 games to the end, because most pause after a wrong answer and the test browser slowed those pauses down. The later states of the other 95 still need a quick play-through by hand.
- **Small text on phones:** text inside the drawn phone mocks is small on a 375px screen (about 5px). The older chapters do the same, so it's consistent, but worth a design decision.
- **rs.4-3:** number badges briefly stack for about 2 s while the severity grid fills.

## Facts to check
- cw.2: Hindi lines need a native speaker; the text-growth figures approximate IBM's guidance
- br.2: which fonts cover Devanagari (Tiro, Yatra One), from memory
- ui.5: the Material keyline claim (20px circle vs 18px square)
- bz.4: GST/TDS lines are short summaries, not legal guidance
- gr.4: outside research cited from memory
- pr.3: UPI Lite ₹1,000 no-PIN cap; ax.3: IS 17802 ← EN 301 549, W3C maturity stages. All three look right to me.

## Known small issues
- pr.4-1 LogicWire: the stock limit applies before its card is wired
- st.3-2: the HEART game's second question (which row) isn't replayed in the review deck
- ds.2: the `editAt` helper sits in TierEdit.tsx with no test
- rs.5: small-sample gaps use a Wald interval (Wilson would be more accurate)
- Classic sort exercises allow at most 3 buckets, so ia.3, ia.4, rs.4 and dc.3 cover fewer categories than their episode games
- Many thresholds and story numbers are invented rules of thumb, written for the story: rs.4 severity grid and study costs, pr.2 duration bands, ds.4 governance thresholds, ia.5 policy numbers, br.3 scroll depth, ld.1 sprint costs, and so on

## New shared logic modules (packages/content/src, all tested)
stats, identity, marketing, pitch, sales, handoff, ai, team, judgment, survey, researchops, service, polish, dataviz, governance, multibrand, advproto, contentstrategy, inclusive, designstrategy, retention, brandstrategy, designroi, designeng, leadership, designops
