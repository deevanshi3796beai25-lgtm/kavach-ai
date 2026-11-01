export default function ScoreRing({ value, size = 130, stroke = 10, caption = "score", tone = "var(--cyan)" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={`${caption}: ${pct} out of 100`}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(130,170,230,.15)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={tone} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} style={{ transition: "stroke-dashoffset .8s ease" }} />
      </svg>
      <div className="ring-label"><div className="ring-value">{pct}</div><div className="ring-cap">{caption}</div></div>
    </div>
  );
}
