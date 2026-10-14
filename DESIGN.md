# Design notes — redesign-gundam

Editorial minimalism after the density-toggle idea of xiaoyulics.com (typographic hierarchy, hairline rules, calm tone), in an RX-78-2 white / blue / red palette. Static HTML + one CSS + one JS file, no build step.

## Palette (CSS custom properties in `assets/site.css`)
| token | light | dark ("night hangar") | use |
|---|---|---|---|
| `--paper` | #F6F5F0 | #0A1330 | ground ("armour") |
| `--paper-2` | #ECEAE2 | #111D44 | tiles, placeholders |
| `--ink` | #0F1D44 | #ECEBE4 | headings, rules (Federation navy) |
| `--ink-2` | #34426B | #C3CBE0 | body (9.0:1 / 11.3:1) |
| `--muted` | #56627F | #9AA6C6 | labels (5.6:1 / 7.5:1) |
| `--blue` | #1F4FA8 | #8FB1FF | links, structure (7.0:1 / 8.6:1) |
| `--red` / `--red-ink` | #D7261E / #C21E17 | #FF5448 / #FF7C72 | punctuation only: hero "?", dots, focus ring, Oral marks, stripe end (red-ink text 5.5:1) |
| `--yellow` | #F2C230 | same | V-fin in hero drawing only |

Red is never a large fill. Dark theme follows `prefers-color-scheme`, with a manual toggle (saved in localStorage).

## Type
- Display/headings: Instrument Serif (hero clamp 2.7–5.9rem, h2 2rem, paper titles 1.3–1.6rem)
- Body: Inter 17px / 1.65
- Labels: JetBrains Mono 11–13px, uppercase, tracked — "spec sheet" voice (`01 / PROFILE` …)
- System fallbacks for all three.

## Motifs
Tricolour stripe (top/bottom), hairline rules, numbered sections 01–05, corner crop marks on the portrait and project cards, faint blueprint grid + construction-line drawing of a stylised mobile-suit head (inline SVG, themed via tokens), V-fin favicon.

## Minimal / Expanded
Header toggle, persisted in `localStorage` (`zg-view`); default Minimal.
- Minimal: hero, About, 3 latest news, 5 selected publications (first one prominent with thumbnail), Projects.
- Expanded: all 13 news, all 14 publications by year with thumbnails, Education & Experience.
- Without JS nothing is hidden (everything shows). Hash links to hidden content switch to Expanded.

## Motion
Subtle scroll-reveal, hover underline/bar transitions, slow float on the drawing; all disabled under `prefers-reduced-motion`.

## Notes
`style.css` is kept because `publications/*.html` still use it.
