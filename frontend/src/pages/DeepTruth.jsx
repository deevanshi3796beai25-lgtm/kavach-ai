import { useState } from "react";
import { Image as ImageIcon, Music, Video, ScanFace, RotateCcw } from "lucide-react";
import { Button, Card, DemoNotice, FileDropzone, LoadingPanel, PageHeader, Tabs } from "../components/common/index.js";
import { MediaPreview, RiskResultCard } from "../components/security/index.js";
import { useFileUpload } from "../hooks/useFileUpload.js";
import { useSimulatedTask } from "../hooks/useSimulatedTask.js";
import { useApp } from "../hooks/useApp.js";
import { useToast } from "../hooks/useToast.js";
import { analyzeMedia } from "../services/mockAnalysis.js";

const TABS = [
  { id: "image", label: "Image", icon: ImageIcon, accept: "image/*", prefix: ["image/"], mb: 15, hint: "JPG, PNG or WEBP up to 15 MB" },
  { id: "audio", label: "Audio", icon: Music, accept: "audio/*", prefix: ["audio/"], mb: 25, hint: "MP3, WAV, M4A or OGG up to 25 MB" },
  { id: "video", label: "Video", icon: Video, accept: "video/*", prefix: ["video/"], mb: 50, hint: "MP4, MOV or WEBM up to 50 MB" },
];

function Panel({ tab }) {
  const upload = useFileUpload({ accept: tab.prefix, maxMB: tab.mb });
  const task = useSimulatedTask();
  const { addScan } = useApp();
  const toast = useToast();
  const res = task.result;

  const analyze = async () => {
    if (!upload.file) return toast.warning(`Add ${tab.id === "image" ? "an" : "a"} ${tab.id} file first`);
    const r = await task.run(() => analyzeMedia(upload.file, tab.id));
    if (r) {
      addScan({ module: "deepfake", title: upload.file.name, subject: `${tab.label} analysis`, level: r.level, label: r.level === "low" ? "NO SIGNALS" : r.level === "medium" ? "REVIEW" : "SIGNALS FOUND", detail: r.summary });
      toast.success("Analysis complete (DEMO)", r.label);
    }
  };
  const reset = () => { upload.clear(); task.reset(); };

  return (
    <div className="grid grid-2" style={{ alignItems: "start" }}>
      <Card title={`Upload ${tab.label.toLowerCase()}`} icon={tab.icon} subtitle={tab.hint}>
        {!upload.file ? (
          <FileDropzone onFile={(f) => { if (upload.select(f)) { task.reset(); toast.info(`${tab.label} added`, f.name); } }} accept={tab.accept} title={`Drag & drop ${tab.id === "image" ? "an" : "a"} ${tab.id} file`} hint={tab.hint} error={upload.error} icon={tab.icon} />
        ) : (<MediaPreview file={upload.file} url={upload.previewUrl} kind={tab.id} onRemove={reset} />)}
        <div className="row" style={{ marginTop: 18 }}>
          <Button icon={ScanFace} loading={task.loading} onClick={analyze}>{task.loading ? "Analysing…" : "Analyze media"}</Button>
          {(upload.file || res) && <Button variant="ghost" icon={RotateCcw} onClick={reset} disabled={task.loading}>Start over</Button>}
        </div>
      </Card>

      <div className="stack">
        {task.loading && <Card><LoadingPanel message={`Inspecting ${tab.id}…`} /></Card>}
        {!task.loading && !res && (
          <Card title="Sample result"><div className="empty"><tab.icon size={34} style={{ opacity: .5 }} /><p style={{ marginTop: 8 }}>Results appear here. A real model would look at the media itself; this demo returns an illustrative result.</p></div></Card>
        )}
        {res && !task.loading && (
          <>
            <RiskResultCard level={res.level} label={res.label} score={res.score} caption="signal" headline={upload.file?.name} summary={res.summary} />
            <Card title="Signals examined" subtitle="Illustrative values">
              <ul className="stack-sm">
                {res.signals.map((s) => (
                  <li key={s.name}>
                    <div className="row-between text-sm"><span>{s.name}</span><span className="muted">{s.value}%</span></div>
                    <div className={`progress ${s.type === "warn" ? "warn" : "safe"}`}><span style={{ width: `${s.value}%` }} /></div>
                  </li>
                ))}
              </ul>
            </Card>
            <DemoNotice>No deepfake model has been run. Never treat an automated score as proof either way.</DemoNotice>
          </>
        )}
      </div>
    </div>
  );
}

export default function DeepTruth() {
  const [tab, setTab] = useState("image");
  const current = TABS.find((t) => t.id === tab);
  return (
    <>
      <PageHeader title="DeepTruth AI" demo description="Check images, audio and video for signs of manipulation or AI generation. Results here are simulated placeholders for the future detection models." />
      <div style={{ marginBottom: 20 }}><Tabs tabs={TABS} value={tab} onChange={setTab} label="Media type" /></div>
      <Panel key={current.id} tab={current} />
    </>
  );
}
