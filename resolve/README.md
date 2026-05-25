# Resolve Folder / 解題與自動化資料夾

This folder is the instructor/author side of the project.

這個資料夾是出題者或助教使用的區域，包含自動化腳本、產生題目附件的工具，以及完整解題流程。

## Files / 檔案說明

- `generate_02.py` - creates `02/dist/signal.png`.
- `generate_02.py` - 產生圖片題附件 `02/dist/signal.png`。
- `solve_01.py` - exploits the web challenge and prints the flag.
- `solve_01.py` - 自動攻擊網頁題並輸出 flag。
- `solve_02.py` - extracts the hidden PNG payload and prints the flag.
- `solve_02.py` - 從 PNG 中取出隱藏 payload 並輸出 flag。
- `solve_03.py` - recovers the accepted input from the reverse binary.
- `solve_03.py` - 從逆向題 binary 中還原可通過驗證的輸入。
- `01_solution.md`, `02_solution.md`, `03_solution.md` - exact solution paths and rubric mapping.
- `01_solution.md`, `02_solution.md`, `03_solution.md` - 每題的完整解題流程與評分表對應說明。
- `VERIFY.md` - reproducible verification steps for all three challenges.
- `VERIFY.md` - 三題可解性的完整驗證步驟與預期輸出。

## Regenerate Artifacts / 重新產生題目附件

```sh
python3 resolve/generate_02.py
docker compose build rev03
mkdir -p 03/dist
cid=$(docker create cyber_code-rev03)
docker cp "$cid":/challenge/warden 03/dist/warden
docker rm "$cid"
```

Use these commands when you want to rebuild the image challenge PNG or extract the compiled reverse engineering binary.

如果要重新產生圖片題 PNG，或從 Docker image 中取出逆向題編譯好的 binary，可以使用上面的指令。
