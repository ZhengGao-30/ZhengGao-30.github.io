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

## Site map (round 6)
```
index.html            Minimal (text only, News + selected work) / Expanded (slim: bio, research, selected publications, projects, experience, contact)
publications.html     full archive: Accepted (Journal / Conference / Workshop) then Preprints & under review; search, topic chips, Show summaries, live count
news.html             all 17 news items (the 3 latest also sit in Minimal)
playground.html       games and videos (empty state "coming soon", filter + templates ready)
publications/*.html   per-paper landing pages (Google Scholar citation_* tags), restyled with the shared CSS/header/footer
```
Shared: `assets/site.css` (tokens + all components), `assets/site.js` (view switch, theme, archive filter, Playground logic). Sub-page header: name (home) · Home · Publications · News · Playground + theme toggle.

## Minimal / Expanded (home)
Modelled on xiaoyulics.com. Two DOM blocks (`#view-minimal`, `#view-expanded`) switched by `data-view` on `<html>` (default Minimal, persisted in `localStorage` `zg-view`; `#hash` links to Expanded content switch automatically; no-JS shows Expanded in full).
- **Minimal**: text only, **zero images**. Name + switch, hero question + Mark/Break/Detect, News (3 rows, "All news →" news.html), Selected recent work (6), "All publications (20) →", About me (collapsible), footer links (Email · Scholar · GitHub · ORCID · Publications · Playground).
- **Expanded** (slim, ~4,500 px at 1440): Hello + short bio; 01 Research (one heading, hero art, six research threads as a 3×2 tile grid with one line each; full CV wording is in each tile's `title` attribute); 02 Selected publications (6 compact rows + "All publications (20)" + Scholar); 03 Projects (three compact cards with `<details>`); 04 Education & Experience (tight rows, bullets in `<details>`, GPA/coursework one muted line); 05 Contact. No News and no Playground section any more (they have their own pages); nav: Research · Publications · Projects · Experience · Contact · Playground.

## Publications archive scheme
Sections: **Accepted** (Journal articles 1 · Conference papers 6 · Workshop papers 3) and **Preprints & under review** (10, includes IRIS which is not in the CV). Newest first inside each group. Topic tags (assigned from titles/CV bullets; edit in `data-topics` and the `.a-tags` list): Watermarking, Attacks, Deepfake detection, LLM agents, Privacy, Graph learning, NAS / efficiency, Learning theory, Vision, Security. Search matches title, authors and venue; chips are single-select; "Show summaries" reveals the CV-derived summary lines; without JS everything (incl. summaries) is visible and the controls are hidden.

**How to add a paper**: copy an `<article class="a-item" id="…" data-topics="A|B" data-search="lowercase title authors venue">` block into the right group of `publications.html`, update the counts in the page head (`#a-total`, the section `.a-n` numbers, `#a-total data-total`) and, if it is a selected work, add a row to the Minimal and Expanded lists in `index.html`.
**How to add a news item**: add an `<li><span class="m-date">Month YYYY</span><span>text</span></li>` at the top of `news.html` (and, if it is among the three latest, in the Minimal News list of `index.html`).

## Playground (`playground.html`)
Standalone page. Rename in one place: `PLAY_NAME` at the top of `assets/site.js` (fills every `[data-play-name]` element: nav links, footer link, page heading; the `<title>` is plain HTML). Two "coming soon" tiles (`.play-soon`, kinds `game` / `video`); as soon as a real `.play-item` of a kind exists its tile disappears, and when both kinds exist the `All · Games · Videos` filter appears.

**How to add a game** — paste inside `<div class="play-grid">` in `playground.html`:
```html
<article class="play-item" data-kind="game">
  <a class="play-poster" href="https://example.com/my-game/" target="_blank" rel="noopener">
    <img src="assets/play/my-game-poster.webp" width="1200" height="800" alt="Describe the game" loading="lazy">
  </a>
  <div class="play-meta">
    <p class="play-tag mono">Game · 2026</p>
    <h3>My game title</h3>
    <p>One-line blurb.</p>
    <ul class="play-tags"><li>Godot</li><li>Web</li></ul>
    <p class="pub-links"><a href="https://example.com/my-game/" target="_blank" rel="noopener">Play</a> <a href="https://github.com/ZhengGao-30/my-game" target="_blank" rel="noopener">Code</a></p>
  </div>
</article>
```
**How to add a video (self-hosted, small files only; real example = the two videos in `playground.html`, files in `assets/video/<slug>.mp4` + `<slug>-poster.webp`, H.264 + AAC, `+faststart`, poster = a real frame as webp)**:
```html
<article class="play-item" data-kind="video">
  <video controls preload="none" poster="assets/play/my-film-poster.webp" playsinline>
    <source src="assets/play/my-film.mp4" type="video/mp4">
  </video>
  <div class="play-meta"><p class="play-tag mono">Video · 2026</p><h3>Film title</h3><p>One-line blurb.</p></div>
</article>
```
**Embedded video (YouTube etc., lazy)**:
```html
<article class="play-item" data-kind="video">
  <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Film title" loading="lazy" allowfullscreen></iframe>
  <div class="play-meta"><p class="play-tag mono">Video · 2026</p><h3>Film title</h3><p>One-line blurb.</p></div>
</article>
```
Keep large media out of git (use an embed or a release asset); no media is checked in. Name alternatives considered: Studio, Hangar (Gundam nod), Side Quests, Interludes.

## Illustrations
All art in `assets/art/` is **raw OpenAI image generation output via the local Codex CLI** (crop/resize/webp only; no drawing, compositing or recolouring). Style: soft gouache / Japanese-woodblock-inspired washes in indigo and cobalt on warm paper, vermilion as the single accent (chosen over a risograph two-ink look after generating two candidates of each for the hero). Full table of prompts, Codex session ids, crop/resize and SHA-256 of every original: `assets/art/PROVENANCE.md`. The unmodified PNGs are not deployed; they stay in `~/.codex/generated_images/`. Real paper-figure thumbnails in Publications are the papers' own figures. Images load only in Expanded.

## Motion
Subtle scroll-reveal, hover transitions, marquee; all disabled / static under `prefers-reduced-motion`.

## Notes
All pages share `assets/site.css`; the old `style.css` was removed in round 6.

## Measured (round 6, Chromium)
Home Minimal 2,194 px @1440 / 2,687 px @390, 0 images (~307 KB incl. fonts). Home Expanded 4,472 px @1440 / 7,609 px @390 (was 14,479 px), 11 images lazy-loaded (~1.4 MB). publications.html 5,449 px @1440, 0 images, ~258 KB. Reference (xiaoyulics.com): Minimal ≈1,900 px, Expanded ≈3,700 px.

## Videos (round 7)
`playground.html` holds two self-hosted videos made together with Xiaoyu Li (credits block + per-card `.play-credit` line: Claude – production assistance, Astra – Blender modelling for camera language, Seedance 2.5 – rendering). Both were already web-ready (H.264 High, yuv420p, AAC, moov atom first, 1280×720) so they were copied unchanged; the originals' sha256 are in `assets/video/PROVENANCE.md`. Click-to-play only (`preload="none"`), posters are real frames. Check `.gitattributes` marks `*.mp4`/`*.webp` as binary.
