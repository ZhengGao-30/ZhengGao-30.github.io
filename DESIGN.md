# Design notes — redesign-gundam (round 3)

Editorial minimalism after the density-toggle idea of xiaoyulics.com (typographic hierarchy, hairline rules, calm tone), now with the RX-78-2 colour identity actually on the page: clean white ground, structural Federation blue, bold signal red. Swiss/Bauhaus poster restraint. Static HTML + one CSS + one JS file, no build step. Nothing depicts a robot or character; yellow is not used.

## Palette (CSS custom properties in `assets/site.css`)
| token | light | dark | use |
|---|---|---|---|
| `--paper` | #FFFFFF | #0A1330 | ground |
| `--paper-2` | #F2F4F8 | #111D44 | tiles |
| `--ink` | #0F1D44 | #F4F5F8 | headings (16.4:1 / 16.8:1) |
| `--ink-2` | #2D3A63 | #C3CBE0 | body (11.1:1 / 11.3:1) |
| `--muted` | #55607E | #9AA6C6 | labels (6.3:1 / 7.5:1) |
| `--blue` | #1B46A0 | #8FB1FF | links, rules, "made" (8.6:1 / 8.6:1) |
| `--blue-band` | #1B46A0 | #1F4FA8 | full-bleed bands; white text 8.6:1 / 7.7:1 |
| `--red` | #D5222F | #D5222F | blocks, tricolour band, Oral badges (white on red 5.1:1), focus ring |
| `--red-ink` | #C41E2B | #FF7C72 | red text: section numbers, link hover (5.9:1 / 7.3:1) |

## Where colour shows
- Tricolour band (blue / white / red, 14px) at top; 28px at the footer.
- Hero: white ground, navy serif headline, blue "made", red "?" and dot, generated art panel with a red tab.
- Full-bleed blue band with the three research questions (Mark / Break / Detect), white text, red top edge.
- Blue section for Projects (white cards), red tab at its top-left.
- Red: section numbers, "Oral" badges as solid red chips, hover/active states, focus ring.
- Dark theme keeps white / blue / red; bands stay blue, ground is deep navy.

## Generated art (OpenAI image generation through the local Codex CLI, `assets/art/`)
Prompts asked for abstract, no robots/characters/text, palette #FFFFFF/#F4F3EF/#1B46A0/#0F1D44/#D5222F.
- `hero-panel.webp` (1000×913): overlapping armour-plate panels with seams, one red disc.
- `signal-banner.webp` (1600×500): watermark signal resolving out of blue noise into concentric rings with one red ring.
- `cover-baton.webp`, `cover-csi.webp`, `cover-trace.webp` (1200×800, ≤30 KB each): relay lanes with a red disc handed between nodes; a tile grid with a few "shifted" red cells; two channels of discs with a gap bridged by a red thread.
- `shot-csi.webp`: real screenshot of the CSI Attack live site, shown in a minimal browser-window mock. (The TRACE and Baton pages were not mocked: TRACE's page features a cartoon mascot, Baton's defaults to a Chinese terracotta theme.)
All decorative with descriptive alt text; everything below the fold is lazy-loaded.

## Components added in round 3
- **Research threads** (About): six numbered threads; Minimal shows titles, Expanded adds the CV one-liners.
- **Publications**: grouped by type (journal / conference / workshop / preprints) with `[J1]…[P9]` ids, venue + CORE badges, red Oral/Poster chips, equal-contribution notes, per-paper "Contribution" line (Expanded only). Minimal view shows six selected works plus a count line.
- **Education & Experience**: Research experience and Education sub-lists with the CV bullets; Expanded view only (GPA / coursework live here).
- **Projects** (case-study cards on the blue band): marquee of the tech stack, lead card (Baton) + two supporting cards, large red index numerals, generated cover per project, stack chips, ghost/solid link buttons with arrow micro-interactions, native `<details>` for the CV bullets, cursor spotlight and subtle 3D tilt (fine pointers only, disabled with reduced motion), clip-path image reveal with stagger. On touch / mobile: stacked, no tilt, nothing hover-only.

## Type
Instrument Serif (display), Inter (body 17px/1.65), JetBrains Mono (spec-sheet labels). System fallbacks.

## Minimal / Expanded
Header toggle persisted in `localStorage` (`zg-view`); default Minimal. Without JS everything shows. Hash links to hidden content switch to Expanded. Theme toggle (`zg-theme`) follows `prefers-color-scheme` by default.

## Motion
Subtle scroll-reveal and hover transitions; disabled under `prefers-reduced-motion`.

## Notes
`style.css` is kept because `publications/*.html` still use it.
