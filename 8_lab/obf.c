#include <stdio.h>

unsigned char encoded_secret_key[] = {
    0xEE, 0xF2, 0xAA, 0xAE, 0xAC, 0xAF, 0xAB, 0xE9, 0xAA, 0xA2, 0xAF, 0xA4, 0xA8, 0xE8, 0xEA, 0xEB, 0xAE, 0xAC, 0xA5, 0xA7, 0xAD, 0xAE, 0xAF, 0x00 // Null terminator
};
unsigned char xor_key = 0xAA;

void decode_string(unsigned char *encoded_str, unsigned char key) {
    int i = 0;
    while (encoded_str[i] != 0) { 
        encoded_str[i] = encoded_str[i] ^ key;
        i++;
    }
}

int validate_key(char *input_key) {
    char decoded_key[sizeof(encoded_secret_key)];
    memcpy(decoded_key, encoded_secret_key, sizeof(encoded_secret_key));

    decode_string((unsigned char *)decoded_key, xor_key);  

    if (strcmp(input_key, decoded_key) == 0) {
        printf("Correct!");
        return 1;
    } else {
        printf("Wrong!");
        return 0;
    }
}