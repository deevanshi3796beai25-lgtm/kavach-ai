import { useCallback, useEffect, useState } from "react";
import { formatBytes } from "../utils/format.js";

/**
 * Handles a single selected file: type/size validation + an object-URL preview.
 * accept: array of MIME prefixes or exact types, e.g. ["image/"] or ["audio/", "video/mp4"]
 */
export function useFileUpload({ accept = [], maxMB = 25 } = {}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const select = useCallback((f) => {
    if (!f) return false;
    if (accept.length && !accept.some((a) => f.type.startsWith(a))) {
      setError("Unsupported file type for this tool.");
      return false;
    }
    if (f.size > maxMB * 1024 * 1024) {
      setError(`File is too large (${formatBytes(f.size)}). Maximum is ${maxMB} MB.`);
      return false;
    }
    setError("");
    setFile(f);
    setPreviewUrl((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(f); });
    return true;
  }, [accept, maxMB]);

  const clear = useCallback(() => {
    setFile(null); setError("");
    setPreviewUrl((old) => { if (old) URL.revokeObjectURL(old); return ""; });
  }, []);

  return { file, previewUrl, error, select, clear };
}
