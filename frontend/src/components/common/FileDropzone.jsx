import { useRef, useState } from "react";
import { UploadCloud, AlertCircle } from "lucide-react";

export default function FileDropzone({ onFile, accept, title = "Drag & drop a file here", hint, error, icon: Icon = UploadCloud, disabled }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const handle = (files) => { if (files && files[0]) onFile(files[0]); };

  return (
    <div>
      <label
        className={`dropzone ${drag ? "is-dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (!disabled) handle(e.dataTransfer.files); }}
        style={disabled ? { opacity: 0.6, pointerEvents: "none" } : undefined}
      >
        <input ref={inputRef} type="file" accept={accept} onChange={(e) => { handle(e.target.files); e.target.value = ""; }} />
        <span className="icon-chip lg dz-icon"><Icon size={24} aria-hidden="true" /></span>
        <div style={{ fontWeight: 600 }}>{title}</div>
        <div className="muted text-sm" style={{ marginTop: 4 }}>or <span style={{ color: "var(--cyan)", fontWeight: 600 }}>browse files</span></div>
        {hint && <div className="hint" style={{ marginTop: 10 }}>{hint}</div>}
      </label>
      {error && <p className="error-text" role="alert" style={{ marginTop: 8 }}><AlertCircle size={14} />{error}</p>}
    </div>
  );
}
