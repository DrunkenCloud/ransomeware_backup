import pandas as pd
import os

with open("sample_log.txt", "w") as f:
    f.write("2024-06-11 10:00:01 INFO User 'admin' logged in.\n")
    f.write("2024-06-11 10:05:30 ERROR Failed login attempt from 192.168.1.10.\n")
    f.write("2024-06-11 10:15:00 INFO System health check passed.\n")

try:
    with open("sample_log.txt", "r") as file:
        content = file.read()
        print("--- Content of sample_log.txt ---")
        print(content)
except FileNotFoundError:
    print("Error: sample_log.txt not found.")

try:
    with open("sample_log.txt", "r") as file:
        print("\n--- Content of sample_log.txt (line by line) ---")
        for line in file:
            print(line.strip()) # .strip() removes leading/trailing whitespace including newlines
except FileNotFoundError:
    print("Error: sample_log.txt not found.")


data_csv = """Timestamp,Event,Source_IP,Destination_IP,Port
2024-06-11 10:00:01,Login,192.168.1.50,ServerA,80
2024-06-11 10:00:05,FileAccess,192.168.1.60,ServerB,443
2024-06-11 10:00:10,NetworkScan,10.0.0.1,203.0.113.1,N/A
2024-06-11 10:00:15,Alert,192.168.1.70,ServerC,22
2024-06-11 10:00:20,Login,192.168.1.50,ServerA,80
"""
with open("security_events.csv", "w") as f:
    f.write(data_csv)

data = {
    'Threat_ID': [101, 102, 103, 104],
    'Threat_Name': ['Malware.Gen', 'Phishing.URL', 'DDoS.Attack', 'Ransomware.Crypt'],
    'Severity': ['High', 'Medium', 'Critical', 'High'],
    'Date_Detected': ['2024-06-01', '2024-06-03', '2024-06-05', '2024-06-08']
}
threat_df = pd.DataFrame(data)
print("\n--- DataFrame created from dictionary ---")
print(threat_df)

try:
    events_df = pd.read_csv("security_events.csv")
    print("\n--- DataFrame loaded from security_events.csv ---")
    print(events_df)
except FileNotFoundError:
    print("Error: security_events.csv not found.")

if 'events_df' in locals(): 
    print("\n--- First 3 rows of events_df (head) ---")
    print(events_df.head(3))

    print("\n--- Information about events_df (info) ---")
    events_df.info()

    print("\n--- Summary statistics for numerical columns (describe) ---")
    print(events_df.describe())

    print("\n--- Selecting a single column ('Event') ---")
    print(events_df['Event'])

    print("\n--- Selecting multiple columns ('Timestamp', 'Source_IP') ---")
    print(events_df[['Timestamp', 'Source_IP']])

    print("\n--- Filtering rows where Event is 'Login' ---")
    login_events = events_df[events_df['Event'] == 'Login']
    print(login_events)

os.remove("sample_log.txt")
os.remove("new_report.txt")
os.remove("security_events.csv")
print("\nCleaned up dummy files.")