// Renders a hidden, print-only plain-document view of a set of artifacts.
// Stays display:none on screen (see .fr-print-root in App.jsx's ResponsiveStyles)
// and is revealed only inside a @media print block, so triggering window.print()
// produces a clean report instead of the app's window chrome.
export default function PrintExport({ title, subtitle, artifacts }) {
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="fr-print-root" style={S.root}>
      <div style={S.header}>
        <h1 style={S.h1}>Forensic Artifact Reference</h1>
        <h2 style={S.h2}>{title}</h2>
        {subtitle && <p style={S.subtitle}>{subtitle}</p>}
        <p style={S.meta}>Exported {today} · {artifacts.length} artifact{artifacts.length !== 1 ? "s" : ""} · AI-generated reference — verify before operational use</p>
      </div>

      {artifacts.map((a, i) => (
        <div key={i} style={S.card}>
          <div style={S.cardTitleRow}>
            <span style={S.cardTitle}>{a.artifact}</span>
            {(a._os || a.os) && <span style={S.badge}>{a._os || a.os}{(a._cat || a.cat) ? " › " + (a._cat || a.cat) : ""}</span>}
          </div>

          <Field label="Evidence Value">
            <p style={S.text}>{a.reveals}</p>
          </Field>

          <Field label="Artifact Locations">
            {a.locations.map((loc, li) => <code key={li} style={S.code}>{loc}</code>)}
          </Field>

          <Field label="Analysis Tools">
            <p style={S.text}>{a.tools.join(", ")}</p>
          </Field>

          {a.eventIds?.length > 0 && (
            <Field label="Key Event IDs">
              <p style={S.text}>{a.eventIds.join(", ")}</p>
            </Field>
          )}

          {a.mitre?.length > 0 && (
            <Field label="MITRE ATT&CK Techniques">
              <p style={S.text}>{a.mitre.join(", ")}</p>
            </Field>
          )}

          {a.commands?.length > 0 && (
            <Field label="Quick Commands">
              {a.commands.map((c, ci) => (
                <div key={ci} style={{ marginBottom: 4 }}>
                  <span style={S.commandLabel}>{c.label}:</span>
                  <code style={S.code}>{c.cmd}</code>
                </div>
              ))}
            </Field>
          )}

          {a.related?.length > 0 && (
            <Field label="Related Artifacts">
              <p style={S.text}>{a.related.join(", ")}</p>
            </Field>
          )}

          {a.retention && (
            <Field label="Retention / Volatility">
              <p style={S.textItalic}>{a.retention}</p>
            </Field>
          )}

          {a.sources?.length > 0 && (
            <Field label="Commonly Documented In">
              <p style={S.text}>{a.sources.join(", ")}</p>
            </Field>
          )}
        </div>
      ))}

      <div style={S.footer}>
        Content AI-assisted, not independently verified against every primary source — verify before operational or evidentiary use.
        All third-party product names and trademarks referenced are property of their respective owners.
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={S.field}>
      <div style={S.fieldLabel}>{label}</div>
      {children}
    </div>
  );
}

const S = {
  root: { fontFamily: "Georgia, 'Times New Roman', serif", color: "#111", padding: "20px 10px", maxWidth: 760, margin: "0 auto" },
  header: { marginBottom: 24, borderBottom: "2px solid #333", paddingBottom: 12 },
  h1: { fontSize: 20, margin: "0 0 4px", fontFamily: "-apple-system, Helvetica, Arial, sans-serif" },
  h2: { fontSize: 16, margin: "0 0 6px", color: "#444", fontWeight: 600, fontFamily: "-apple-system, Helvetica, Arial, sans-serif" },
  subtitle: { fontSize: 12, color: "#666", margin: "0 0 4px" },
  meta: { fontSize: 10.5, color: "#888", margin: 0, fontFamily: "-apple-system, Helvetica, Arial, sans-serif" },

  card: { border: "1px solid #ccc", borderRadius: 4, padding: "12px 14px", marginBottom: 12, breakInside: "avoid" },
  cardTitleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 8 },
  cardTitle: { fontSize: 14, fontWeight: 700, fontFamily: "-apple-system, Helvetica, Arial, sans-serif" },
  badge: { fontSize: 9.5, color: "#666", border: "1px solid #ccc", borderRadius: 4, padding: "1px 6px", fontFamily: "-apple-system, Helvetica, Arial, sans-serif", whiteSpace: "nowrap" },

  field: { marginBottom: 8 },
  fieldLabel: { fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#666", marginBottom: 3, fontFamily: "-apple-system, Helvetica, Arial, sans-serif" },
  text: { fontSize: 12, lineHeight: 1.5, margin: 0 },
  textItalic: { fontSize: 11.5, lineHeight: 1.5, margin: 0, fontStyle: "italic", color: "#444" },
  code: { display: "block", fontFamily: "'Courier New', monospace", fontSize: 10.5, background: "#f4f4f4", padding: "3px 6px", borderRadius: 3, marginBottom: 3, wordBreak: "break-all" },
  commandLabel: { fontSize: 10.5, fontWeight: 600, marginRight: 4, fontFamily: "-apple-system, Helvetica, Arial, sans-serif" },

  footer: { marginTop: 24, paddingTop: 12, borderTop: "1px solid #ccc", fontSize: 9, color: "#888", lineHeight: 1.5, fontFamily: "-apple-system, Helvetica, Arial, sans-serif" },
};
