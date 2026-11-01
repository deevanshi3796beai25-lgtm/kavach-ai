export default function LoadingPanel({ message = "Analysing…", sub = "Simulated analysis — this only takes a moment." }) {
  return (
    <div className="loading-panel" role="status" aria-live="polite">
      <div className="loader-ring" />
      <div style={{ color: "var(--text)", fontWeight: 600 }}>{message}</div>
      <div className="text-sm">{sub}</div>
    </div>
  );
}
