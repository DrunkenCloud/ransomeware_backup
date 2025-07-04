
export interface LogEntry {
  timestamp: string;
  type: 'FILE_ACCESS' | 'PROCESS' | 'NETWORK' | 'SYSTEM' | 'SECURITY';
  user: string;
  process: string;
  message: string;
  isMalicious: boolean;
}

const users = [
  'jsmith', 'mdavis', 'kwilson', 'abrown', 'rjohnson', 'lgarcia', 'tmiller', 'cwilliams',
  'slee', 'mjones', 'dwhite', 'kmartin', 'bthompson', 'janderson', 'ntaylor', 'pclark'
];

const benignProcesses = [
  'explorer.exe', 'chrome.exe', 'firefox.exe', 'outlook.exe', 'word.exe', 'excel.exe',
  'powerpoint.exe', 'notepad.exe', 'calculator.exe', 'cmd.exe', 'powershell.exe',
  'svchost.exe', 'winlogon.exe', 'lsass.exe', 'csrss.exe', 'wininit.exe',
  'services.exe', 'spoolsv.exe', 'dwm.exe', 'audiodg.exe', 'conhost.exe'
];

const maliciousProcesses = [
  'payload.exe', 'invoice_handler.exe', 'system_update.exe', 'security_patch.exe',
  'document_viewer.exe', 'flash_player.exe', 'java_updater.exe', 'chrome_update.exe',
  'windows_defender.exe', 'antivirus_scan.exe'
];

const fileExtensions = [
  '.txt', '.doc', '.docx', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx',
  '.jpg', '.png', '.gif', '.mp4', '.avi', '.zip', '.rar', '.exe'
];

const encryptedExtensions = [
  '.locked', '.encrypted', '.crypto', '.vault', '.secure', '.encoded',
  '.cipher', '.protected', '.blocked', '.ransom'
];

const commonFiles = [
  'invoice', 'report', 'presentation', 'budget', 'contract', 'proposal',
  'meeting_notes', 'project_plan', 'customer_data', 'financial_report',
  'employee_list', 'backup', 'archive', 'database', 'config', 'log'
];

const generateTimestamp = (baseTime: Date, offsetMinutes: number): string => {
  const time = new Date(baseTime.getTime() + offsetMinutes * 60000);
  return time.toISOString().replace('T', ' ').split('.')[0];
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateBenignLogs = (count: number, startTime: Date): LogEntry[] => {
  const logs: LogEntry[] = [];
  
  for (let i = 0; i < count; i++) {
    const user = getRandomElement(users);
    const process = getRandomElement(benignProcesses);
    const file = getRandomElement(commonFiles);
    const ext = getRandomElement(fileExtensions);
    const timestamp = generateTimestamp(startTime, Math.random() * 480); // 8 hours spread
    
    const logTypes = [
      {
        type: 'FILE_ACCESS' as const,
        message: `File accessed: C:\\Users\\${user}\\Documents\\${file}${ext}`,
      },
      {
        type: 'PROCESS' as const,
        message: `Process started by user ${user}`,
      },
      {
        type: 'NETWORK' as const,
        message: `Network connection established to ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}:${80 + Math.floor(Math.random() * 8000)}`,
      },
      {
        type: 'SYSTEM' as const,
        message: `System service ${process} performed routine maintenance`,
      },
      {
        type: 'SECURITY' as const,
        message: `User ${user} successfully authenticated`,
      }
    ];
    
    const logType = getRandomElement(logTypes);
    
    logs.push({
      timestamp,
      type: logType.type,
      user,
      process,
      message: logType.message,
      isMalicious: false
    });
  }
  
  return logs;
};

const generateSuspiciousButSafeLogs = (startTime: Date): LogEntry[] => {
  const logs: LogEntry[] = [];
  const suspiciousUser = getRandomElement(users);
  
  // Generate 15-20 mildly suspicious but benign activities
  const suspiciousCount = 15 + Math.floor(Math.random() * 6);
  
  for (let i = 0; i < suspiciousCount; i++) {
    const timeOffset = 30 + Math.random() * 400; // Spread over ~7 hours
    const user = i < 3 ? suspiciousUser : getRandomElement(users);
    
    const suspiciousActivities = [
      {
        type: 'FILE_ACCESS' as const,
        process: 'explorer.exe',
        message: `Multiple file access attempts in short succession in C:\\Users\\${user}\\Downloads\\`,
      },
      {
        type: 'NETWORK' as const,
        process: 'chrome.exe',
        message: `Connection to unfamiliar domain: temp-downloads-${Math.floor(Math.random() * 1000)}.com`,
      },
      {
        type: 'PROCESS' as const,
        process: 'powershell.exe',
        message: `PowerShell script execution by user ${user}`,
      },
      {
        type: 'SECURITY' as const,
        process: 'winlogon.exe',
        message: `Failed login attempt for user ${user} from workstation`,
      },
      {
        type: 'FILE_ACCESS' as const,
        process: 'winrar.exe',
        message: `Archive extraction: temp_files_${Math.floor(Math.random() * 100)}.zip`,
      },
      {
        type: 'NETWORK' as const,
        process: 'firefox.exe',
        message: `Download initiated from external source: file_${Math.floor(Math.random() * 1000)}.exe`,
      },
      {
        type: 'SYSTEM' as const,
        process: 'cmd.exe',
        message: `Command line utility accessed by ${user}`,
      },
      {
        type: 'FILE_ACCESS' as const,
        process: 'notepad.exe',
        message: `Text file created: C:\\Users\\${user}\\Desktop\\notes_${Math.floor(Math.random() * 100)}.txt`,
      }
    ];
    
    const activity = getRandomElement(suspiciousActivities);
    
    logs.push({
      timestamp: generateTimestamp(startTime, timeOffset),
      type: activity.type,
      user,
      process: activity.process,
      message: activity.message,
      isMalicious: false // These are suspicious but not actually malicious
    });
  }
  
  return logs;
};

const generateMaliciousLogs = (startTime: Date): LogEntry[] => {
  const logs: LogEntry[] = [];
  const attackUser = getRandomElement(users);
  const maliciousProcess = getRandomElement(maliciousProcesses);
  
  // Initial infection - spread over 30 minutes
  logs.push({
    timestamp: generateTimestamp(startTime, 45),
    type: 'FILE_ACCESS',
    user: attackUser,
    process: 'outlook.exe',
    message: `Email attachment opened: invoice_2024_urgent.pdf.exe`,
    isMalicious: true
  });
  
  logs.push({
    timestamp: generateTimestamp(startTime, 52),
    type: 'PROCESS',
    user: attackUser,
    process: maliciousProcess,
    message: `Suspicious process execution detected`,
    isMalicious: true
  });
  
  // Privilege escalation - 20 minutes later
  logs.push({
    timestamp: generateTimestamp(startTime, 75),
    type: 'SECURITY',
    user: 'SYSTEM',
    process: maliciousProcess,
    message: `Process attempted to modify system registry`,
    isMalicious: true
  });
  
  // Network communication - spread across 40 minutes
  logs.push({
    timestamp: generateTimestamp(startTime, 88),
    type: 'NETWORK',
    user: attackUser,
    process: maliciousProcess,
    message: `Outbound connection to suspicious IP: 185.234.72.45:8080`,
    isMalicious: true
  });
  
  logs.push({
    timestamp: generateTimestamp(startTime, 125),
    type: 'NETWORK',
    user: 'SYSTEM',
    process: maliciousProcess,
    message: `Suspicious DNS query to temp-file-server.net`,
    isMalicious: true
  });
  
  // File encryption starts - spread over 2 hours
  const encryptionStartTime = 140;
  for (let i = 0; i < 12; i++) {
    const file = getRandomElement(commonFiles);
    const originalExt = getRandomElement(fileExtensions);
    const encryptedExt = getRandomElement(encryptedExtensions);
    const targetUser = getRandomElement(users);
    
    logs.push({
      timestamp: generateTimestamp(startTime, encryptionStartTime + i * 8),
      type: 'FILE_ACCESS',
      user: 'SYSTEM',
      process: maliciousProcess,
      message: `File renamed: C:\\Users\\${targetUser}\\Documents\\${file}${originalExt} -> ${file}${originalExt}${encryptedExt}`,
      isMalicious: true
    });
  }
  
  // Mass file modifications - spread over 90 minutes
  for (let i = 0; i < 6; i++) {
    logs.push({
      timestamp: generateTimestamp(startTime, 200 + i * 15),
      type: 'FILE_ACCESS',
      user: 'SYSTEM',
      process: maliciousProcess,
      message: `High-volume file modification detected in C:\\Users\\${getRandomElement(users)}\\`,
      isMalicious: true
    });
  }
  
  // Additional network exfiltration attempts - spread out
  logs.push({
    timestamp: generateTimestamp(startTime, 235),
    type: 'NETWORK',
    user: 'SYSTEM',
    process: maliciousProcess,
    message: `Data exfiltration detected: 23.7 MB uploaded to external server`,
    isMalicious: true
  });
  
  logs.push({
    timestamp: generateTimestamp(startTime, 280),
    type: 'NETWORK',
    user: 'SYSTEM',
    process: maliciousProcess,
    message: `Large data transfer: 67.3 MB sent to 203.45.78.12:443`,
    isMalicious: true
  });
  
  // Ransom notes creation - spread over 30 minutes
  const ransomNoteTime = 320;
  for (let i = 0; i < 5; i++) {
    const targetUser = getRandomElement(users);
    logs.push({
      timestamp: generateTimestamp(startTime, ransomNoteTime + i * 6),
      type: 'FILE_ACCESS',
      user: 'SYSTEM',
      process: maliciousProcess,
      message: `File created: C:\\Users\\${targetUser}\\Desktop\\READ_ME_FOR_DECRYPT.txt`,
      isMalicious: true
    });
  }
  
  // Process persistence - near the end
  logs.push({
    timestamp: generateTimestamp(startTime, 380),
    type: 'SYSTEM',
    user: 'SYSTEM',
    process: maliciousProcess,
    message: `Registry modification: Added startup entry for ${maliciousProcess}`,
    isMalicious: true
  });
  
  // Final cleanup attempt
  logs.push({
    timestamp: generateTimestamp(startTime, 420),
    type: 'SYSTEM',
    user: 'SYSTEM',
    process: maliciousProcess,
    message: `Event log tampering detected: Security logs being cleared`,
    isMalicious: true
  });
  
  return logs;
};

export const generateSystemLogs = (): LogEntry[] => {
  const startTime = new Date('2024-06-12T08:00:00');
  
  // Randomly decide if this should be a safe system or compromised system
  // 30% chance of being truly safe, 70% chance of being compromised
  const isSafeSystem = Math.random() < 0.5;
  
  if (isSafeSystem) {
    // Generate truly safe system with only benign logs and some mildly suspicious but safe activities
    const benignLogs = generateBenignLogs(65, startTime);
    const suspiciousButSafeLogs = generateSuspiciousButSafeLogs(startTime);
    
    const allLogs = [...benignLogs, ...suspiciousButSafeLogs];
    allLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return allLogs;
  } else {
    // Generate compromised system with actual ransomware attack
    const benignLogs = generateBenignLogs(60, startTime);
    const maliciousLogs = generateMaliciousLogs(startTime);
    
    const allLogs = [...benignLogs, ...maliciousLogs];
    allLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return allLogs;
  }
};
