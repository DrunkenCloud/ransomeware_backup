#include <stdio.h>
#include <string.h>

int calculate_checksum(int data[], int size) {
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += data[i];
    }
    return sum;
}

int validate_key(char *input_key) {
    char secret_key[] = "MySecurePassword123";
    if (strcmp(input_key, secret_key) == 0) {
        return 1;
    } else {
        return 0;
    }
}

int main() {
    printf("Welcome, this is a Simple C Program!\n");

    int my_data[] = {10, 20, 30, 40, 50};
    int data_size = sizeof(my_data) / sizeof(my_data[0]);
    int checksum_result = calculate_checksum(my_data, data_size);
    printf("Checksum of data: %d\n", checksum_result);

    char user_input[50];
    printf("Enter the secret key: ");
    scanf("%s", user_input);

    if (validate_key(user_input)) {
        printf("Key validation successful! Access granted.\n");
    } else {
        printf("Key validation failed! Access denied.\n");
    }

    return 0;
}