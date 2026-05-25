"use strict";

const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");

const { FLAG, SIGNING_SECRET } = require("./config");

const ROOT = __dirname;
const PUBLIC = path.join(ROOT, "public");
const PORT = Number(process.env.PORT || 8080);

function b64url(data) {
  return Buffer.from(data).toString("base64url");
}

function b64urlDecode(data) {
  return Buffer.from(data, "base64url").toString("utf8");
}

function sign(payload) {
  return crypto.createHmac("sha256", SIGNING_SECRET).update(payload).digest("hex");
}

function makeSession(role = "user") {
  const payload = b64url(JSON.stringify({ user: "guest", role }));
  return `${payload}.${sign(payload)}`;
}

function parseCookies(header) {
  const cookies = {};
  if (!header) {
    return cookies;
  }
  for (const pair of header.split(";")) {
    const index = pair.indexOf("=");
    if (index === -1) {
      continue;
    }
    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    cookies[key] = value;
  }
  return cookies;
}

function verifySession(cookieHeader) {
  const cookie = parseCookies(cookieHeader).session;
  if (!cookie) {
    return {};
  }

  try {
    const [payload, supplied] = cookie.split(".", 2);
    if (!payload || !supplied) {
      return {};
    }

    const expected = sign(payload);
    const suppliedBuffer = Buffer.from(supplied, "hex");
    const expectedBuffer = Buffer.from(expected, "hex");
    if (
      suppliedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
    ) {
      return {};
    }

    return JSON.parse(b64urlDecode(payload));
  } catch {
    return {};
  }
}

function send(res, status, body, contentType = "text/plain; charset=utf-8") {
  const data = Buffer.from(body);
  res.writeHead(status, {
    "Content-Type": contentType,
    "Content-Length": data.length,
  });
  res.end(data);
}

function rawQueryValue(query, key) {
  const prefix = `${key}=`;
  for (const part of query.split("&")) {
    if (part.startsWith(prefix)) {
      return part.slice(prefix.length);
    }
  }
  return null;
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, "http://ledger.local");

  if (req.method !== "GET") {
    send(res, 405, "method not allowed");
    return;
  }

  if (parsed.pathname === "/") {
    const body = [
      "<h1>Ledger Smoke</h1>",
      "<p>Export staged ledger notes from /download?name=readme.txt.</p>",
      "<p>Admin review panel: /admin</p>",
    ].join("");
    const data = Buffer.from(body);
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": data.length,
      "Set-Cookie": `session=${makeSession()}; HttpOnly; SameSite=Lax`,
    });
    res.end(data);
    return;
  }

  if (parsed.pathname === "/robots.txt") {
    send(res, 200, "User-agent: *\nDisallow: /download\nDisallow: /admin\n");
    return;
  }

  if (parsed.pathname === "/download") {
    const rawName = rawQueryValue(parsed.search.slice(1), "name");
    if (rawName === null) {
      send(res, 400, "missing name");
      return;
    }

    const once = safeDecode(rawName);
    if (once === null) {
      send(res, 400, "bad encoding");
      return;
    }

    if (once.startsWith("/") || once.includes("..")) {
      send(res, 403, "blocked traversal token");
      return;
    }

    const twice = safeDecode(once);
    if (twice === null) {
      send(res, 400, "bad encoding");
      return;
    }

    const target = path.join(PUBLIC, twice);
    fs.readFile(target, (err, data) => {
      if (err) {
        send(res, 404, "not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Length": data.length,
      });
      res.end(data);
    });
    return;
  }

  if (parsed.pathname === "/admin") {
    const session = verifySession(req.headers.cookie);
    if (session.role !== "admin") {
      send(res, 403, "admin role required");
      return;
    }
    send(res, 200, `review complete: ${FLAG}\n`);
    return;
  }

  send(res, 404, "not found");
});

server.listen(PORT, "0.0.0.0");
