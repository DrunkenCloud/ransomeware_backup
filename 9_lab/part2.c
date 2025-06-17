#include <stdio.h>
#include <string.h>
#include <stdlib.h>

unsigned char flag[] = {0x46, 0x4C, 0x41, 0x47, 0x7B, 0x50, 0x61, 0x72, 0x74, 0x5F, 0x31, 0x73, 0x5F, 0x48, 0x69, 0x64, 0x64, 0x65, 0x6E, 0x7D, 0x00};

int main() {
    int user_num;
    printf("Welcome to the Binary-Only Challenge!\n");
    printf("To reveal the secret, enter the magic number: ");

    if (scanf("%d", &user_num) != 1) {
        printf("Invalid input. Please enter a number.\n");
        return 1;
    }

    int magic_number = 1337;
    int target_sum = 2000;

    if (user_num + magic_number == target_sum) {
        printf("Correct! Here is your flag:\n");

        printf("%s", flag);
    } else {
        printf("Incorrect number. Access denied.\n");
    }

    return 0;
}