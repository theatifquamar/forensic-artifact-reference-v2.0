import { useState } from "react";
import { DB } from "./database.js";
import { TRIAGE_CHECKLISTS, getChecklistTypes } from "./triageChecklists.js";

// Looks up full artifact objects (with locations/tools/etc.) for a list of artifact
// names within one OS, searching across all of that OS's categories.
function resolveArtifacts(os, names) {
  if (!os || !names || names.length === 0) return [];
  const out = [];
  for (const name of names) {
    for (const cat of Object.keys(DB[os] || {})) {
      const found = DB[os][cat].find((a) => a.artifact === name);
      if (found) {
        out.push({ ...found, _os: os, _cat: cat });
        break;
      }
    }
  }
  return out;
}

export default function TriageBuilder({ ST, theme, Sym, ArtifactCard, isBookmarked, toggleBookmark, ExportButton, onRecordView }) {
  const [incidentType, setIncidentType] = useState(null);
  const [selectedOS, setSelectedOS] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [checkedOff, setCheckedOff] = useState({});

  const incidentTypes = getChecklistTypes();
  const checklist = incidentType ? TRIAGE_CHECKLISTS[incidentType] : null;
  const osOptions = checklist ? Object.keys(DB).filter((os) => (checklist[os] || []).length > 0) : [];
  const artifacts = checklist && selectedOS ? resolveArtifacts(selectedOS, checklist[selectedOS]) : [];

  const toggleCheck = (name) => {
    setCheckedOff((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const reset = () => {
    setIncidentType(null);
    setSelectedOS(null);
    setCheckedOff({});
    setExpanded(null);
  };

  if (!incidentType) {
    return (
      <div style={ST.viewInner} className="fr-view-inner">
        <div style={ST.viewHeader}>
          <span style={{ ...ST.viewIconWrap, background: "#30D15822" }}>
            <Sym name="checklist" size={18} color="#30D158" />
          </span>
          <div>
            <div style={ST.viewTitle}>Triage Checklist Builder</div>
            <div style={ST.viewSub}>Pick an incident type to get a prioritized artifact pull order</div>
          </div>
        </div>

        <div style={T.grid}>
          {incidentTypes.map((type) => (
            <button key={type} onClick={() => setIncidentType(type)} style={{ ...T.card, background: theme.cardBg, boxShadow: `inset 0 0 0 1px ${theme.cardBorder}`, color: theme.text }}>
              <div style={T.cardTitle}>{type}</div>
              <div style={{ ...T.cardDesc, color: theme.textTertiary }}>{TRIAGE_CHECKLISTS[type].description}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedOS) {
    return (
      <div style={ST.viewInner} className="fr-view-inner">
        <div style={ST.viewHeader}>
          <button onClick={reset} style={{ ...T.backBtn, color: theme.textTertiary }}>
            <Sym name="chevron" size={12} color={theme.textTertiary} />
            <span style={{ transform: "rotate(180deg)", display: "inline-block" }} />
          </button>
          <span style={{ ...ST.viewIconWrap, background: "#30D15822" }}>
            <Sym name="checklist" size={18} color="#30D158" />
          </span>
          <div>
            <div style={ST.viewTitle}>{incidentType}</div>
            <div style={ST.viewSub}>Which platform is involved?</div>
          </div>
        </div>

        <div style={T.grid}>
          {osOptions.map((os) => (
            <button key={os} onClick={() => setSelectedOS(os)} style={{ ...T.card, background: theme.cardBg, boxShadow: `inset 0 0 0 1px ${theme.cardBorder}`, color: theme.text }}>
              <div style={T.cardTitle}>{os}</div>
              <div style={{ ...T.cardDesc, color: theme.textTertiary }}>{(checklist[os] || []).length} artifacts in priority order</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const checkedCount = Object.values(checkedOff).filter(Boolean).length;

  return (
    <div style={ST.viewInner} className="fr-view-inner">
      <div style={ST.viewHeader}>
        <button onClick={() => setSelectedOS(null)} style={{ ...T.backBtn, color: theme.textTertiary }}>
          <Sym name="chevron" size={12} color={theme.textTertiary} />
        </button>
        <span style={{ ...ST.viewIconWrap, background: "#30D15822" }}>
          <Sym name="checklist" size={18} color="#30D158" />
        </span>
        <div style={{ flex: 1 }}>
          <div style={ST.viewTitle}>{incidentType} — {selectedOS}</div>
          <div style={ST.viewSub}>{checkedCount}/{artifacts.length} pulled · in priority order, top first</div>
        </div>
        {ExportButton && <ExportButton ST={ST} theme={theme} />}
        <button onClick={reset} style={{ ...T.startOverBtn, color: theme.textTertiary }}>Start over</button>
      </div>

      <div style={ST.cardList}>
        {artifacts.map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <button
              onClick={() => toggleCheck(a.artifact)}
              aria-label={checkedOff[a.artifact] ? "Mark not pulled" : "Mark as pulled"}
              style={{
                marginTop: 14, width: 20, height: 20, borderRadius: 5, flexShrink: 0, cursor: "pointer",
                border: `1.5px solid ${checkedOff[a.artifact] ? "#30D158" : theme.borderColor}`,
                background: checkedOff[a.artifact] ? "#30D158" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {checkedOff[a.artifact] && <Sym name="check" size={12} color="#fff" />}
            </button>
            <div style={{ flex: 1, minWidth: 0, opacity: checkedOff[a.artifact] ? 0.55 : 1 }}>
              <ArtifactCard
                artifact={a}
                tint="#30D158"
                ST={ST}
                os={a._os}
                cat={a._cat}
                badge={`Priority ${i + 1} · ${a._cat}`}
                expanded={expanded === i}
                onToggle={() => setExpanded(expanded === i ? null : i)}
                isBookmarked={isBookmarked}
                toggleBookmark={toggleBookmark}
                onRecordView={onRecordView}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const T = {
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 },
  card: { border: "none", borderRadius: 10, padding: "14px 16px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", gap: 6 },
  cardTitle: { fontSize: 14, fontWeight: 700 },
  cardDesc: { fontSize: 12, lineHeight: 1.5 },
  backBtn: { background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexShrink: 0 },
  startOverBtn: { background: "none", border: "none", fontSize: 12, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 },
};
