import { useState, useMemo, useEffect, useRef } from "react";
import { DB, countArtifacts, searchArtifacts } from "./database.js";
import Logo from "./Logo.jsx";
import PolicyPage from "./PolicyPage.jsx";
import CopyButton, { formatArtifact } from "./CopyButton.jsx";
import { ThemeProvider, useTheme, OS_TINTS } from "./ThemeContext.jsx";
import { useBookmarks } from "./useBookmarks.js";
import { useRecentlyViewed } from "./useRecentlyViewed.js";
import PrintExport from "./PrintExport.jsx";
import TriageBuilder from "./TriageBuilder.jsx";

// EDIT THIS to point at your actual GitHub repo — used by the "Suggest an edit" link on every artifact card.
const GITHUB_REPO_URL = "https://github.com/theatifquamar/forensic-artifact-reference-v2.0";

const CAT_SYMBOL = {
  "Authentication": "key", "File Activity": "folder", "Browsing Activity": "globe",
  "Registry": "grid", "Network Activity": "wifi", "Process Execution": "gear",
  "USB & Removable Media": "usb", "Persistence Mechanisms": "pin",
  "Memory Forensics": "brain", "Email Artifacts": "mail", "Cloud & Sync Artifacts": "cloud",
  "Anti-Forensics Indicators": "shield", "Call & SMS Records": "phone",
  "App Activity": "apps", "Location Data": "pin-loc", "Device & System Info": "info",
  "Cloud & Collaboration Apps": "cloud", "Virtualization & Containers": "cube",
  "Windows 11 / Modern Artifacts": "sparkle", "Print & Peripheral Artifacts": "printer",
  "Application-Specific Forensics": "app", "Windows Server / Enterprise": "server",
  "Containers & Virtualization": "cube", "Package Management & Software": "box",
  "Web Server & Application Logs": "server", "Mail Server Artifacts": "mail",
  "System Configuration & Baseline": "sliders", "Log Management & SIEM Forwarding": "list",
  "Collaboration & Communication Apps": "bubble", "Virtualization & Development": "cube",
  "System Diagnostics & Configuration": "sliders", "Remote Access & Screen Sharing": "monitor",
  "Social Media Apps": "bubble", "Financial & Payment Apps": "card",
  "Productivity & Cloud Apps": "cloud", "System & Security Artifacts": "shield",
  "Health & Fitness Apps": "heart", "Dating & Ephemeral Apps": "bubble",
};

function Sym({ name, size = 15, color = "currentColor" }) {
  const s = { width: size, height: size, display: "block" };
  const common = { fill: "none", stroke: color, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "key": return <svg style={s} viewBox="0 0 24 24"><circle cx="8" cy="15" r="4" {...common}/><path d="M11 12 L20 3 M16 7 L19 4 M18 9 L21 6" {...common}/></svg>;
    case "folder": return <svg style={s} viewBox="0 0 24 24"><path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" {...common}/></svg>;
    case "globe": return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...common}/><path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z" {...common}/></svg>;
    case "grid": return <svg style={s} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.2" {...common}/><rect x="14" y="3" width="7" height="7" rx="1.2" {...common}/><rect x="3" y="14" width="7" height="7" rx="1.2" {...common}/><rect x="14" y="14" width="7" height="7" rx="1.2" {...common}/></svg>;
    case "wifi": return <svg style={s} viewBox="0 0 24 24"><path d="M2 8.5c5.5-5 14.5-5 20 0M5.5 12.5c3.6-3 9.4-3 13 0M9 16.5c1.8-1.5 4.2-1.5 6 0" {...common}/><circle cx="12" cy="20" r="1.1" fill={color} stroke="none"/></svg>;
    case "gear": return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2" {...common}/><path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.55 1.55M7.15 16.85 5.6 18.4M18.4 18.4l-1.55-1.55M7.15 7.15 5.6 5.6" {...common}/></svg>;
    case "usb": return <svg style={s} viewBox="0 0 24 24"><path d="M12 3v9M9 6l3-3 3 3M7 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm10 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM9 16l3-3 3 3" {...common}/></svg>;
    case "pin": return <svg style={s} viewBox="0 0 24 24"><path d="M12 3l3 3-6 6-3-3 6-6ZM9 12l-5 8 8-5" {...common}/></svg>;
    case "brain": return <svg style={s} viewBox="0 0 24 24"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3M9 4v16M15 4v16" {...common}/></svg>;
    case "mail": return <svg style={s} viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" {...common}/><path d="m4 7 8 6 8-6" {...common}/></svg>;
    case "cloud": return <svg style={s} viewBox="0 0 24 24"><path d="M7 18a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 17.2 8.1 4 4 0 0 1 17 18H7Z" {...common}/></svg>;
    case "shield": return <svg style={s} viewBox="0 0 24 24"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" {...common}/><path d="m9 12 2 2 4-4" {...common}/></svg>;
    case "phone": return <svg style={s} viewBox="0 0 24 24"><path d="M6 3h4l1.5 4.5L9 9.5a11 11 0 0 0 5.5 5.5l2-2.5L21 14v4a2 2 0 0 1-2 2C10.5 20 4 13.5 4 5a2 2 0 0 1 2-2Z" {...common}/></svg>;
    case "apps": return <svg style={s} viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="2" {...common}/><rect x="13" y="3" width="8" height="8" rx="2" {...common}/><rect x="3" y="13" width="8" height="8" rx="2" {...common}/><rect x="13" y="13" width="8" height="8" rx="2" {...common}/></svg>;
    case "pin-loc": return <svg style={s} viewBox="0 0 24 24"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" {...common}/><circle cx="12" cy="9" r="2.3" {...common}/></svg>;
    case "info": return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...common}/><path d="M12 11v6M12 7.5v.01" {...common}/></svg>;
    case "cube": return <svg style={s} viewBox="0 0 24 24"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z" {...common}/><path d="M4 7.5 12 12l8-4.5M12 12v9" {...common}/></svg>;
    case "sparkle": return <svg style={s} viewBox="0 0 24 24"><path d="M12 3 13.8 9.2 20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Z" {...common}/></svg>;
    case "printer": return <svg style={s} viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M6 14h12v7H6v-7Z" {...common}/></svg>;
    case "app": return <svg style={s} viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" {...common}/></svg>;
    case "server": return <svg style={s} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="6" rx="1.5" {...common}/><rect x="3" y="14" width="18" height="6" rx="1.5" {...common}/><circle cx="7" cy="7" r=".8" fill={color} stroke="none"/><circle cx="7" cy="17" r=".8" fill={color} stroke="none"/></svg>;
    case "box": return <svg style={s} viewBox="0 0 24 24"><path d="M3 8l9-5 9 5-9 5-9-5Zm0 0v8l9 5m0-13v13m9-13v8l-9 5" {...common}/></svg>;
    case "sliders": return <svg style={s} viewBox="0 0 24 24"><path d="M5 5v6M5 15v4M12 5v3M12 12v7M19 5v10M19 19v0" {...common}/><circle cx="5" cy="13" r="2" {...common}/><circle cx="12" cy="10" r="2" {...common}/><circle cx="19" cy="17" r="2" {...common}/></svg>;
    case "list": return <svg style={s} viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" {...common}/></svg>;
    case "bubble": return <svg style={s} viewBox="0 0 24 24"><path d="M21 12a8 8 0 1 1-3.6-6.7L21 4l-1 4.3A7.96 7.96 0 0 1 21 12Z" {...common}/></svg>;
    case "monitor": return <svg style={s} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="1.5" {...common}/><path d="M8 20h8M12 16v4" {...common}/></svg>;
    case "card": return <svg style={s} viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" {...common}/><path d="M3 10h18M7 15h4" {...common}/></svg>;
    case "heart": return <svg style={s} viewBox="0 0 24 24"><path d="M12 20s-7-4.5-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.5-9.3 9-9.3 9Z" {...common}/></svg>;
    case "search": return <svg style={s} viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" {...common}/><path d="m20 20-3.5-3.5" {...common}/></svg>;
    case "chevron": return <svg style={s} viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" {...common}/></svg>;
    case "close": return <svg style={s} viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" {...common}/></svg>;
    case "doc": return <svg style={s} viewBox="0 0 24 24"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" {...common}/><path d="M14 3v5h5" {...common}/></svg>;
    case "menu": return <svg style={s} viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" {...common}/></svg>;
    case "sun": return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2" {...common}/><path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" {...common}/></svg>;
    case "moon": return <svg style={s} viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" {...common}/></svg>;
    case "print": return <svg style={s} viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M6 14h12v7H6v-7Z" {...common}/></svg>;
    case "checklist": return <svg style={s} viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11" {...common}/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2" {...common}/></svg>;
    case "check": return <svg style={s} viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" {...common}/></svg>;
    case "star": return <svg style={s} viewBox="0 0 24 24" fill={color === "none" ? "none" : "currentColor"} stroke={color} strokeWidth="1.4"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5Z" strokeLinejoin="round"/></svg>;
    case "star-outline": return <svg style={s} viewBox="0 0 24 24"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5Z" {...common} strokeLinejoin="round"/></svg>;
    case "terminal": return <svg style={s} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" {...common}/><path d="m7 9 3 3-3 3M13 15h4" {...common}/></svg>;
    case "link": return <svg style={s} viewBox="0 0 24 24"><path d="M9 15 15 9M10 6l1.2-1.2a4 4 0 0 1 5.6 5.6L15.5 11.6M14 18l-1.2 1.2a4 4 0 0 1-5.6-5.6L8.5 12.4" {...common}/></svg>;
    case "book": return <svg style={s} viewBox="0 0 24 24"><path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" {...common}/><path d="M5 4a3 3 0 0 0-1 2.2V17a3 3 0 0 0 3 3" {...common}/></svg>;
    case "clock": return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...common}/><path d="M12 7v5l3.5 2" {...common}/></svg>;
    case "flag": return <svg style={s} viewBox="0 0 24 24"><path d="M5 3v18M5 4h11l-2.5 3.5L16 11H5" {...common}/></svg>;
    case "target": return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" {...common}/><circle cx="12" cy="12" r="4" {...common}/><circle cx="12" cy="12" r=".6" fill={color} stroke="none"/></svg>;
    case "bookmark-list": return <svg style={s} viewBox="0 0 24 24"><path d="M6 3h9a2 2 0 0 1 2 2v16l-6.5-4L4 21V5a2 2 0 0 1 2-2Z" {...common}/></svg>;
    default: return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" fill={color} stroke="none"/></svg>;
  }
}

function OSGlyph({ os, size = 17, color }) {
  const s = { width: size, height: size, display: "block" };
  const common = { fill: "none", stroke: color, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  if (os === "Windows") return <svg style={s} viewBox="0 0 24 24"><path d="M3 5.5 11 4.3V11H3V5.5ZM12 4.1 21 3v8H12V4.1ZM3 12h8v6.5L3 17.3V12Zm9 0h9v8l-9-1.3V12Z" {...common}/></svg>;
  if (os === "Linux") return <svg style={s} viewBox="0 0 24 24"><ellipse cx="12" cy="8" rx="4" ry="5" {...common}/><path d="M8.5 12c-1.5 2-2.5 5-2 8h11c.5-3-.5-6-2-8M9 6.5h.01M15 6.5h.01" {...common}/></svg>;
  if (os === "macOS") return <svg style={s} viewBox="0 0 24 24"><path d="M16.5 3c.2 1.3-.3 2.6-1.1 3.5-.8.9-2 1.6-3.2 1.5-.2-1.3.4-2.6 1.1-3.5C14.1 3.6 15.4 3 16.5 3ZM12 8.5c1 0 2.7-1.2 4.8-1.2 2.1 0 3.5 1.1 4.5 2.7-.1.1-2.7 1.6-2.7 4.6 0 3.4 3 4.7 3 4.7-.1.3-.5 1.7-1.5 3.2-.9 1.3-1.9 2.7-3.4 2.7-1.4 0-1.9-.9-3.5-.9-1.6 0-2.2.9-3.5.9-1.4 0-2.5-1.5-3.4-2.8C4.5 19.6 3 16.4 3 13.3c0-4.8 3.1-7.3 6.1-7.3 1.5 0 2.8 1 3.6 1 .7 0 2.3-1.2 4-1" {...common}/></svg>;
  if (os === "Android") return <svg style={s} viewBox="0 0 24 24"><path d="M7 9.5v6M17 9.5v6M8 8h8v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8Zm0 0 -2-3M16 8l2-3M10 4l.6 1M13.4 4l-.6 1" {...common}/></svg>;
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

function AppInner() {
  const { theme, mode, toggle } = useTheme();
  const ST = useMemo(() => buildStyles(theme), [theme]);

  const [route, setRoute] = useState("app"); // "app" | "policy"
  const [selectedOS, setSelectedOS] = useState("Windows");
  const [selectedCat, setSelectedCat] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [time, setTime] = useState(new Date());
  const [navOpen, setNavOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [viewingBookmarks, setViewingBookmarks] = useState(false);
  const [viewingTriage, setViewingTriage] = useState(false);
  const [viewingRecent, setViewingRecent] = useState(false);
  const [triagePrintData, setTriagePrintData] = useState(null);
  const searchRef = useRef(null);
  const { bookmarks, isBookmarked, toggleBookmark, clearAll } = useBookmarks();
  const { recent, recordView, clearAll: clearRecent } = useRecentlyViewed();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const categories = selectedOS ? Object.keys(DB[selectedOS]) : [];
  const artifacts = (selectedOS && selectedCat) ? (DB[selectedOS][selectedCat] || []) : [];

  const totalArtifacts = useMemo(() => countArtifacts(), []);
  const searchResults = useMemo(() => searchArtifacts(search), [search]);

  const isSearching = search.trim().length > 0;

  // The list currently on screen, plus the prefix its `expanded` keys use — needed so
  // arrow-key navigation and Enter-to-expand work the same way regardless of which view
  // (category, search, bookmarks, recent) is active. TriageBuilder manages its own
  // internal expand state and is intentionally excluded from this global handler.
  const activeList = viewingRecent ? recent.map(r => r.artifact)
    : viewingBookmarks ? bookmarks.map(b => b.artifact)
    : isSearching ? searchResults
    : artifacts;
  const activePrefix = viewingRecent ? "r" : viewingBookmarks ? "b" : isSearching ? "s" : "";

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      const tag = document.activeElement?.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA";
      if (viewingTriage || activeList.length === 0) return;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (isTyping && document.activeElement !== searchRef.current) return;
        e.preventDefault();
        const currentIdx = expanded !== null && String(expanded).startsWith(activePrefix)
          ? parseInt(String(expanded).replace(activePrefix, ""), 10)
          : -1;
        const delta = e.key === "ArrowDown" ? 1 : -1;
        let nextIdx = currentIdx === -1 ? (delta === 1 ? 0 : activeList.length - 1) : currentIdx + delta;
        nextIdx = Math.max(0, Math.min(activeList.length - 1, nextIdx));
        setExpanded(activePrefix ? `${activePrefix}${nextIdx}` : nextIdx);
        if (document.activeElement === searchRef.current) searchRef.current.blur();
      } else if (e.key === "Escape" && expanded !== null) {
        setExpanded(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [expanded, activeList, activePrefix, viewingTriage]);

  const handleOS = (os) => { setSelectedOS(os); setSelectedCat(Object.keys(DB[os])[0]); setExpanded(null); setNavOpen(false); setViewingBookmarks(false); setViewingTriage(false); setViewingRecent(false); setTriagePrintData(null); setSearch(""); };
  const handleCat = (cat) => { setSelectedCat(cat); setExpanded(null); setNavOpen(false); setViewingBookmarks(false); setViewingTriage(false); setViewingRecent(false); setTriagePrintData(null); };

  useEffect(() => {
    if (selectedOS && !selectedCat) setSelectedCat(Object.keys(DB[selectedOS])[0]);
  }, [selectedOS]);

  useEffect(() => {
    if (search.trim().length > 0 && viewingBookmarks) setViewingBookmarks(false);
    if (search.trim().length > 0 && viewingTriage) { setViewingTriage(false); setTriagePrintData(null); }
    if (search.trim().length > 0 && viewingRecent) setViewingRecent(false);
  }, [search]);

  const dateStr = time.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const timeStr = time.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  if (route === "policy") {
    return <PolicyPage onBack={() => setRoute("app")} time={{ dateStr, timeStr }} />;
  }

  const printData = (viewingTriage && triagePrintData)
    ? triagePrintData
    : viewingRecent
    ? { title: "Recently Viewed", subtitle: `Last ${recent.length} artifact${recent.length !== 1 ? "s" : ""} opened this session`, artifacts: recent.map(r => r.artifact) }
    : viewingBookmarks
    ? { title: "Bookmarked Artifacts", subtitle: `${bookmarks.length} saved for this case`, artifacts: bookmarks.map(b => b.artifact) }
    : isSearching
    ? { title: "Search Results", subtitle: `${searchResults.length} match${searchResults.length !== 1 ? "es" : ""} for "${search}"`, artifacts: searchResults }
    : { title: selectedCat || "", subtitle: selectedOS ? `${selectedOS} · ${artifacts.length} artifact${artifacts.length !== 1 ? "s" : ""}` : "", artifacts };

  return (
    <>
      <div style={ST.desktop}>
        <ResponsiveStyles />
        <MenuBar dateStr={dateStr} timeStr={timeStr} onPolicy={() => setRoute("policy")} ST={ST} />

      <div style={ST.windowWrap}>
        <div style={ST.window} className="fr-window">
          <TitleBar
            total={totalArtifacts}
            search={search}
            setSearch={setSearch}
            searchRef={searchRef}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
            mobileSearchOpen={mobileSearchOpen}
            setMobileSearchOpen={setMobileSearchOpen}
            ST={ST}
            mode={mode}
            toggle={toggle}
          />

          <div style={ST.body} className="fr-body">
            {navOpen && <div style={ST.navScrim} className="fr-scrim" onClick={() => setNavOpen(false)} />}
            <div className={"fr-sidebar" + (navOpen ? " fr-sidebar-open" : "")}>
              <Sidebar
                selectedOS={selectedOS}
                selectedCat={selectedCat}
                onOS={handleOS}
                onCat={handleCat}
                isSearching={isSearching}
                onPolicy={() => { setRoute("policy"); setNavOpen(false); }}
                ST={ST}
                theme={theme}
                bookmarkCount={bookmarks.length}
                viewingBookmarks={viewingBookmarks}
                onBookmarks={() => { setViewingBookmarks(true); setViewingTriage(false); setViewingRecent(false); setTriagePrintData(null); setSearch(""); setNavOpen(false); }}
                viewingTriage={viewingTriage}
                onTriage={() => { setViewingTriage(true); setViewingBookmarks(false); setViewingRecent(false); setSearch(""); setNavOpen(false); }}
                recentCount={recent.length}
                viewingRecent={viewingRecent}
                onRecent={() => { setViewingRecent(true); setViewingBookmarks(false); setViewingTriage(false); setTriagePrintData(null); setSearch(""); setNavOpen(false); }}
              />
            </div>

            <div style={ST.content} className="fr-content">
              {viewingTriage ? (
                <TriageBuilder
                  ST={ST}
                  theme={theme}
                  Sym={Sym}
                  ArtifactCard={ArtifactCard}
                  isBookmarked={isBookmarked}
                  toggleBookmark={toggleBookmark}
                  ExportButton={ExportButton}
                  onRecordView={recordView}
                  onPrintDataChange={setTriagePrintData}
                />
              ) : viewingRecent ? (
                <RecentView
                  recent={recent}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  ST={ST}
                  theme={theme}
                  isBookmarked={isBookmarked}
                  toggleBookmark={toggleBookmark}
                  onRecordView={recordView}
                  clearAll={clearRecent}
                />
              ) : viewingBookmarks ? (
                <BookmarksView
                  bookmarks={bookmarks}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  ST={ST}
                  theme={theme}
                  isBookmarked={isBookmarked}
                  toggleBookmark={toggleBookmark}
                  clearAll={clearAll}
                  onRecordView={recordView}
                />
              ) : isSearching ? (
                <SearchView
                  results={searchResults}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  query={search}
                  ST={ST}
                  theme={theme}
                  isBookmarked={isBookmarked}
                  toggleBookmark={toggleBookmark}
                  onRecordView={recordView}
                />
              ) : (
                <CategoryView
                  os={selectedOS}
                  cat={selectedCat}
                  artifacts={artifacts}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  ST={ST}
                  theme={theme}
                  isBookmarked={isBookmarked}
                  toggleBookmark={toggleBookmark}
                  onRecordView={recordView}
                />
              )}
            </div>
          </div>

          <StatusBar total={totalArtifacts} selectedOS={selectedOS} selectedCat={selectedCat} isSearching={isSearching} resultCount={searchResults.length} ST={ST} viewingBookmarks={viewingBookmarks} bookmarkCount={bookmarks.length} />
        </div>
      </div>
      </div>

      <PrintExport title={printData.title} subtitle={printData.subtitle} artifacts={printData.artifacts} theme={theme} />
    </>
  );
}

function ResponsiveStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      html, body { overscroll-behavior-y: none; }

      .fr-scrim { display: none; }
      .fr-sidebar { display: flex; flex-shrink: 0; }

      @media (max-width: 860px) {
        .fr-window {
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          border-radius: 0 !important;
        }
        .fr-body { position: relative; overflow: hidden; }
        .fr-sidebar {
          position: absolute !important;
          top: 0; left: 0; bottom: 0;
          width: 78vw !important;
          max-width: 300px !important;
          z-index: 20;
          transform: translateX(-100%);
          transition: transform 0.24s ease;
          box-shadow: 8px 0 30px rgba(0,0,0,0.5);
        }
        .fr-sidebar-open { transform: translateX(0); }
        .fr-scrim {
          display: block; position: absolute; inset: 0;
          background: rgba(0,0,0,0.45); z-index: 15;
        }
        .fr-content { width: 100%; }
        .fr-hide-mobile { display: none !important; }
        .fr-show-mobile { display: flex !important; }
      }

      @media (min-width: 861px) {
        .fr-show-mobile { display: none !important; }
      }

      @media (max-width: 520px) {
        .fr-view-inner { padding: 16px 14px 32px !important; }
        .fr-title-center { min-width: 0; }
        .fr-title-center span:nth-child(2) {
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100px;
        }
      }

      @media (max-width: 400px) {
        .fr-title-center span:nth-child(2) { display: none; }
      }

      input, textarea, select, button { font-size: 16px; }
      @media (min-width: 521px) {
        input, textarea, select, button { font-size: revert; }
      }

      .fr-print-root { display: none; }

      @media print {
        #root > div:not(.fr-print-root) { display: none !important; }
        .fr-print-root {
          display: block !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color-adjust: exact;
        }
        @page { margin: 14mm 12mm; }
      }
    `}</style>
  );
}

function ThemeToggle({ mode, toggle, size = 15, style = {} }) {
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark/light mode"
      title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 7, cursor: "pointer",
        width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        color: mode === "dark" ? "#FFD60A" : "#5E5CE6",
        ...style,
      }}
    >
      <Sym name={mode === "dark" ? "sun" : "moon"} size={size} />
    </button>
  );
}

function MenuBar({ dateStr, timeStr, onPolicy, ST }) {
  return (
    <div style={ST.menuBar}>
      <div style={ST.menuLeft}>
        <span style={ST.appleMark}></span>
        <span style={ST.menuBold}>Forensic Reference</span>
        <span style={ST.menuItem} className="fr-hide-mobile">File</span>
        <span style={ST.menuItem} className="fr-hide-mobile">Edit</span>
        <span style={ST.menuItem} className="fr-hide-mobile">View</span>
        <span style={ST.menuItem} onClick={onPolicy}>Policy</span>
      </div>
      <div style={ST.menuRight}>
        <span style={ST.menuItem} className="fr-hide-mobile">{dateStr}</span>
        <span style={ST.menuItem}>{timeStr}</span>
      </div>
    </div>
  );
}

function TitleBar({ total, search, setSearch, searchRef, navOpen, setNavOpen, mobileSearchOpen, setMobileSearchOpen, ST, mode, toggle }) {
  return (
    <div style={ST.titleBar}>
      <div style={ST.traffic} className="fr-hide-mobile">
        <span style={{ ...ST.dot, background: "#FF5F57" }} />
        <span style={{ ...ST.dot, background: "#FEBC2E" }} />
        <span style={{ ...ST.dot, background: "#28C840" }} />
      </div>

      <button
        style={ST.hamburger}
        className="fr-show-mobile"
        onClick={() => setNavOpen(!navOpen)}
        aria-label="Toggle navigation"
      >
        <Sym name={navOpen ? "close" : "menu"} size={17} color={ST._iconColor} />
      </button>

      {!mobileSearchOpen && (
        <div style={ST.titleCenter} className="fr-title-center">
          <Logo size={18} />
          <span style={ST.titleText}>Forensic Artifact Reference</span>
          <span style={ST.titleBadge} className="fr-hide-mobile">{total}</span>
        </div>
      )}

      <div style={{ ...ST.titleSearchWrap, ...(mobileSearchOpen ? { flex: 1 } : {}) }} className={mobileSearchOpen ? "" : "fr-hide-mobile"}>
        <Sym name="search" size={13} color={ST._iconColorMuted} />
        <input
          ref={searchRef}
          style={ST.titleSearch}
          placeholder="Search artifacts  ⌘K"
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus={mobileSearchOpen}
        />
        {search && (
          <button style={ST.searchClear} onClick={() => setSearch("")}>
            <Sym name="close" size={11} color={ST._iconColorMuted} />
          </button>
        )}
      </div>

      <ThemeToggle mode={mode} toggle={toggle} />

      <button
        style={ST.mobileSearchBtn}
        className="fr-show-mobile"
        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
        aria-label="Toggle search"
      >
        <Sym name={mobileSearchOpen ? "close" : "search"} size={16} color={ST._iconColor} />
      </button>
    </div>
  );
}

function Sidebar({ selectedOS, selectedCat, onOS, onCat, isSearching, onPolicy, ST, theme, bookmarkCount, viewingBookmarks, onBookmarks, viewingTriage, onTriage, recentCount, viewingRecent, onRecent }) {
  const categories = selectedOS ? Object.keys(DB[selectedOS]) : [];
  return (
    <div style={ST.sidebar}>
      <div style={ST.sideGroupLabel}>Platforms</div>
      {Object.keys(DB).map(os => {
        const active = selectedOS === os && !isSearching && !viewingBookmarks && !viewingTriage && !viewingRecent;
        const count = Object.values(DB[os]).reduce((s, a) => s + a.length, 0);
        return (
          <button key={os} onClick={() => onOS(os)}
            style={{ ...ST.sideItem, ...(active ? ST.sideItemActive : {}) }}>
            <span style={{ ...ST.sideIconWrap, background: active ? "rgba(255,255,255,0.22)" : OS_TINTS[os] + "22" }}>
              <OSGlyph os={os} size={14} color={active ? "#fff" : OS_TINTS[os]} />
            </span>
            <span style={ST.sideLabel}>{os}</span>
            <span style={{ ...ST.sideCount, color: active ? "rgba(255,255,255,0.75)" : theme.textTertiary }}>{count}</span>
          </button>
        );
      })}

      <div style={{ ...ST.sideGroupLabel, marginTop: 18 }}>
        {selectedOS ? `${selectedOS} Categories` : "Categories"}
      </div>
      <div style={ST.sideScroll}>
        {categories.map(cat => {
          const active = selectedCat === cat && !isSearching && !viewingBookmarks && !viewingTriage && !viewingRecent;
          return (
            <button key={cat} onClick={() => onCat(cat)}
              style={{ ...ST.sideSubItem, ...(active ? ST.sideSubItemActive : {}) }}>
              <Sym name={CAT_SYMBOL[cat] || "app"} size={13} color={active ? "#fff" : theme.textTertiary} />
              <span style={ST.sideSubLabel}>{cat}</span>
              <span style={{ ...ST.sideCount, color: active ? "rgba(255,255,255,0.7)" : theme.textQuaternary, fontSize: 10.5 }}>
                {DB[selectedOS]?.[cat]?.length ?? ""}
              </span>
            </button>
          );
        })}
      </div>

      <div style={ST.sideFooter}>
        <button style={{ ...ST.sideFooterBtn, ...(viewingTriage ? { color: "#30D158", fontWeight: 700 } : {}) }} onClick={onTriage}>
          <Sym name="checklist" size={13} color={viewingTriage ? "#30D158" : theme.textTertiary} />
          <span style={{ flex: 1 }}>Triage Checklist</span>
        </button>
        <button style={{ ...ST.sideFooterBtn, ...(viewingRecent ? { color: "#5E5CE6", fontWeight: 700 } : {}) }} onClick={onRecent}>
          <Sym name="clock" size={13} color={viewingRecent ? "#5E5CE6" : theme.textTertiary} />
          <span style={{ flex: 1 }}>Recently Viewed</span>
          {recentCount > 0 && <span style={{ ...ST.bookmarkBadge, background: "#5E5CE622", color: "#5E5CE6" }}>{recentCount}</span>}
        </button>
        <button style={{ ...ST.sideFooterBtn, ...(viewingBookmarks ? { color: "#FF9F0A", fontWeight: 700 } : {}) }} onClick={onBookmarks}>
          <Sym name={viewingBookmarks ? "star" : "star-outline"} size={13} color={viewingBookmarks ? "#FF9F0A" : theme.textTertiary} />
          <span style={{ flex: 1 }}>Bookmarked Artifacts</span>
          {bookmarkCount > 0 && <span style={ST.bookmarkBadge}>{bookmarkCount}</span>}
        </button>
        <button style={ST.sideFooterBtn} onClick={onPolicy}>
          <Sym name="doc" size={13} color={theme.textTertiary} />
          <span>About &amp; Policy</span>
        </button>
      </div>
    </div>
  );
}

function ExportButton({ ST, theme }) {
  return (
    <button
      onClick={() => window.print()}
      style={{
        display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", flexShrink: 0,
        background: theme.pillBg, border: "none", borderRadius: 7, cursor: "pointer",
        padding: "6px 12px", fontSize: 12, fontWeight: 600, color: theme.textSecondary, fontFamily: "inherit",
      }}
      title="Export this view as a PDF (opens print dialog — choose 'Save as PDF')"
    >
      <Sym name="print" size={13} color={theme.textSecondary} />
      Export PDF
    </button>
  );
}

function CategoryView({ os, cat, artifacts, expanded, setExpanded, ST, theme, isBookmarked, toggleBookmark, onRecordView }) {
  if (!os || !cat) return <Empty text="Select a platform to begin." ST={ST} />;
  const tint = OS_TINTS[os];
  return (
    <div style={ST.viewInner} className="fr-view-inner">
      <div style={ST.viewHeader}>
        <span style={{ ...ST.viewIconWrap, background: tint + "1E" }}>
          <Sym name={CAT_SYMBOL[cat] || "app"} size={18} color={tint} />
        </span>
        <div>
          <div style={ST.viewTitle}>{cat}</div>
          <div style={ST.viewSub}>{os} · {artifacts.length} artifact{artifacts.length !== 1 ? "s" : ""}</div>
        </div>
      </div>
      <div style={ST.cardList}>
        {artifacts.map((a, i) => (
          <ArtifactCard key={i} artifact={a} tint={tint} ST={ST} os={os} cat={cat}
            expanded={expanded === i} onToggle={() => setExpanded(expanded === i ? null : i)}
            isBookmarked={isBookmarked} toggleBookmark={toggleBookmark} onRecordView={onRecordView} />
        ))}
      </div>
    </div>
  );
}

function SearchView({ results, expanded, setExpanded, query, ST, theme, isBookmarked, toggleBookmark, onRecordView }) {
  return (
    <div style={ST.viewInner} className="fr-view-inner">
      <div style={ST.viewHeader}>
        <span style={{ ...ST.viewIconWrap, background: "#0A84FF1E" }}>
          <Sym name="search" size={17} color="#0A84FF" />
        </span>
        <div>
          <div style={ST.viewTitle}>Search Results</div>
          <div style={ST.viewSub}>{results.length} match{results.length !== 1 ? "es" : ""} for "{query}"</div>
        </div>
      </div>
      {results.length === 0 ? (
        <Empty text="No artifacts found. Try a tool name, file path, event ID, or MITRE ATT&CK technique." ST={ST} />
      ) : (
        <div style={ST.cardList}>
          {results.map((a, i) => (
            <ArtifactCard key={i} artifact={a} tint={OS_TINTS[a._os]} ST={ST} os={a._os} cat={a._cat}
              badge={`${a._os} · ${a._cat}`}
              expanded={expanded === `s${i}`} onToggle={() => setExpanded(expanded === `s${i}` ? null : `s${i}`)}
              isBookmarked={isBookmarked} toggleBookmark={toggleBookmark} onRecordView={onRecordView} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookmarksView({ bookmarks, expanded, setExpanded, ST, theme, isBookmarked, toggleBookmark, clearAll, onRecordView }) {
  return (
    <div style={ST.viewInner} className="fr-view-inner">
      <div style={ST.viewHeader}>
        <span style={{ ...ST.viewIconWrap, background: "#FF9F0A1E" }}>
          <Sym name="star" size={17} color="#FF9F0A" />
        </span>
        <div style={{ flex: 1 }}>
          <div style={ST.viewTitle}>Bookmarked Artifacts</div>
          <div style={ST.viewSub}>{bookmarks.length} saved for this case</div>
        </div>
        {bookmarks.length > 0 && (
          <>
            <ExportButton ST={ST} theme={theme} />
            <button
              onClick={() => { if (confirm("Clear all bookmarks? This can't be undone.")) clearAll(); }}
              style={{ background: "none", border: "none", color: theme.textTertiary, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
            >
              Clear all
            </button>
          </>
        )}
      </div>
      {bookmarks.length === 0 ? (
        <Empty text={"No bookmarks yet.\nTap the star on any artifact card to save it here for quick reference during a case."} ST={ST} />
      ) : (
        <div style={ST.cardList}>
          {bookmarks
            .slice()
            .sort((a, b) => b.addedAt - a.addedAt)
            .map((b, i) => (
              <ArtifactCard
                key={b.key}
                artifact={b.artifact}
                tint={OS_TINTS[b.artifact._os] || "#0A84FF"}
                ST={ST}
                os={b.artifact._os}
                cat={b.artifact._cat}
                badge={`${b.artifact._os} · ${b.artifact._cat}`}
                expanded={expanded === `b${i}`}
                onToggle={() => setExpanded(expanded === `b${i}` ? null : `b${i}`)}
                isBookmarked={isBookmarked}
                toggleBookmark={toggleBookmark}
                onRecordView={onRecordView}
              />
            ))}
        </div>
      )}
    </div>
  );
}

function RecentView({ recent, expanded, setExpanded, ST, theme, isBookmarked, toggleBookmark, onRecordView, clearAll }) {
  return (
    <div style={ST.viewInner} className="fr-view-inner">
      <div style={ST.viewHeader}>
        <span style={{ ...ST.viewIconWrap, background: "#5E5CE61E" }}>
          <Sym name="clock" size={17} color="#5E5CE6" />
        </span>
        <div style={{ flex: 1 }}>
          <div style={ST.viewTitle}>Recently Viewed</div>
          <div style={ST.viewSub}>Last {recent.length} artifact{recent.length !== 1 ? "s" : ""} opened this session</div>
        </div>
        {recent.length > 0 && (
          <button
            onClick={() => { if (confirm("Clear recently viewed history?")) clearAll(); }}
            style={{ background: "none", border: "none", color: theme.textTertiary, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
          >
            Clear
          </button>
        )}
      </div>
      {recent.length === 0 ? (
        <Empty text={"Nothing viewed yet.\nArtifacts you expand will show up here for quick access."} ST={ST} />
      ) : (
        <div style={ST.cardList}>
          {recent.map((r, i) => (
            <ArtifactCard
              key={r.artifact.artifact + i}
              artifact={r.artifact}
              tint={OS_TINTS[r.artifact._os] || "#0A84FF"}
              ST={ST}
              os={r.artifact._os}
              cat={r.artifact._cat}
              badge={`${r.artifact._os} · ${r.artifact._cat}`}
              expanded={expanded === `r${i}`}
              onToggle={() => setExpanded(expanded === `r${i}` ? null : `r${i}`)}
              isBookmarked={isBookmarked}
              toggleBookmark={toggleBookmark}
              onRecordView={onRecordView}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ArtifactCard({ artifact, tint, badge, expanded, onToggle, ST, os, cat, isBookmarked, toggleBookmark, onRecordView }) {
  const bookmarked = isBookmarked ? isBookmarked(artifact, os, cat) : false;
  const handleToggle = () => {
    if (!expanded && onRecordView) onRecordView(artifact, os, cat);
    onToggle();
  };
  return (
    <div style={{ ...ST.card, ...(expanded ? { boxShadow: `0 0 0 1px ${tint}55, 0 8px 24px rgba(0,0,0,0.35)` } : {}) }}>
      <button style={ST.cardHead} onClick={handleToggle}>
        <div style={ST.cardHeadLeft}>
          {badge && <span style={ST.cardBadge}>{badge}</span>}
          <span style={{ ...ST.cardTitle, color: expanded ? tint : ST._text }}>{artifact.artifact}</span>
          {!expanded && <span style={ST.cardPreview}>{artifact.reveals.slice(0, 100)}{artifact.reveals.length > 100 ? "…" : ""}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          {toggleBookmark && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleBookmark(artifact, os, cat); }}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark this artifact"}
              title={bookmarked ? "Remove bookmark" : "Bookmark this artifact"}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "3px 4px", display: "flex", color: bookmarked ? "#FF9F0A" : ST._textTertiary }}
            >
              <Sym name={bookmarked ? "star" : "star-outline"} size={14} color={bookmarked ? "#FF9F0A" : ST._textTertiary} />
            </button>
          )}
          <CopyButton
            getText={() => formatArtifact(artifact)}
            style={{ color: ST._textTertiary }}
          />
          <span style={{ ...ST.cardChevron, transform: expanded ? "rotate(90deg)" : "rotate(0deg)", color: expanded ? tint : ST._chevronColor }}>
            <Sym name="chevron" size={14} />
          </span>
        </div>
      </button>
      {expanded && (
        <div style={ST.cardBody}>
          <FieldBlock label="Evidence Value" ST={ST}>
            <p style={{ ...ST.fieldText, borderLeft: `2px solid ${tint}66`, paddingLeft: 10 }}>{artifact.reveals}</p>
          </FieldBlock>
          <FieldBlock label="Artifact Locations" ST={ST}>
            {artifact.locations.map((loc, i) => <code key={i} style={ST.code}>{loc}</code>)}
          </FieldBlock>
          <FieldBlock label="Analysis Tools" ST={ST}>
            <div style={ST.pillRow}>{artifact.tools.map((t, i) => <span key={i} style={ST.pill}>{t}</span>)}</div>
          </FieldBlock>
          {artifact.eventIds?.length > 0 && (
            <FieldBlock label="Key Event IDs" ST={ST}>
              <div style={ST.pillRow}>
                {artifact.eventIds.map((id, i) => (
                  <span key={i} style={{ ...ST.pillTint, background: tint + "26", color: tint, boxShadow: `inset 0 0 0 1px ${tint}55` }}>{id}</span>
                ))}
              </div>
            </FieldBlock>
          )}
          {artifact.mitre?.length > 0 && (
            <FieldBlock label="MITRE ATT&CK Techniques" icon="target" ST={ST}>
              <div style={ST.pillRow}>
                {artifact.mitre.map((m, i) => (
                  <a key={i} href={`https://attack.mitre.org/techniques/${m.replace(".", "/")}/`} target="_blank" rel="noopener noreferrer"
                    style={{ ...ST.pillTint, background: tint + "26", color: tint, boxShadow: `inset 0 0 0 1px ${tint}55`, textDecoration: "none", cursor: "pointer" }}>
                    {m} ↗
                  </a>
                ))}
              </div>
            </FieldBlock>
          )}
          {artifact.commands?.length > 0 && (
            <FieldBlock label="Quick Commands" icon="terminal" ST={ST}>
              {artifact.commands.map((c, i) => (
                <div key={i} style={ST.commandRow}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={ST.commandLabel}>{c.label}</div>
                    <code style={ST.commandCode}>{c.cmd}</code>
                  </div>
                  <CopyButton getText={c.cmd} style={{ color: ST._textTertiary, flexShrink: 0 }} />
                </div>
              ))}
            </FieldBlock>
          )}
          {artifact.related?.length > 0 && (
            <FieldBlock label="Related Artifacts" icon="link" ST={ST}>
              <div style={ST.pillRow}>
                {artifact.related.map((r, i) => <span key={i} style={ST.pillMuted}>{r}</span>)}
              </div>
            </FieldBlock>
          )}
          {artifact.retention && (
            <FieldBlock label="Typical Retention / Volatility" icon="clock" ST={ST}>
              <p style={ST.fieldTextSmall}>{artifact.retention}</p>
            </FieldBlock>
          )}
          {artifact.sources?.length > 0 && (
            <FieldBlock label="Commonly Documented In" icon="book" ST={ST}>
              <div style={ST.pillRow}>
                {artifact.sources.map((s, i) => <span key={i} style={ST.pillMuted}>{s}</span>)}
              </div>
            </FieldBlock>
          )}
          <SuggestEditLink artifact={artifact} os={os} cat={cat} ST={ST} />
        </div>
      )}
    </div>
  );
}

function SuggestEditLink({ artifact, os, cat, ST }) {
  const issueTitle = encodeURIComponent(`Correction: "${artifact.artifact}" (${os || "?"} / ${cat || "?"})`);
  const issueBody = encodeURIComponent(
    `Artifact: ${artifact.artifact}\nPlatform: ${os || "unknown"}\nCategory: ${cat || "unknown"}\n\nWhat's inaccurate or out of date:\n\n\nSuggested correction:\n`
  );
  const href = `${GITHUB_REPO_URL}/issues/new?title=${issueTitle}&body=${issueBody}`;
  return (
    <div style={{ marginTop: 6, paddingTop: 12, borderTop: `1px solid ${ST._borderColorSoft}` }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 12, fontWeight: 600, color: "#0A84FF", textDecoration: "none",
          background: "#0A84FF16", border: "1px solid #0A84FF44",
          borderRadius: 20, padding: "5px 12px",
        }}
      >
        <Sym name="flag" size={12} color="#0A84FF" />
        Suggest an edit to this artifact
      </a>
    </div>
  );
}

function FieldBlock({ label, children, ST, icon }) {
  return (
    <div style={ST.field}>
      <div style={ST.fieldLabel}>
        {icon && <Sym name={icon} size={10} color={ST._textTertiary} />}
        {label}
      </div>
      {children}
    </div>
  );
}

function Empty({ text, ST }) {
  return (
    <div style={ST.emptyWrap}>
      <Logo size={40} muted />
      <p style={{ ...ST.emptyText, whiteSpace: "pre-line" }}>{text}</p>
    </div>
  );
}

function StatusBar({ total, selectedOS, selectedCat, isSearching, resultCount, ST, viewingBookmarks, bookmarkCount }) {
  return (
    <div style={ST.statusBar}>
      <span>
        {viewingBookmarks
          ? `${bookmarkCount} bookmarked`
          : isSearching
          ? `${resultCount} results`
          : `${selectedOS || ""} ${selectedCat ? "› " + selectedCat : ""}`}
      </span>
      <span className="fr-hide-mobile" style={{ marginLeft: 16, opacity: 0.7 }}>↑↓ navigate · Enter/Esc toggle · ⌘K search</span>
      <span style={{ marginLeft: "auto" }}>{total} artifacts indexed · AI-generated reference, verify before operational use</span>
    </div>
  );
}

function buildStyles(theme) {
  const t = theme;
  return {
    _text: t.text,
    _textTertiary: t.textTertiary,
    _iconColor: t.textSecondary,
    _iconColorMuted: t.textTertiary,
    _chevronColor: t.name === "dark" ? "#636366" : "#B8B8BC",
    _borderColorSoft: t.borderColorSoft,

    desktop: {
      minHeight: "100vh",
      background: t.desktopBg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Helvetica, Arial, sans-serif",
      color: t.text,
      display: "flex",
      flexDirection: "column",
      transition: "background 0.25s ease, color 0.25s ease",
    },
    menuBar: {
      height: 26, background: t.menuBarBg, backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${t.borderColorSoft}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 14px", fontSize: 12.5, color: t.textSecondary, flexShrink: 0,
    },
    menuLeft: { display: "flex", alignItems: "center", gap: 16 },
    menuRight: { display: "flex", alignItems: "center", gap: 14 },
    appleMark: { fontSize: 13, marginRight: 2 },
    menuBold: { fontWeight: 600, color: t.text },
    menuItem: { color: t.textSecondary, cursor: "pointer" },

    windowWrap: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 16px", minHeight: 0 },
    window: {
      width: "100%", maxWidth: 1680, height: "calc(100vh - 66px)", maxHeight: 1100,
      background: t.windowBg,
      borderRadius: 12, overflow: "hidden",
      boxShadow: t.shadow,
      display: "flex", flexDirection: "column",
    },
    titleBar: {
      height: 52, background: t.titleBarBg, backdropFilter: "blur(10px)",
      borderBottom: `1px solid ${t.borderColor}`,
      display: "flex", alignItems: "center", padding: "0 14px", gap: 12, flexShrink: 0,
    },
    traffic: { display: "flex", gap: 8, width: 60, flexShrink: 0 },
    dot: { width: 12, height: 12, borderRadius: "50%", display: "inline-block", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.15)" },
    titleCenter: { display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 },
    titleText: { fontSize: 13, fontWeight: 600, color: t.text, whiteSpace: "nowrap" },
    titleBadge: { fontSize: 10.5, fontWeight: 700, background: "rgba(120,120,140,0.35)", color: t.textSecondary, borderRadius: 20, padding: "2px 7px" },
    titleSearchWrap: {
      display: "flex", alignItems: "center", gap: 6, background: t.inputBg,
      borderRadius: 7, padding: "6px 9px", width: 240, flexShrink: 0,
      boxShadow: `inset 0 0 0 1px ${t.borderColorSoft}`,
    },
    titleSearch: { flex: 1, minWidth: 0, background: "none", border: "none", outline: "none", color: t.text, fontSize: 12.5, fontFamily: "inherit" },
    searchClear: { background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0, flexShrink: 0, color: t.textTertiary },
    hamburger: {
      background: t.pillBg, border: "none", borderRadius: 7, cursor: "pointer",
      width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    mobileSearchBtn: {
      background: t.pillBg, border: "none", borderRadius: 7, cursor: "pointer",
      width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    navScrim: {},

    body: { flex: 1, display: "flex", minHeight: 0 },

    sidebar: {
      width: 240, flexShrink: 0, background: t.sidebarBg,
      borderRight: `1px solid ${t.borderColorSoft}`,
      display: "flex", flexDirection: "column", padding: "14px 10px",
      overflow: "hidden",
    },
    sideGroupLabel: { fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: t.textQuaternary, textTransform: "uppercase", padding: "0 8px 6px" },
    sideItem: {
      display: "flex", alignItems: "center", gap: 9, width: "100%",
      background: "none", border: "none", borderRadius: 7, padding: "6px 8px",
      cursor: "pointer", color: t.textSecondary, fontSize: 13, fontFamily: "inherit", textAlign: "left",
    },
    sideItemActive: { background: "linear-gradient(180deg, #0A84FF, #0870DB)", color: "#fff" },
    sideIconWrap: { width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    sideLabel: { flex: 1, fontWeight: 500 },
    sideCount: { fontSize: 11, fontWeight: 600 },

    sideScroll: { flex: 1, overflowY: "auto", marginRight: -4, paddingRight: 4, display: "flex", flexDirection: "column" },
    sideSubItem: {
      display: "flex", alignItems: "center", gap: 8, width: "100%",
      background: "none", border: "none", borderRadius: 6, padding: "5.5px 8px",
      cursor: "pointer", color: t.textSecondary, fontSize: 12, fontFamily: "inherit", textAlign: "left",
    },
    sideSubItemActive: { background: t.sidebarActiveBg, color: t.text },
    sideSubLabel: { flex: 1, lineHeight: 1.3 },

    sideFooter: { borderTop: `1px solid ${t.borderColor}`, paddingTop: 10, marginTop: 8 },
    sideFooterBtn: {
      display: "flex", alignItems: "center", gap: 8, width: "100%",
      background: "none", border: "none", borderRadius: 6, padding: "6px 8px",
      cursor: "pointer", color: t.textTertiary, fontSize: 12, fontFamily: "inherit", textAlign: "left",
      marginBottom: 2,
    },
    bookmarkBadge: {
      fontSize: 10, fontWeight: 700, background: "#FF9F0A22", color: "#FF9F0A",
      borderRadius: 20, padding: "1px 7px", flexShrink: 0,
    },

    content: { flex: 1, overflowY: "auto", background: t.contentBg },
    viewInner: { padding: "22px 26px 40px", maxWidth: 880, margin: "0 auto" },
    viewHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 18 },
    viewIconWrap: { width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    viewTitle: { fontSize: 19, fontWeight: 700, color: t.text },
    viewSub: { fontSize: 12, color: t.textTertiary, marginTop: 1 },

    cardList: { display: "flex", flexDirection: "column", gap: 7 },
    card: { background: t.cardBg, borderRadius: 10, boxShadow: `inset 0 0 0 1px ${t.cardBorder}`, overflow: "hidden" },
    cardHead: {
      width: "100%", background: "none", border: "none", cursor: "pointer",
      padding: "12px 14px", display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      fontFamily: "inherit", textAlign: "left", gap: 10,
    },
    cardHeadLeft: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: 1 },
    cardBadge: { fontSize: 10, color: t.textTertiary, background: t.pillBg, borderRadius: 4, padding: "2px 6px", width: "fit-content" },
    cardTitle: { fontSize: 13.5, fontWeight: 600 },
    cardPreview: { fontSize: 11.5, color: t.textTertiary, lineHeight: 1.5 },
    cardChevron: { flexShrink: 0, marginTop: 3, transition: "transform 0.15s" },

    cardBody: { padding: "4px 14px 16px", display: "flex", flexDirection: "column", gap: 13, borderTop: `1px solid ${t.borderColorSoft}` },
    field: { display: "flex", flexDirection: "column", gap: 6, marginTop: 10 },
    fieldLabel: { fontSize: 10, fontWeight: 700, color: t.textQuaternary, textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: 5 },
    fieldText: { fontSize: 13, lineHeight: 1.65, color: t.textSecondary, margin: 0 },
    fieldTextSmall: { fontSize: 12, lineHeight: 1.6, color: t.textTertiary, margin: 0, fontStyle: "italic" },
    code: {
      display: "block", background: t.codeBg, color: t.codeText,
      borderRadius: 5, padding: "5px 9px", fontSize: 11.5, marginBottom: 4,
      wordBreak: "break-all", fontFamily: "'SF Mono', Menlo, Consolas, monospace",
    },
    pillRow: { display: "flex", flexWrap: "wrap", gap: 5 },
    pill: { background: t.pillBg, color: t.pillText, borderRadius: 20, padding: "3px 10px", fontSize: 11.5 },
    pillTint: { borderRadius: 20, padding: "3px 10px", fontSize: 11.5, fontWeight: 700, display: "inline-block" },
    pillMuted: { background: "none", color: t.textTertiary, borderRadius: 20, padding: "3px 10px", fontSize: 11.5, boxShadow: `inset 0 0 0 1px ${t.borderColor}` },

    commandRow: {
      display: "flex", alignItems: "flex-start", gap: 8,
      background: t.codeBg, borderRadius: 6, padding: "8px 10px",
    },
    commandLabel: { fontSize: 10.5, color: t.textTertiary, marginBottom: 3 },
    commandCode: {
      display: "block", color: t.codeText, fontSize: 11.5, wordBreak: "break-all",
      fontFamily: "'SF Mono', Menlo, Consolas, monospace", background: "none", padding: 0,
    },

    emptyWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 20px", gap: 16, opacity: 0.7 },
    emptyText: { fontSize: 13, color: t.textTertiary },

    statusBar: {
      height: 26, background: t.menuBarBg, borderTop: `1px solid ${t.borderColor}`,
      display: "flex", alignItems: "center", padding: "0 14px", fontSize: 10.5, color: t.textQuaternary, flexShrink: 0, gap: 6,
    },
  };
}
