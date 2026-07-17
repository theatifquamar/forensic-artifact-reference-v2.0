// Curated triage checklists — which artifacts to pull first for common incident types,
// per platform. Each entry is an artifact NAME that must exactly match an "artifact"
// field in the corresponding platform's data file (see src/artifacts/*.js), so the
// checklist can look up real locations/tools/commands rather than duplicating data.
//
// To add a new incident type: add a new top-level key here with Windows/Linux/macOS/Android
// arrays of artifact names, in priority order (most urgent/most volatile first).

export const TRIAGE_CHECKLISTS = {
  "Ransomware": {
    description: "Fast-moving encryption event — prioritize volatile evidence and initial access vector before the host is rebuilt or reimaged.",
    Windows: [
      "RAM / Full Memory Dump",
      "Volume Shadow Copies (VSS)",
      "Volume Shadow Copy Deletion Evidence",
      "Security Event Log — Logon Events",
      "Security Event Log — Process Creation (4688)",
      "Sysmon Event Log",
      "Prefetch Files",
      "Scheduled Tasks",
      "Run / RunOnce Keys",
      "Windows Firewall Log",
      "RDP Client Connection History",
      "TerminalServices-LocalSessionManager Event Log",
      "Event Log Cleared",
    ],
    Linux: [
      "Linux RAM Dump",
      "auth.log / secure",
      "bash_history / shell histories",
      "Cron / at / batch Jobs",
      "Systemd Services & Timers",
      "auditd execve Records",
      "SSH authorized_keys",
    ],
    macOS: [
      "macOS Memory Acquisition (live)",
      "Unified Log System",
      "LaunchAgents / LaunchDaemons",
      "FSEvents Log",
      "Zsh/Bash History (macOS default zsh)",
    ],
    Android: [],
  },

  "Insider Threat / Data Exfiltration": {
    description: "Focus on file access, removable media, cloud upload, and communication artifacts that establish what left the organization and how.",
    Windows: [
      "SRUDB.dat (System Resource Usage Monitor)",
      "USBSTOR Registry Key",
      "SetupAPI Device Log",
      "Shellbags",
      "LNK Files (Shell Links)",
      "Jump Lists",
      "OpenSavePidlMRU",
      "OneDrive Sync Logs & Database",
      "Dropbox Client Database",
      "Outlook PST / OST Files",
      "Windows Search Database (Windows.edb)",
      "7-Zip / WinRAR MRU",
    ],
    Linux: [
      "auth.log / secure",
      "bash_history / shell histories",
      "sysfs / udev USB History",
      "syslog / kern.log / messages",
    ],
    macOS: [
      "FSEvents Log",
      "QuarantineEventsV2 Database",
      "Spotlight Metadata Store",
      "iCloud Drive",
      "Unified Log System",
    ],
    Android: [
      "Google Drive / Docs Cache",
      "Download Manager Database",
      "Internal Storage (/data/media/)",
    ],
  },

  "Unauthorized Remote Access / Lateral Movement": {
    description: "Reconstruct how an attacker moved between systems and what credentials were used.",
    Windows: [
      "Security Event Log — Logon Events",
      "Security Event Log — Kerberos",
      "RDP Client Connection History",
      "TerminalServices-RDPClient Event Log",
      "TerminalServices-LocalSessionManager Event Log",
      "RDP Bitmap Cache",
      "Cached Domain Credentials (DCC2)",
      "LSA Secrets (Registry)",
      "Security Log — Share & SMB Access",
      "TeamViewer Connection Logs",
      "AnyDesk Connection Trace",
    ],
    Linux: [
      "auth.log / secure",
      "wtmp (Login History)",
      "btmp (Failed Logins)",
      "SSH authorized_keys",
      "SSH known_hosts (client)",
    ],
    macOS: [
      "SSH Authentication (Unified Log)",
      "Screen Sharing / VNC Logs",
      "Apple Remote Desktop (ARD) Logs",
      "SSH Server Logs (macOS)",
    ],
    Android: [],
  },

  "Malware Execution / Endpoint Compromise": {
    description: "Establish what ran, when, and how it persists — the core execution-evidence triangle.",
    Windows: [
      "Prefetch Files",
      "AmCache.hve — Execution Evidence",
      "Shimcache (AppCompatCache)",
      "BAM/DAM",
      "Sysmon Event Log",
      "Security Event Log — Process Creation (4688)",
      "Run / RunOnce Keys",
      "Scheduled Tasks",
      "WMI Repository",
      "Services Registry Key",
      "Windows Error Reporting (WER)",
    ],
    Linux: [
      "bash_history / shell histories",
      "auditd execve Records",
      "Cron / at / batch Jobs",
      "Systemd Services & Timers",
      "LD_PRELOAD / ld.so.preload",
      "Kernel Module List",
    ],
    macOS: [
      "LaunchAgents / LaunchDaemons",
      "Unified Log System",
      "Gatekeeper & Notarization",
      "Crash Reports & Diagnostics",
      "KEXT / System Extension History",
    ],
    Android: [
      "Package Manager Database",
      "APK Install Sources & Signatures",
      "Accessibility Service Grants",
      "Tombstone / Crash Logs",
    ],
  },

  "Mobile Device Investigation": {
    description: "Focus on communications, location, and account artifacts most relevant to phone-centric cases.",
    Windows: [],
    Linux: [],
    macOS: [],
    Android: [
      "Call Log Database",
      "SMS / MMS Database",
      "WhatsApp Messages & Media",
      "GPS Location History (Google)",
      "Photo EXIF GPS Data",
      "Google Account Tokens",
      "Lock Screen Credential Hash",
      "App Usage Statistics (UsageStats)",
      "Wi-Fi Configuration",
      "Factory Reset Evidence",
    ],
  },
};

export function getChecklistTypes() {
  return Object.keys(TRIAGE_CHECKLISTS);
}
