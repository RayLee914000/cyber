#!/usr/bin/env python3
from __future__ import annotations

import random
import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "02" / "dist" / "signal.png"

WIDTH = 160
HEIGHT = 120
SEED = 0x5EED2026
KEY = b"rubric-high"
FLAG = b"CTF{png_lsb_chunks_are_loud}"


def chunk(kind: bytes, data: bytes) -> bytes:
    body = kind + data
    return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)


def bits_from_bytes(data: bytes) -> list[int]:
    bits: list[int] = []
    for byte in data:
        bits.extend((byte >> shift) & 1 for shift in range(7, -1, -1))
    return bits


def build_pixels() -> bytearray:
    pixels = bytearray()
    for y in range(HEIGHT):
        for x in range(WIDTH):
            r = (x * 3 + y * 5) & 0xFF
            g = (x * 7 + y * 2) & 0xFF
            b = (x ^ y ^ 0x42) & 0xFF
            pixels.extend([r, g, b])
    return pixels


def main() -> None:
    payload = zlib.compress(FLAG)
    encrypted = bytes(byte ^ KEY[i % len(KEY)] for i, byte in enumerate(payload))
    bits = bits_from_bytes(encrypted)

    pixels = build_pixels()
    positions = list(range(WIDTH * HEIGHT))
    random.Random(SEED).shuffle(positions)
    for bit, pos in zip(bits, positions):
        blue_index = pos * 3 + 2
        pixels[blue_index] = (pixels[blue_index] & 0xFE) | bit

    raw = bytearray()
    stride = WIDTH * 3
    for y in range(HEIGHT):
        raw.append(0)
        raw.extend(pixels[y * stride:(y + 1) * stride])

    ihdr = struct.pack(">IIBBBBB", WIDTH, HEIGHT, 8, 2, 0, 0, 0)
    text = b"Comment\x00seed=0x5eed2026; channel=B; stream=xor-zlib; key=rubric-high"
    hint = struct.pack(">IIH", SEED, len(encrypted), len(bits))
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"tEXt", text)
        + chunk(b"rNDm", hint)
        + chunk(b"IDAT", zlib.compress(bytes(raw)))
        + chunk(b"IEND", b"")
    )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(png)
    print(f"wrote {OUT} ({len(png)} bytes)")


if __name__ == "__main__":
    main()
