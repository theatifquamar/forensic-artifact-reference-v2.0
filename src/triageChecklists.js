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

  "Web Server Compromise / Defacement": {
    description: "Establish how a public-facing web server was accessed, what was changed, and whether a webshell or backdoor was planted.",
    Windows: [
      "IIS Logs",
      "Security Event Log — Logon Events",
      "Security Event Log — Process Creation (4688)",
      "File System Audit Log (SACL)",
      "Sysmon Event Log",
      "Windows Firewall Log",
    ],
    Linux: [
      "Apache Access & Error Logs",
      "Nginx Access & Error Logs",
      "PHP Error / Application Logs",
      "auth.log / secure",
      "SUID / SGID File Enumeration",
      "World-Writable Files & Dirs",
      "auditd execve Records",
      "Cron Jobs (system & user)",
    ],
    macOS: [],
    Android: [],
  },

  "SQL Injection / Web Application Attack": {
    description: "Trace malicious input through web server and database logs to confirm exploitation and data accessed.",
    Windows: [
      "IIS Logs",
      "Security Event Log — Process Creation (4688)",
      "File System Audit Log (SACL)",
    ],
    Linux: [
      "Apache Access & Error Logs",
      "Nginx Access & Error Logs",
      "PHP Error / Application Logs",
      "MySQL / MariaDB Query Log",
      "PostgreSQL Logs",
    ],
    macOS: [],
    Android: [],
  },

  "Public-Facing Service Exploitation (RDP/SSH Exposed)": {
    description: "An internet-exposed remote access service was likely brute-forced or exploited — confirm entry point and follow-on activity.",
    Windows: [
      "Security Event Log — Logon Events",
      "TerminalServices-LocalSessionManager Event Log",
      "TerminalServices-RDPClient Event Log",
      "RDP Bitmap Cache",
      "Windows Firewall Log",
      "Security Event Log — Process Creation (4688)",
    ],
    Linux: [
      "auth.log / secure",
      "btmp (Failed Logins)",
      "wtmp (Login History)",
      "SSH authorized_keys",
      "SSH Host Config",
    ],
    macOS: [
      "SSH Authentication (Unified Log)",
      "SSH Server Logs (macOS)",
    ],
    Android: [],
  },

  "Rogue Wi-Fi / Network Reconnaissance": {
    description: "Device may have connected to an untrusted or spoofed network — establish network history and correlate with activity timing.",
    Windows: [
      "Network Profile History",
      "WLAN AutoConfig Event Log",
      "Network Event Log",
      "SRUDB.dat (System Resource Usage Monitor)",
    ],
    Linux: [
      "Network Interface Configuration",
      "DHCP Lease History",
      "syslog / kern.log / messages",
    ],
    macOS: [
      "Wi-Fi Known Networks",
      "DHCP Lease History",
      "Unified Log (Network Events)",
    ],
    Android: [
      "Wi-Fi Configuration",
      "Wi-Fi Location Scans",
      "Connectivity & Settings Database",
    ],
  },

  "Credential Stuffing / Password Spray Attack": {
    description: "High-volume authentication attempts against one or many accounts — confirm scope, source, and any successful compromise.",
    Windows: [
      "Security Event Log — Logon Events",
      "Security Event Log — Kerberos",
      "Cached Domain Credentials (DCC2)",
    ],
    Linux: [
      "auth.log / secure",
      "btmp (Failed Logins)",
      "wtmp (Login History)",
      "Fail2Ban Logs",
    ],
    macOS: [
      "Unified Log System",
      "OpenDirectory / DirectoryService Logs",
    ],
    Android: [],
  },

  "Business Email Compromise (BEC)": {
    description: "Account takeover or spoofing used for financial fraud or phishing — trace mailbox access and message manipulation.",
    Windows: [
      "Exchange Server Message Tracking Logs",
      "Outlook PST / OST Files",
      "Outlook Attachment Temp Files",
      "Security Event Log — Logon Events",
      "Windows Mail App (UWP)",
    ],
    Linux: [
      "Postfix Mail Logs",
      "Sendmail Logs",
      "Dovecot IMAP/POP3 Logs",
    ],
    macOS: [],
    Android: [
      "Email Apps (Gmail/Outlook)",
      "Google Account Tokens",
    ],
  },

  "Phishing Click-Through Investigation": {
    description: "User clicked a malicious link or opened an attachment — confirm what executed and whether credentials or a payload were delivered.",
    Windows: [
      "Zone.Identifier (Mark of the Web)",
      "Chrome — History & Downloads",
      "Edge (Chromium) — History & Cache",
      "Outlook Attachment Temp Files",
      "Prefetch Files",
      "AmCache.hve — Execution Evidence",
    ],
    Linux: [
      "Firefox History (Linux)",
      "Chrome History (Linux)",
      "Wget / cURL Download Evidence",
    ],
    macOS: [
      "QuarantineEventsV2 Database",
      "Safari History",
      "Extended Attributes (xattr)",
    ],
    Android: [
      "Chrome (Android) History",
      "WebView Cache (in-app browsers)",
    ],
  },

  "Privileged Account Abuse": {
    description: "An administrative or service account was used outside its normal pattern — confirm scope of access and actions taken.",
    Windows: [
      "Security Event Log — Account Management",
      "Security Event Log — Logon Events",
      "SAM Database",
      "NTDS.dit (Active Directory)",
      "Active Directory Replication Metadata",
    ],
    Linux: [
      "/etc/sudoers & /etc/sudoers.d/",
      "auth.log / secure",
      "auditd execve Records",
    ],
    macOS: [
      "Authorization Logs (authd)",
      "Local User Accounts (dslocal)",
    ],
    Android: [
      "Device Admin & MDM Policies",
    ],
  },

  "Kerberoasting / Golden Ticket Attack": {
    description: "Suspected abuse of Kerberos ticket-granting to obtain service account credentials or forge tickets.",
    Windows: [
      "Security Event Log — Kerberos",
      "NTDS.dit (Active Directory)",
      "Active Directory Replication Metadata",
      "Security Event Log — Logon Events",
    ],
    Linux: [],
    macOS: [],
    Android: [],
  },

  "Session Hijacking / Token Theft": {
    description: "An active session or auth token was stolen and reused — check browser and credential stores for the theft vector.",
    Windows: [
      "Chrome — Cookies",
      "Chrome — Login Data & Passwords",
      "Firefox — Cookies",
      "Credential Manager / Windows Vault",
      "Security Event Log — Logon Events",
    ],
    Linux: [
      "auth.log / secure",
    ],
    macOS: [
      "Safari Local Storage & WebSQL",
      "Keychain Files",
    ],
    Android: [
      "Google Account Tokens",
      "Chrome (Android) History",
    ],
  },

  "Fileless Malware / Living-off-the-Land": {
    description: "Attack uses built-in OS tools (PowerShell, WMI, scripting) rather than dropped executables — focus on script and process telemetry.",
    Windows: [
      "PowerShell Script Block Logging",
      "Sysmon Event Log",
      "WMI Repository",
      "WMI Event Subscriptions",
      "Security Event Log — Process Creation (4688)",
    ],
    Linux: [
      "auditd execve Records",
      "bash_history / shell histories",
      "LD_PRELOAD / ld.so.preload",
    ],
    macOS: [
      "Unified Log System",
      "Emond (Event Monitor Daemon)",
    ],
    Android: [],
  },

  "Rootkit Infection": {
    description: "System-level concealment is suspected — compare live state against on-disk artifacts to find discrepancies.",
    Windows: [
      "Boot Sector / Bootkit Evidence",
      "Timestomping Evidence (MFT vs $LogFile)",
      "Event Log Cleared",
      "Services Registry Key",
    ],
    Linux: [
      "Kernel Module List",
      "File Integrity Monitoring (AIDE/Tripwire)",
      "SUID / SGID File Enumeration",
    ],
    macOS: [
      "KEXT / System Extension History",
      "System Integrity Protection (SIP) Status",
    ],
    Android: [
      "Root / Bootloader Unlock Evidence",
      "SELinux / SEAndroid Logs",
    ],
  },

  "Cryptomining Malware": {
    description: "Unexplained CPU/GPU load and network activity — confirm persistence mechanism and mining pool communication.",
    Windows: [
      "Task Scheduler Logs",
      "Sysmon Event Log",
      "Prefetch Files",
      "SRUDB.dat (System Resource Usage Monitor)",
      "Services Registry Key",
    ],
    Linux: [
      "Cron / at / batch Jobs",
      "Systemd Services & Timers",
      "auditd execve Records",
    ],
    macOS: [
      "LaunchAgents / LaunchDaemons",
      "Power Management Logs (pmset)",
    ],
    Android: [
      "Battery History (batterystats)",
      "Network Stats Database",
      "App Usage Statistics (UsageStats)",
    ],
  },

  "Command-and-Control (C2) Beaconing Detection": {
    description: "Regular outbound connections to a suspicious host suggest active C2 — confirm the responsible process and its persistence.",
    Windows: [
      "Sysmon Event Log",
      "SRUDB.dat (System Resource Usage Monitor)",
      "Windows Firewall Log",
      "DNS Client Event Log",
      "Active Network Connections (volatile)",
    ],
    Linux: [
      "Active Network Connections (live)",
      "iptables / nftables / ufw Logs",
      "auditd execve Records",
    ],
    macOS: [
      "Unified Log (Network Events)",
      "Application Firewall Log",
    ],
    Android: [
      "Network Stats Database",
      "Logcat (live system log)",
    ],
  },

  "Advanced Persistent Threat (APT) Investigation": {
    description: "Long-dwell, multi-stage intrusion — combine execution, persistence, lateral movement, and exfiltration evidence into one timeline.",
    Windows: [
      "Security Event Log — Logon Events",
      "Sysmon Event Log",
      "Scheduled Tasks",
      "WMI Event Subscriptions",
      "AmCache.hve — Execution Evidence",
      "RDP Client Connection History",
      "SRUDB.dat (System Resource Usage Monitor)",
      "Event Log Cleared",
    ],
    Linux: [
      "auth.log / secure",
      "auditd execve Records",
      "Systemd Services & Timers",
      "SSH authorized_keys",
    ],
    macOS: [
      "Unified Log System",
      "LaunchAgents / LaunchDaemons",
      "FSEvents Log",
    ],
    Android: [],
  },

  "Intellectual Property Theft": {
    description: "Establish what proprietary files were accessed, copied, or transmitted, and by what route.",
    Windows: [
      "Shellbags",
      "LNK Files (Shell Links)",
      "Jump Lists",
      "RecentDocs Registry Key",
      "USBSTOR Registry Key",
      "OneDrive Sync Logs & Database",
      "Print Spooler Files (EMF/SPL)",
      "7-Zip / WinRAR MRU",
    ],
    Linux: [
      "bash_history / shell histories",
      "sysfs / udev USB History",
    ],
    macOS: [
      "FSEvents Log",
      "Recent Items Lists",
      "iCloud Drive",
    ],
    Android: [
      "Internal Storage (/data/media/)",
      "Google Drive / Docs Cache",
    ],
  },

  "Database Exfiltration": {
    description: "Bulk or unusual query activity suggests data was pulled from a database — confirm query patterns and export volume.",
    Windows: [],
    Linux: [
      "MySQL / MariaDB Query Log",
      "PostgreSQL Logs",
      "auth.log / secure",
      "auditd execve Records",
    ],
    macOS: [],
    Android: [],
  },

  "Unauthorized Cloud Storage Sharing": {
    description: "Files may have been shared or synced outside approved channels — check every cloud sync client present on the system.",
    Windows: [
      "OneDrive Sync Logs & Database",
      "Dropbox Client Database",
      "Google Drive / DriveFS",
    ],
    Linux: [],
    macOS: [
      "iCloud Drive",
    ],
    Android: [
      "Google Drive / Docs Cache",
      "Microsoft Office Mobile / OneDrive",
    ],
  },

  "Print/Scan Data Leakage": {
    description: "Sensitive documents may have been printed or scanned for physical removal — recover spooled job content and history.",
    Windows: [
      "Print Spooler Files (EMF/SPL)",
      "PrintService Event Log",
      "Scanner / Imaging Device Logs",
    ],
    Linux: [],
    macOS: [],
    Android: [],
  },

  "Employee Departure / Offboarding Review": {
    description: "Standard review of a departing employee's device for data movement or account misuse in the final days of access.",
    Windows: [
      "Security Event Log — Account Management",
      "USBSTOR Registry Key",
      "OneDrive Sync Logs & Database",
      "RecentDocs Registry Key",
      "Shellbags",
      "Outlook PST / OST Files",
    ],
    Linux: [
      "auth.log / secure",
      "sysfs / udev USB History",
    ],
    macOS: [
      "FSEvents Log",
      "iCloud Drive",
    ],
    Android: [],
  },

  "Policy Violation Investigation": {
    description: "Acceptable-use or workplace policy review — browsing history, installed software, and general activity timeline.",
    Windows: [
      "Chrome — History & Downloads",
      "Edge (Chromium) — History & Cache",
      "AmCache.hve — Execution Evidence",
      "Steam / Gaming Platform Logs",
      "torrent Client Artifacts (qBittorrent/uTorrent)",
    ],
    Linux: [
      "Firefox History (Linux)",
      "Chrome History (Linux)",
      "APT/DPKG Install History",
    ],
    macOS: [
      "Safari History",
      "Install History",
    ],
    Android: [
      "App Usage Statistics (UsageStats)",
      "Instagram Cache & Database",
      "TikTok Cache & Database",
    ],
  },

  "Harassment/Misconduct Digital Evidence": {
    description: "Collect communications relevant to a workplace conduct investigation, preserving message content and timestamps.",
    Windows: [
      "Outlook PST / OST Files",
      "Microsoft Teams Cache & Logs",
      "Skype Main.db / Desktop Skype",
    ],
    Linux: [],
    macOS: [
      "iMessage Database",
      "Microsoft Teams (macOS)",
    ],
    Android: [
      "SMS / MMS Database",
      "WhatsApp Messages & Media",
      "Facebook Messenger",
    ],
  },

  "Sabotage by Departing Employee": {
    description: "Suspected deliberate data destruction or system damage by an employee prior to departure.",
    Windows: [
      "Event Log Cleared",
      "Volume Shadow Copy Deletion Evidence",
      "Timestomping Evidence (MFT vs $LogFile)",
      "Recycle Bin ($Recycle.Bin)",
      "Security Event Log — Account Management",
    ],
    Linux: [
      "auth.log / secure",
      "bash_history / shell histories",
    ],
    macOS: [
      "FSEvents Log",
      "Trash (.Trash)",
    ],
    Android: [],
  },

  "Unauthorized Software Installation": {
    description: "Confirm what was installed, when, and from what source, particularly for unapproved or high-risk applications.",
    Windows: [
      "AmCache.hve — Execution Evidence",
      "SOFTWARE Hive",
      "Run / RunOnce Keys",
    ],
    Linux: [
      "APT/DPKG Install History",
      "YUM/DNF/RPM Transaction History",
      "Snap Package History",
    ],
    macOS: [
      "Install History",
      "Homebrew Package History",
    ],
    Android: [
      "Package Manager Database",
      "APK Install Sources & Signatures",
      "Google Play Store History",
    ],
  },

  "SaaS/Collaboration App Data Breach": {
    description: "Data exposure or account compromise within a collaboration platform (Teams, Slack, Zoom) — check local caches for evidence of the activity.",
    Windows: [
      "Microsoft Teams Cache & Logs",
      "Slack Desktop Cache",
      "Zoom Local Recordings & Logs",
    ],
    Linux: [],
    macOS: [
      "Microsoft Teams (macOS)",
      "Slack (macOS)",
      "Zoom (macOS)",
    ],
    Android: [
      "Slack Mobile",
      "Microsoft Teams Mobile",
    ],
  },

  "Lost or Stolen Device Investigation": {
    description: "Device recovery or remote-wipe scenario — confirm lock state, last known activity, and whether a factory reset occurred.",
    Windows: [],
    Linux: [],
    macOS: [],
    Android: [
      "Lock Screen Credential Hash",
      "Factory Reset Evidence",
      "Device Admin & MDM Policies",
      "Android Event Logs",
      "GPS Location History (Google)",
    ],
  },

  "USB Drop Attack / Malicious Peripheral": {
    description: "A suspicious USB device was connected — confirm identity, connection time, and any files executed from it.",
    Windows: [
      "USBSTOR Registry Key",
      "SetupAPI Device Log",
      "USB Connection Event Logs",
      "LNK Files Pointing to USB Files",
      "MountedDevices (USB Volumes)",
    ],
    Linux: [
      "sysfs / udev USB History",
      "syslog / kern.log / messages",
    ],
    macOS: [
      "Unified Log System",
    ],
    Android: [],
  },

  "Physical Access Correlation": {
    description: "Correlate digital timestamps with physical presence indicators to establish who was at the device and when.",
    Windows: [
      "Security Event Log — Logon Events",
      "Bluetooth Device Pairing History",
      "USB Connection Event Logs",
    ],
    Linux: [
      "auth.log / secure",
    ],
    macOS: [
      "Unified Log System",
    ],
    Android: [],
  },

  "macOS-Specific Malware Infection": {
    description: "Suspected malware on macOS — check the primary persistence, quarantine, and code-signing checkpoints unique to the platform.",
    Windows: [],
    Linux: [],
    macOS: [
      "LaunchAgents / LaunchDaemons",
      "Gatekeeper & Notarization",
      "QuarantineEventsV2 Database",
      "KEXT / System Extension History",
      "Unified Log System",
      "Crash Reports & Diagnostics",
    ],
    Android: [],
  },

  "Linux Web Shell Detection": {
    description: "A web server may host an attacker-planted webshell — check for unusual files, permissions, and execution evidence.",
    Windows: [],
    Linux: [
      "Apache Access & Error Logs",
      "Nginx Access & Error Logs",
      "PHP Error / Application Logs",
      "SUID / SGID File Enumeration",
      "World-Writable Files & Dirs",
      "Cron Jobs (system & user)",
      "auditd execve Records",
    ],
    macOS: [],
    Android: [],
  },

  "Android Banking Trojan Investigation": {
    description: "Suspected malicious app abusing Accessibility Services to intercept banking credentials or SMS-based 2FA codes.",
    Windows: [],
    Linux: [],
    macOS: [],
    Android: [
      "Accessibility Service Grants",
      "Package Manager Database",
      "APK Install Sources & Signatures",
      "SMS / MMS Database",
      "Banking App Data (generic)",
      "Notification History (Android 11+)",
    ],
  },

  "Active Directory Domain Compromise": {
    description: "Domain-wide compromise investigation — prioritize the Domain Controller's own artifacts alongside affected member servers.",
    Windows: [
      "NTDS.dit (Active Directory)",
      "Active Directory Replication Metadata",
      "Group Policy Objects (GPO)",
      "Security Event Log — Account Management",
      "Security Event Log — Kerberos",
      "Security Event Log — Logon Events",
    ],
    Linux: [],
    macOS: [],
    Android: [],
  },

  "Exchange/Email Server Compromise": {
    description: "Mail server itself was compromised (not just a single mailbox) — check server-level logs and message tracking.",
    Windows: [
      "Exchange Server Message Tracking Logs",
      "IIS Logs",
      "Security Event Log — Logon Events",
    ],
    Linux: [
      "Postfix Mail Logs",
      "Sendmail Logs",
      "Dovecot IMAP/POP3 Logs",
    ],
    macOS: [],
    Android: [],
  },
};

export function getChecklistTypes() {
  return Object.keys(TRIAGE_CHECKLISTS);
}
