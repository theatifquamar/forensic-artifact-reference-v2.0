import Logo from "./Logo.jsx";
import { useTheme } from "./ThemeContext.jsx";

export default function PolicyPage({ onBack, time }) {
  const { theme, mode, toggle } = useTheme();
  const P = buildStyles(theme);

  return (
    <div style={P.desktop}>
      <style>{`
        @media (max-width: 860px) {
          .policy-window {
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
          }
          .policy-content {
            padding: 26px 20px 48px !important;
          }
        }
        @media (max-width: 420px) {
          .policy-h1 { font-size: 21px !important; }
        }
        input, button { font-size: 16px; }
        @media (min-width: 521px) {
          input, button { font-size: revert; }
        }
      `}</style>
      <div style={P.menuBar}>
        <div style={P.menuLeft}>
          <span style={{ fontSize: 13, marginRight: 2 }}></span>
          <span style={{ fontWeight: 600 }}>Forensic Reference</span>
          <span style={P.menuItem} onClick={onBack}>Back to App</span>
        </div>
        <div style={P.menuRight}>
          <span style={P.menuItem}>{time.dateStr}</span>
          <span style={P.menuItem}>{time.timeStr}</span>
        </div>
      </div>

      <div style={P.windowWrap}>
        <div style={P.window} className="policy-window">
          <div style={P.titleBar}>
            <div style={P.traffic}>
              <span style={{ ...P.dot, background: "#FF5F57" }} onClick={onBack} />
              <span style={{ ...P.dot, background: "#FEBC2E" }} />
              <span style={{ ...P.dot, background: "#28C840" }} />
            </div>
            <div style={P.titleCenter}>
              <Logo size={16} />
              <span style={P.titleText}>About & Policy</span>
            </div>
            <button
              onClick={toggle}
              aria-label="Toggle dark/light mode"
              style={{
                background: P.pillBg, border: "none", borderRadius: 7, cursor: "pointer",
                width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                color: mode === "dark" ? "#FFD60A" : "#5E5CE6", marginRight: 6,
              }}
            >
              {mode === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <button style={P.backBtn} onClick={onBack}>Done</button>
          </div>

          <div style={P.content} className="policy-content">
            <div style={P.hero}>
              <Logo size={56} />
              <h1 style={P.h1} className="policy-h1">Forensic Artifact Reference</h1>
              <p style={P.lead}>
                A quick-reference directory of digital forensic artifacts across Windows, Linux, macOS, and Android —
                built to help legitimate forensic investigators recall artifact locations, tools, and evidentiary value during analysis.
              </p>
            </div>

            <Section title="Purpose" P={P}>
              <p>
                This reference exists to support DFIR practitioners, SOC analysts, and forensic examiners who need a fast,
                organized lookup of where artifacts live, which tools parse them, and what they reveal — the kind of
                information normally scattered across blog posts, vendor documentation, and personal notes.
                It is a memory aid for people who already understand digital forensics, not a substitute for training,
                certification, or a validated forensic methodology.
              </p>
            </Section>

            <Section title="AI-Generated Content — No Guarantee of Accuracy" flag P={P}>
              <p>
                <strong>Every artifact entry on this site was generated with the assistance of an AI language model.</strong>{" "}
                While the content is drawn from well-established, publicly documented forensic knowledge, it has not been
                individually verified line-by-line against primary sources, vendor documentation, or live testing on
                every OS build and version.
              </p>
              <p>
                AI-generated content can contain errors: incorrect file paths, outdated registry keys, deprecated tools,
                imprecise event ID mappings, or artifacts that behave differently across OS versions and configurations.
                <strong> We make no warranty, express or implied, as to the completeness, accuracy, or currency of any
                information on this site.</strong>
              </p>
              <p>
                Before relying on any artifact location, tool recommendation, or interpretation in this reference for
                an active investigation, court proceeding, incident response action, or any decision with legal or
                operational consequences, <strong>independently verify it</strong> against authoritative sources,
                your organization's validated procedures, and your own testing.
              </p>
            </Section>

            <Section title="Intended Use" P={P}>
              <p>This resource is intended for:</p>
              <ul style={P.list}>
                <li>Licensed and professional digital forensic investigators</li>
                <li>SOC analysts and incident responders performing authorized investigations</li>
                <li>Security researchers, students, and educators studying digital forensics</li>
                <li>DFIR practitioners seeking a quick-reference memory aid during casework</li>
              </ul>
            </Section>

            <Section title="Prohibited Use & Liability" flag P={P}>
              <p>
                This reference documents where evidence <em>can be found</em> on a system — the same knowledge that
                underpins both defensive forensic investigation and any unauthorized attempt to access, monitor, or
                extract information from a device or account without proper authorization.
              </p>
              <p>
                <strong>This site does not authorize, condone, or provide legal cover for any illegal activity,</strong>{" "}
                including but not limited to: unauthorized access to computer systems, stalkerware or spyware
                installation, surveillance of a person without consent or legal authority, data theft, or any other
                use that violates applicable computer misuse, privacy, or wiretapping laws in your jurisdiction.
              </p>
              <p>
                <strong>Any person who uses information published on this site to facilitate illegal activity — including
                unauthorized surveillance, spying, stalking, or unlawful data access — is solely and fully liable for
                their own actions.</strong> The creators, operators, and any contributors to this reference accept no
                responsibility or liability for misuse of the information provided. Use of this site constitutes
                acknowledgment of this condition.
              </p>
            </Section>

            <Section title="No Professional Advice" P={P}>
              <p>
                Nothing on this site constitutes legal advice, chain-of-custody guidance, or a substitute for your
                organization's forensic procedures or applicable law. Evidence handling requirements vary by
                jurisdiction and case type — consult qualified legal counsel and your organization's policies for
                anything related to actual investigations or court-admissible evidence.
              </p>
            </Section>

            <Section title="Trademarks & Third-Party Names" flag P={P}>
              <p>
                This reference mentions the names of third-party forensic tools and software used by investigators
                to analyze the artifacts described — for identification purposes only, so you know which tool is
                commonly used to parse or examine a given artifact.
              </p>
              <p>
                All such product names, trademarks, and service marks are the property of their respective owners.
                <strong> Their mention here does not imply any sponsorship, endorsement, affiliation, or partnership</strong> between
                this site and the tool's maker. We do not claim any ownership or rights over these names, and we make
                no representation as to a tool's current features, licensing terms, availability, or pricing — always
                refer to the tool's own official website or documentation for current, authoritative information.
              </p>
              <p>
                If a trademark owner has concerns about how their product name is referenced here, corrections are
                welcome (see below).
              </p>
            </Section>

            <Section title="Feedback & Corrections" P={P}>
              <p>
                If you find an inaccurate artifact path, outdated tool reference, or an error of any kind, corrections
                from the community are welcome and help keep this resource useful for everyone. This is an evolving
                reference, not a finished or authoritative document.
              </p>
            </Section>

            <div style={P.footer}>
              <div>Built as a community reference tool · Content AI-assisted · Verify before operational use</div>
              <div style={P.copyright}>© {new Date().getFullYear()} atifquamar. All rights reserved.</div>
              <div style={P.trademarkNote}>All third-party product names, logos, and trademarks referenced are property of their respective owners.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

function Section({ title, children, flag, P }) {
  return (
    <div style={P.section}>
      <h2 style={{ ...P.h2, ...(flag ? { color: "#FF9F0A" } : {}) }}>
        {flag && <span style={P.flagDot} />}
        {title}
      </h2>
      <div style={P.sectionBody}>{children}</div>
    </div>
  );
}

function buildStyles(t) {
  return {
    pillBg: t.pillBg,
    desktop: {
      minHeight: "100vh",
      background: t.desktopBg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Helvetica, Arial, sans-serif",
      color: t.text,
      display: "flex",
      flexDirection: "column",
    },
    menuBar: {
      height: 26, background: t.menuBarBg, backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${t.borderColorSoft}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 14px", fontSize: 12.5, color: t.textSecondary, flexShrink: 0,
    },
    menuLeft: { display: "flex", alignItems: "center", gap: 16 },
    menuRight: { display: "flex", alignItems: "center", gap: 14 },
    menuItem: { color: t.textSecondary, cursor: "pointer" },

    windowWrap: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "26px 20px" },
    window: {
      width: "100%", maxWidth: 760, height: "calc(100vh - 90px)", maxHeight: 820,
      background: t.windowBg, borderRadius: 12, overflow: "hidden",
      boxShadow: t.shadow,
      display: "flex", flexDirection: "column",
    },
    titleBar: {
      height: 52, background: t.titleBarBg, backdropFilter: "blur(10px)",
      borderBottom: `1px solid ${t.borderColor}`,
      display: "flex", alignItems: "center", padding: "0 14px", gap: 14, flexShrink: 0,
    },
    traffic: { display: "flex", gap: 8, width: 60, flexShrink: 0 },
    dot: { width: 12, height: 12, borderRadius: "50%", display: "inline-block", cursor: "pointer" },
    titleCenter: { display: "flex", alignItems: "center", gap: 8, flex: 1 },
    titleText: { fontSize: 13, fontWeight: 600, color: t.text },
    backBtn: {
      background: t.pillBg, border: "none", borderRadius: 6, color: "#0A84FF",
      fontSize: 12.5, fontWeight: 600, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit",
    },

    content: { flex: 1, overflowY: "auto", padding: "40px 44px 60px" },
    hero: { textAlign: "center", marginBottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 },
    h1: { fontSize: 26, fontWeight: 700, margin: 0, color: t.text },
    lead: { fontSize: 14, color: t.textTertiary, lineHeight: 1.7, maxWidth: 520, margin: 0 },

    section: { maxWidth: 620, margin: "0 auto 30px" },
    h2: { fontSize: 15, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 8, color: t.text },
    flagDot: { width: 6, height: 6, borderRadius: "50%", background: "#FF9F0A", display: "inline-block" },
    sectionBody: { fontSize: 13.5, lineHeight: 1.75, color: t.textSecondary },
    list: { margin: "8px 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 },

    footer: {
      textAlign: "center", fontSize: 11, color: t.textQuaternary, marginTop: 40, paddingTop: 20,
      borderTop: `1px solid ${t.borderColor}`, maxWidth: 620, marginLeft: "auto", marginRight: "auto",
      display: "flex", flexDirection: "column", gap: 6,
    },
    copyright: { fontSize: 11, color: t.textQuaternary, fontWeight: 500 },
    trademarkNote: { fontSize: 10.5, color: t.textQuaternary, lineHeight: 1.6, maxWidth: 480, marginLeft: "auto", marginRight: "auto" },
  };
}
