import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const THEMES = {
  dark: {
    name: "dark",
    // Backdrop / desktop
    desktopBg: "radial-gradient(ellipse at top, #2b2540 0%, #171425 45%, #0d0c16 100%)",
    // Window chrome
    windowBg: "#1E1E22",
    menuBarBg: "rgba(28,28,30,0.55)",
    titleBarBg: "rgba(40,40,44,0.9)",
    borderColor: "rgba(255,255,255,0.07)",
    borderColorSoft: "rgba(255,255,255,0.06)",
    // Text
    text: "#F2F2F7",
    textSecondary: "#C7C7CC",
    textTertiary: "#8E8E93",
    textQuaternary: "#6E6E73",
    // Sidebar
    sidebarBg: "#1C1C1F",
    sidebarHover: "rgba(255,255,255,0.06)",
    sidebarActiveBg: "rgba(255,255,255,0.1)",
    // Content
    contentBg: "#141417",
    cardBg: "rgba(255,255,255,0.035)",
    cardBorder: "rgba(255,255,255,0.06)",
    codeBg: "rgba(0,0,0,0.35)",
    codeText: "#FF9F0A",
    pillBg: "rgba(255,255,255,0.08)",
    pillText: "#C7C7CC",
    inputBg: "rgba(0,0,0,0.28)",
    scrimBg: "rgba(0,0,0,0.45)",
    shadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
  },
  light: {
    name: "light",
    desktopBg: "radial-gradient(ellipse at top, #eef1f7 0%, #dfe4ee 45%, #cfd6e3 100%)",
    windowBg: "#FFFFFF",
    menuBarBg: "rgba(246,246,248,0.75)",
    titleBarBg: "rgba(246,246,248,0.92)",
    borderColor: "rgba(0,0,0,0.09)",
    borderColorSoft: "rgba(0,0,0,0.07)",
    text: "#1C1C1E",
    textSecondary: "#3A3A3C",
    textTertiary: "#6E6E73",
    textQuaternary: "#8E8E93",
    sidebarBg: "#F2F2F5",
    sidebarHover: "rgba(0,0,0,0.045)",
    sidebarActiveBg: "rgba(0,0,0,0.06)",
    contentBg: "#FAFAFB",
    cardBg: "#FFFFFF",
    cardBorder: "rgba(0,0,0,0.08)",
    codeBg: "rgba(0,0,0,0.05)",
    codeText: "#C2650A",
    pillBg: "rgba(0,0,0,0.055)",
    pillText: "#3A3A3C",
    inputBg: "rgba(0,0,0,0.045)",
    scrimBg: "rgba(0,0,0,0.25)",
    shadow: "0 30px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
  },
};

// Accent tints stay constant across themes (macOS system colors read fine on both)
export const OS_TINTS = {
  Windows: "#0A84FF",
  Linux: "#30D158",
  macOS: "#BF5AF2",
  Android: "#FF9F0A",
};

function getInitialMode() {
  try {
    const saved = localStorage.getItem("far-theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch (e) {
    /* localStorage unavailable (private browsing, etc.) — fall through */
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  return "dark";
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    try {
      localStorage.setItem("far-theme", mode);
    } catch (e) {
      /* ignore write failures */
    }
    if (typeof document !== "undefined") {
      document.documentElement.style.colorScheme = mode;
    }
  }, [mode]);

  const toggle = () => setMode((m) => (m === "dark" ? "light" : "dark"));
  const theme = THEMES[mode];

  return (
    <ThemeContext.Provider value={{ mode, theme, toggle, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
