import { useState } from "react";

// Formats one artifact as clean, shareable plain text
export function formatArtifact(a) {
  const lines = [
    `Artifact: ${a.artifact}`,
    a._os ? `Platform: ${a._os}${a._cat ? " › " + a._cat : ""}` : null,
    `Reveals: ${a.reveals}`,
    `Locations:`,
    ...a.locations.map((l) => `  - ${l}`),
    `Tools: ${a.tools.join(", ")}`,
    a.eventIds && a.eventIds.length ? `Event IDs: ${a.eventIds.join(", ")}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

export default function CopyButton({ getText, size = 13, style = {}, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation(); // don't toggle the parent card's expand/collapse
    const text = typeof getText === "function" ? getText() : getText;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback for older/insecure contexts where Clipboard API is unavailable
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (_) { /* silently ignore */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={label || "Copy to clipboard"}
      title={label || "Copy to clipboard"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "3px 6px",
        borderRadius: 6,
        fontFamily: "inherit",
        fontSize: 11,
        color: copied ? "#30D158" : "inherit",
        flexShrink: 0,
        ...style,
      }}
    >
      {copied ? (
        <>
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
          </svg>
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
}
