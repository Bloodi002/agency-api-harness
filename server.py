"""Agency API Harness — Python (stdlib only) twin of server.js.

Same behaviour, same public/ UI, same environment variables. The browser only ever talks to this
server; every API call is proxied server-to-server to the gateway, so there is no CORS to configure.
Webhooks are received, signature-checked and streamed to the page live.

    PORT            port to listen on (the host sets this)
    GATEWAY_BASE    public gateway origin, e.g. https://apidev.rostered.ai
    API_PREFIX      gateway path prefix that routes to Partners (default: /partners)
    WEBHOOK_SECRET  the endpoint signing secret (whsec_...); or set it in the UI at runtime
    SIG_TOLERANCE   max age in seconds of a signed webhook before it is stale (default 300)

Run:  GATEWAY_BASE=http://localhost:7000 python server.py
"""

import hashlib
import hmac
import json
import mimetypes
import os
import queue
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PORT", "4000"))
GATEWAY_BASE = os.environ.get("GATEWAY_BASE", "http://localhost:7000").rstrip("/")
API_PREFIX = os.environ.get("API_PREFIX", "/partners")
TOLERANCE = int(os.environ.get("SIG_TOLERANCE", "300"))
WEBHOOK_SECRET = os.environ.get("WEBHOOK_SECRET", "")
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")

# ── shared state ──────────────────────────────────────────────────────────────
_received = []            # newest first
_seen_event_ids = set()
_sse_clients = set()      # set[queue.Queue]
_lock = threading.Lock()


def push_event(entry):
    with _lock:
        _received.insert(0, entry)
        del _received[200:]
        clients = list(_sse_clients)
    for q in clients:
        try:
            q.put_nowait(entry)
        except queue.Full:
            pass


# ── signature verification: t=<unix>,v1=<hex> over "<unix>.<rawBody>" ──────────
def parse_signature(header):
    parts = {}
    for piece in (header or "").split(","):
        kv = piece.split("=")
        if len(kv) == 2:
            parts[kv[0].strip()] = kv[1].strip()
    if parts.get("t") and parts.get("v1"):
        return parts["t"], parts["v1"]
    return None


def verify(raw_body, header):
    if not WEBHOOK_SECRET:
        return False, "no secret configured on the harness"
    parsed = parse_signature(header)
    if not parsed:
        return False, "missing or malformed signature header"
    timestamp, signature = parsed
    try:
        age = abs(int(time.time()) - int(timestamp))
    except ValueError:
        return False, "unparseable timestamp"
    if age > TOLERANCE:
        return False, f"timestamp outside {TOLERANCE}s tolerance"
    expected = hmac.new(
        WEBHOOK_SECRET.encode(), f"{timestamp}.{raw_body}".encode(), hashlib.sha256
    ).hexdigest()
    ok = hmac.compare_digest(expected, signature)
    return ok, (None if ok else "signature mismatch")


# ── forward a call to the gateway (server-to-server; no browser CORS) ─────────
def forward(method, gateway_path, headers, body):
    url = GATEWAY_BASE + gateway_path
    req = urllib.request.Request(url, data=body or None, method=method)
    for k, v in headers.items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, dict(resp.headers), resp.read()
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers or {}), e.read()
    except Exception as e:  # noqa: BLE001 - a gateway that is unreachable is a normal, reportable state
        return 502, {"content-type": "application/json"}, json.dumps(
            {"error": "gateway_unreachable", "detail": str(e)}
        ).encode()


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *args):  # keep the console to one line per delivery, not one per request
        pass

    # ── small response helpers ───────────────────────────────────────────────
    def _json(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("content-type", "application/json")
        self.send_header("access-control-allow-origin", "*")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _body(self):
        length = int(self.headers.get("content-length") or 0)
        return self.rfile.read(length) if length else b""

    def _text(self, code, text):
        body = text.encode()
        self.send_response(code)
        self.send_header("content-type", "text/plain; charset=utf-8")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _serve_static(self, url_path):
        rel = "/index.html" if url_path == "/" else url_path
        file = os.path.normpath(os.path.join(PUBLIC_DIR, rel.lstrip("/")))
        if not file.startswith(PUBLIC_DIR) or not os.path.isfile(file):
            return self._text(404, "Not found")
        ctype = mimetypes.guess_type(file)[0] or "application/octet-stream"
        with open(file, "rb") as fh:
            data = fh.read()
        self.send_response(200)
        self.send_header("content-type", ctype)
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _path(self):
        return self.path.split("?")[0]

    def _query(self):
        return ("?" + self.path.split("?", 1)[1]) if "?" in self.path else ""

    # ── proxy an /api/* call, any method ─────────────────────────────────────
    def _proxy_api(self):
        url = self._path()
        body = self._body()
        gateway_path = API_PREFIX + url[len("/api"):] + self._query()
        headers = {"content-type": self.headers.get("content-type") or "application/json"}
        auth = self.headers.get("authorization")
        if auth:
            headers["authorization"] = auth
        if body:
            headers["content-length"] = str(len(body))
        status, resp_headers, out = forward(self.command, gateway_path, headers, body)
        self.send_response(status)
        self.send_header("content-type", resp_headers.get("content-type", "application/json"))
        self.send_header("access-control-allow-origin", "*")
        self.send_header("content-length", str(len(out)))
        self.end_headers()
        self.wfile.write(out)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("access-control-allow-origin", "*")
        self.send_header("access-control-allow-headers", "content-type,authorization")
        self.send_header("access-control-allow-methods", "GET,POST,PUT,DELETE,PATCH")
        self.end_headers()

    def do_GET(self):
        url = self._path()
        if url == "/config":
            return self._json(200, {
                "gatewayBase": GATEWAY_BASE, "apiPrefix": API_PREFIX,
                "webhookSecretConfigured": bool(WEBHOOK_SECRET), "tolerance": TOLERANCE,
            })
        if url == "/health":
            return self._json(200, {"ok": True, "received": len(_received)})
        if url == "/received":
            with _lock:
                snapshot = list(_received)
            return self._json(200, snapshot)
        if url == "/events":
            return self._sse()
        if url.startswith("/api/"):
            return self._proxy_api()
        return self._serve_static(url)

    def do_PUT(self):
        if self._path().startswith("/api/"):
            return self._proxy_api()
        return self._text(404, "Not found")

    def do_DELETE(self):
        if self._path().startswith("/api/"):
            return self._proxy_api()
        return self._text(404, "Not found")

    def do_POST(self):
        global WEBHOOK_SECRET
        url = self._path()

        if url == "/token":
            raw = self._body().decode("utf-8", "replace")
            try:
                creds = json.loads(raw)
            except ValueError:
                creds = {}
            form = urllib.parse.urlencode({
                "grant_type": "client_credentials",
                "client_id": creds.get("clientId", ""),
                "client_secret": creds.get("clientSecret", ""),
            }).encode()
            status, resp_headers, out = forward(
                "POST", f"{API_PREFIX}/agency/apis/token",
                {"content-type": "application/x-www-form-urlencoded", "content-length": str(len(form))}, form,
            )
            self.send_response(status)
            self.send_header("content-type", resp_headers.get("content-type", "application/json"))
            self.send_header("access-control-allow-origin", "*")
            self.send_header("content-length", str(len(out)))
            self.end_headers()
            self.wfile.write(out)
            return

        if url == "/set-secret":
            raw = self._body().decode("utf-8", "replace")
            try:
                WEBHOOK_SECRET = json.loads(raw).get("secret") or WEBHOOK_SECRET
            except ValueError:
                pass
            return self._json(200, {"webhookSecretConfigured": bool(WEBHOOK_SECRET)})

        if url == "/reset":
            with _lock:
                _received.clear()
                _seen_event_ids.clear()
            return self._json(200, {"cleared": True})

        if url.startswith("/api/"):
            return self._proxy_api()

        # Anything else is treated as an inbound webhook delivery.
        raw = self._body().decode("utf-8", "replace")
        ok, reason = verify(raw, self.headers.get("x-rosteredai-signature"))
        parsed = None
        try:
            parsed = json.loads(raw)
        except ValueError:
            pass
        event_id = self.headers.get("x-rosteredai-event-id")
        entry = {
            "at": datetime.now(timezone.utc).isoformat(),
            "path": url,
            "eventType": self.headers.get("x-rosteredai-event-type")
            or (parsed.get("eventType") if isinstance(parsed, dict) else None) or "unknown",
            "eventId": event_id,
            "deliveryId": self.headers.get("x-rosteredai-delivery-id"),
            "apiVersion": self.headers.get("x-rosteredai-api-version"),
            "valid": ok,
            "reason": reason,
            "duplicate": ok and bool(event_id) and event_id in _seen_event_ids,
            "data": (parsed.get("data") if isinstance(parsed, dict) else None) if parsed else None,
            "raw": raw,
        }
        push_event(entry)
        if not ok:
            return self._text(401, "signature rejected")  # 401 is retried
        if event_id:
            _seen_event_ids.add(event_id)
        self._json(200, {"received": True})

    # ── Server-Sent Events stream of received deliveries ─────────────────────
    def _sse(self):
        self.send_response(200)
        self.send_header("content-type", "text/event-stream")
        self.send_header("cache-control", "no-cache")
        self.send_header("connection", "keep-alive")
        self.send_header("access-control-allow-origin", "*")
        self.end_headers()
        q = queue.Queue(maxsize=100)
        with _lock:
            _sse_clients.add(q)
        try:
            self.wfile.write(b": connected\n\n")
            self.wfile.flush()
            while True:
                try:
                    entry = q.get(timeout=20)
                    self.wfile.write(f"data: {json.dumps(entry)}\n\n".encode())
                except queue.Empty:
                    self.wfile.write(b": keep-alive\n\n")  # keep the connection open through idle
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError, OSError):
            pass
        finally:
            with _lock:
                _sse_clients.discard(q)


def main():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    server.daemon_threads = True
    print(f"Agency API Harness (Python) listening on :{PORT}")
    print(f"  gateway   {GATEWAY_BASE}{API_PREFIX}")
    print(f"  webhooks  {'secret set' if WEBHOOK_SECRET else 'no secret yet — set it in the UI'}")
    server.serve_forever()


if __name__ == "__main__":
    main()
