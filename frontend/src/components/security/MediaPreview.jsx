import { X, FileImage, FileAudio, FileVideo } from "lucide-react";
import { Button } from "../common/index.js";
import { formatBytes } from "../../utils/format.js";

/** Preview for an uploaded image / audio / video file with a remove button. */
export default function MediaPreview({ file, url, kind, onRemove }) {
  const Icon = kind === "audio" ? FileAudio : kind === "video" ? FileVideo : FileImage;
  return (
    <div className="stack-sm">
      <div className="file-chip">
        <span className="icon-chip"><Icon size={18} aria-hidden="true" /></span>
        <div className="grow"><div style={{ fontWeight: 600, overflowWrap: "anywhere" }}>{file.name}</div><div className="muted text-xs">{formatBytes(file.size)} · {file.type || "unknown type"}</div></div>
        <Button variant="ghost" size="sm" icon={X} onClick={onRemove} aria-label="Remove file">Remove</Button>
      </div>
      <div className="preview-box">
        {kind === "image" && <img src={url} alt={`Preview of ${file.name}`} />}
        {kind === "video" && <video src={url} controls preload="metadata" />}
        {kind === "audio" && <audio src={url} controls preload="metadata" />}
      </div>
    </div>
  );
}
