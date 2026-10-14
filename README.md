# zhenggao-30.github.io

Personal academic homepage of Zheng Gao — plain static HTML + CSS, no build step.

## Structure

- `index.html` — homepage with a Minimal (text only) and an Expanded view
- `publications.html` — full publications archive (search, topic chips, summaries)
- `news.html` — all news items
- `playground.html` — games and videos (coming soon)
- `publications/<slug>.html` — one landing page per paper, carrying the Google
  Scholar `citation_*` tags
- `papers/<slug>.pdf` — self-hosted full texts (author copies from arXiv)
- `assets/site.css`, `assets/site.js` — shared styling and behaviour
- `assets/art/` — illustrations generated with OpenAI image generation (see `PROVENANCE.md`)
- `images/` — portrait and paper thumbnails
- `robots.txt`, `sitemap.xml`, `googleaf77cc177f277e58.html` (Search Console proof; do not delete)

See `DESIGN.md` for the site map, palette and the "how to add …" recipes
(paper, news item, game, video).

## Editing

- **New paper**: copy an `<article class="a-item">` in `publications.html` (set
  `data-topics` and `data-search`), add it to the right section, update the count
  numbers in the page head, and, if it is a selected work, to `index.html`
  (Minimal and Expanded lists).
- **New news item**: add an `<li>` to `news.html`; for the three latest also
  update the Minimal News list in `index.html`.
- Per-paper landing page, PDF, sitemap and `@graph` steps as before:
  1. copy an existing `publications/<slug>.html` and update its `citation_*` tags,
     title, authors, venue, abstract, and BibTeX;
  2. drop the PDF at `papers/<slug>.pdf` and point `citation_pdf_url` at it;
  3. link the title from the archive to `publications/<slug>.html`;
  4. add the page to `sitemap.xml` and to the `@graph` array in `index.html`.

Titles and author lists should match the arXiv/publisher record exactly — Scholar
uses them to merge this page with the record it already has.

## Deploying

Pushing to `main` deploys automatically via GitHub Actions
(`.github/workflows/deploy.yml`), with the repository's Pages source set to
"GitHub Actions". No dependencies, no build.

To preview locally:

```sh
python3 -m http.server 4173
# then open http://localhost:4173
```

## Search engine indexing

The page carries a canonical URL, `index, follow` robots directives, Open Graph
tags, and a schema.org JSON-LD block describing the person and every
publication. `robots.txt` allows all crawlers and advertises `sitemap.xml`.

When adding a publication, also add it to the `@graph` array in the JSON-LD
`<script>` at the bottom of `<head>`, and bump `<lastmod>` in `sitemap.xml`.

### One-time setup in Google Search Console

1. Open [Search Console](https://search.google.com/search-console), add a
   **URL prefix** property for `https://zhenggao-30.github.io/`.
2. Verify ownership. This site uses the **HTML file** method:
   `googleaf77cc177f277e58.html` sits in the repo root and is served at
   `https://zhenggao-30.github.io/googleaf77cc177f277e58.html`. **Do not delete
   or rename it** — Google re-checks periodically and will un-verify the
   property if the file disappears.
   (The `<head>` also has a reserved comment for the alternative **HTML tag**
   method, if the file method ever needs replacing.)
3. Under **Sitemaps**, submit `sitemap.xml`.
4. Under **URL Inspection**, paste the homepage URL and click
   **Request Indexing**.

Both verification methods work here: `upload-pages-artifact` publishes the repo
root as-is, with no Jekyll step, so a file dropped at the root is served
verbatim at the matching path.

### Google Scholar

Scholar indexes *papers*, not homepages — a publication list alone is never
indexed. So each paper gets its own page under `publications/`, following
Scholar's [inclusion guidelines](https://scholar.google.com/intl/en/scholar/inclusion.html):

- one paper per page, never a list;
- Highwire Press `citation_*` meta tags in `<head>`;
- `citation_pdf_url` pointing at a freely readable PDF **on this domain**
  (Scholar generally will not follow a cross-site PDF link), which is why the
  full texts are mirrored into `papers/` rather than linked to arXiv;
- every paper page linked from `publications.html` (itself linked from `index.html`), which acts as the browse interface
  Scholar crawls.

Three papers (`bip`, `gscnet`, `g-rxad`) have no self-hosted PDF yet, so they
carry citation tags but no `citation_pdf_url`. Scholar will not index those until
a PDF is added to `papers/`.

Inclusion is not instant — Scholar re-crawls on its own schedule and can take
weeks to months. Nothing here is submitted manually; there is no Scholar
equivalent of Search Console for personal sites.

Separately, the [Scholar profile](https://scholar.google.com/citations?user=j15KDM8AAAAJ)
is curated in Scholar's own UI, not from this repo.
