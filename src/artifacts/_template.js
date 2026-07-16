// TEMPLATE — copy this file to add a brand-new platform (e.g. iOS, IoT, ChromeOS)
//
// STEPS TO ADD A NEW PLATFORM:
//   1. Duplicate this file, rename it (e.g. artifacts/ios.js)
//   2. Rename the exported constant (e.g. export const iOS = { ... })
//   3. Fill in real categories and artifacts below
//   4. Open src/database.js and:
//      a) import your new file:      import { iOS } from "./artifacts/ios.js";
//      b) add it to the DB object:   export const DB = { ..., iOS };
//   5. Open src/App.jsx and add an entry to OS_META so it gets an icon/colour, e.g.:
//      iOS: { symbol: "ios", tint: "#5AC8FA" }
//      (then add a matching case in the OSGlyph function for the icon shape)
//
// That's it — the sidebar, search, and category views all read from DB automatically.
// You never need to touch the UI logic itself to add platforms or artifacts.

export const PlatformTemplate = {
  "Example Category": [
    {
      artifact: "Example Artifact Name",
      locations: ["/path/to/artifact/file", "C:\\alternate\\path\\if\\relevant"],
      tools: ["Tool One", "Tool Two", "Tool Three"],
      reveals: "Plain-English description of what this artifact proves or reveals during an investigation.",
      eventIds: [], // optional — only used for Windows Event Log style artifacts, leave empty array otherwise

      // ---- OPTIONAL FIELDS — omit any of these entirely if not applicable ----

      mitre: ["T1547.001", "T1053.005"], // MITRE ATT&CK technique IDs this artifact helps detect/investigate

      commands: [
        // Exact copy-pasteable commands to pull/inspect this artifact quickly
        { label: "Query with reg.exe", cmd: 'reg query "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"' },
      ],

      related: ["Another Artifact Name In Same Or Different Category"], // artifact names investigators typically cross-reference with this one

      retention: "Persists until manually cleared or registry hive is rebuilt — no automatic rotation.", // how long this artifact typically survives before being overwritten/rotated

      sources: ["SANS FOR500", "Microsoft Learn — Windows Registry"], // where this is commonly documented, for credibility/further reading
    },
    // add more artifact objects here, comma-separated
  ],

  "Another Category": [
    {
      artifact: "Another Example",
      locations: ["/another/path"],
      tools: ["Some Tool"],
      reveals: "What this tells an investigator.",
      eventIds: [],
    },
  ],
};
