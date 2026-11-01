import { useState } from "react";
import { Link } from "react-router-dom";
import { ScanLine, QrCode, BadgeCheck, HelpCircle, ShieldAlert, PauseCircle, RotateCcw, Copy } from "lucide-react";
import { Button, Card, DemoBadge, DemoNotice, FileDropzone, LoadingPanel, PageHeader } from "../components/common/index.js";
import { IndicatorList, MediaPreview, VerificationStatusCard } from "../components/security/index.js";
import { useFileUpload } from "../hooks/useFileUpload.js";
import { useSimulatedTask } from "../hooks/useSimulatedTask.js";
import { useApp } from "../hooks/useApp.js";
import { useToast } from "../hooks/useToast.js";
import { analyzeQr } from "../services/mockAnalysis.js";

const IMG = ["image/"];
const STATUS_LABEL = { verified: "VERIFIED", unverified: "UNVERIFIED", risk: "RISK-FLAGGED" };
const SCENARIOS = [["auto", "Auto"], ["verified", "Verified"], ["unverified", "Unverified"], ["risk", "Risk-flagged"]];

export default function QrUpiAnalyzer() {
  const upload = useFileUpload({ accept: IMG, maxMB: 10 });
  const task = useSimulatedTask();
  const { addScan } = useApp();
  const toast = useToast();
  const [scenario, setScenario] = useState("auto");

  const onFile = (f) => { if (upload.select(f)) { task.reset(); toast.info("QR image added", f.name); } };

  const analyze = async () => {
    if (!upload.file) return toast.warning("Add a QR image first", "Upload or drop a QR code image to analyse.");
    const res = await task.run(() => analyzeQr(upload.file, scenario));
    if (res) {
      addScan({ module: "qr", title: `QR — ${res.payee.name}`, subject: res.payee.upiId, level: res.info.level, label: STATUS_LABEL[res.key], detail: res.info.meaning });
      toast.success("Analysis complete (DEMO)", res.info.label);
    }
  };
  const reset = () => { upload.clear(); task.reset(); };
  const res = task.result;

  return (
    <>
      <PageHeader title="QR & UPI Analyzer" demo description="Upload a payment QR to review who you are about to pay. A beneficiary we cannot verify is shown as unverified — never automatically as fraud." />
      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <div className="stack">
          <Card title="1. Upload QR image" icon={QrCode} subtitle="PNG, JPG or WEBP up to 10 MB">
            {!upload.file ? (
              <FileDropzone onFile={onFile} accept="image/*" title="Drag & drop a QR image" hint="Images stay in your browser in this demo" error={upload.error} icon={QrCode} />
            ) : (
              <MediaPreview file={upload.file} url={upload.previewUrl} kind="image" onRemove={reset} />
            )}
            <div style={{ marginTop: 16 }}>
              <div className="label" style={{ marginBottom: 8 }}>Demo outcome to simulate</div>
              <div className="chip-row" role="group" aria-label="Demo outcome">
                {SCENARIOS.map(([v, l]) => <button key={v} className="chip" aria-pressed={scenario === v} onClick={() => setScenario(v)}>{l}</button>)}
              </div>
              <p className="scenario-note" style={{ marginTop: 8 }}>The QR is not actually decoded in this version. “Auto” picks an outcome from the file; choose one to preview each state.</p>
            </div>
            <div className="row" style={{ marginTop: 18 }}>
              <Button icon={ScanLine} loading={task.loading} onClick={analyze}>{task.loading ? "Analysing…" : "Analyze QR"}</Button>
              {(upload.file || res) && <Button variant="ghost" icon={RotateCcw} onClick={reset} disabled={task.loading}>Start over</Button>}
            </div>
          </Card>

          <Card title="Understanding the three states" subtitle="What each result means">
            <div className="three-states">
              <div className="state-row"><span className="icon-chip safe"><BadgeCheck size={18} /></span><div><b>VERIFIED</b><p>The payee matches a trusted source, such as a registered merchant. Lower risk — not a guarantee.</p></div></div>
              <div className="state-row"><span className="icon-chip warn"><HelpCircle size={18} /></span><div><b>UNKNOWN / UNVERIFIED</b><p>We have no information to confirm the payee. This is normal for individuals and new shops and <b>does not mean fraud</b>. Confirm identity yourself.</p></div></div>
              <div className="state-row"><span className="icon-chip danger"><ShieldAlert size={18} /></span><div><b>RISK-FLAGGED</b><p>A specific risk signal was found, such as a scam-like pattern or a report. Pause and double-check.</p></div></div>
            </div>
          </Card>
        </div>

        <div className="stack">
          {task.loading && <Card><LoadingPanel message="Reading QR and checking payee…" /></Card>}

          {!task.loading && !res && (
            <Card title="Results" action={<DemoBadge />}><div className="empty"><QrCode size={34} style={{ opacity: .5 }} /><p style={{ marginTop: 8 }}>Upload a QR image and press <b>Analyze QR</b> to see extracted payment details and a verification status.</p></div></Card>
          )}

          {res && !task.loading && (
            <>
              <VerificationStatusCard statusKey={res.key} info={res.info} />
              <Card title="Extracted payment details" action={<DemoBadge>SAMPLE DATA</DemoBadge>}>
                <dl className="kv">
                  <dt>Payee name</dt><dd>{res.payee.name}</dd>
                  <dt>UPI ID</dt><dd className="mono">{res.payee.upiId}</dd>
                  <dt>Merchant category</dt><dd>{res.payee.merchantCode}</dd>
                  <dt>Amount in QR</dt><dd>{res.payee.amount}</dd>
                  <dt>Note</dt><dd>{res.payee.note}</dd>
                </dl>
                <div className="row" style={{ marginTop: 14 }}>
                  <Button variant="secondary" size="sm" icon={Copy} onClick={() => { navigator.clipboard?.writeText(res.payee.upiId).then(() => toast.success("UPI ID copied"), () => toast.error("Could not copy")); }}>Copy UPI ID</Button>
                </div>
              </Card>
              <Card title="Why this status?"><IndicatorList items={res.reasons} /></Card>
              <DemoNotice>The payee details above are sample data and no bank or registry lookup happened.</DemoNotice>
              <Link to="/app/safepause" className="btn btn-secondary"><PauseCircle size={16} />Continue to UPI SafePause</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
