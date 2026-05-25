# 03 - Warden State Solution

## Rubric Fit

- Problem clarity: High. The binary only says accepted or denied.
- Number of steps: High. Identify format, find embedded target bytes, reverse the state update, then invert each byte.
- Required knowledge: High. Requires ELF inspection, static analysis, integer arithmetic, rotations, and brute-force inversion.
- Tool usage: High. `strings`, `objdump`, `gdb`, Ghidra, Binary Ninja, or a custom parser can be used.
- Error tolerance: High. A wrong rotation width or signed/unsigned assumption changes every later byte.
- Estimated solving time: High. Expected time is over 40 minutes.
- Hint dependency: High. Hints may be needed to locate `WDRN` and notice the byte-wise invertibility.

## Exact Solution Path

1. Inspect the ELF and find marker `WDRN`.
2. The byte after `WDRN` is the target length.
3. The following bytes are the expected mixed output.
4. Reverse the loop:
   - state starts as `0xC0DEC0DE`
   - `state = rotl32(state ^ input_byte, 5)`
   - `state = state + 0x9e3779b9 + index * 17`
   - output byte is `((input_byte ^ (state & 0xff)) + ((state >> 8) & 0xff) + index * 3) & 0xff`
5. Because state depends on the previous accepted byte, brute force one printable flag character at a time.
6. Verify the recovered flag with `./warden '<flag>'`.

Automated solver:

```sh
python3 resolve/solve_03.py 03/dist/warden
```
