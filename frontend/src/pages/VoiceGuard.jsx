import { AudioLines, Music, RotateCcw, FileText } from "lucide-react";
import { Button, Card, DemoNotice, FileDropzone, LoadingPanel, PageHeader, Badge } from "../components/common/index.js";
import { IndicatorList, MediaPreview, RiskResultCard } from "../components/security/index.js";
import { useFileUpload } from "../hooks/useFileUpload.js";
import { useSimulatedTask } from "../hooks/useSimulatedTask.js";
import { useApp } from "../hooks/useApp.js";
import { useToast } from "../hooks/useToast.js";
import { analyzeVoice } from "../services/mockAnalysis.js";

export default function VoiceGuard() {
  const upload = useFileUpload({ accept: ["audio/"], maxMB: 25 });
  const task = useSimulatedTask();
  const { addScan } = useApp();
  const toast = useToast();
  const res = task.result;

  const analyze = async () => {
    if (!upload.file) return toast.warning("Add an audio file first", "Upload a call recording to analyse.");
    const r = await task.run(analyzeVoice);
    if (r) {
      addScan({ module: "voice", title: upload.file.name, subject: "Voice analysis", level: r.level, label: "SCAM LANGUAGE", detail: "Scam-like phrases were found in the sample transcript." });
      toast.success("Analysis complete (DEMO)", r.label);
    }
  };
  const reset = () => { upload.clear(); task.reset(); };

  return (
    <>
      <PageHeader title="VoiceGuard" demo description="Upload a call recording to look for pressure tactics and scam language. Transcription and detection here are simulated with a fixed sample." />
      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <Card title="Upload call audio" icon={Music} subtitle="MP3, WAV, M4A or OGG up to 25 MB">
          {!upload.file ? (
            <FileDropzone onFile={(f) => { if (upload.select(f)) { task.reset(); toast.info("Audio added", f.name); } }} accept="audio/*" title="Drag & drop a call recording" hint="Audio is played back locally and not uploaded anywhere" error={upload.error} icon={AudioLines} />
          ) : (<MediaPreview file={upload.file} url={upload.previewUrl} kind="audio" onRemove={reset} />)}
          <div className="row" style={{ marginTop: 18 }}>
            <Button icon={AudioLines} loading={task.loading} onClick={analyze}>{task.loading ? "Analysing…" : "Analyze call"}</Button>
            {(upload.file || res) && <Button variant="ghost" icon={RotateCcw} onClick={reset} disabled={task.loading}>Start over</Button>}
          </div>
          <div className="callout" style={{ marginTop: 18 }}><FileText size={18} /><div>Only record calls where the law and the other party allow it. Never share recordings that contain OTPs or PINs.</div></div>
        </Card>

        <div className="stack">
          {task.loading && <Card><LoadingPanel message="Transcribing and checking language…" /></Card>}
          {!task.loading && !res && <Card title="Transcription & indicators"><div className="empty"><AudioLines size={34} style={{ opacity: .5 }} /><p style={{ marginTop: 8 }}>Add audio and press <b>Analyze call</b> to see a sample transcript with suspicious phrases highlighted.</p></div></Card>}
          {res && !task.loading && (
            <>
              <RiskResultCard level={res.level} label={res.label} headline="Several common scam-call patterns" summary="Based on a fixed sample transcript, not on your audio." />
              <Card title="Transcription preview" action={<Badge tone="demo">SAMPLE TRANSCRIPT</Badge>}>
                <p style={{ lineHeight: 1.9 }}>
                  {res.transcript.map((seg, i) => seg.flag ? <mark key={i} className="hl" title={seg.flag}>{seg.text}</mark> : <span key={i}>{seg.text}</span>)}
                </p>
                <div className="chip-row" style={{ marginTop: 14 }}>
                  {[...new Set(res.transcript.filter((s) => s.flag).map((s) => s.flag))].map((f) => <Badge key={f} tone="danger">{f}</Badge>)}
                </div>
              </Card>
              <Card title="Suspicious language indicators"><IndicatorList items={res.indicators} /></Card>
              <DemoNotice>No speech recognition or voice-cloning detection has been run on your file.</DemoNotice>
            </>
          )}
        </div>
      </div>
    </>
  );
}
