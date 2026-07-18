# Changelog

All notable changes to the Forensic Artifact Reference project, by version.

> **Note:** This changelog was written retroactively to document project history.
> Source code for v1.0 and v1.1 was overwritten during development and is not
> recoverable unless you separately saved those zip downloads. Starting with
> this version, keep this project under Git version control (see README) so
> every future change is permanently restorable via commit history.

---

## v1.7 — PDF Theme-Awareness, Correct Repo URL, Visible Back Button (current)

**PDF export fixes**
- `PrintExport.jsx` was hardcoded to a fixed light-mode palette (`#111` text, `#ccc` borders, etc.) regardless of the active on-screen theme — now accepts a `theme` prop and builds its styles dynamically from the same theme object the rest of the app uses, so a dark-mode export prints with dark backgrounds and light text, and light mode exports light
- Removed a `html, body { background: #fff !important; }` override in the print CSS that fought against theme-aware backgrounds
- Added `print-color-adjust: exact` (plus vendor-prefixed variants) to the print CSS, which forces browsers to render background/accent colors in the print output even when the user hasn't manually enabled "Background graphics" in their print dialog — the likely cause of the reported "black and white page" symptom
- Added a sane default `@page` margin for print output
- **Fixed a separate, more serious bug: exporting from the Triage Checklist Builder printed the wrong (or empty) artifacts.** `TriageBuilder` tracked its own `incidentType`/`selectedOS`/resolved-artifacts state entirely internally and never reported it to the parent app, so the shared "Export PDF" button — which prints whatever the top-level `<PrintExport>` currently holds — fell through to whatever OS/category had been selected *before* entering Triage mode, or printed nothing if none had been. Fixed by adding an `onPrintDataChange` callback that `TriageBuilder` calls whenever its incident type, platform, or artifact list changes, so the parent's print data always reflects the actual checklist on screen.

**Suggest an edit — corrected link + visibility**
- Fixed the GitHub issue link, which was pointing at a placeholder repo and returning 404 — `GITHUB_REPO_URL` now correctly points to `https://github.com/theatifquamar/forensic-artifact-reference-v2.0`
- Redesigned the link from a barely-visible muted-gray text line into a clearly visible blue pill button (matching the app's system-blue accent), with a top border separating it from the artifact's other fields

**Triage Checklist Builder — back button**
- Both back buttons (incident-type screen and platform screen) previously rendered as a bare, low-contrast chevron icon with no label or button chrome — one of them even pointed in the wrong direction (right instead of left)
- Both now render as a proper pill-shaped button with background, a correctly left-pointing chevron, and a "Back" label

---

## v1.6 — PDF Export, Triage Checklists, Recently Viewed, Keyboard Nav, Suggest an Edit

**PDF / print export**
- New `src/PrintExport.jsx` — a hidden, print-only document view revealed via `@media print`, so clicking "Export PDF" (browser's native print-to-PDF) produces a clean report instead of a screenshot of the app chrome
- "Export PDF" button available on Category, Search, Bookmarks, and Triage Checklist views

**Triage Checklist Builder**
- New `src/TriageBuilder.jsx` + `src/triageChecklists.js` — pick an incident type (Ransomware, Insider Threat/Data Exfiltration, Unauthorized Remote Access/Lateral Movement, Malware Execution/Endpoint Compromise, Mobile Device Investigation) and a platform, get a prioritized, checkable artifact pull order
- Checklists reference real artifact names resolved live against the actual database — verified zero mismatches against all 378 artifacts
- New sidebar entry "Triage Checklist"

**Recently Viewed**
- New `src/useRecentlyViewed.js` — tracks the last 12 artifacts expanded this session, localStorage-backed
- New sidebar entry "Recently Viewed" with a live count badge
- Wired into every view (Category, Search, Bookmarks, Triage) so any artifact expansion anywhere gets recorded

**Keyboard navigation**
- ↑/↓ arrow keys move the expanded artifact up/down through whichever list is currently on screen
- Enter/collapsing behavior unified across all views via a single index-based `expanded` state scheme
- Esc collapses the currently expanded card
- ⌘K / Ctrl+K still jumps to search (merged into the same handler, no behavior change)
- Small on-screen hint added to the desktop status bar (hidden on mobile, since there's no keyboard there)

**Suggest an edit**
- Every artifact card now has a small "Suggest an edit to this artifact" link at the bottom of its expanded view
- Opens a pre-filled GitHub issue (title + body auto-populated with the artifact name, platform, and category) via a new `GITHUB_REPO_URL` constant at the top of `src/App.jsx` — **update this to your actual repo URL before deploying**

**Housekeeping**
- Removed a stale README reference to the already-deleted `AdWidget.jsx`

---

## v1.5 — Removed Commercial Course References, Wider Desktop Window

**Content changes — safer trademark posture**
- Removed all "SANS FOR500/508/518/526/585" course-code citations from every artifact's `sources` field (was present on all 378 artifacts) — these referenced a specific paid commercial training provider, which was more legal exposure than a source citation needed to carry
- Removed two "Mandiant [topic] research" source citations (Shimcache, timestomping) and replaced with vendor-neutral citations (Eric Zimmermann's tools documentation, MITRE ATT&CK)
- Artifacts that had only a SANS citation now simply have an empty `sources` array — the UI already hides the "Commonly Documented In" block when empty, so no broken or empty-looking fields
- Updated `src/artifacts/_template.js` and `README.md` documentation examples to no longer suggest SANS as an example source

**Policy page — simplified trademark section**
- Rewrote "Trademarks & Third-Party Names" to focus only on the legitimate mention of forensic tool names (e.g., a tool used to parse a given artifact) rather than naming specific companies, training providers, or course codes
- Removed explicit callouts of SANS Institute, Cellebrite, Magnet Forensics, and Microsoft by name from the disclaimer text itself — kept the disclaimer generic and evergreen so it doesn't need updating as tool references change

**Desktop layout**
- Widened the desktop window from `maxWidth: 1180 / maxHeight: 820` to `maxWidth: 1680 / maxHeight: 1100`, and reduced the surrounding padding — the app now fills most of a typical desktop viewport instead of floating with large empty margins on all sides. Mobile drawer/full-viewport behavior is unaffected.

---

## v1.4 — Full 378-Artifact Enrichment, Star Color Fix

**Bug fixes**
- Fixed `ReferenceError: isBookmarked is not defined` crash that made the entire app render blank — `CategoryView`'s function signature was missing `isBookmarked`/`toggleBookmark` in its destructured props despite the parent component correctly passing them in
- Fixed bookmark star icon not changing color when toggled — explicitly pass `color` to the icon instead of relying on CSS `currentColor` inheritance through the button wrapper

**Full artifact enrichment (100% coverage)**
- All 378 artifacts across all 4 platforms (Windows 146, Linux 84, macOS 76, Android 72) now have complete MITRE ATT&CK mappings, quick commands (where a meaningful one exists), related-artifact cross-references, retention/volatility notes, and source citations
- Previously only 12 flagship artifacts had this enrichment as a proof-of-concept; this release completes the remaining 366
- Recovered one artifact ("Sysmon Event Log" under Windows → Process Execution) that was accidentally dropped during a prior enrichment pass — verified against the last known-good backup and restored with full enrichment

---

## v1.3 — Investigator Enrichment Fields, Bookmarking, Ad Removal

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
