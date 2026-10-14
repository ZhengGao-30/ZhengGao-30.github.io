# Design notes — redesign-gundam (round 4)

Editorial minimalism after the density-toggle idea of xiaoyulics.com (typographic hierarchy, hairline rules, calm tone). The RX-78-2 white / blue / red DNA is kept, but expressed as a **calm, eye-comfortable palette**: warm paper white, indigo ink, dusty cobalt, soft vermilion. Static HTML + one CSS + one JS file, no build step.

## Why round 3 felt ugly (diagnosis)
- Large full-bleed fields of fully saturated blue (#1B46A0) → heavy, high chroma over big areas.
- A loud red (#D5222F) used directly next to saturated blue → chromostereopsis (red and blue on one surface appear at different depths, the eye keeps refocusing).
- Pure white (#FFFFFF) ground with navy/white text at near-maximum contrast → glare / halation, especially in long reading.
- Everything at roughly the same loudness: no quiet neutral between colour areas.

## Research notes and principles used
- **Off-white ground, no pure black/white for text.** Reduces the luminance jump between text and page; commonly recommended for long reading ([UX Planet](https://uxplanet.org/alternatives-to-using-pure-black-000000-for-text-and-backgrounds-54ef0e733cdb), [UX Movement](https://uxmovement.com/content/why-you-should-never-use-pure-black-for-text-or-backgrounds/)). Body text here sits around 10–11:1 and headings around 14–15:1 instead of 21:1, while every text pair stays ≥ WCAG AA 4.5:1 and body/headings reach AAA 7:1 ([WCAG G18](https://www.w3.org/WAI/WCAG21/Techniques/general/G18)).
- **Avoid saturated red next to saturated blue.** Chromostereopsis depends on hue pair, saturation and background ([Kitaoka](https://www.psy.ritsumei.ac.jp/akitaoka/Kitaoka2015_ReferenceWorkEntry_Chromostereopsis.pdf), [Frontiers in Psychology 2015](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.00337/full)). Mitigations used: lower chroma, change lightness, and always separate red from blue with neutral space (the tricolour rule has a grey gap; red only touches ivory, tints or ink).
- **Low-glare dark theme.** Ink-navy ground (not black), text #EEEBE2 (~15:1, not pure white), desaturated light-blue links, softened red; generated art gets `brightness(.9)` in dark.
- **OKLCH for even lightness steps and capped chroma** ([OKLCH token guides](https://frontendchecklist.io/rules/css/color-oklch)). Large areas ≤ 0.03 chroma, accents ≤ 0.15 and only on small elements. Hex values below are generated from the OKLCH values (gamut-clipped).
- **Tonal-scale roles** à la [Radix Colors](https://www.radix-ui.com/colors/docs/palette-composition/scales): steps 1–2 backgrounds, 3–5 component/tint backgrounds, 6–8 hairlines, 9–10 solid fills, 11–12 text. Our tokens map to the same roles (ground / raised / tint / hairline / solid / ink).
- **Japanese traditional colours as a lens** ([Wikipedia: Traditional colors of Japan](https://en.wikipedia.org/wiki/Traditional_colors_of_Japan)): gofun 胡粉 (shell white, warm), ai 藍 / hanada 縹 (indigo and mid blues), shu 朱 (vermilion). It fits the mecha heritage of the RX-78-2 and gives a softer red than signal red. (Hex values are our own OKLCH approximations, not quoted from the sources.)
- Structural rules: page ground is warm off-white; blue = ink, links, hairlines, small solid elements and *pale* tinted bands; red = punctuation (short rules, numerals, Oral/Poster chips, hover/focus); slim muted tricolour rule; soft shadows; consistent radii (6 px controls, 14 px cards/images).

## Palette candidates (tokens in `assets/site.css`, selected by `data-palette` on `<html>`)
Default: **A — Gofun & Ai**. Why: it keeps the clearest white-blue-red reading (warm gofun white, indigo, vermilion), the warm ground matches the generated art's ground colour exactly (images blend into the page), and it has the softest overall feel. B is cooler/techier, C is crisper but its coral is closer to pink.

| token (CSS var) | role | A light | A dark | B light | B dark | C light | C dark |
|---|---|---|---|---|---|---|---|
| `--paper` | ground | #F8F6EE | #111725 | #F2F5F7 | #131A22 | #FAFAF7 | #0C1525 |
| `--surface` | raised cards | #FDFCF7 | #192031 | #FAFCFE | #1C242C | #FFFEFD | #141E31 |
| `--blue-soft` | pale blue band | #E5EEF8 | #162338 | see CSS | | | |
| `--rule-strong` | hairline | #AAB2BE | #434D63 | #AAB2BA | #445160 | #B2B8BF | #3D4B63 |
| `--ink` | headings | #17223B | #EEEBE2 | #192532 | #E8ECEF | #101E39 | #F0EEE9 |
| `--ink-2` | body | #2E3951 | #C5CBD5 | #303C49 | #C5CBD1 | #2A3852 | #C7CED8 |
| `--muted` | secondary | #5A6378 | #949FB2 | #596571 | #95A0AA | #586478 | #96A2B5 |
| `--blue` | links / blue ink | #2A4F96 | #93BFF0 | #245A81 | #93C5E6 | #2A4A88 | #92C4EE |
| `--blue-solid` | buttons, small solids | #264A8E | #30599D | #1E547A | #2A6087 | #254582 | #2C5797 |
| `--red` | accent (non-text) | #D15E49 | #D36757 | #C46A46 | #CF7855 | #DA726D | #D87974 |
| `--red-ink` | red text | #A8372C | #EF9687 | #9D4529 | #EB9F81 | #AB413F | #F19E98 |
| `--red-tint` | Oral/Poster chip bg | #FBE1DC | #44241F | | | | |
| `--navy` | mock window | #17233F | #090F1D | | | | |

(The CSS has the full set incl. `--tint-2`, `--rule`, `--on-solid`, `--on-navy`, `--focus`, `--selection`, `--shadow`, `--art-filter`.) A swatch sheet with all values and contrast ratios: `site-preview-shots/round4/swatches.png`.

### Contrast (WCAG 2.x), palette A
Light: ink/ground 14.6, body/ground 10.7, secondary/ground 5.6, link/ground 7.3, red-ink/ground 6.0, link/tint 6.7, secondary/tint 5.1 (worst), red-ink/red-tint 5.2, on-solid/blue-solid 8.3.
Dark: ink/ground 15.0, body/ground 11.0, secondary/ground 6.7, link/ground 9.3, red-ink/ground 8.0, secondary/raised 6.1, on-solid/blue-solid 6.7 (worst 5.9 = secondary/tint).
All text pairs ≥ 4.5:1 in all three palettes (lowest: C light, 4.97).

### Dev-only palette preview
`?palette=a|b|c` on the URL switches palette (script line in the `<head>` of `index.html` + `data-palette` token blocks b/c in `site.css`). No visible UI. To remove: delete that one script line, set `data-palette="a"` and delete the `[data-palette="b"|"c"]` blocks. Note the generated art has the ground colour of palette A, so on B/C the images show as ivory panels.

## Type
Instrument Serif (display), Inter (body 17px/1.65), JetBrains Mono (spec-sheet labels). System fallbacks.

## Layout
Hero (headline + hero illustration) → pale-blue band with Mark / Break / Detect → About with six illustrated research threads → News → Publications (grouped by type, count line) → Projects (pale-blue section, case-study cards) → Education & Experience (Expanded only) → footer with slim tricolour rule.
- **Minimal / Expanded** toggle persisted in `localStorage` (`zg-view`); default Minimal. Minimal: six thread tiles with titles, 3 news, 6 selected publications; Expanded adds thread descriptions, all news, all 20 publications with "Contribution" lines, Education & Experience (GPA/coursework live there). Without JS everything shows.
- Theme toggle (`zg-theme`), default follows `prefers-color-scheme`.
- Projects cards: marquee of the stack, lead card + two cards, red index numerals, native `<details>` for CV bullets, cursor spotlight + subtle tilt on fine pointers (off with reduced motion), clip-path image reveal with stagger. Stacked on mobile, nothing hover-only.

## Illustrations (generated with OpenAI image generation through the local Codex CLI)
All assets in `assets/art/`, ≤ 117 KB each, webp, width/height set, lazy-loaded below the fold, descriptive alt text. Common style line used in every prompt: *refined flat editorial / scientific-journal illustration, thin precise linework, soft layered flat shapes, a hint of paper grain, generous negative space; whole canvas is the flat ground #F8F6EE; palette strictly ground #F8F6EE, ink navy #17223B, muted cobalt #2A4F96, pale blue tint #CEE0F5, hairline grey #AAB2BE, soft vermilion #D15E49 used sparingly; no gradients/glow/neon/3D; no text, letters, numbers, logos, robots, characters or faces; 3:2.*

| file | depicts | concept prompt (abridged) |
|---|---|---|
| `hero.webp` | the core theme: invisible watermark in a generated image | a calm landscape tile whose right half dissolves into diffusion-noise grain; faint concentric rings (hidden watermark) emerge in the noise; a thin scan line and a lens with a small vermilion detection blob |
| `thread-attack.webp` | Adversarial analysis (CSI, SHIFT, DRIFT) | a dotted trajectory through noise is deflected (vermilion) around a concentric-ring watermark and lands in an intact landscape tile |
| `thread-slice.webp` | Robust watermarking design (SLICE) | an image split into a 4×4 grid of compartments, each with a small dot mark; after regeneration/smudging the marks stay crisp |
| `thread-trace.webp` | Attribution & forensics (TRACE, TrajMark) | three rows of nodes on two interleaved channels, a gap of deleted steps and tampered shapes, a seal motif on remaining nodes and a bracket (owner still recoverable). Also the TRACE project cover |
| `thread-lava.webp` | Proactive deepfake forensics (LAVA) | filmstrip above an audio waveform with a tampered segment bracketed across both tracks |
| `thread-agent.webp` | Reliability & privacy of LLM agents | retry loop through a gate, bounded privacy-envelope curve under a ceiling, held-out history cards with checks |
| `thread-graph.webp` | Robust learning under deficient supervision (RoGRAD) | graph with missing edges and noisy nodes repaired by dotted vermilion retrieval arcs from a small source |
| `cover-csi.webp` | CSI Attack cover | concentric-ring watermark over a landscape, half of the rings rewritten in vermilion while the picture stays coherent (+ real live-site screenshot `shot-csi.webp` in a browser-window mock) |
| `cover-baton.webp` | Baton cover | one blank window frame handing task tokens along lines to four worker nodes, a ledger of bars below |

Rejected candidates (kept out of the repo): hero triptych; trajectory-deflection (thin strip) and ring/noise variants; slice with irregular semantic regions; thin timeline strips for TRACE; a card-chain for TRACE; filmstrip with locator needle; the first agent loop strip and the frozen-gate diagram; the noisy-cloud graph; the hub-with-ledger Baton variant. Earlier rounds' colour-block posters are only in git history.

Image credits: generated with OpenAI image generation via the local Codex CLI (`codex exec` with the image generation tool), prompts as above; the CSI Attack screenshot is of the author's own live site. No stock images or photos besides the portrait.

## Motion
Subtle scroll-reveal, hover transitions, marquee; all disabled / static under `prefers-reduced-motion`.

## Notes
`style.css` is kept because `publications/*.html` still use it.
