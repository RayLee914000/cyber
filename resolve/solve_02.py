#!/usr/bin/env python3
from __future__ import annotations

import random
import struct
import sys
import zlib
from pathlib import Path


def chunks(data: bytes):
    offset = 8
    while offset < len(data):
        size = struct.unpack(">I", data[offset:offset + 4])[0]
        kind = data[offset + 4:offset + 8]
        body = data[offset + 8:offset + 8 + size]
        yield kind, body
        offset += 12 + size


def bits_to_bytes(bits: list[int]) -> bytes:
    out = bytearray()
    for i in range(0, len(bits), 8):
        value = 0
        for bit in bits[i:i + 8]:
            value = (value << 1) | bit
        out.append(value)
    return bytes(out)


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: solve_02.py 02/dist/signal.png")
    data = Path(sys.argv[1]).read_bytes()
    assert data.startswith(b"\x89PNG\r\n\x1a\n")

    width = height = None
    seed = length = bit_count = None
    key = None
    idat = bytearray()

    for kind, body in chunks(data):
        if kind == b"IHDR":
            width, height = struct.unpack(">II", body[:8])
        elif kind == b"tEXt":
            text = body.decode()
            key = text.split("key=", 1)[1].encode()
        elif kind == b"rNDm":
            seed, length, bit_count = struct.unpack(">IIH", body)
        elif kind == b"IDAT":
            idat.extend(body)

    if None in (width, height, seed, length, bit_count, key):
        raise SystemExit("missing required PNG metadata")

    raw = zlib.decompress(bytes(idat))
    pixels = bytearray()
    stride = width * 3
    for y in range(height):
        row = raw[y * (stride + 1):(y + 1) * (stride + 1)]
        if row[0] != 0:
            raise SystemExit("unsupported PNG filter")
        pixels.extend(row[1:])

    positions = list(range(width * height))
    random.Random(seed).shuffle(positions)
    bits = [(pixels[pos * 3 + 2] & 1) for pos in positions[:bit_count]]
    encrypted = bits_to_bytes(bits)[:length]
    compressed = bytes(byte ^ key[i % len(key)] for i, byte in enumerate(encrypted))
    print(zlib.decompress(compressed).decode())


if __name__ == "__main__":
    main()
