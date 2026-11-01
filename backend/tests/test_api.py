import os, tempfile
os.environ["KAVACH_DB"] = os.path.join(tempfile.mkdtemp(), "t.db")

from fastapi.testclient import TestClient
from app.main import app

H = {"X-Client-Id": "client-test-1"}


def post(type_, payload="", files=None, headers=H):
    return client.post("/api/v1/scan", data={"type": type_, "payload": payload}, files=files, headers=headers)


client = TestClient(app)
client.__enter__()


def test_safe_link():
    r = post("link", "https://www.sbi.co.in/web/personal-banking").json()
    assert r["verdict"] == "SAFE"


def test_phishing_link():
    r = post("link", "http://sbi-kyc-update.xyz/login").json()
    assert r["verdict"] == "FAKE"


def test_lookalike_brand():
    r = post("link", "https://hdfc-secure-login.top/verify").json()
    assert r["verdict"] == "FAKE"


def test_qr_reverse_debit():
    r = post("qr", "upi://pay?pa=shop123@okaxis&pn=Shop&am=4999&mc=0000&tn=refund claim").json()
    assert r["verdict"] == "FAKE"


def test_qr_normal():
    r = post("qr", "upi://pay?pa=chaiwala@okhdfc&pn=Chai%20Wala&mc=5812").json()
    assert r["verdict"] == "SAFE"


def test_call_scam():
    r = post("voice", "This is CBI. Digital arrest. Share OTP immediately, do not tell anyone").json()
    assert r["verdict"] == "FAKE"


def test_media_demo_mode():
    r = post("media", files={"file": ("deepfake_clip.mp4", b"x" * 9000)}).json()
    assert r["mode"] == "demo" and r["verdict"] in ("SUSPICIOUS", "FAKE")


def test_history_isolated_and_get():
    a = post("link", "https://example.com").json()
    assert client.get("/api/v1/scans", headers=H).json()
    other = {"X-Client-Id": "client-test-2"}
    assert client.get("/api/v1/scans", headers=other).json() == []
    assert client.get(f"/api/v1/scans/{a['id']}", headers=H).status_code == 200
    assert client.get(f"/api/v1/scans/{a['id']}", headers=other).status_code == 404


def test_bad_type():
    assert post("xyz", "a").status_code == 400
