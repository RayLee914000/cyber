"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = Number(process.env.PORT || 8080);
const CONTENT = path.join(__dirname, "content");

const challenges = {
  "01": {
    title: "01 - Ledger Smoke / 帳本煙霧",
    category: "Web / 網頁安全",
    play: "http://localhost:8081",
    action: "Open the web challenge / 開啟網頁題",
  },
  "02": {
    title: "02 - Palette Static / 調色盤雜訊",
    category: "Image / Forensics / 圖片鑑識",
    play: "http://localhost:8082/signal.png",
    action: "Download signal.png / 下載 signal.png",
  },
  "03": {
    title: "03 - Warden State / 守衛狀態機",
    category: "Reverse Engineering / 逆向工程",
    play: null,
    action: "Run: docker compose run --build --rm rev03 ./warden 'CTF{test}'",
  },
};

function read(file) {
  return fs.readFileSync(path.join(CONTENT, file), "utf8");
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inlineMarkdown(text) {
  return escapeHtml(text).replace(/`([^`]+)`/g, "<code>$1</code>");
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const out = [];
  let inCode = false;
  let listOpen = false;

  function closeList() {
    if (listOpen) {
      out.push("</ul>");
      listOpen = false;
    }
  }

  for (const line of lines) {
    if (line.startsWith("```")) {
      closeList();
      if (inCode) {
        out.push("</code></pre>");
      } else {
        out.push("<pre><code>");
      }
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      out.push(`${escapeHtml(line)}\n`);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    if (line.startsWith("# ")) {
      closeList();
      out.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
    } else if (line.startsWith("## ")) {
      closeList();
      out.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
    } else if (line.startsWith("- ")) {
      if (!listOpen) {
        out.push("<ul>");
        listOpen = true;
      }
      out.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
    } else {
      closeList();
      out.push(`<p>${inlineMarkdown(line)}</p>`);
    }
  }

  closeList();
  if (inCode) {
    out.push("</code></pre>");
  }
  return out.join("\n");
}

function page(title, body) {
  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f7f7f4;
      --ink: #1e2528;
      --muted: #5f6b70;
      --line: #d8ddd8;
      --panel: #ffffff;
      --accent: #0f766e;
      --accent-dark: #115e59;
      --code: #eef3f1;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.6;
    }
    header {
      border-bottom: 1px solid var(--line);
      background: var(--panel);
    }
    nav, main {
      width: min(1080px, calc(100vw - 32px));
      margin: 0 auto;
    }
    nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 0;
    }
    nav a {
      color: var(--accent-dark);
      font-weight: 700;
      text-decoration: none;
    }
    .nav-links {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      font-size: 14px;
    }
    main { padding: 28px 0 52px; }
    h1 { font-size: clamp(28px, 4vw, 44px); line-height: 1.08; margin: 0 0 14px; }
    h2 { font-size: 21px; margin: 30px 0 10px; }
    p { color: var(--muted); margin: 8px 0 14px; }
    ul { padding-left: 22px; color: var(--muted); }
    code {
      background: var(--code);
      border: 1px solid var(--line);
      border-radius: 5px;
      padding: 1px 5px;
      color: var(--ink);
    }
    pre {
      overflow-x: auto;
      background: #172026;
      color: #e9f5ef;
      padding: 14px;
      border-radius: 8px;
    }
    pre code {
      background: transparent;
      border: 0;
      padding: 0;
      color: inherit;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 14px;
      margin-top: 22px;
    }
    .card, .doc, .hint {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
    }
    .card h2 { margin-top: 0; }
    .actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 16px;
    }
    .button, button {
      appearance: none;
      border: 1px solid var(--accent);
      background: var(--accent);
      color: white;
      border-radius: 6px;
      padding: 9px 12px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
    }
    .button.secondary, button.secondary {
      background: transparent;
      color: var(--accent-dark);
    }
    .hint {
      display: none;
      margin-top: 12px;
      border-left: 4px solid var(--accent);
    }
    .hint.visible { display: block; }
    .doc { margin-top: 18px; }
    .note {
      border-left: 4px solid var(--accent);
      padding-left: 14px;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <header>
    <nav>
      <a href="/">EMI CTF</a>
      <div class="nav-links">
        <a href="/challenge/01">01 Web</a>
        <a href="/challenge/02">02 Image</a>
        <a href="/challenge/03">03 Reverse</a>
      </div>
    </nav>
  </header>
  <main>${body}</main>
</body>
</html>`;
}

function indexPage() {
  const cards = Object.entries(challenges).map(([id, challenge]) => {
    const play = challenge.play
      ? `<a class="button" href="${challenge.play}" target="_blank" rel="noreferrer">${challenge.action}</a>`
      : `<code>${escapeHtml(challenge.action)}</code>`;
    return `<section class="card">
      <h2>${escapeHtml(challenge.title)}</h2>
      <p>${escapeHtml(challenge.category)}</p>
      <div class="actions">
        <a class="button secondary" href="/challenge/${id}">Read challenge / 看題目</a>
        ${play}
      </div>
    </section>`;
  }).join("\n");

  return page("EMI CTF Challenge Portal", `
    <h1>EMI CTF Challenge Portal / 題目入口</h1>
    <p class="note">Start here as a player. Read one challenge page, use hints only when stuck, and avoid opening the <code>resolve/</code> folder unless you are the instructor.</p>
    <p class="note">如果你是假裝解題者，從這裡開始看題目。卡住時再依序打開提示，不要看 <code>resolve/</code>，那是出題者解答區。</p>
    <div class="grid">${cards}</div>
  `);
}

function challengePage(id) {
  const challenge = challenges[id];
  if (!challenge) {
    return null;
  }

  const hints = [1, 2, 3].map((number) => {
    const html = markdownToHtml(read(`${id}/hints/hint${number}.md`));
    return `<section id="hint-${number}" class="hint">${html}</section>`;
  }).join("\n");

  const play = challenge.play
    ? `<a class="button" href="${challenge.play}" target="_blank" rel="noreferrer">${challenge.action}</a>`
    : `<code>${escapeHtml(challenge.action)}</code>`;

  return page(challenge.title, `
    <section class="doc">
      ${markdownToHtml(read(`${id}/README.md`))}
      <div class="actions">${play}</div>
    </section>
    <section class="doc">
      <h2>Sequential Hints / 依序提示</h2>
      <p>Click one hint at a time. The next hint appears only after you reveal the current one.</p>
      <p>請一次只打開一個提示。打開目前提示後，下一個提示按鈕才會出現。</p>
      <div class="actions">
        <button id="hint-button-1" type="button" data-hint="1">Show Hint 1 / 顯示提示 1</button>
        <button id="hint-button-2" class="secondary" type="button" data-hint="2" hidden>Show Hint 2 / 顯示提示 2</button>
        <button id="hint-button-3" class="secondary" type="button" data-hint="3" hidden>Show Hint 3 / 顯示提示 3</button>
      </div>
      ${hints}
    </section>
    <script>
      for (const button of document.querySelectorAll("button[data-hint]")) {
        button.addEventListener("click", () => {
          const number = Number(button.dataset.hint);
          document.getElementById("hint-" + number).classList.add("visible");
          button.disabled = true;
          button.textContent = "Hint " + number + " opened / 提示 " + number + " 已開啟";
          const next = document.getElementById("hint-button-" + (number + 1));
          if (next) next.hidden = false;
        });
      }
    </script>
  `);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://portal.local");
  let html = null;

  if (url.pathname === "/") {
    html = indexPage();
  } else {
    const match = url.pathname.match(/^\/challenge\/(01|02|03)$/);
    if (match) {
      html = challengePage(match[1]);
    }
  }

  if (!html) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("not found");
    return;
  }

  const body = Buffer.from(html);
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Length": body.length,
  });
  res.end(body);
});

server.listen(PORT, "0.0.0.0");
