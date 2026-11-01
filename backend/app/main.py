from typing import Optional

from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from . import db, detectors

app = FastAPI(title="KAVACH AI", docs_url="/api/docs", openapi_url="/api/openapi.json")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
P = "/api/v1"
MAX_FILE = 15 * 1024 * 1024
TYPES = {"link", "qr", "voice", "media"}


@app.on_event("startup")
def _startup():
    db.init()


@app.get(f"{P}/health")
def health():
    return {"status": "ok"}


@app.post(f"{P}/scan")
async def scan(
    type: str = Form(...),
    payload: str = Form(""),
    file: Optional[UploadFile] = File(None),
    x_client_id: str = Header(..., min_length=8),
):
    if type not in TYPES:
        raise HTTPException(400, "type must be link, qr, voice or media")
    th = db.threats()
    data, name = b"", ""
    if file is not None:
        data = await file.read(MAX_FILE + 1)
        if len(data) > MAX_FILE:
            raise HTTPException(413, "File 15MB se badi hai")
        name = file.filename or ""
    if type == "link":
        res, preview = detectors.check_link(payload, th), payload
    elif type == "qr":
        res, preview = detectors.check_qr(payload, th), payload
    elif type == "voice":
        if data:
            res, preview = detectors.check_file("voice", data, name), name
        else:
            res, preview = detectors.check_voice_text(payload, th), payload
    else:
        if not data:
            raise HTTPException(400, "Media ke liye file upload karein")
        res, preview = detectors.check_file("media", data, name), name
    return db.save_scan(x_client_id, res, preview)


@app.get(f"{P}/scans")
def scans(x_client_id: str = Header(..., min_length=8)):
    return db.list_scans(x_client_id)


@app.get(f"{P}/scans/{{scan_id}}")
def one(scan_id: str, x_client_id: str = Header(..., min_length=8)):
    s = db.get_scan(x_client_id, scan_id)
    if not s:
        raise HTTPException(404, "Scan nahi mila")
    return s


@app.delete(f"{P}/scans")
def clear(x_client_id: str = Header(..., min_length=8)):
    return {"deleted": db.delete_scans(x_client_id)}
