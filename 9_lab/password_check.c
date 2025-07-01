#include <stdio.h>
#include <string.h>

void print_flag() {
    char flag[] = { 'f', 'l', 'a', 'g', '{', 'o', 'p', 'e', 'n', 's', '}', '\0' };
    printf("Flag: %s\n", flag);
}

int main() {
    char password[16];
    printf("Enter password: ");
    scanf("%15s", password);
    if (strcmp(password, "opensesame") == 0) {
        print_flag();
    } else {
        printf("Wrong password\n");
    }
    return 0;
}
