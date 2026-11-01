"""KAVACH AI detectors.

Link, QR/UPI and call-transcript checks are rule-based and real.
Audio / image / video checks are DEMO heuristics (no ML model) and are
labelled as such in the result.
"""
import hashlib
import re
from urllib.parse import urlparse, parse_qs

SHORTENERS = {"bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly", "rb.gy", "shorturl.at"}
BAD_TLDS = {"xyz", "top", "click", "link", "work", "support", "zip", "gq", "tk", "ml", "cf", "ga", "buzz", "rest"}
BRANDS = {
    "sbi": "sbi.co.in", "hdfc": "hdfcbank.com", "icici": "icicibank.com", "axis": "axisbank.com",
    "paytm": "paytm.com", "phonepe": "phonepe.com", "gpay": "pay.google.com", "npci": "npci.org.in",
    "amazon": "amazon.in", "flipkart": "flipkart.com", "irctc": "irctc.co.in", "uidai": "uidai.gov.in",
}
URL_WORDS = ["login", "verify", "kyc", "update", "secure", "reward", "refund", "claim", "otp", "suspend", "blocked"]
SCAM_PHRASES = {
    "otp": 25, "pin": 20, "cvv": 25, "digital arrest": 40, "arrest": 25, "cbi": 20, "customs": 15,
    "parcel": 15, "kyc": 20, "account will be blocked": 30, "blocked": 12, "anydesk": 35,
    "teamviewer": 30, "screen share": 30, "remote": 10, "lottery": 25, "refund": 15,
    "send money": 20, "transfer": 12, "urgent": 10, "immediately": 10, "don't tell": 25,
    "do not tell": 25, "police": 12, "gift card": 25, "scan this qr": 20, "work from home": 15,
}
FILE_WORDS = ["deepfake", "fake", "ai_generated", "ai-generated", "synthetic", "swap", "cloned", "midjourney", "dalle"]


def _verdict(score: int) -> str:
    return "FAKE" if score >= 60 else "SUSPICIOUS" if score >= 30 else "SAFE"


def _result(kind: str, score: int, reasons: list, mode: str = "rules") -> dict:
    score = max(0, min(100, int(score)))
    if not reasons:
        reasons = ["Koi suspicious signal nahi mila."]
    return {"type": kind, "score": score, "verdict": _verdict(score), "reasons": reasons, "mode": mode}


def check_link(url: str, threats: set) -> dict:
    url = (url or "").strip()
    if not url:
        return _result("link", 0, ["Link khali hai."])
    if "://" not in url:
        url = "http://" + url
    p = urlparse(url)
    host = (p.hostname or "").lower()
    score, why = 0, []
    if host in threats or url.lower() in threats:
        return _result("link", 95, ["Ye link known threat list me hai (I4C/demo feed)."])
    if p.scheme != "https":
        score += 12; why.append("HTTPS nahi hai (insecure connection).")
    if re.fullmatch(r"[\d.]+", host):
        score += 35; why.append("Domain ki jagah seedha IP address use hua hai.")
    if host.startswith("xn--") or ".xn--" in host:
        score += 30; why.append("Punycode domain: lookalike characters ho sakte hain.")
    if "@" in url.split("?")[0]:
        score += 25; why.append("URL me '@' hai, asli destination chhupa sakta hai.")
    if host in SHORTENERS:
        score += 20; why.append("URL shortener: asli destination dikh nahi raha.")
    tld = host.rsplit(".", 1)[-1] if "." in host else ""
    if tld in BAD_TLDS:
        score += 22; why.append(f"Risky domain extension (.{tld}).")
    if host.count(".") >= 4:
        score += 12; why.append("Bahut zyada subdomains.")
    if host.count("-") >= 2:
        score += 10; why.append("Domain me bahut hyphens hain.")
    for b, official in BRANDS.items():
        if b in host and not (host == official or host.endswith("." + official)):
            score += 40; why.append(f"'{b}' brand ka naam hai par official domain ({official}) nahi hai.")
            break
    hits = [w for w in URL_WORDS if w in url.lower()]
    if hits:
        score += min(20, 7 * len(hits)); why.append("Phishing jaise shabd: " + ", ".join(hits[:4]) + ".")
    return _result("link", score, why)


def check_qr(payload: str, threats: set) -> dict:
    payload = (payload or "").strip()
    if not payload:
        return _result("qr", 0, ["QR content khali hai."])
    if payload.lower().startswith(("http://", "https://")):
        r = check_link(payload, threats); r["type"] = "qr"
        r["reasons"].insert(0, "QR ke andar web link hai.")
        return r
    if not payload.lower().startswith("upi://"):
        return _result("qr", 15, ["Ye UPI ya link QR nahi hai, content dhyan se dekhein."])
    q = {k: v[0] for k, v in parse_qs(urlparse(payload).query).items()}
    pa, pn, am, mc, tn = q.get("pa", ""), q.get("pn", ""), q.get("am", ""), q.get("mc", ""), q.get("tn", "")
    score, why = 0, []
    if pa.lower() in threats:
        return _result("qr", 95, [f"UPI ID {pa} known fraud list me hai."])
    if not pa or "@" not in pa:
        score += 40; why.append("UPI ID invalid ya missing hai.")
    if mc == "0000":
        score += 25; why.append("Merchant code 0000: fake/unregistered merchant ka signal.")
    if am:
        score += 12; why.append(f"QR me amount (Rs {am}) pehle se bhara hai.")
    if re.search(r"refund|cashback|receive|reward|prize|claim|collect", tn, re.I):
        score += 38; why.append("Note me refund/cashback jaisa lalach hai. Paisa *lene* ke liye PIN kabhi nahi daalna padta.")
    if re.search(r"[0-9]{6,}", pa.split("@")[0]) and not pn:
        score += 10; why.append("Merchant naam missing hai.")
    if not why:
        why.append("Beneficiary aur transaction me koi red flag nahi mila. Phir bhi naam apne se match karke hi pay karein.")
    return _result("qr", score, why)


def check_voice_text(text: str, threats: set) -> dict:
    text = (text or "").strip()
    if not text:
        return _result("voice", 0, ["Call transcript ya number khali hai."])
    t = text.lower()
    if re.fullmatch(r"[+\d\s-]{8,}", text):  # looks like a phone number
        n = re.sub(r"[\s-]", "", text)
        if n in threats:
            return _result("voice", 92, ["Ye number known scam list me hai (demo feed)."])
        if n.startswith("+") and not n.startswith("+91"):
            return _result("voice", 45, ["International number: Indian bank/police isi tarah call nahi karte."])
        return _result("voice", 10, ["Number known threat list me nahi hai. Transcript paste karein to behtar check hoga."])
    score, why = 0, []
    for ph, w in SCAM_PHRASES.items():
        if ph in t:
            score += w; why.append(f"Scam jaisa shabd: '{ph}'.")
    if "otp" in t and ("share" in t or "batao" in t or "bolo" in t or "bata" in t):
        score += 20; why.append("OTP maanga ja raha hai. Asli bank OTP kabhi nahi maangta.")
    return _result("voice", min(score, 100), why[:6])


def _demo_score(data: bytes, name: str) -> tuple:
    """Deterministic DEMO score from file content + name. Not a real model."""
    h = int(hashlib.sha256(data).hexdigest()[:8], 16)
    base = 8 + h % 40  # 8..47
    why = []
    low = name.lower()
    if any(w in low for w in FILE_WORDS):
        base += 45; why.append("File ke naam me fake/AI/deepfake jaisa shabd hai.")
    if low.endswith((".jpg", ".jpeg")) and b"Exif" not in data[:4096]:
        base += 12; why.append("Photo me camera metadata (EXIF) nahi mila: edited/AI image me aisa hota hai.")
    if len(data) < 5000:
        base += 8; why.append("File bahut chhoti hai.")
    return base, why


def check_file(kind: str, data: bytes, name: str) -> dict:
    if not data:
        return _result(kind, 0, ["File nahi mili."], "demo")
    score, why = _demo_score(data, name)
    why.append("DEMO mode: ye heuristic check hai, asli AI model nahi.")
    return _result(kind, score, why, "demo")
