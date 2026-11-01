const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export function clientId() {
  let id = localStorage.getItem("kavach_client_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("kavach_client_id", id);
  }
  return id;
}

async function call(path, opts = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      ...opts,
      headers: { "X-Client-Id": clientId(), ...(opts.headers || {}) },
    });
  } catch {
    throw new Error("Backend se connect nahi ho pa raha. Server chalu hai? (uvicorn app.main:app --port 8000)");
  }
  if (!res.ok) {
    let msg = "Kuch galat ho gaya";
    try { msg = (await res.json()).detail || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export function scan(type, payload, file) {
  const fd = new FormData();
  fd.append("type", type);
  fd.append("payload", payload || "");
  if (file) fd.append("file", file);
  return call("/scan", { method: "POST", body: fd });
}
export const listScans = () => call("/scans");
export const getScan = (id) => call(`/scans/${id}`);
export const clearScans = () => call("/scans", { method: "DELETE" });
