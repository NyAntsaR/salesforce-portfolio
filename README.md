# Salesforce engineering portfolio

A static portfolio site built with Next.js (App Router), TypeScript, and Tailwind CSS, exported to plain HTML for GitHub Pages.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000, with live reload
```

To preview the exact files GitHub Pages will serve:

```bash
npm run build                      # writes the static site to out/
npx serve out                      # or: cd out && python3 -m http.server 4173
```

## Checks

```bash
npm run lint         # ESLint (Next.js core-web-vitals + TypeScript rules)
npx tsc --noEmit     # type check (run `npx next typegen` first after adding routes)
npm run build        # production build and static export
```

## Editing content

All content is data; the pages render it.

| What | Where |
| --- | --- |
| Name, intro, links, resume | `src/content/site.ts` |
| Skills | `skillGroups` in `src/content/site.ts` |
| Projects | `src/content/projects/*.ts` |
| Project order | `src/content/projects/index.ts` |

## Updating the resume

The resume lives in `src/content/resume.ts`. The `/resume/` page renders it, and the PDF is printed from that page, so the web and PDF versions always match. After editing:

```bash
npm run build
(cd out && python3 -m http.server 4173 &)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer \
  --print-to-pdf="$PWD/public/resume/ny-antsa-rajaonarison-resume.pdf" http://localhost:4173/resume/
npm run build      # rebuild so out/ includes the new PDF
```

You can also open `/resume/` in Chrome and use **Print → Save as PDF** (turn off "Headers and footers"). Aim for two pages.

### Placeholders to fill in before publishing

These render as visible "coming soon" placeholders until set:

- The other six certification names in `src/content/resume.ts`.
- Screenshots: add images to `public/screenshots/` and set `src` on the matching entry in the project file.
- Demo video: set `demo.href` in the project file.

### Adding a project (case-study template)

1. Copy `src/content/projects/_template.ts` to a new file and rename the export.
2. Fill in only what exists. Mark unfinished work `"planned"` or `"partial"`, and leave `href` empty for links you don't have yet.
3. Add it to the list in `src/content/projects/index.ts`.

The page at `/projects/<slug>/` is generated at build time, and the diagram is drawn from `architecture.nodes` and `architecture.edges`. Nodes that aren't `"done"` are drawn dashed.

Keep each project's `lastVerified` date current when you re-check it against the source code.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.

1. Create a GitHub repository and push this project to its `main` branch.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`, or run the workflow from the **Actions** tab.

The workflow passes the Pages base path and URL to the build, so the same code works for a project repository (`https://<user>.github.io/<repo>/`) and for a `<user>.github.io` repository.

To build for a project repository locally:

```bash
NEXT_PUBLIC_BASE_PATH=/salesforce-portfolio npm run build
```

## Design notes

- **Static export** (`output: "export"`, `trailingSlash: true`): every route is pre-rendered to `index.html`, which GitHub Pages serves without a server or rewrites. `public/.nojekyll` stops Pages from ignoring the `_next/` folder.
- **No Cache Components:** the generated `cacheComponents` setting is turned off. A static export doesn't need it, and turning it off allows `dynamicParams = false`, so unknown project slugs fail at build time instead of needing a server.
- **Diagrams are inline SVG** generated from project data: no client JavaScript, readable by screen readers through `<title>`/`<desc>` and a text version, and themed by the same CSS variables as the page.
- **Honest status everywhere:** every capability, component, and diagram node has a status, and badges always include a text label, not just a color.
- **Static files and the base path:** `next/link` adds the base path automatically, but `<a href>` and `<img src>` to files in `public/` don't, so use `withBasePath()` from `src/lib/paths.ts` for those.
