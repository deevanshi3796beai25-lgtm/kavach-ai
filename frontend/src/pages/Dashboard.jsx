import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ScanSearch, ShieldAlert, ShieldCheck, Activity, ArrowRight } from "lucide-react";
import { Card, ScoreRing, Modal, Button, DemoBadge, LevelBadge, PageHeader } from "../components/common/index.js";
import { StatCard, ScanList, AlertList, ActivityTimeline, ModuleCard, QuickActions } from "../components/dashboard/index.js";
import { moduleNav } from "../routes/navigation.js";
import { useApp } from "../hooks/useApp.js";
import { useToast } from "../hooks/useToast.js";
import { timeAgo } from "../utils/format.js";

export default function Dashboard() {
  const { user, scans, alerts, timeline, dismissAlert } = useApp();
  const toast = useToast();
  const [openAlert, setOpenAlert] = useState(null);

  const stats = useMemo(() => {
    const flagged = scans.filter((s) => s.level === "high").length;
    const review = scans.filter((s) => s.level === "medium").length;
    const clear = scans.filter((s) => s.level === "low").length;
    const score = Math.max(30, Math.min(98, 70 + clear * 4 - flagged * 3 - review * 1));
    return { flagged, review, clear, score };
  }, [scans]);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <div className="welcome">
        <div>
          <div className="row" style={{ marginBottom: 6 }}><DemoBadge>DEMO DATA</DemoBadge></div>
          <h1>{greet}, {user.name.split(" ")[0]} 👋</h1>
          <p className="muted" style={{ marginTop: 6, maxWidth: 520 }}>Here is your protection overview. Pause and verify before you pay — that habit stops most scams.</p>
        </div>
        <div className="row"><Link to="/app/qr-upi" className="btn btn-primary"><ShieldCheck size={16} />Start a scan</Link><Link to="/app/safepause" className="btn btn-secondary">Try SafePause</Link></div>
      </div>

      <div className="grid grid-4">
        <StatCard icon={ScanSearch} label="Total scans" value={scans.length} note="Includes sample data" />
        <StatCard icon={ShieldAlert} label="High-risk findings" value={stats.flagged} tone="danger" />
        <StatCard icon={Activity} label="Need your review" value={stats.review} tone="warn" />
        <StatCard icon={ShieldCheck} label="Cleared" value={stats.clear} tone="safe" />
      </div>

      <div className="grid grid-main-side section-gap">
        <Card title="Protection overview" subtitle="A simple demo score based on your recent scans" action={<DemoBadge />}>
          <div className="row" style={{ gap: 28 }}>
            <ScoreRing value={stats.score} caption="protection" tone={stats.score >= 75 ? "var(--safe)" : "var(--warn)"} size={150} />
            <div className="grow stack-sm" style={{ minWidth: 220 }}>
              {[["QR & UPI checks", 88], ["Link safety", 64], ["Call awareness", 72]].map(([n, v]) => (
                <div key={n}><div className="row-between text-sm"><span>{n}</span><span className="muted">{v}%</span></div><div className="progress" aria-hidden="true"><span style={{ width: `${v}%` }} /></div></div>
              ))}
            </div>
          </div>
        </Card>
        <Card title="Quick actions"><QuickActions /></Card>
      </div>

      <div className="grid grid-2 section-gap">
        <Card title="Recent scans" action={<DemoBadge />}><ScanList scans={scans} /></Card>
        <Card title="Recent alerts" action={<span className="badge badge-danger">{alerts.length} active</span>}>
          <AlertList alerts={alerts} onOpen={setOpenAlert} onDismiss={(a) => { dismissAlert(a.id); toast.success("Alert dismissed"); }} />
        </Card>
      </div>

      <div className="grid grid-main-side section-gap">
        <Card title="Security activity" subtitle="Latest events across all modules" action={<DemoBadge />}><ActivityTimeline items={timeline} /></Card>
        <Card title="Safety reminder">
          <div className="callout"><ShieldCheck size={18} /><div>Your bank will <b>never</b> ask for your UPI PIN or OTP over a call or message. If someone does, hang up and dial <b>1930</b>.</div></div>
          <div style={{ marginTop: 14 }}><Link className="btn btn-secondary btn-sm" to="/app/intelligence">See recommended actions <ArrowRight size={14} /></Link></div>
        </Card>
      </div>

      <h2 style={{ fontSize: 18, margin: "32px 0 14px" }}>Protection modules</h2>
      <div className="grid grid-3">
        {moduleNav.map((m, i) => <ModuleCard key={m.path} to={m.path} icon={m.icon} label={m.label} desc={m.desc} tone={i % 2 ? "purple" : ""} />)}
      </div>

      <Modal open={!!openAlert} onClose={() => setOpenAlert(null)} title={openAlert?.title || ""}
        footer={<><Button variant="secondary" onClick={() => setOpenAlert(null)}>Close</Button><Button onClick={() => { dismissAlert(openAlert.id); setOpenAlert(null); toast.success("Alert dismissed"); }}>Dismiss alert</Button></>}>
        {openAlert && (<div className="stack-sm"><div className="row"><LevelBadge level={openAlert.level}>{openAlert.level} priority</LevelBadge><DemoBadge /><span className="muted text-sm">{timeAgo(openAlert.at)}</span></div><p>{openAlert.body}</p></div>)}
      </Modal>
    </>
  );
}
