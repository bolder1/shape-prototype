# Characters: Nib (buddy) and Studio (you)

> Chosen on 2026-11-21. Concept boards: [Figma, Shape — Character concepts](https://www.figma.com/design/53osx1B4nBIX9iyzEfCfG5) (v1 options, v2 chosen direction). Local copies: `assets/concepts/` and `assets/concepts/v2/`.

## Nib, the buddy (AI companion)
- Body blends a fountain-pen nib and a cursor arrow. Matte midnight `#1E2A4A`, glowing mint `#2BC08A` translucent tip, vertical oval eyes, tiny floating hands, no legs, hovers.
- About cat-sized next to Studio, floating at shoulder height.
- **Signature move:** the tip draws a thin mint line. In the product that line becomes the progress line along the road and the path trace in the app.
- **Expressions / animation clips** (names the code will use): `idle`, `wave`, `think`, `cheer`, `sad`, `celebrate`. Expression lives in eye shape, tilt, hands and tip glow (readable at 40px).

## Studio, the learner (your avatar)
- Stylised adult, about 5 heads tall, soft matte clay, simple friendly face. Clothing palette: off-white, sand, midnight, one mint accent.
- **Evolution tiers** (match the character card): `rookie` → `rare` → `epic` → `legendary`. Gear, orbiting skill tokens and the mint aura grow with level. Grounded and professional, never superhero.
- **Customisation:** skin tone, hair (incl. braid, bob, curls, grey), faith wear (turban), glasses, mobility aids, age. The v2 lineup is the starting set.
- **Animation clips:** `idle`, `walk`, `wave`, `celebrate`, `think`.

## 3D handoff (what you do, what comes back)
1. **Image → 3D:** upload `assets/concepts/v2/nib-turnaround.png` (and one Studio front view cropped from `studio-evolution.png`, Rookie) to **Meshy** or **Tripo**, image-to-3D, stylised / low detail.
2. **Rig:** Studio through **Mixamo** auto-rig, then pick the clips above. Nib needs no skeleton: its motion is transforms plus blend shapes for the eyes; or do it in Rive (2D) for the buddy button.
3. **Clean-up:** in Blender, simplify the mesh, apply the palette as flat materials, and add a toon/outline pass if wanted.
4. **Export:** `glTF (.glb)`, Draco-compressed, under ~2 MB each. Name the clips exactly as above.
5. **Drop in:** `apps/web/public/models/nib.glb` and `studio.glb`. The onboarding world swaps the placeholders (`learner` group in `world/parts.tsx`, buddy button in `Buddy.tsx`) for the models.
