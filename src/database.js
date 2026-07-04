// Central artifact database — assembled from per-platform files in ./artifacts/
//
// To add a new platform (iOS, IoT, ChromeOS, etc.), see artifacts/_template.js
// To add/edit/remove artifacts within an existing platform, open the matching
// file below directly — each one is self-contained and documented.

import { Windows } from "./artifacts/windows.js";
import { Linux } from "./artifacts/linux.js";
import { macOS } from "./artifacts/macos.js";
import { Android } from "./artifacts/android.js";

export const DB = {
  Windows,
  Linux,
  macOS,
  Android,
};

// ---- Derived helpers (used across the app; no need to edit these) ----

export function countArtifacts(db = DB) {
  return Object.values(db).reduce(
    (sum, os) => sum + Object.values(os).reduce((s, arr) => s + arr.length, 0),
    0
  );
}

export function countCategories(db = DB) {
  return Object.values(db).reduce((sum, os) => sum + Object.keys(os).length, 0);
}

export function searchArtifacts(query, db = DB) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const out = [];
  for (const os of Object.keys(db)) {
    for (const cat of Object.keys(db[os])) {
      for (const a of db[os][cat]) {
        const hit =
          a.artifact.toLowerCase().includes(q) ||
          a.reveals.toLowerCase().includes(q) ||
          a.tools.some((t) => t.toLowerCase().includes(q)) ||
          a.locations.some((l) => l.toLowerCase().includes(q)) ||
          (a.eventIds && a.eventIds.some((e) => e.includes(q)));
        if (hit) out.push({ ...a, _os: os, _cat: cat });
      }
    }
  }
  return out;
}
