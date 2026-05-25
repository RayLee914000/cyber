# 03 Hint 3 / 提示 3

The check updates state one input byte at a time. Because the alphabet is small and the state is deterministic, you can brute force each next character while carrying the state forward.

驗證邏輯會逐 byte 更新 state。因為 flag 字元集合不大，而且 state 更新是 deterministic 的，所以可以逐字暴力測試下一個字元並把 state 往後帶。
