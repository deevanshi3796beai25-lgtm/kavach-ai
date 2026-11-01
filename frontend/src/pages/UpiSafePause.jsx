import { useEffect, useState } from "react";
import { PauseCircle, ShieldCheck, ShieldAlert, HelpCircle, XCircle, Eye, UserRound, IndianRupee } from "lucide-react";
import { Button, Card, DemoNotice, FormField, LoadingPanel, Modal, PageHeader, DemoBadge } from "../components/common/index.js";
import { IndicatorList } from "../components/security/index.js";
import { useSimulatedTask } from "../hooks/useSimulatedTask.js";
import { useToast } from "../hooks/useToast.js";
import { checkRecipient } from "../services/mockAnalysis.js";
import { safePauseSamples } from "../services/mockData.js";
import { validate, required, upiId, amount as amountRule } from "../utils/validators.js";
import { formatINR } from "../utils/format.js";

const BANNER = {
  verified: { tone: "safe", Icon: ShieldCheck, title: "Recipient matches a verified record" },
  unverified: { tone: "warn", Icon: HelpCircle, title: "We could not verify this recipient" },
  risk: { tone: "danger", Icon: ShieldAlert, title: "Warning: this recipient shows risk signals" },
};
const SCHEMA = { name: (v) => required(v, "Recipient name"), upiId: [(v) => required(v, "UPI ID"), upiId], amount: amountRule };

export default function UpiSafePause() {
  const [form, setForm] = useState({ name: "", upiId: "", amount: "", note: "" });
  const [errors, setErrors] = useState({});
  const [paused, setPaused] = useState(null); // frozen snapshot shown in the checkpoint
  const [reviewOpen, setReviewOpen] = useState(false);
  const [ack, setAck] = useState(false);
  const [wait, setWait] = useState(0);
  const task = useSimulatedTask();
  const toast = useToast();

  // short cooling-off timer for risk-flagged recipients
  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); if (errors[k]) setErrors((x) => ({ ...x, [k]: "" })); };
  const pick = (s) => { setForm({ name: s.name, upiId: s.upiId, amount: s.amount, note: "" }); setErrors({}); setPaused(null); task.reset(); };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(form, SCHEMA);
    setErrors(errs);
    if (Object.keys(errs).length) return toast.error("Please fix the highlighted fields");
    const snap = { ...form };
    const r = await task.run(() => checkRecipient(snap));
    if (r) { setPaused({ ...snap, ...r }); setAck(false); setWait(r.key === "risk" ? 5 : 0); toast.warning("Payment paused (simulation)", "Review the recipient before continuing."); }
  };

  const cancel = () => { setPaused(null); setReviewOpen(false); task.reset(); toast.success("Payment cancelled", "Nothing was sent — this is only a simulation."); };
  const proceed = () => { setReviewOpen(false); setPaused(null); task.reset(); toast.info("Simulation complete", "No real payment was made. A real checkpoint would hand back to your UPI app here."); };

  const b = paused && BANNER[paused.key];
  const checklist = paused && [
    { type: paused.key === "verified" ? "pass" : "warn", title: "Recipient verification", body: paused.info.headline },
    { type: paused.highAmount ? "warn" : "pass", title: "Payment amount", body: paused.highAmount ? "This is a large amount. Double-check the recipient on a trusted channel." : "Amount is within a typical range." },
    { type: "warn", title: "Did someone pressure you?", body: "Urgency, secrecy or ‘pay a fee to receive money’ are classic scam signs." },
  ];

  return (
    <>
      <PageHeader title="UPI SafePause" demo description="A simulated safety checkpoint that appears before a payment. It helps you slow down and verify. No real payment functionality exists here." />
      <div className="callout warn" style={{ marginBottom: 20 }}><PauseCircle size={18} /><div><b>Simulation only.</b> Nothing on this page sends money, connects to UPI or contacts a bank.</div></div>

      {!paused && !task.loading && (
        <div className="grid grid-main-side" style={{ alignItems: "start" }}>
          <Card title="Payment you are about to make" icon={IndianRupee}>
            <form className="stack" onSubmit={submit} noValidate>
              <FormField label="Recipient name" value={form.name} onChange={set("name")} error={errors.name} placeholder="e.g. Corner Mart" autoComplete="off" />
              <FormField label="UPI ID" value={form.upiId} onChange={set("upiId")} error={errors.upiId} placeholder="name@bank" autoComplete="off" spellCheck={false} />
              <FormField label="Amount (₹)" value={form.amount} onChange={set("amount")} error={errors.amount} placeholder="0.00" inputMode="decimal" />
              <FormField label="Note (optional)" value={form.note} onChange={set("note")} placeholder="What is this payment for?" />
              <div><Button type="submit" size="lg" icon={PauseCircle}>Pay — with SafePause</Button></div>
            </form>
          </Card>
          <Card title="Try a sample recipient" subtitle="Tap to fill the form">
            <div className="stack-sm">
              {safePauseSamples.map((s) => (
                <button key={s.upiId} className="quick-action" style={{ width: "100%" }} onClick={() => pick(s)}>
                  <b>{s.name}</b><span className="mono">{s.upiId}</span><span>{formatINR(s.amount)}</span>
                </button>
              ))}
            </div>
            <p className="hint" style={{ marginTop: 12 }}>These are fictional recipients. In this demo, any UPI ID containing words like “refund”, “prize” or “kyc” is flagged.</p>
          </Card>
        </div>
      )}

      {task.loading && <Card className="pause-card"><LoadingPanel message="Running safety checks…" /></Card>}

      {paused && !task.loading && (
        <Card className="pause-card" title="Payment paused" icon={PauseCircle} action={<DemoBadge />}>
          <div className={`pause-banner ${b.tone}`}><b.Icon size={28} aria-hidden="true" /><div><div style={{ fontWeight: 700 }}>{b.title}</div><div className="muted text-sm">{paused.info.label} · {paused.info.meaning}</div></div></div>
          <div className="pause-amount">{formatINR(paused.amount)}</div>
          <dl className="kv" style={{ margin: "14px 0 20px" }}>
            <dt><UserRound size={14} style={{ verticalAlign: -2 }} /> Recipient</dt><dd>{paused.name}</dd>
            <dt>UPI ID</dt><dd className="mono">{paused.upiId}</dd>
            <dt>Verification</dt><dd><b>{paused.info.label}</b></dd>
            {paused.note && (<><dt>Note</dt><dd>{paused.note}</dd></>)}
          </dl>
          <div className="row">
            <Button size="lg" icon={Eye} onClick={() => setReviewOpen(true)}>Review</Button>
            <Button size="lg" variant="danger" icon={XCircle} onClick={cancel}>Cancel payment</Button>
          </div>
          <p className="hint" style={{ marginTop: 12 }}>Unverified is not the same as fraudulent — it means we could not confirm who this is.</p>
        </Card>
      )}
      {paused && <div className="pause-card" style={{ marginTop: 16 }}><DemoNotice>Verification result is simulated from the UPI ID text only.</DemoNotice></div>}

      <Modal open={reviewOpen} onClose={() => setReviewOpen(false)} wide title="Review before you pay"
        footer={<><Button variant="danger" onClick={cancel}>Cancel payment</Button><Button disabled={!ack || wait > 0} onClick={proceed}>{wait > 0 ? <span className="countdown">Wait {wait}s…</span> : "I understand — continue (simulated)"}</Button></>}>
        {paused && (
          <div className="stack">
            <IndicatorList items={checklist} />
            <label className="check"><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /><span>I have confirmed who I am paying through a channel I trust, and nobody is rushing me.</span></label>
            {paused.key === "risk" && <div className="callout danger"><ShieldAlert size={18} /><div>This recipient is risk-flagged. A short wait is added so you have time to reconsider.</div></div>}
          </div>
        )}
      </Modal>
    </>
  );
}
