#include <stdio.h>
#include <string.h>
#include <stdlib.h>

unsigned char actual_xor_flag_data[] = {
    0x33, 0x39, 0x3C, 0x3B, 0x06, 0x33, 0x3A, 0x06,
    0x35, 0x33, 0x3F, 0x06, 0x3E, 0x3A, 0x3D, 0x06,
    0x3F, 0x00
};

unsigned char xor_key = 0x55;

void decrypt_buffer(unsigned char *buffer, int len, unsigned char key) {
    for (int i = 0; i < len; i++) {
        buffer[i] = buffer[i] ^ key;
    }
}

int main() {
    char user_input[32];
    int actual_flag_len = sizeof(actual_xor_flag_data) - 1;

    printf("Welcome to the XOR Challenge!\n");
    printf("Enter the secret string: ");

    if (scanf("%31s", user_input) != 1) {
        printf("Error reading input.\n");
        return 1;
    }

    unsigned char decrypted_comparison_buffer[sizeof(actual_xor_flag_data)];
    memcpy(decrypted_comparison_buffer, actual_xor_flag_data, sizeof(actual_xor_flag_data));

    decrypt_buffer(decrypted_comparison_buffer, actual_flag_len, xor_key);

    if (strcmp(user_input, (char*)decrypted_comparison_buffer) == 0) {
        printf("Congratulations! You found the flag!\n");
    } else {
        printf("Incorrect string. Try again.\n");
    }

    return 0;
}