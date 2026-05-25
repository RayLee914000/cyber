# 03 - Warden State / 守衛狀態機

## Category / 類別

Reverse Engineering / 逆向工程

## Proposed Difficulty / 建議難度

High / 高難度

## Challenge / 題目說明

The Linux binary `warden` validates a flag with a rolling state machine. Recover the accepted input.

Linux binary `warden` 會使用 rolling state machine 驗證 flag。請分析程式並還原能通過驗證的輸入。

## Run / 執行方式

```sh
docker build -t ctf-03 ./03
docker run --rm -it ctf-03 ./warden 'CTF{...}'
```

With Docker Compose:

使用 Docker Compose：

```sh
docker compose run --build --rm rev03 ./warden 'CTF{...}'
```

## Notes For Players / 給解題者的提示方向

The intended path is static reverse engineering. Identify the embedded target bytes, understand the byte-wise state update, then invert it one character at a time.

預期解法是靜態逆向分析。請先找出程式中嵌入的 target bytes，理解每個 byte 如何更新 state，再逐字反推正確輸入。

## Hints / 提示

Open hints only when you are stuck, and read them in order.

卡住時再看提示，請依序一個一個打開，不要一次看完三個。

- Hint 1 / 提示 1：`hints/hint1.md`
- Hint 2 / 提示 2：`hints/hint2.md`
- Hint 3 / 提示 3：`hints/hint3.md`
