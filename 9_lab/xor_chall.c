#include <stdio.h>
#include <string.h>

int main() {
    unsigned char key;
    unsigned char val1 = 0x42;
    unsigned char val2 = 0x2F;

    printf("Enter the XOR key (0-255): ");
    scanf("%hhu", &key);

    if ((val1 ^ key) == val2) {
        char flag[] = "flag{xor_key_correct}";
        printf("Correct! Flag: %s\n", flag);
    } else {
        printf("Wrong key.\n");
    }

    return 0;
}
