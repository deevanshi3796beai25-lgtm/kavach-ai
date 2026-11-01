import { useCallback, useRef, useState } from "react";

/** Runs an async (simulated) task with loading / result / error state. */
export function useSimulatedTask() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const runId = useRef(0);

  const run = useCallback(async (fn) => {
    const id = ++runId.current;
    setLoading(true); setError(""); setResult(null);
    try {
      const out = await fn();
      if (id === runId.current) setResult(out);
      return out;
    } catch (e) {
      if (id === runId.current) setError(e?.message || "Something went wrong.");
      return null;
    } finally {
      if (id === runId.current) setLoading(false);
    }
  }, []);

  const reset = useCallback(() => { runId.current++; setLoading(false); setResult(null); setError(""); }, []);
  return { loading, result, error, run, reset };
}
