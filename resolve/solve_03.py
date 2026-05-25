#!/usr/bin/env python3
from __future__ import annotations

import string
import sys
from pathlib import Path

ALPHABET = string.ascii_letters + string.digits + "{}_"


def rotl32(value: int, shift: int) -> int:
    return ((value << shift) | (value >> (32 - shift))) & 0xFFFFFFFF


def mix(byte: int, index: int, state: int) -> tuple[int, int]:
    state = rotl32(state ^ byte, 5)
    state = (state + 0x9E3779B9 + index * 17) & 0xFFFFFFFF
    out = ((byte ^ (state & 0xFF)) + ((state >> 8) & 0xFF) + index * 3) & 0xFF
    return out, state


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: solve_03.py 03/dist/warden")
    blob = Path(sys.argv[1]).read_bytes()
    marker = blob.index(b"WDRN")
    length = blob[marker + 4]
    target = blob[marker + 5:marker + 5 + length]

    state = 0xC0DEC0DE
    answer = []
    for i, expected in enumerate(target):
        for ch in ALPHABET:
            got, next_state = mix(ord(ch), i, state)
            if got == expected:
                answer.append(ch)
                state = next_state
                break
        else:
            raise SystemExit(f"no candidate for position {i}")

    print("".join(answer))


if __name__ == "__main__":
    main()
