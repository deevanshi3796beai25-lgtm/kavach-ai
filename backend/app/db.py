"""SQLite store (local dev). Same shape as supabase/schema.sql so you can switch to Supabase later."""
import json
import os
import sqlite3
import uuid
from datetime import datetime, timezone

DB_PATH = os.environ.get("KAVACH_DB", os.path.join(os.path.dirname(os.path.dirname(__file__)), "kavach_dev.db"))

SEED_THREATS = [
    ("domain", "sbi-kyc-update.xyz", "[DEMO] fake bank KYC page"),
    ("domain", "paytm-reward-claim.top", "[DEMO] reward phishing"),
    ("upi", "refund.helpdesk@oksbi", "[DEMO] reverse-debit refund scam"),
    ("upi", "lucky.winner@ybl", "[DEMO] lottery collect request"),
    ("phone", "+919999900000", "[DEMO] digital arrest scam caller"),
]


def conn():
    c = sqlite3.connect(DB_PATH)
    c.row_factory = sqlite3.Row
    return c


def init():
    with conn() as c:
        c.executescript(
            """
            CREATE TABLE IF NOT EXISTS profiles (
                id TEXT PRIMARY KEY, display_name TEXT, language TEXT DEFAULT 'hi', created_at TEXT);
            CREATE TABLE IF NOT EXISTS scans (
                id TEXT PRIMARY KEY, client_id TEXT NOT NULL, input_type TEXT NOT NULL,
                input_preview TEXT, score INTEGER, verdict TEXT, reasons TEXT, mode TEXT, created_at TEXT);
            CREATE INDEX IF NOT EXISTS idx_scans_client ON scans(client_id, created_at DESC);
            CREATE TABLE IF NOT EXISTS threat_indicators (
                id INTEGER PRIMARY KEY AUTOINCREMENT, indicator_type TEXT, indicator_value TEXT UNIQUE, note TEXT);
            """
        )
        for t, v, n in SEED_THREATS:
            c.execute("INSERT OR IGNORE INTO threat_indicators(indicator_type,indicator_value,note) VALUES (?,?,?)", (t, v.lower(), n))


def threats() -> set:
    with conn() as c:
        return {r["indicator_value"] for r in c.execute("SELECT indicator_value FROM threat_indicators")}


def save_scan(client_id: str, result: dict, preview: str) -> dict:
    sid = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    with conn() as c:
        c.execute(
            "INSERT INTO scans(id,client_id,input_type,input_preview,score,verdict,reasons,mode,created_at) VALUES (?,?,?,?,?,?,?,?,?)",
            (sid, client_id, result["type"], preview[:120], result["score"], result["verdict"],
             json.dumps(result["reasons"], ensure_ascii=False), result["mode"], now),
        )
    return {**result, "id": sid, "input_preview": preview[:120], "created_at": now}


def _row(r) -> dict:
    d = dict(r)
    d["reasons"] = json.loads(d["reasons"] or "[]")
    d["type"] = d.pop("input_type")
    d.pop("client_id", None)
    return d


def list_scans(client_id: str, limit: int = 50) -> list:
    with conn() as c:
        rows = c.execute("SELECT * FROM scans WHERE client_id=? ORDER BY created_at DESC LIMIT ?", (client_id, limit)).fetchall()
    return [_row(r) for r in rows]


def get_scan(client_id: str, sid: str):
    with conn() as c:
        r = c.execute("SELECT * FROM scans WHERE id=? AND client_id=?", (sid, client_id)).fetchone()
    return _row(r) if r else None


def delete_scans(client_id: str) -> int:
    with conn() as c:
        return c.execute("DELETE FROM scans WHERE client_id=?", (client_id,)).rowcount
