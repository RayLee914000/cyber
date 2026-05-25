# 02 - Palette Static Solution

## Rubric Fit

- Problem clarity: High. The PNG looks harmless and the useful data is split between metadata and pixel data.
- Number of steps: High. Inspect chunks, parse custom metadata, rebuild raw pixels, extract shuffled blue-channel LSBs, XOR, then decompress.
- Required knowledge: High. Requires PNG chunk structure, scanline filters, LSB steganography, PRNG ordering, XOR, and zlib.
- Tool usage: High. `xxd`, `binwalk`, custom scripts, or a PNG parser are expected.
- Error tolerance: High. Wrong channel, wrong bit order, or ignoring scanline filter bytes breaks the payload.
- Estimated solving time: High. Expected time is over 40 minutes.
- Hint dependency: High. Hints may be needed for the `rNDm` chunk and scanline layout.

## Exact Solution Path

1. Parse PNG chunks and find `tEXt` plus custom `rNDm`.
2. Read the text hint: seed `0x5eed2026`, channel `B`, stream `xor-zlib`, key `rubric-high`.
3. Read `rNDm`: seed, encrypted payload length, and bit count.
4. Decompress `IDAT`.
5. Rebuild RGB pixels, skipping one PNG filter byte at the start of every scanline.
6. Shuffle pixel positions with Python's `random.Random(seed).shuffle(...)`.
7. Take the blue-channel LSBs from the first `bit_count` shuffled positions.
8. Pack bits into bytes, XOR with `rubric-high`, and zlib-decompress the result.

Automated solver:

```sh
python3 resolve/solve_02.py 02/dist/signal.png
```
