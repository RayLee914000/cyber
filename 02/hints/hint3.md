# 02 Hint 3 / 提示 3

After decompressing `IDAT`, skip each scanline filter byte, shuffle pixel positions with the stored seed, read blue-channel LSBs, XOR with the key, then zlib-decompress.

解壓 `IDAT` 後，記得跳過每列開頭的 scanline filter byte；用儲存的 seed 打亂 pixel 位置，讀 blue channel 的 LSB，接著用 key 做 XOR，最後 zlib 解壓。
