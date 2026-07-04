import { useState } from "react";

/**
 * AdWidget — a macOS "Today View" widget-styled slot for future ad placement.
 *
 * WHY IT'S BUILT THIS WAY:
 * Rather than embedding a specific ad network's script now, this component is a
 * clean container that mimics a native macOS widget (rounded card, subtle chrome,
 * dismiss control). When you're ready to monetize:
 *
 *   1. Sign up with an ad network that offers non-intrusive, single-unit ads —
 *      e.g. Ethical Ads (ethicalads.io, popular with dev/technical audiences),
 *      Carbon Ads, or Google AdSense's "Display" unit.
 *   2. Drop their embed snippet into the <div className="ad-slot-inner"> below,
 *      or replace the placeholder content with their React/script tag.
 *   3. Nothing else in the app needs to change — this component already sits in
 *      a responsive, theme-aware slot in both the sidebar (desktop) and content
 *      flow (mobile), and respects the user's dismiss action via localStorage.
 *
 * This is intentionally a single, small, clearly-labeled unit (not a banner or
 * interstitial) — the kind of ad placement least likely to irritate readers who
 * are mid-task looking up a forensic artifact.
 */
export default function AdWidget({ theme, variant = "sidebar" }) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("far-ad-dismissed") === "1";
    } catch (e) {
      return false;
    }
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("far-ad-dismissed", "1");
    } catch (e) {
      /* ignore */
    }
  };

  const isSidebar = variant === "sidebar";

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: 12,
        padding: "10px 12px",
        margin: isSidebar ? "10px 2px 4px" : "16px 0 0",
        position: "relative",
        boxShadow: theme.name === "dark" ? "inset 0 0 0 1px rgba(255,255,255,0.04)" : "none",
      }}
      className="ad-slot-inner"
      data-ad-slot={variant}
    >
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{
          position: "absolute", top: 6, right: 6,
          width: 18, height: 18, borderRadius: "50%",
          border: "none", background: theme.pillBg, color: theme.textTertiary,
          fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          lineHeight: 1, padding: 0,
        }}
      >
        ✕
      </button>
      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.textQuaternary, marginBottom: 6 }}>
        Sponsored
      </div>
      <div style={{ fontSize: 11.5, color: theme.textTertiary, lineHeight: 1.5, paddingRight: 14 }}>
        This space is reserved for a single, unobtrusive sponsor message —
        no banners, no pop-ups, no tracking beyond what the ad network itself requires.
      </div>
    </div>
  );
}
