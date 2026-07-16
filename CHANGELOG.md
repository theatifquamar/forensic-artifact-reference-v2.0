# Changelog

All notable changes to the Forensic Artifact Reference project, by version.

> **Note:** This changelog was written retroactively to document project history.
> Source code for v1.0 and v1.1 was overwritten during development and is not
> recoverable unless you separately saved those zip downloads. Starting with
> this version, keep this project under Git version control (see README) so
> every future change is permanently restorable via commit history.

---

## v1.3 — Investigator Enrichment Fields, Bookmarking, Ad Removal (current)

**Ads removed**
- Fully removed `AdWidget.jsx` and its two usages in `App.jsx` per project decision to drop advertising

**Investigator-focused data enrichment**
- Added 5 new optional fields to the artifact data model: `mitre` (MITRE ATT&CK technique IDs, linked to attack.mitre.org), `commands` (copy-pasteable extraction one-liners), `related` (cross-referenced artifact names), `retention` (volatility/persistence notes), `sources` (documentation credibility references)
- Populated a representative set of 12 flagship artifacts across all 4 platforms (Windows: Logon Events, Prefetch, AmCache, Shimcache, Run keys, Scheduled Tasks, Sysmon, USBSTOR; Linux: auth.log, bash_history; macOS: FSEvents, LaunchAgents; Android: Call Log, WhatsApp) as a template for further expansion
- Updated `src/artifacts/_template.js` with full annotated examples of all new fields
- Extended `searchArtifacts()` in `database.js` to match against MITRE IDs, related artifact names, and sources

**Bookmarking / case notes**
- New `src/useBookmarks.js` — localStorage-backed hook to star/unstar any artifact
- New "Bookmarked Artifacts" view accessible from the sidebar, with a live count badge and a "Clear all" action
- Star toggle added to every artifact card (works in category view, search results, and bookmarks view)
- Typing a search query automatically exits the Bookmarks view

**Artifact card UI**
- New MITRE ATT&CK pill row — click any technique ID to open the official ATT&CK page in a new tab
- New "Quick Commands" block — each command has its own copy button
- New "Related Artifacts" and "Commonly Documented In" pill rows
- New "Typical Retention / Volatility" note, shown in italic for visual distinction
- `formatArtifact()` (used by the copy button) now includes all enriched fields when present

---

## v1.2 — Scalability, Theming, Copy, Ads, SEO

**Content architecture**
- Split the single monolithic `database.js` into per-platform files: `src/artifacts/windows.js`, `linux.js`, `macos.js`, `android.js`
- Added `src/artifacts/_template.js` — a documented starting point for adding new platforms (iOS, IoT, ChromeOS, etc.) without touching existing code
- Added helper functions `countArtifacts()`, `countCategories()`, `searchArtifacts()` in `database.js`

**Dark / light mode**
- New `src/ThemeContext.jsx` — theme provider with sun/moon toggle in the title bar
- Preference persisted in `localStorage`; defaults to system preference on first visit
- All components and styles converted from hardcoded colors to theme tokens

**Copy to clipboard**
- New `src/CopyButton.jsx` — one-tap copy on every artifact card
- Copies a clean, formatted plain-text summary (artifact, platform, locations, tools, evidence value)
- Visual confirmation (checkmark, 1.5s) on copy

**Ad space (infrastructure only, no network wired in)**
- New `src/AdWidget.jsx` — a small, dismissible, clearly-labeled "Sponsored" widget styled like a macOS Today View card
- Appears in sidebar (desktop) and below artifact list (mobile)
- Documented in-file with steps to wire in a real ad network later (Ethical Ads, Carbon Ads, AdSense, etc.)

**SEO**
- Rewrote `index.html`: proper title/description, Open Graph tags, Twitter card tags, JSON-LD structured data, canonical URL
- Added `<noscript>` fallback with real indexable text for crawlers/no-JS users
- Added `public/robots.txt` and `public/sitemap.xml`
- Generated `public/og-image.png` — 1200×630 social share preview image matching app branding

**Legal / policy**
- Added copyright line to Policy page footer: `© {year} atifquamar. All rights reserved.`

---

## v1.1 — Mobile Responsiveness

*(Source not retained — summary based on conversation history)*

- Added hamburger-menu sidebar that becomes a slide-out drawer below 860px width
- Search bar collapses to an icon on mobile, expands on tap
- Window goes edge-to-edge (no floating margin) on small screens
- Fixed iOS auto-zoom-on-input-focus bug (inputs set to 16px on mobile)
- Traffic-light dots and artifact-count badge hidden on narrow screens to prevent title bar overflow
- Same responsive treatment applied to the Policy page

---

## v1.0 — Initial Release

*(Source not retained — summary based on conversation history)*

- Initial macOS-themed single-page React app (Vite + React 18)
- Custom logo: fingerprint under a magnifying glass, macOS system-blue gradient
- Sidebar navigation: OS picker (Windows/Linux/macOS/Android) → category list → artifact cards
- Global search (⌘K) across all platforms and categories
- 378 artifacts across 58 categories covering authentication, file activity, browsing,
  registry, network, process execution, USB, persistence, memory forensics, cloud/collaboration
  apps, mobile app forensics, and more
- Policy/About page: AI-generated content disclaimer, no-warranty statement, intended-use
  and prohibited-use/liability sections
- macOS desktop chrome: menu bar with live clock, traffic-light window controls,
  translucent blurred sidebar, San Francisco system font

---

## How to keep future versions from being lost

1. Create a GitHub repository (see README "Deploying" section)
2. Every time you receive updated files from me, replace the files in your local
   folder and run:
   ```bash
   git add .
   git commit -m "Describe what changed"
   git push
   ```
3. Each commit becomes a permanent, restorable snapshot — visible under the
   "Commits" tab on GitHub, with the ability to view or revert to any prior version
