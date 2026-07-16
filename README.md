# Forensic Artifact Reference

A quick-reference directory of digital forensic artifacts across **Windows, Linux, macOS, and Android** — built for DFIR practitioners, SOC analysts, and forensic examiners.

378+ artifacts across 58 categories — authentication, file activity, browsing, registry, network, process execution, persistence mechanisms, memory forensics, cloud & collaboration apps, mobile app forensics, and more — each with file/registry locations, recommended analysis tools, and evidentiary value.

## ⚠️ Important

The artifact content in this reference was generated with AI assistance and has **not** been independently verified line-by-line against primary sources. Always cross-check against authoritative documentation and your organization's validated procedures before relying on this for operational or evidentiary purposes. See the in-app **About & Policy** page for full terms, including liability disclaimers for misuse.

## Features

- **378 artifacts, 58 categories** across 4 platforms, fully searchable (⌘K) — search covers artifact names, tools, paths, event IDs, MITRE ATT&CK IDs, and related-artifact names
- **Dark / light mode**, persisted across visits, respects system preference by default
- **One-tap copy** on every artifact card and every individual command — copies a clean, formatted text summary including all enriched fields
- **Bookmarking** — star any artifact (star turns solid amber when bookmarked) to save it to a personal "Bookmarked Artifacts" list for the current case, persisted in the browser (`src/useBookmarks.js`)
- **Every one of the 378 artifacts is fully enriched** with:
  - **MITRE ATT&CK technique links** — click through to the official ATT&CK page for that technique
  - **Quick commands** — copy-pasteable one-liners to pull/inspect the artifact immediately (where a meaningful command exists)
  - **Related artifacts** — cross-references to artifacts investigators typically triangulate with
  - **Retention / volatility notes** — how long the artifact typically survives before rotation/overwrite
  - **Sources** — where the artifact is commonly documented, for credibility and further reading
- **Fully responsive** — desktop window chrome collapses to a mobile-friendly drawer layout below 860px
- **SEO-ready** — Open Graph/Twitter cards, JSON-LD structured data, sitemap, robots.txt

## Adding, editing, or removing artifacts

All artifact data lives in `src/artifacts/`, split one file per platform:

```
src/artifacts/
  windows.js
  linux.js
  macos.js
  android.js
  _template.js   ← copy this to add a brand-new platform
```

**To add an artifact:** open the relevant file, find the category array, add a new object:

```js
{
  artifact: "Name",
  locations: ["path/one", "path/two"],
  tools: ["Tool A", "Tool B"],
  reveals: "What this proves during an investigation.",
  eventIds: [], // Windows Event Log IDs, if applicable — otherwise leave empty

  // Optional enrichment fields — omit any you don't have data for:
  mitre: ["T1547.001"],                    // MITRE ATT&CK technique IDs
  commands: [{ label: "...", cmd: "..." }], // copy-pasteable extraction commands
  related: ["Other Artifact Name"],         // cross-referenced artifacts
  retention: "How long this typically persists before being overwritten.",
  sources: ["SANS FOR500", "..."],          // where this is commonly documented
}
```

See `src/artifacts/_template.js` for the full annotated reference, and any of the
enriched entries already in `src/artifacts/windows.js` (search for `mitre:`) for
real examples.

**To add a new category:** add a new key to the object in that file, e.g. `"My New Category": [ {...}, {...} ]`.

**To add a whole new platform** (iOS, IoT, ChromeOS, etc.):
1. Copy `src/artifacts/_template.js`, rename the file and the exported constant
2. Import and register it in `src/database.js`
3. Add an entry to `OS_TINTS` in `src/ThemeContext.jsx` and to the `OSGlyph` function in `src/App.jsx` for its icon/colour

No other UI code needs to change — the sidebar, search, and category views all read from the database automatically.

## Running locally

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

## Building for production

```bash
npm run build
```

Output goes to `dist/` — deploy that folder to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Project structure

```
src/
  App.jsx             Main UI shell, icons, layout
  ThemeContext.jsx    Dark/light mode provider + persisted preference
  CopyButton.jsx      One-tap copy-to-clipboard component
  useBookmarks.js     Bookmark/case-notes hook (localStorage-backed)
  Logo.jsx            App logo (fingerprint + magnifier mark)
  PolicyPage.jsx       About / policy / liability page
  database.js         Assembles all platform files + search/count helpers
  artifacts/          Per-platform artifact data (see above)
public/
  logo-source.svg     App icon source
  og-source.svg       Social share image source
  og-image.png        Rendered social share image (1200×630)
  robots.txt
  sitemap.xml
```

## Tech stack

- React 18 + Vite
- No external UI libraries — hand-built, macOS-inspired interface
- No external ad network integrated yet (see `AdWidget.jsx`)

## Copyright

© atifquamar. Content is community-maintained and provided as-is. See the in-app Policy page for full terms of use and liability disclaimers.
