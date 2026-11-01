import { useState } from "react";
import { FileText, ToggleRight, Download, Pencil, Trash2, MessageSquareWarning, History, Info } from "lucide-react";
import { Button, Card, FormField, Modal, PageHeader, Tabs, Toggle, Badge, DemoBadge } from "../components/common/index.js";
import { useApp } from "../hooks/useApp.js";
import { useToast } from "../hooks/useToast.js";
import { privacyNotice } from "../services/mockData.js";
import { validate, required, email, minLength } from "../utils/validators.js";
import { uid } from "../utils/format.js";

const TABS = [
  { id: "notice", label: "Notice", icon: FileText },
  { id: "consent", label: "Consent", icon: ToggleRight },
  { id: "requests", label: "Data requests", icon: Download },
  { id: "grievance", label: "Grievance", icon: MessageSquareWarning },
  { id: "history", label: "Consent history", icon: History },
];
const PURPOSES = [
  { id: "essential", label: "Essential security processing", description: "Needed to analyse what you submit. Cannot be turned off.", locked: true },
  { id: "history", label: "Scan history storage", description: "Keep your past results so you can review them." },
  { id: "improve", label: "Product improvement", description: "Use anonymised results to improve detection." },
  { id: "analytics", label: "Usage analytics", description: "Help us understand which features are used." },
  { id: "alerts", label: "Safety alerts & tips", description: "Receive scam alerts and awareness tips." },
];
const REQ_TYPES = {
  access: { title: "Access my data", icon: Download, desc: "Get a summary of the personal data we hold about you." },
  correction: { title: "Correct my data", icon: Pencil, desc: "Ask us to fix inaccurate or incomplete information." },
  erasure: { title: "Erase my data", icon: Trash2, desc: "Ask us to delete your personal data." },
};
const fmt = (d) => new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function PrivacyCentre() {
  const { user, consentHistory, addConsentEvent } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState("notice");
  const [consent, setConsent] = useState({ essential: true, history: true, improve: false, analytics: false, alerts: true });
  const [saved, setSaved] = useState(consent);
  const [reqModal, setReqModal] = useState(null);
  const [req, setReq] = useState({ email: user.email, details: "", confirm: false });
  const [reqErr, setReqErr] = useState({});
  const [requests, setRequests] = useState([]);
  const [gr, setGr] = useState({ subject: "", email: user.email, message: "" });
  const [grErr, setGrErr] = useState({});

  const dirty = JSON.stringify(consent) !== JSON.stringify(saved);

  const saveConsent = () => {
    PURPOSES.forEach((p) => { if (consent[p.id] !== saved[p.id]) addConsentEvent(consent[p.id] ? "Granted" : "Withdrawn", p.label); });
    setSaved(consent);
    toast.success("Consent preferences saved", "Changes are recorded in your consent history.");
  };

  const openReq = (type) => { setReq({ email: user.email, details: "", confirm: false }); setReqErr({}); setReqModal(type); };
  const submitReq = () => {
    const schema = { email, details: reqModal === "access" ? () => "" : minLength(10, "Details") };
    const errs = validate(req, schema);
    if (reqModal === "erasure" && !req.confirm) errs.confirm = "Please confirm you want your data erased.";
    setReqErr(errs);
    if (Object.keys(errs).length) return;
    const id = `REQ-${uid("").slice(1, 7).toUpperCase()}`;
    setRequests((r) => [{ id, type: reqModal, at: new Date().toISOString() }, ...r]);
    toast.success("Request logged (demo)", `Reference ${id}. Nothing is sent anywhere in this version.`);
    setReqModal(null);
  };
  const submitGr = (e) => {
    e.preventDefault();
    const errs = validate(gr, { subject: (v) => required(v, "Subject"), email, message: minLength(20, "Description") });
    setGrErr(errs);
    if (Object.keys(errs).length) return toast.error("Please fix the highlighted fields");
    toast.success("Grievance recorded (demo)", `Reference GRV-${uid("").slice(1, 7).toUpperCase()}`);
    setGr({ subject: "", email: user.email, message: "" });
  };

  return (
    <>
      <PageHeader title="Privacy Centre" demo description="Understand how your data is used and exercise your choices. Designed around the principles of India's Digital Personal Data Protection Act, 2023 — this demo is not legal advice or a compliance claim." />
      <div style={{ marginBottom: 20 }}><Tabs tabs={TABS} value={tab} onChange={setTab} label="Privacy sections" /></div>

      {tab === "notice" && (
        <div className="grid grid-2">
          {privacyNotice.map((n) => <Card key={n.title} title={n.title}><p className="muted">{n.body}</p></Card>)}
          <Card className="" title="Placeholder notice" icon={Info}><p className="muted text-sm">This is sample text. Your real privacy notice should be reviewed by a qualified legal professional before launch and offered in the languages your users speak.</p></Card>
        </div>
      )}

      {tab === "consent" && (
        <Card title="Consent preferences" subtitle="Choose what we may do with your data. You can change this at any time.">
          {PURPOSES.map((p) => <Toggle key={p.id} label={p.label} description={p.description} checked={consent[p.id]} disabled={p.locked} onChange={(v) => setConsent((c) => ({ ...c, [p.id]: v }))} />)}
          <div className="row" style={{ marginTop: 18 }}>
            <Button disabled={!dirty} onClick={saveConsent}>Save preferences</Button>
            <Button variant="ghost" disabled={!dirty} onClick={() => setConsent(saved)}>Reset</Button>
            {dirty && <Badge tone="warn">Unsaved changes</Badge>}
          </div>
        </Card>
      )}

      {tab === "requests" && (
        <div className="stack">
          <div className="grid grid-3">
            {Object.entries(REQ_TYPES).map(([k, r]) => (
              <Card key={k} hover><div className="feature-card"><span className={`icon-chip ${k === "erasure" ? "danger" : ""}`}><r.icon size={20} /></span><h3 style={{ fontSize: 16 }}>{r.title}</h3><p className="muted text-sm" style={{ flex: 1 }}>{r.desc}</p><Button variant={k === "erasure" ? "danger" : "secondary"} onClick={() => openReq(k)}>Start request</Button></div></Card>
            ))}
          </div>
          <Card title="Your requests this session" action={<DemoBadge />}>
            {requests.length === 0 ? <div className="empty">No requests yet.</div> : (
              <div className="consent-table">{requests.map((r) => <div className="row-item" key={r.id}><div><b>{REQ_TYPES[r.type].title}</b><div className="muted text-xs mono">{r.id}</div></div><div className="row"><Badge tone="info">Logged</Badge><span className="muted text-sm">{fmt(r.at)}</span></div></div>)}</div>
            )}
          </Card>
        </div>
      )}

      {tab === "grievance" && (
        <Card title="Raise a grievance" icon={MessageSquareWarning} subtitle="Tell us about a privacy concern or a problem with how we handled your data." className="" >
          <form className="stack" onSubmit={submitGr} noValidate style={{ maxWidth: 640 }}>
            <FormField label="Subject" value={gr.subject} error={grErr.subject} onChange={(e) => setGr({ ...gr, subject: e.target.value })} />
            <FormField label="Your email" type="email" value={gr.email} error={grErr.email} onChange={(e) => setGr({ ...gr, email: e.target.value })} />
            <FormField label="Describe the issue" kind="textarea" value={gr.message} error={grErr.message} hint="At least 20 characters" onChange={(e) => setGr({ ...gr, message: e.target.value })} />
            <div><Button type="submit">Submit grievance</Button></div>
          </form>
        </Card>
      )}

      {tab === "history" && (
        <Card title="Consent history" action={<DemoBadge />}>
          <div className="consent-table">
            {consentHistory.map((c) => (
              <div className="row-item" key={c.id}><div><b>{c.purpose}</b><div className="muted text-sm">{fmt(c.at)}</div></div><Badge tone={c.action === "Granted" ? "safe" : "warn"}>{c.action}</Badge></div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={!!reqModal} onClose={() => setReqModal(null)} title={reqModal ? REQ_TYPES[reqModal].title : ""}
        footer={<><Button variant="secondary" onClick={() => setReqModal(null)}>Cancel</Button><Button variant={reqModal === "erasure" ? "danger" : "primary"} onClick={submitReq}>Submit request</Button></>}>
        {reqModal && (
          <div className="stack">
            <p className="muted text-sm">{REQ_TYPES[reqModal].desc}</p>
            <FormField label="Contact email" type="email" value={req.email} error={reqErr.email} onChange={(e) => setReq({ ...req, email: e.target.value })} />
            {reqModal !== "access" && <FormField label={reqModal === "erasure" ? "What should be erased?" : "What should be corrected?"} kind="textarea" value={req.details} error={reqErr.details} onChange={(e) => setReq({ ...req, details: e.target.value })} hint="At least 10 characters" />}
            {reqModal === "erasure" && (<div><label className="check"><input type="checkbox" checked={req.confirm} onChange={(e) => setReq({ ...req, confirm: e.target.checked })} /><span>I understand erasure may remove my scan history and cannot be undone.</span></label>{reqErr.confirm && <p className="error-text" role="alert" style={{ marginTop: 6 }}>{reqErr.confirm}</p>}</div>)}
          </div>
        )}
      </Modal>
    </>
  );
}
