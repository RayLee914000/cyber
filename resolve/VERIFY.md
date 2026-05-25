# Challenge Verification / 題目可解性驗證

This document verifies that all three challenges are solvable with the included automated solvers.

這份文件用來確認三題都能透過內附的自動化解題腳本成功解出。

## 1. Start Services / 啟動服務

From the project root:

請在專案根目錄執行：

```sh
cd /Users/raylee/Desktop/cyber_code
docker compose up --build
```

Keep this terminal running. The player portal, web challenge, and image file server should be available at:

請保持這個 terminal 不要關閉。啟動後會有以下服務：

- Player portal / 解題入口：<http://localhost:8080>
- Web challenge / 網頁題：<http://localhost:8081>
- Image artifact / 圖片題附件：<http://localhost:8082/signal.png>

## 2. Verify Challenge 01 / 驗證第 01 題

Open a second terminal and run:

開另一個 terminal 執行：

```sh
cd /Users/raylee/Desktop/cyber_code
python3 resolve/solve_01.py http://localhost:8081
```

Expected output:

預期輸出：

```text
review complete: CTF{w3b_c0ok13s_l34k_tw1c3}
```

## 3. Verify Challenge 02 / 驗證第 02 題

Run:

執行：

```sh
cd /Users/raylee/Desktop/cyber_code
python3 resolve/solve_02.py 02/dist/signal.png
```

Expected output:

預期輸出：

```text
CTF{png_lsb_chunks_are_loud}
```

## 4. Verify Challenge 03 / 驗證第 03 題

Build the reverse challenge image and extract the compiled binary:

建置逆向題 image，並取出編譯好的 binary：

```sh
cd /Users/raylee/Desktop/cyber_code
docker compose build rev03
mkdir -p 03/dist
cid=$(docker create cyber_code-rev03)
docker cp "$cid":/challenge/warden 03/dist/warden
docker rm "$cid"
```

Run the solver:

執行 solver：

```sh
python3 resolve/solve_03.py 03/dist/warden
```

Expected output:

預期輸出：

```text
CTF{reverse_the_state_machine_73}
```

Optionally verify the recovered flag inside Docker:

也可以把還原出的 flag 放回 Docker 中驗證：

```sh
docker compose run --build --rm rev03 ./warden 'CTF{reverse_the_state_machine_73}'
```

Expected output:

預期輸出：

```text
accepted
```

## 5. Full Expected Result / 完整預期結果

If all three checks pass, the challenge pack is solvable and reproducible.

如果三個檢查都通過，代表這份題目包是可解且可重現的。

Expected flags:

預期 flags：

```text
CTF{w3b_c0ok13s_l34k_tw1c3}
CTF{png_lsb_chunks_are_loud}
CTF{reverse_the_state_machine_73}
```

Detailed manual solution paths are in:

完整人工解題流程在：

- `resolve/01_solution.md`
- `resolve/02_solution.md`
- `resolve/03_solution.md`
