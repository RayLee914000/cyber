#include <stdint.h>
#include <stdio.h>
#include <string.h>

static const unsigned char target_blob[] = {
    'W', 'D', 'R', 'N', 0x21,
    0xbf, 0xf6, 0xe9, 0xd3, 0xd0, 0x81, 0xd5, 0xf2, 0x69, 0x2c, 0xd8,
    0x75, 0xc3, 0x30, 0x0f, 0xa3, 0x54, 0x03, 0x10, 0x53, 0x29, 0x23,
    0x39, 0x8b, 0x4b, 0xe4, 0x4c, 0xbb, 0x9a, 0xd6, 0xa0, 0xd7, 0x1d
};

static uint32_t rotl32(uint32_t value, unsigned int shift) {
    return (value << shift) | (value >> (32 - shift));
}

static unsigned char mix(unsigned char input, int index, uint32_t *state) {
    *state = rotl32(*state ^ input, 5);
    *state = *state + 0x9e3779b9U + (uint32_t)(index * 17);
    return (unsigned char)(((input ^ (*state & 0xff)) + ((*state >> 8) & 0xff) + index * 3) & 0xff);
}

int main(int argc, char **argv) {
    const unsigned char *target = target_blob + 5;
    const int target_len = target_blob[4];
    uint32_t state = 0xC0DEC0DEU;

    if (argc != 2) {
        puts("usage: ./warden CTF{...}");
        return 2;
    }

    if ((int)strlen(argv[1]) != target_len) {
        puts("denied");
        return 1;
    }

    for (int i = 0; i < target_len; i++) {
        unsigned char got = mix((unsigned char)argv[1][i], i, &state);
        if (got != target[i]) {
            puts("denied");
            return 1;
        }
    }

    puts("accepted");
    return 0;
}
