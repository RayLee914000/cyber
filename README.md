# EMI CTF Challenge Pack / EMI CTF 題目包

This pack contains three high-difficulty CTF challenges designed against the rubric in `groupproject.pdf`.

這份題目包依照 `groupproject.pdf` 的評分表設計，共包含三題高難度 CTF 題目。

## Layout / 目錄結構

- `01/` - Web challenge: signed cookie forgery through a double-decoding file read.
- `01/` - 網頁題：透過 double decode 檔案讀取漏洞取得簽章密鑰，再偽造 signed cookie。
- `02/` - Image forensics challenge: PNG chunk analysis plus shuffled LSB extraction.
- `02/` - 圖片鑑識題：分析 PNG chunk，並從打亂順序的 LSB 資料中還原 flag。
- `03/` - Reverse engineering challenge: Linux ELF password checker with an invertible state machine.
- `03/` - 逆向工程題：分析 Linux ELF 驗證程式，反推可通過的輸入。
- `resolve/` - Build helpers, automated solve scripts, and exact solution writeups.
- `resolve/` - 自動化產生腳本、解題腳本，以及完整解題流程說明。

## Run With Docker / 使用 Docker 執行

Build and start the player portal plus the web/image services:

建置並啟動解題入口網頁、網頁題與圖片題服務：

```sh
docker compose up --build
```

Then open:

啟動後開啟：

- Player portal / 解題入口：<http://localhost:8080>
- Web challenge / 網頁題：<http://localhost:8081>
- Image artifact server / 圖片題檔案服務：<http://localhost:8082/signal.png>

Run the reverse challenge container:

執行逆向題容器：

```sh
docker compose run --build --rm rev03 ./warden 'test'
```
