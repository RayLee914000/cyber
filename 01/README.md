# 01 - Ledger Smoke / 帳本煙霧

## Category / 類別

Web / 網頁安全

## Proposed Difficulty / 建議難度

High / 高難度

## Challenge / 題目說明

An internal Node.js reimbursement ledger exposes a tiny file export feature. The administrator says the export route rejects traversal and the admin panel only trusts signed sessions.

某個內部 Node.js 報銷帳本系統提供一個簡單的檔案匯出功能。管理員表示匯出路由已經阻擋路徑穿越，而管理後台只信任已簽章的 session。

Find the flag.

請找出 flag。

## Run / 執行方式

```sh
docker build -t ctf-01 ./01
docker run --rm -p 8081:8080 ctf-01
```

Visit <http://localhost:8081>.

開啟 <http://localhost:8081>。

## Notes For Players / 給解題者的提示方向

No brute force is needed. The intended path is web enumeration, source/config disclosure, and signed session forgery.

不需要暴力破解。預期解法是先做 web enumeration，接著取得 source/config 資訊，最後偽造 signed session。

## Hints / 提示

Open hints only when you are stuck, and read them in order.

卡住時再看提示，請依序一個一個打開，不要一次看完三個。

- Hint 1 / 提示 1：`hints/hint1.md`
- Hint 2 / 提示 2：`hints/hint2.md`
- Hint 3 / 提示 3：`hints/hint3.md`
