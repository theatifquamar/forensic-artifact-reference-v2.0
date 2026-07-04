export default function Logo({ size = 24, muted = false }) {
  const ringColor = muted ? "#6E6E73" : "url(#appLogoRing)";
  const ridgeColor = muted ? "#48484A" : "#98989D";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: "block", flexShrink: 0 }}>
      <defs>
        <linearGradient id="appLogoRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5AC8FA" />
          <stop offset="100%" stopColor="#0A84FF" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={ridgeColor} strokeWidth="1.6" strokeLinecap="round">
        <path d="M 32 18 a 10 10 0 0 1 10 10 c 0 4 -1 7 -2.2 9.4" />
        <path d="M 32 21 a 7 7 0 0 1 7 7 c 0 5 -1.4 8.4 -3 11" />
        <path d="M 32 24 a 4 4 0 0 1 4 4 c 0 6 -2 10.5 -4.6 14" />
        <path d="M 24.5 27.5 c -1 2 -1.5 4.2 -1.5 6.5 c 0 6 2.4 10.8 5.6 14.6" />
        <path d="M 27 24 c -1.6 2.6 -2.5 5.8 -2.5 10 c 0 6.5 2.6 11.4 6 15.4" />
      </g>
      <circle cx="34" cy="34" r="15" fill="none" stroke={ringColor} strokeWidth="3" />
      <line x1="44.6" y1="44.6" x2="53" y2="53" stroke={ringColor} strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}
