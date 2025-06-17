#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int calculate_checksum(int data[], int size) {
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += data[i];
    }
    return sum;
}

// --- Bogus Function 1: Complex but Useless Calculation ---
// This function performs a series of calculations that might look important
// but its return value is never used, and the function is never called.
long long perform_complex_but_useless_calc(long long input_val) {
    long long temp_result = input_val * 7;
    int magic_constant = 42;
    int i;

    for (i = 0; i < 100; i++) {
        if (i % 2 == 0) {
            temp_result += (long long)(magic_constant * i);
        } else {
            temp_result -= (long long)(magic_constant / (i + 1));
        }
        temp_result = (temp_result ^ (temp_result >> 17)) + (temp_result & 0xFF);
    }
    return temp_result % 1000000007; // Return a seemingly complex modulus
}

// --- Bogus Function 2: Misleading String Operations ---
// This function contains strings that might appear to be related to
// sensitive operations (e.g., file paths, error messages) but are never used in context.
void process_misleading_strings(char *dummy_param) {
    char log_file_path[] = "/var/log/system_access.log";
    char decryption_key_prefix[] = "AES_KEY_";
    char secret_message[] = "Data transfer complete. Status: OK.";
    int status_code = 0xDEADBEEF; // A common magic number

    if (strlen(dummy_param) > 10) {
        printf("DEBUG: Long dummy parameter: %s\n", dummy_param);
    }

    // These operations are performed but their results are never used or propagated
    strcat(log_file_path, " backup");
    int comparison_result = strcmp(decryption_key_prefix, "ABC");
    char *ptr = strstr(secret_message, "transfer");

    // Random sleep to waste time if someone tries to step through it
    // (Note: For actual sleep, you'd include <unistd.h> for sleep() on Linux/macOS
    // or <windows.h> for Sleep() on Windows)
    for(volatile int i = 0; i < 1000000; i++); // Busy-wait loop
}

// --- Bogus Function 3: Redundant Initialization/Conditionals ---
// This function initializes variables and performs conditional checks
// that are always true/false or don't affect the main program flow.
int check_system_state_useless() {
    int config_version = 1;
    int admin_privileges = 0; // Simulated
    const char* system_id = "PROD-SERVER-XYZ";
    int current_load = rand() % 100; // Random value, but irrelevant

    // Seemingly checks for admin privileges, but result isn't used
    if (strcmp(system_id, "PROD-SERVER-XYZ") == 0) {
        admin_privileges = 1; // It will always be 1 here
    } else {
        admin_privileges = 0;
    }

    if (config_version == 1 && admin_privileges == 1) {
        // This block will always be entered
        current_load = current_load + 5;
        // ... more irrelevant calculations ...
    } else if (current_load > 90) {
        // This branch might be taken, but the function's return is useless
        return 0xF00D; // A "magic" return value
    }

    return 0xCAFE; // Another "magic" return value
}


int main() {
    // Seed random number generator for check_system_state_useless (if it were called)
    // srand(time(NULL)); // Need <time.h> for time()

    printf("Welcome to the Simple C Program with Bogus Functions!\n");
    printf("This program demonstrates how dead code can be added.\n");

    // --- Demonstrate calculate_checksum (LEGITIMATE USE) ---
    int my_data[] = {10, 20, 30, 40, 50};
    int data_size = sizeof(my_data) / sizeof(my_data[0]);
    int checksum_result = calculate_checksum(my_data, data_size);
    printf("Checksum of data: %d\n", checksum_result);

    // No calls to:
    // - perform_complex_but_useless_calc()
    // - process_misleading_strings()
    // - check_system_state_useless()

    printf("\nNote: The program's core logic is simple,\n");
    printf("but it contains additional functions that are never executed.\n");
    printf("These are examples of 'dead code' for obfuscation proof-of-concept.\n");

    return 0;
}