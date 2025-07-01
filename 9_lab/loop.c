#include <stdio.h>

#include <stdio.h>

void print_flag(int result) {
    char flag[] = "CTF{result_is_";
    printf("%s%d}\n", flag, result);
}


int main() {
    int user;
    printf("Enter result: ");
    scanf("%d", &user);

    int result = 0;
    for (int i = 1; i <= 5; i++) {
        result += i * 3;
    }

    if (user == result) {
        print_flag(result);
    } else {
        printf("Nope!\n");
    }

    return 0;
}
