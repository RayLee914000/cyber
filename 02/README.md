# 02 - Palette Static / 調色盤雜訊

## Category / 類別

Image / Forensics

圖片鑑識 / 數位鑑識

## Proposed Difficulty / 建議難度

High / 高難度

## Challenge / 題目說明

The file `signal.png` looks like a simple generated image, but its author left metadata and a shuffled bitstream inside the image data.

`signal.png` 看起來只是一張普通的產生圖片，但作者在 metadata 與影像資料中留下了被打亂的 bitstream。

Recover the flag.

請還原 flag。

## Run / 執行方式

```sh
docker build -t ctf-02 ./02
docker run --rm -p 8082:8080 ctf-02
```

Download <http://localhost:8082/signal.png>.

下載 <http://localhost:8082/signal.png>。

## Notes For Players / 給解題者的提示方向

The intended path does not require guessing image dimensions or visually editing the image. Inspect PNG chunks, reconstruct scanlines, then extract the indicated LSB stream.

預期解法不需要猜圖片尺寸，也不需要用影像編輯器肉眼修改圖片。請檢查 PNG chunks、重建 scanlines，並依照提示取出指定的 LSB stream。

## Hints / 提示

Open hints only when you are stuck, and read them in order.

卡住時再看提示，請依序一個一個打開，不要一次看完三個。

- Hint 1 / 提示 1：`hints/hint1.md`
- Hint 2 / 提示 2：`hints/hint2.md`
- Hint 3 / 提示 3：`hints/hint3.md`
