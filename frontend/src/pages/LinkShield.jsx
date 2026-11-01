import { useState } from "react";
import { Link2, Search, RotateCcw, Globe } from "lucide-react";
import { Button, Card, DemoNotice, FormField, LoadingPanel, PageHeader } from "../components/common/index.js";
import { IndicatorList, RiskResultCard } from "../components/security/index.js";
import { useSimulatedTask } from "../hooks/useSimulatedTask.js";
import { useApp } from "../hooks/useApp.js";
import { useToast } from "../hooks/useToast.js";
import { analyzeLink } from "../services/mockAnalysis.js";
import { url as urlRule } from "../utils/validators.js";

const SAMPLES = ["https://kyc-update-sbi.help/login", "http://192.168.4.20/pay", "https://www.irctc.co.in", "https://bit.ly/3xYzAb"];

export default function LinkShield() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const task = useSimulatedTask();
  const { addScan } = useApp();
  const toast = useToast();
  const res = task.result;

  const submit = async (e) => {
    e?.preventDefault();
    const err = urlRule(value);
    setError(err);
    if (err) return toast.error("Check the link", err);
    const r = await task.run(() => analyzeLink(value));
    if (r) {
      addScan({ module: "link", title: r.domain, subject: "Link analysis", level: r.level, label: r.level === "high" ? "HIGH RISK" : r.level === "medium" ? "SUSPICIOUS" : "LOW RISK", detail: r.recommendation });
      toast.success("Analysis complete (DEMO)", r.label);
    }
  };
  const fill = (s) => { setValue(s); setError(""); task.reset(); };

  return (
    <>
      <PageHeader title="LinkShield" demo description="Paste a link you received by SMS, WhatsApp or email. LinkShield checks the link text for known scam patterns — without ever opening the page." />
      <div className="grid grid-main-side" style={{ alignItems: "start" }}>
        <div className="stack">
          <Card title="Check a link" icon={Link2}>
            <form onSubmit={submit} noValidate>
              <FormField label="Link / URL" value={value} onChange={(e) => { setValue(e.target.value); if (error) setError(""); }} placeholder="https://example.com/offer" error={error} inputMode="url" autoComplete="off" spellCheck={false} />
              <div className="row" style={{ marginTop: 14 }}>
                <Button type="submit" icon={Search} loading={task.loading}>{task.loading ? "Analysing…" : "Analyze link"}</Button>
                {(value || res) && <Button variant="ghost" icon={RotateCcw} onClick={() => { setValue(""); setError(""); task.reset(); }} disabled={task.loading}>Clear</Button>}
              </div>
            </form>
            <div style={{ marginTop: 18 }}>
              <div className="label" style={{ marginBottom: 8 }}>Try a sample</div>
              <div className="chip-row">{SAMPLES.map((s) => <button key={s} className="chip" onClick={() => fill(s)} style={{ maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.replace(/^https?:\/\//, "")}</button>)}</div>
            </div>
          </Card>

          {task.loading && <Card><LoadingPanel message="Checking link patterns…" /></Card>}
          {res && !task.loading && (
            <>
              <RiskResultCard level={res.level} label={res.label} score={res.score} caption="risk" headline={res.domain} summary={res.recommendation} />
              <Card title="Threat indicators" subtitle="What we looked at in the link text"><IndicatorList items={res.indicators} /></Card>
            </>
          )}
        </div>

        <div className="stack">
          {res && !task.loading ? (
            <Card title="Domain analysis" icon={Globe} action={<span className="badge badge-demo">SAMPLE</span>}>
              <dl className="kv">
                <dt>Domain</dt><dd className="mono">{res.domain}</dd>
                <dt>Registered name</dt><dd className="mono">{res.registrable}</dd>
                <dt>Full link</dt><dd className="mono">{res.url}</dd>
                <dt>Domain age</dt><dd className="muted">Not checked</dd>
                <dt>Page opened?</dt><dd>No — never</dd>
              </dl>
            </Card>
          ) : (
            <Card title="How LinkShield reads a link"><ul className="stack-sm text-sm muted"><li>• Is it encrypted (HTTPS)?</li><li>• Does it use a raw IP address?</li><li>• Is it pretending to be a known brand?</li><li>• Does it use pressure words such as “KYC”, “refund”, “blocked”?</li><li>• Does it hide behind a link shortener?</li></ul></Card>
          )}
          <DemoNotice>Rule-of-thumb checks on the link text only. No domain-age, threat-feed or page-content lookups are made yet.</DemoNotice>
        </div>
      </div>
    </>
  );
}
