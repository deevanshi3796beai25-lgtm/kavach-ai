import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileDown, QrCode, ScanFace, AudioLines, Link2, ShieldAlert, Phone } from "lucide-react";
import { Button, Card, DemoBadge, LevelBadge, PageHeader, ScoreRing, Tabs, DemoNotice } from "../components/common/index.js";
import { ActivityTimeline } from "../components/dashboard/index.js";
import { useApp } from "../hooks/useApp.js";
import { useToast } from "../hooks/useToast.js";
import { moduleMeta, recommendedActions } from "../services/mockData.js";
import { sleep } from "../services/mockAnalysis.js";
import { timeAgo } from "../utils/format.js";

const ICON = { qr: QrCode, deepfake: ScanFace, voice: AudioLines, link: Link2 };
const PATH = { qr: "/app/qr-upi", deepfake: "/app/deeptruth", voice: "/app/voiceguard", link: "/app/linkshield" };
const TABS = [{ id: "all", label: "All evidence" }, ...Object.entries(moduleMeta).map(([id, m]) => ({ id, label: m.label, icon: ICON[id] }))];
const WEIGHT = { low: 10, medium: 55, high: 90 };

export default function ScamIntelligence() {
  const { scans, timeline } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState("all");
  const [done, setDone] = useState(() => new Set());
  const [busy, setBusy] = useState(false);

  const overall = useMemo(() => {
    if (!scans.length) return 0;
    const recent = scans.slice(0, 10);
    return Math.round(recent.reduce((a, s) => a + WEIGHT[s.level], 0) / recent.length);
  }, [scans]);

  const perModule = useMemo(() => Object.keys(moduleMeta).map((id) => {
    const list = scans.filter((s) => s.module === id);
    const avg = list.length ? Math.round(list.reduce((a, s) => a + WEIGHT[s.level], 0) / list.length) : 0;
    return { id, count: list.length, avg };
  }), [scans]);

  const evidence = scans.filter((s) => tab === "all" || s.module === tab);
  const overallLevel = overall >= 60 ? "high" : overall >= 30 ? "medium" : "low";
  const tone = overallLevel === "high" ? "var(--danger)" : overallLevel === "medium" ? "var(--warn)" : "var(--safe)";

  const toggle = (id) => setDone((d) => { const n = new Set(d); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const report = async () => { setBusy(true); await sleep(1400); setBusy(false); toast.success("Sample report prepared (DEMO)", "Real PDF export arrives with the backend."); };

  return (
    <>
      <PageHeader title="Scam Intelligence" demo description="One view that combines evidence from the QR Analyzer, DeepTruth, VoiceGuard and LinkShield. Run scans in those modules and they appear here."
        actions={<Button variant="secondary" icon={FileDown} loading={busy} onClick={report}>Generate sample report</Button>} />

      <div className="grid grid-main-side">
        <Card title="Risk overview" subtitle="Based on your 10 most recent scans" action={<DemoBadge />}>
          <div className="row" style={{ gap: 28 }}>
            <div className="stack-sm" style={{ alignItems: "center" }}>
              <ScoreRing value={overall} size={150} caption="risk" tone={tone} />
              <LevelBadge level={overallLevel}>{overallLevel === "high" ? "Elevated" : overallLevel === "medium" ? "Moderate" : "Low"} exposure</LevelBadge>
            </div>
            <div className="grow risk-bars" style={{ minWidth: 220 }}>
              {perModule.map(({ id, count, avg }) => {
                const Icon = ICON[id];
                return (
                  <div className="risk-bar-row" key={id}>
                    <div className="head"><span className="row" style={{ gap: 8 }}><Icon size={15} color="var(--cyan)" />{moduleMeta[id].label}</span><span className="muted">{count} scan{count === 1 ? "" : "s"}</span></div>
                    <div className={`progress ${avg >= 60 ? "danger" : avg >= 30 ? "warn" : "safe"}`}><span style={{ width: `${Math.max(avg, count ? 6 : 0)}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
        <Card title="Activity timeline"><ActivityTimeline items={timeline} limit={6} /></Card>
      </div>

      <h2 style={{ fontSize: 18, margin: "30px 0 14px" }}>Evidence</h2>
      <div style={{ marginBottom: 16 }}><Tabs tabs={TABS} value={tab} onChange={setTab} label="Filter evidence by module" /></div>
      {evidence.length === 0 ? (
        <Card><div className="empty">No evidence from this module yet. <Link to={PATH[tab]}>Run a scan</Link> to add some.</div></Card>
      ) : (
        <div className="grid grid-3">
          {evidence.slice(0, 9).map((s) => {
            const Icon = ICON[s.module];
            return (
              <Card key={s.id} hover>
                <div className="evidence-card">
                  <div className="meta"><span className="row" style={{ gap: 8 }}><Icon size={16} color="var(--cyan)" /><span className="text-sm muted">{moduleMeta[s.module].label}</span></span><LevelBadge level={s.level}>{s.label}</LevelBadge></div>
                  <h3 style={{ fontSize: 15, overflowWrap: "anywhere" }}>{s.title}</h3>
                  <p className="muted text-sm" style={{ flex: 1 }}>{s.detail || s.subject}</p>
                  <div className="row-between text-xs muted"><span>{timeAgo(s.at)}</span><Link to={PATH[s.module]}>Open module →</Link></div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid grid-main-side section-gap" style={{ marginTop: 28 }}>
        <Card title="Recommended actions" subtitle={`${done.size} of ${recommendedActions.length} done`}>
          <div className="progress" style={{ marginBottom: 8 }}><span style={{ width: `${(done.size / recommendedActions.length) * 100}%` }} /></div>
          {recommendedActions.map((a) => (
            <label key={a.id} className={`action-item ${done.has(a.id) ? "done" : ""}`} style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={done.has(a.id)} onChange={() => { toggle(a.id); }} style={{ accentColor: "var(--blue)", width: 17, height: 17, marginTop: 3 }} />
              <div><div className="t" style={{ fontWeight: 600 }}>{a.title}</div><div className="muted text-sm">{a.body}</div></div>
            </label>
          ))}
        </Card>
        <Card title="If you have been scammed" icon={ShieldAlert}>
          <div className="stack-sm">
            <div className="callout danger"><Phone size={18} /><div>Call <b>1930</b> (National Cyber Crime Helpline) immediately — the first hours matter most.</div></div>
            <p className="muted text-sm">Then report at <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer noopener">cybercrime.gov.in</a> and inform your bank to block the transaction or card.</p>
          </div>
          <div style={{ marginTop: 14 }}><DemoNotice>Scores here are simple averages of demo results, not a real risk model.</DemoNotice></div>
        </Card>
      </div>
    </>
  );
}
