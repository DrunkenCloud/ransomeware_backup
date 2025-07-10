import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Lock,
  File,
  Folder,
  Image,
  FileText,
  Database,
  HardDrive,
  Eye,
  Wifi,
  WifiOff,
  Power,
  PowerOff,
  Camera,
  Archive,
  Phone,
  Users,
  Clock,
  Zap,
  MessageSquare,
  ClipboardCheck,
  Search,
  Download,
  Upload,
  Server,
  ShieldCheck,
  Loader,
  Bluetooth,
  BluetoothOff,
  Cable,
  Keyboard,
  Mouse,
  Monitor,
  MonitorOff,
  Unplug,
  Router,
  Slash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'document' | 'image' | 'spreadsheet';
  encrypted: boolean;
  suspicious: boolean;
  backedUp: boolean;
}

interface Activity {
  id: string;
  description: string;
  type: 'normal' | 'suspicious' | 'malicious';
  fileChanges?: string[];
  delay: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  requiresAction?: boolean;
  actionType?: 'alert' | 'response';
}

interface IncidentResponse {
  networkIsolated: boolean;
  systemIsolated: boolean;
  evidencePreserved: boolean;
  managementNotified: boolean;
  backupVerified: boolean;
  securityTeamContacted: boolean;
  legalNotified: boolean;
  communicationsPrepared: boolean;
  recoveryPlanInitiated: boolean;
  wifiDisabled: boolean;
  bluetoothDisabled: boolean;
  ethernetDisabled: boolean;
  keyboardDisconnected: boolean;
  mouseDisconnected: boolean;
  monitorDisconnected: boolean;
}

const RansomwareLab: React.FC = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [alertsTriggered, setAlertsTriggered] = useState(0);
  const [correctAlerts, setCorrectAlerts] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [backupCreated, setBackupCreated] = useState(false);
  const [backupScore, setBackupScore] = useState(0);
  const [showRansomNote, setShowRansomNote] = useState(false);
  const [incidentDetected, setIncidentDetected] = useState(false);
  const [waitingForAction, setWaitingForAction] = useState(false);
  const [missedActions, setMissedActions] = useState(0);
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);
  const [activityTimeoutRef, setActivityTimeoutRef] = useState<NodeJS.Timeout | null>(null);
  const [showHints, setShowHints] = useState(true); // New state for hint visibility
  const [showSetupDialog, setShowSetupDialog] = useState(false); // New state for setup dialog
  
  // Enhanced friction states
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupPinCode, setBackupPinCode] = useState('');
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [backupCorrupted, setBackupCorrupted] = useState(false);
  const [managementEmail, setManagementEmail] = useState('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [legalPinCode, setLegalPinCode] = useState('');
  const [showLegalDialog, setShowLegalDialog] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [actionProgress, setActionProgress] = useState(0);
  const [randomizedActivities, setRandomizedActivities] = useState<Activity[]>([]);
  
  const [incidentResponse, setIncidentResponse] = useState<IncidentResponse>({
    networkIsolated: false,
    systemIsolated: false,
    evidencePreserved: false,
    managementNotified: false,
    backupVerified: false,
    securityTeamContacted: false,
    legalNotified: false,
    communicationsPrepared: false,
    recoveryPlanInitiated: false,
    wifiDisabled: false,
    bluetoothDisabled: false,
    ethernetDisabled: false,
    keyboardDisconnected: false,
    mouseDisconnected: false,
    monitorDisconnected: false
  });
  
  const [fileSystem, setFileSystem] = useState<FileItem[]>([
    { id: '1', name: 'Documents', type: 'folder', encrypted: false, suspicious: false, backedUp: false },
    { id: '2', name: 'report.docx', type: 'document', encrypted: false, suspicious: false, backedUp: false },
    { id: '3', name: 'budget.xlsx', type: 'spreadsheet', encrypted: false, suspicious: false, backedUp: false },
    { id: '4', name: 'vacation.jpg', type: 'image', encrypted: false, suspicious: false, backedUp: false },
    { id: '5', name: 'presentation.pptx', type: 'document', encrypted: false, suspicious: false, backedUp: false },
    { id: '6', name: 'Photos', type: 'folder', encrypted: false, suspicious: false, backedUp: false },
    { id: '7', name: 'family.png', type: 'image', encrypted: false, suspicious: false, backedUp: false },
    { id: '8', name: 'contract.pdf', type: 'document', encrypted: false, suspicious: false, backedUp: false },
    { id: '9', name: 'passwords.txt', type: 'document', encrypted: false, suspicious: false, backedUp: false },
    { id: '10', name: 'backup_2024.zip', type: 'file', encrypted: false, suspicious: false, backedUp: false },
    { id: '11', name: 'financial_data.xlsx', type: 'spreadsheet', encrypted: false, suspicious: false, backedUp: false },
    { id: '12', name: 'client_list.docx', type: 'document', encrypted: false, suspicious: false, backedUp: false },
    { id: '13', name: 'product_images', type: 'folder', encrypted: false, suspicious: false, backedUp: false },
    { id: '14', name: 'marketing_plan.pdf', type: 'document', encrypted: false, suspicious: false, backedUp: false },
    { id: '15', name: 'employee_records', type: 'folder', encrypted: false, suspicious: false, backedUp: false }
  ]);

  const baseActivities: Activity[] = [
    // Normal baseline activities (more variety)
    {
      id: 'normal1',
      description: 'User login: john.doe@company.com authenticated successfully',
      type: 'normal',
      delay: 3000
    },
    {
      id: 'normal2',
      description: 'User opens document: report.docx',
      type: 'normal',
      delay: 2500
    },
    {
      id: 'normal3', 
      description: 'Auto-save triggered for report.docx',
      type: 'normal',
      delay: 2000
    },
    {
      id: 'normal4',
      description: 'User opens email application',
      type: 'normal', 
      delay: 2200
    },
    {
      id: 'normal5',
      description: 'User downloads attachment: invoice_march.pdf',
      type: 'normal',
      delay: 1800
    },
    {
      id: 'normal6',
      description: 'System backup process runs automatically',
      type: 'normal',
      delay: 2100
    },
    {
      id: 'normal7',
      description: 'User opens image: vacation.jpg',
      type: 'normal',
      delay: 1900
    },
    {
      id: 'normal8',
      description: 'User creates new folder: Q1_Reports',
      type: 'normal',
      delay: 2300
    },
    {
      id: 'normal9',
      description: 'User continues working on presentation.pptx',
      type: 'normal',
      delay: 2000
    },
    {
      id: 'normal10',
      description: 'User saves changes to budget.xlsx',
      type: 'normal',
      delay: 2100
    },
    {
      id: 'normal11',
      description: 'User opens web browser',
      type: 'normal',
      delay: 1700
    },
    {
      id: 'normal12',
      description: 'User checks system time and date',
      type: 'normal',
      delay: 1500
    },
    {
      id: 'normal13',
      description: 'User opens calculator application',
      type: 'normal',
      delay: 1600
    },
    {
      id: 'normal14',
      description: 'User opens file manager',
      type: 'normal',
      delay: 1800
    },
    {
      id: 'normal15',
      description: 'User checks network connectivity',
      type: 'normal',
      delay: 2000
    },
    
    // Early suspicious indicators (more variety)
    {
      id: 'suspicious1',
      description: 'Unusual process started: winlogon.exe from temp directory',
      type: 'suspicious',
      severity: 'low',
      delay: 1800,
      requiresAction: true,
      actionType: 'alert'
    },
    {
      id: 'suspicious2',
      description: 'Multiple failed login attempts detected from unusual location',
      type: 'suspicious',
      severity: 'medium',
      delay: 1500,
      requiresAction: true,
      actionType: 'alert'
    },
    {
      id: 'suspicious3',
      description: 'Unknown process scanning file directory structure',
      type: 'suspicious',
      severity: 'medium',
      delay: 1200,
      requiresAction: true,
      actionType: 'alert'
    },
    {
      id: 'suspicious4',
      description: 'Suspicious network connection to IP 185.220.102.8 (known malicious)',
      type: 'suspicious',
      severity: 'high',
      delay: 1000,
      requiresAction: true,
      actionType: 'alert'
    },
    {
      id: 'suspicious5',
      description: 'PowerShell process attempting to disable Windows Defender',
      type: 'suspicious',
      severity: 'high',
      delay: 1100,
      requiresAction: true,
      actionType: 'alert'
    },
    {
      id: 'suspicious6',
      description: 'Unusual file access pattern: rapid sequential file reading',
      type: 'suspicious',
      severity: 'high',
      delay: 900,
      requiresAction: true,
      actionType: 'alert'
    },
    {
      id: 'suspicious7',
      description: 'Registry modification detected: disabling system restore',
      type: 'suspicious',
      severity: 'high',
      delay: 1000,
      requiresAction: true,
      actionType: 'alert'
    },
    {
      id: 'suspicious8',
      description: 'Suspicious outbound network traffic detected',
      type: 'suspicious',
      severity: 'medium',
      delay: 1300,
      requiresAction: true,
      actionType: 'alert'
    },
    {
      id: 'suspicious9',
      description: 'Unknown executable attempting to modify system files',
      type: 'suspicious',
      severity: 'high',
      delay: 1200,
      requiresAction: true,
      actionType: 'alert'
    },
    {
      id: 'suspicious10',
      description: 'Anomalous CPU and memory usage patterns detected',
      type: 'suspicious',
      severity: 'medium',
      delay: 1400,
      requiresAction: true,
      actionType: 'alert'
    },
    
    // Critical malicious activities (expanded)
    {
      id: 'malicious1',
      description: 'CRITICAL: Mass file encryption process initiated - 8 files affected',
      type: 'malicious',
      severity: 'critical',
      fileChanges: ['2', '3', '5', '8', '9', '11', '12', '14'],
      delay: 1500,
      requiresAction: true,
      actionType: 'alert'
    },
    {
      id: 'malicious2',
      description: 'CRITICAL: Original files being deleted after encryption',
      type: 'malicious',
      severity: 'critical',
      delay: 1200,
      requiresAction: true,
      actionType: 'response'
    },
    {
      id: 'malicious3',
      description: 'CRITICAL: Ransomware note created: README_RANSOM.txt',
      type: 'malicious',
      severity: 'critical',
      delay: 1000,
      requiresAction: true,
      actionType: 'response'
    },
    {
      id: 'malicious4',
      description: 'CRITICAL: System attempting to delete Volume Shadow Copies',
      type: 'malicious',
      severity: 'critical',
      delay: 1300,
      requiresAction: true,
      actionType: 'response'
    },
    {
      id: 'malicious5',
      description: 'CRITICAL: Encrypting remaining image and document files',
      type: 'malicious',
      severity: 'critical',
      fileChanges: ['4', '7'],
      delay: 1100,
      requiresAction: true,
      actionType: 'response'
    },
    {
      id: 'malicious6',
      description: 'CRITICAL: Ransomware attempting to spread to network shares',
      type: 'malicious',
      severity: 'critical',
      delay: 1400,
      requiresAction: true,
      actionType: 'response'
    },
    {
      id: 'malicious7',
      description: 'CRITICAL: Attempting to encrypt network-attached storage',
      type: 'malicious',
      severity: 'critical',
      delay: 1200,
      requiresAction: true,
      actionType: 'response'
    },
    {
      id: 'malicious8',
      description: 'CRITICAL: Modifying boot sector and system files',
      type: 'malicious',
      severity: 'critical',
      delay: 1000,
      requiresAction: true,
      actionType: 'response'
    },
    {
      id: 'malicious9',
      description: 'CRITICAL: Final encryption pass - remaining system files',
      type: 'malicious',
      severity: 'critical',
      fileChanges: ['1', '6', '13', '15'],
      delay: 1500,
      requiresAction: true,
      actionType: 'response'
    },
    {
      id: 'malicious10',
      description: 'CRITICAL: Attempting to disable system recovery options',
      type: 'malicious',
      severity: 'critical',
      delay: 1100,
      requiresAction: true,
      actionType: 'response'
    },
    {
      id: 'malicious11',
      description: 'CRITICAL: Ransomware payload deploying across domain',
      type: 'malicious',
      severity: 'critical',
      delay: 1300,
      requiresAction: true,
      actionType: 'response'
    }
  ];

  const ransomNoteContent = `
🔒 YOUR FILES HAVE BEEN ENCRYPTED! 🔒

What happened to your files?
All of your important files have been encrypted with military-grade encryption.
Without our special decryption key, your files are permanently lost.

What files are affected?
• Documents (.doc, .pdf, .txt)
• Images (.jpg, .png, .gif)
• Spreadsheets (.xls, .xlsx)
• Presentations (.ppt, .pptx)
• And many more...

How to recover your files?
1. Send 0.5 Bitcoin to: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
2. Email proof of payment to: decrypt@darkweb.onion
3. Wait for our decryption tool (usually 24-48 hours)

⚠️ WARNING ⚠️
• Do NOT try to decrypt files yourself - this will cause permanent damage
• Do NOT restart your computer
• Do NOT contact law enforcement
• You have 72 hours before the price DOUBLES

We are the only ones who can help you recover your files.
Time is running out...

Contact us: decrypt@darkweb.onion
Bitcoin Address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
  `;

  // Generate randomized activity sequence
  const generateRandomizedActivities = () => {
    const normalActivities = baseActivities.filter(a => a.type === 'normal');
    const suspiciousActivities = baseActivities.filter(a => a.type === 'suspicious');
    const maliciousActivities = baseActivities.filter(a => a.type === 'malicious');
    
    const randomized: Activity[] = [];
    
    // Add initial normal activities (5-8)
    const initialNormalCount = Math.floor(Math.random() * 4) + 5;
    for (let i = 0; i < initialNormalCount; i++) {
      const activity = normalActivities[Math.floor(Math.random() * normalActivities.length)];
      randomized.push({ ...activity, id: `${activity.id}_${i}` });
    }
    
    // Intersperse suspicious activities (6-10)
    const suspiciousCount = Math.floor(Math.random() * 5) + 6;
    for (let i = 0; i < suspiciousCount; i++) {
      // Add 1-2 normal activities before each suspicious
      const normalBeforeCount = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < normalBeforeCount; j++) {
        const activity = normalActivities[Math.floor(Math.random() * normalActivities.length)];
        randomized.push({ ...activity, id: `${activity.id}_${randomized.length}` });
      }
      
      const activity = suspiciousActivities[Math.floor(Math.random() * suspiciousActivities.length)];
      randomized.push({ ...activity, id: `${activity.id}_${i}` });
    }
    
    // Add all malicious activities with some normal ones interspersed
    maliciousActivities.forEach((activity, i) => {
      if (i > 0 && Math.random() < 0.3) {
        const normalActivity = normalActivities[Math.floor(Math.random() * normalActivities.length)];
        randomized.push({ ...normalActivity, id: `${normalActivity.id}_${randomized.length}` });
      }
      randomized.push({ ...activity, id: `${activity.id}_mal_${i}` });
    });
    
    // Add final normal activities to reach ~50 total
    while (randomized.length < 48) {
      const activity = normalActivities[Math.floor(Math.random() * normalActivities.length)];
      randomized.push({ ...activity, id: `${activity.id}_final_${randomized.length}` });
    }
    
    return randomized;
  };

  // Clear any running timeouts when component unmounts or simulation stops
  useEffect(() => {
    return () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
      if (activityTimeoutRef) {
        clearTimeout(activityTimeoutRef);
      }
    };
  }, [timeoutRef, activityTimeoutRef]);

  const getFileIcon = (type: string, encrypted: boolean, backedUp: boolean) => {
    if (encrypted) return <Lock className="w-6 h-6 text-cyber-red" />;
    
    const baseIcon = (() => {
      switch (type) {
        case 'folder': return <Folder className="w-6 h-6 text-cyber-blue" />;
        case 'document': return <FileText className="w-6 h-6 text-cyber-green" />;
        case 'image': return <Image className="w-6 h-6 text-cyber-amber" />;
        case 'spreadsheet': return <Database className="w-6 h-6 text-cyber-purple" />;
        default: return <File className="w-6 h-6 text-gray-400" />;
      }
    })();
    
    return (
      <div className="relative">
        {baseIcon}
        {backedUp && (
          <Shield className="w-3 h-3 text-cyber-green absolute -top-1 -right-1" />
        )}
      </div>
    );
  };

  // Fixed backup scoring - higher score for earlier backups
  const calculateBackupScore = (currentStep: number, totalSteps: number) => {
    const progressRatio = currentStep / totalSteps;
    
    // Reverse the scoring - earlier backup = higher score
    if (progressRatio <= 0.2) return 50; // Very early backup
    if (progressRatio <= 0.4) return 40; // Early backup  
    if (progressRatio <= 0.6) return 30; // Mid backup
    if (progressRatio <= 0.8) return 20; // Late backup
    return 10; // Very late backup
  };

  const startBackupProcess = () => {
    if (backupPinCode !== '2024') {
      toast({
        title: "Invalid PIN Code",
        description: "Please enter the correct backup PIN (hint: current year)",
        variant: "destructive"
      });
      return;
    }
    
    setShowBackupDialog(false);
    setBackupInProgress(true);
    setBackupProgress(0);
    setBackupCorrupted(false);
    
    const backupInterval = setInterval(() => {
      setBackupProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        
        // Simulate corruption chance at 60-80% progress
        if (newProgress > 60 && newProgress < 80 && Math.random() < 0.3) {
          setBackupCorrupted(true);
          toast({
            title: "⚠️ BACKUP CORRUPTION DETECTED!",
            description: "File 'financial_data.xlsx' corrupted during backup. Stop backup immediately!",
            variant: "destructive"
          });
        }
        
        if (newProgress >= 100) {
          clearInterval(backupInterval);
          if (!backupCorrupted) {
            completeBackup();
          }
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const stopBackup = () => {
    setBackupInProgress(false);
    if (backupCorrupted) {
      toast({
        title: "Backup Stopped",
        description: "Good decision! Corrupted backups can cause data loss. Try again.",
        className: "bg-cyber-green text-cyber-dark"
      });
      setBackupProgress(0);
      setBackupCorrupted(false);
    } else {
      toast({
        title: "Backup Cancelled",
        description: "Backup process stopped by user.",
        variant: "destructive"
      });
    }
  };

  const completeBackup = () => {
    setFileSystem(prev => prev.map(file => ({ 
      ...file, 
      backedUp: true 
    })));
    
    // Calculate score based on timing - higher for earlier backups
    const earnedBackupScore = calculateBackupScore(currentStep, randomizedActivities.length);
    setBackupScore(earnedBackupScore);
    setScore(prev => prev + earnedBackupScore);
    setBackupCreated(true);
    setBackupInProgress(false);
    
    toast({
      title: "Backup Created Successfully!",
      description: `All files backed up securely! +${earnedBackupScore} points (earlier = better score)`,
      className: "bg-cyber-green text-cyber-dark"
    });
  };

  const createBackup = () => {
    setShowBackupDialog(true);
  };

  const startSimulation = () => {
    setShowSetupDialog(true);
  };

  const confirmStartSimulation = () => {
    // Generate new randomized activities
    const newActivities = generateRandomizedActivities();
    setRandomizedActivities(newActivities);
    
    // Clear any existing timeouts
    if (timeoutRef) {
      clearTimeout(timeoutRef);
      setTimeoutRef(null);
    }
    if (activityTimeoutRef) {
      clearTimeout(activityTimeoutRef);
      setActivityTimeoutRef(null);
    }
    
    // Reset all simulation state
    setCurrentStep(0);
    setAlertsTriggered(0);
    setCorrectAlerts(0);
    setShowFeedback(false);
    setIncidentDetected(false);
    setWaitingForAction(false);
    setMissedActions(0);
    setCurrentActivity(null);
    setActionInProgress(null);
    setActionProgress(0);
    setIncidentResponse({
      networkIsolated: false,
      systemIsolated: false,
      evidencePreserved: false,
      managementNotified: false,
      backupVerified: false,
      securityTeamContacted: false,
      legalNotified: false,
      communicationsPrepared: false,
      recoveryPlanInitiated: false,
      wifiDisabled: false,
      bluetoothDisabled: false,
      ethernetDisabled: false,
      keyboardDisconnected: false,
      mouseDisconnected: false,
      monitorDisconnected: false
    });
    
    setFileSystem(prev => prev.map(file => ({ 
      ...file, 
      encrypted: false, 
      suspicious: false 
    })));
    
    // Set running state and close dialog
    setIsRunning(true);
    setShowSetupDialog(false);
    
    console.log('Starting simulation with', newActivities.length, 'activities');
    
    // Start the first activity
    if (newActivities.length > 0) {
      runActivity(0, newActivities);
    }
  };

  const runActivity = (stepIndex: number, activities: Activity[] = randomizedActivities) => {
    console.log(`runActivity called with stepIndex: ${stepIndex}`);
    
    // Stop if we've reached the end
    if (stepIndex >= activities.length) {
      console.log('Stopping simulation - reached end of activities');
      setIsRunning(false);
      showFinalResults();
      return;
    }

    const activity = activities[stepIndex];
    console.log('Setting current activity:', activity.description);
    setCurrentActivity(activity);
    setCurrentStep(stepIndex);
    
    // Always proceed to next after delay, no waiting for action
    console.log('Activity proceeding to next after delay');
    const timeout = setTimeout(() => {
      proceedToNext(stepIndex, activities);
    }, activity.delay);
    
    setActivityTimeoutRef(timeout);
  };

  const proceedToNext = (stepIndex: number, activities: Activity[] = randomizedActivities) => {
    console.log(`proceedToNext called with stepIndex: ${stepIndex}`);
    
    const activity = activities[stepIndex];
    
    // Clear the timeout when proceeding
    if (timeoutRef) {
      clearTimeout(timeoutRef);
      setTimeoutRef(null);
    }
    if (activityTimeoutRef) {
      clearTimeout(activityTimeoutRef);
      setActivityTimeoutRef(null);
    }
    
    // Apply file changes if any
    if (activity.fileChanges) {
      console.log('Applying file changes:', activity.fileChanges);
      setFileSystem(prev => prev.map(file => 
        activity.fileChanges!.includes(file.id) 
          ? { ...file, encrypted: true }
          : file
      ));
    }
    
    if (activity.id.includes('normal8')) {
      setFileSystem(prev => [...prev, {
        id: 'q1_folder',
        name: 'Q1_Reports',
        type: 'folder',
        encrypted: false,
        suspicious: false,
        backedUp: backupCreated
      }]);
    }
    
    if (activity.description.includes('README_RANSOM.txt')) {
      setFileSystem(prev => [...prev, {
        id: 'ransom_note',
        name: 'README_RANSOM.txt',
        type: 'document',
        encrypted: false,
        suspicious: true,
        backedUp: false
      }]);
    }
    
    // Move to next activity
    const nextStep = stepIndex + 1;
    console.log('Moving to next step:', nextStep);
    
    const nextTimeout = setTimeout(() => {
      runActivity(nextStep, activities);
    }, 500);
    
    setActivityTimeoutRef(nextTimeout);
  };

  const triggerAlert = () => {
    if (!isRunning || !currentActivity) {
      toast({
        title: "No Activity to Evaluate",
        description: "Please start the simulation first.",
        variant: "destructive"
      });
      return;
    }
    
    setAlertsTriggered(prev => prev + 1);
    
    const isCorrect = currentActivity.type === 'suspicious' || currentActivity.type === 'malicious';
    
    if (isCorrect) {
      setCorrectAlerts(prev => prev + 1);
      const points = currentActivity.type === 'malicious' ? 15 : 10;
      setScore(prev => prev + points);
      
      // Set incident detected for first malicious activity
      if (currentActivity.type === 'malicious' && !incidentDetected) {
        setIncidentDetected(true);
      }
      
      toast({
        title: "Correct Alert!",
        description: `Good catch! ${currentActivity.type === 'malicious' ? 'Critical malicious' : 'Suspicious'} activity detected. +${points} points`,
        className: "bg-cyber-green text-cyber-dark"
      });
    } else {
      setScore(prev => Math.max(0, prev - 5));
      toast({
        title: "False Alert",
        description: "This was normal user activity. Try to focus on unusual patterns. -5 points",
        variant: "destructive"
      });
    }
  };

  const performActionWithProgress = (actionKey: keyof IncidentResponse, duration: number, points: number, successMessage: string) => {
    if (!incidentDetected) {
      toast({
        title: "No Incident Detected",
        description: "You must first detect and alert on malicious activity before taking response actions.",
        variant: "destructive"
      });
      return;
    }

    setActionInProgress(actionKey);
    setActionProgress(0);

    const interval = setInterval(() => {
      setActionProgress(prev => {
        const newProgress = prev + (100 / (duration / 100));
        if (newProgress >= 100) {
          clearInterval(interval);
          setIncidentResponse(prev => ({ ...prev, [actionKey]: true }));
          setActionInProgress(null);
          setActionProgress(0);
          setScore(prev => prev + points);
          toast({
            title: "Action Completed",
            description: successMessage,
            className: "bg-cyber-blue text-cyber-dark"
          });
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  const handleManagementNotification = () => {
    if (!incidentDetected) {
      toast({
        title: "No Incident Detected",
        description: "You must first detect and alert on malicious activity before taking response actions.",
        variant: "destructive"
      });
      return;
    }
    setShowEmailDialog(true);
  };

  const sendManagementEmail = () => {
    if (!managementEmail.includes('@') || !managementEmail.includes('.')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address for management notification.",
        variant: "destructive"
      });
      return;
    }
    
    setIncidentResponse(prev => ({ ...prev, managementNotified: true }));
    setShowEmailDialog(false);
    setScore(prev => prev + 10);
    
    toast({
      title: "Management Notified",
      description: `Incident notification sent to ${managementEmail}. Leadership team has been alerted.`,
      className: "bg-cyber-blue text-cyber-dark"
    });
  };

  const handleLegalNotification = () => {
    if (!incidentDetected) {
      toast({
        title: "No Incident Detected",
        description: "You must first detect and alert on malicious activity before taking response actions.",
        variant: "destructive"
      });
      return;
    }
    setShowLegalDialog(true);
  };

  const sendLegalNotification = () => {
    if (legalPinCode !== '7890') {
      toast({
        title: "Invalid PIN Code",
        description: "Please enter the correct legal department PIN",
        variant: "destructive"
      });
      return;
    }
    
    setIncidentResponse(prev => ({ ...prev, legalNotified: true }));
    setShowLegalDialog(false);
    setScore(prev => prev + 8);
    
    toast({
      title: "Legal Team Notified",
      description: "Legal department contacted for compliance assessment.",
      className: "bg-cyber-blue text-cyber-dark"
    });
  };

  const showFinalResults = () => {
    const accuracy = alertsTriggered > 0 ? Math.round((correctAlerts / alertsTriggered) * 100) : 0;
    const responseActions = Object.values(incidentResponse).filter(Boolean).length;
    const backupMessage = backupScoreMessage();
    const missedPenalty = missedActions > 0 ? `Missed ${missedActions} critical activities (-${missedActions * 15} pts)` : "No critical activities missed";
    
    toast({
      title: "Simulation Complete!",
      description: `Final Score: ${score} | Accuracy: ${accuracy}% | Response Actions: ${responseActions}/15 | ${backupMessage} | ${missedPenalty}`,
      className: "bg-cyber-blue text-cyber-dark"
    });
  };

  const backupScoreMessage = () => {
    if (!backupCreated) return "No backup created (0 pts)";
    return `Backup created (+${backupScore} pts)`;
  };

  const resetLab = () => {
    // Clear any running timeouts
    if (timeoutRef) {
      clearTimeout(timeoutRef);
      setTimeoutRef(null);
    }
    if (activityTimeoutRef) {
      clearTimeout(activityTimeoutRef);
      setActivityTimeoutRef(null);
    }
    
    setCurrentStep(0);
    setScore(0);
    setAlertsTriggered(0);
    setCorrectAlerts(0);
    setIsRunning(false);
    setShowFeedback(false);
    setCurrentActivity(null);
    setBackupCreated(false);
    setBackupScore(0);
    setIncidentDetected(false);
    setWaitingForAction(false);
    setMissedActions(0);
    setBackupInProgress(false);
    setBackupProgress(0);
    setBackupPinCode('');
    setManagementEmail('');
    setLegalPinCode('');
    setActionInProgress(null);
    setActionProgress(0);
    setRandomizedActivities([]);
    setIncidentResponse({
      networkIsolated: false,
      systemIsolated: false,
      evidencePreserved: false,
      managementNotified: false,
      backupVerified: false,
      securityTeamContacted: false,
      legalNotified: false,
      communicationsPrepared: false,
      recoveryPlanInitiated: false,
      wifiDisabled: false,
      bluetoothDisabled: false,
      ethernetDisabled: false,
      keyboardDisconnected: false,
      mouseDisconnected: false,
      monitorDisconnected: false
    });
    setFileSystem([
      { id: '1', name: 'Documents', type: 'folder', encrypted: false, suspicious: false, backedUp: false },
      { id: '2', name: 'report.docx', type: 'document', encrypted: false, suspicious: false, backedUp: false },
      { id: '3', name: 'budget.xlsx', type: 'spreadsheet', encrypted: false, suspicious: false, backedUp: false },
      { id: '4', name: 'vacation.jpg', type: 'image', encrypted: false, suspicious: false, backedUp: false },
      { id: '5', name: 'presentation.pptx', type: 'document', encrypted: false, suspicious: false, backedUp: false },
      { id: '6', name: 'Photos', type: 'folder', encrypted: false, suspicious: false, backedUp: false },
      { id: '7', name: 'family.png', type: 'image', encrypted: false, suspicious: false, backedUp: false },
      { id: '8', name: 'contract.pdf', type: 'document', encrypted: false, suspicious: false, backedUp: false },
      { id: '9', name: 'passwords.txt', type: 'document', encrypted: false, suspicious: false, backedUp: false },
      { id: '10', name: 'backup_2024.zip', type: 'file', encrypted: false, suspicious: false, backedUp: false },
      { id: '11', name: 'financial_data.xlsx', type: 'spreadsheet', encrypted: false, suspicious: false, backedUp: false },
      { id: '12', name: 'client_list.docx', type: 'document', encrypted: false, suspicious: false, backedUp: false },
      { id: '13', name: 'product_images', type: 'folder', encrypted: false, suspicious: false, backedUp: false },
      { id: '14', name: 'marketing_plan.pdf', type: 'document', encrypted: false, suspicious: false, backedUp: false },
      { id: '15', name: 'employee_records', type: 'folder', encrypted: false, suspicious: false, backedUp: false }
    ]);
  };

  const handleFileClick = (file: FileItem) => {
    if (file.name === 'README_RANSOM.txt') {
      setShowRansomNote(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-darker to-cyber-dark cyber-grid p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-cyber-blue" />
            <h1 className="text-4xl font-bold glow-text text-cyber-blue">
              Ransomware Detection & Response Lab
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Practice detecting ransomware behavior and executing proper incident response procedures. 
            Create backups early, detect threats, and respond with realistic cybersecurity protocols.
          </p>
        </div>

        {/* Enhanced Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-card/50 border-cyber-blue/30 backdrop-blur-sm">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-cyber-blue mb-1">{score}</div>
              <div className="text-sm text-gray-400">Score</div>
            </div>
          </Card>
          
          <Card className="bg-card/50 border-cyber-green/30 backdrop-blur-sm">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-cyber-green mb-1">{correctAlerts}</div>
              <div className="text-sm text-gray-400">Correct Alerts</div>
            </div>
          </Card>
          
          <Card className="bg-card/50 border-cyber-amber/30 backdrop-blur-sm">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-cyber-amber mb-1">{alertsTriggered}</div>
              <div className="text-sm text-gray-400">Total Alerts</div>
            </div>
          </Card>
          
          <Card className="bg-card/50 border-cyber-purple/30 backdrop-blur-sm">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-cyber-purple mb-1">
                {alertsTriggered > 0 ? Math.round((correctAlerts / alertsTriggered) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
          </Card>

          <Card className={`bg-card/50 backdrop-blur-sm ${backupCreated ? 'border-cyber-green/50' : 'border-cyber-red/50'}`}>
            <div className="p-4 text-center">
              <div className={`text-2xl font-bold mb-1 ${backupCreated ? 'text-cyber-green' : 'text-cyber-red'}`}>
                {backupCreated ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-400">Backup</div>
            </div>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-cyber-blue/50">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold mb-1 text-cyber-blue">
                ✓
              </div>
              <div className="text-sm text-gray-400">Response Ready</div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* File System Monitor */}
          <Card className="bg-card/50 border-cyber-blue/30 backdrop-blur-sm xl:col-span-1">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Folder className="w-5 h-5 text-cyber-blue" />
                <h2 className="text-xl font-semibold">File System Monitor</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2">
                {fileSystem.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => handleFileClick(file)}
                    className={`
                      p-3 rounded-lg border transition-all duration-300 file-icon cursor-pointer
                      ${file.encrypted 
                        ? 'border-cyber-red bg-cyber-red/10' 
                        : 'border-gray-600 bg-gray-800/50 hover:border-cyber-blue/50'
                      }
                      ${file.name === 'README_RANSOM.txt' ? 'hover:bg-cyber-red/20' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type, file.encrypted, file.backedUp)}
                      <div className="flex-1">
                        <span className={`text-sm block truncate ${file.encrypted ? 'text-cyber-red' : 'text-gray-200'}`}>
                          {file.name}{file.encrypted ? '.locked' : ''}
                        </span>
                        <div className="flex gap-2 mt-1">
                          {file.backedUp && (
                            <Badge variant="outline" className="text-xs h-4 px-1 py-0 bg-cyber-green/20 text-cyber-green border-cyber-green">
                              Backed Up
                            </Badge>
                          )}
                          {file.encrypted && (
                            <Badge variant="destructive" className="text-xs h-4 px-1 py-0">
                              Encrypted
                            </Badge>
                          )}
                        </div>
                      </div>
                      {file.name === 'README_RANSOM.txt' && (
                        <Eye className="w-4 h-4 text-cyber-red ml-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Activity Monitor & Controls */}
          <Card className="bg-card/50 border-cyber-green/30 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-cyber-green" />
                <h2 className="text-xl font-semibold">Activity Monitor</h2>
              </div>
              
              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Simulation Progress</span>
                  <span>{currentStep}/{randomizedActivities.length || '~50'}</span>
                </div>
                <Progress 
                  value={randomizedActivities.length ? (currentStep / randomizedActivities.length) * 100 : 0} 
                  className="h-2 bg-gray-700"
                />
              </div>

              {/* Current Activity - No color coding, always neutral */}
              {currentActivity && (
                <div className="p-4 rounded-lg mb-4 border-l-4 transition-all duration-300 bg-gray-800/50 border-gray-500">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <Badge variant="outline" className="bg-gray-700/50 text-gray-300 border-gray-500">
                      ACTIVITY
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-200">{currentActivity.description}</p>
                  {showHints && currentActivity.requiresAction && (
                    <p className="text-xs text-cyber-amber mt-2">
                      ⏱️ Evaluate this activity carefully. Is this suspicious behavior?
                    </p>
                  )}
                </div>
              )}

              {/* Controls */}
              <div className="space-y-3">
                {/* Backup Controls - Always visible */}
                <div className="space-y-2">
                  {!backupInProgress ? (
                    <Button 
                      onClick={createBackup}
                      disabled={backupCreated}
                      className={`w-full font-semibold ${
                        backupCreated 
                          ? 'bg-cyber-green/50 text-cyber-green cursor-not-allowed' 
                          : 'bg-cyber-green hover:bg-cyber-green/80 text-cyber-dark'
                      }`}
                    >
                      <HardDrive className="w-4 h-4 mr-2" />
                      {backupCreated ? `Backup Complete (+${backupScore} pts)` : 'Create Backup Files (PIN Required)'}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader className="w-4 h-4 animate-spin text-cyber-blue" />
                        <span className="text-sm">Backing up files... {Math.round(backupProgress)}%</span>
                      </div>
                      <Progress value={backupProgress} className="h-2" />
                      {backupCorrupted && (
                        <Button 
                          onClick={stopBackup}
                          className="w-full bg-cyber-red hover:bg-cyber-red/80 text-white animate-pulse"
                        >
                          ⚠️ STOP BACKUP (Corruption Detected)
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Alert Button - Always available */}
                <Button
                  onClick={triggerAlert}
                  disabled={!isRunning || !currentActivity}
                  className={`w-full font-semibold ${
                    (!isRunning || !currentActivity)
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-cyber-red hover:bg-cyber-red/80 text-white'
                  }`}
                  size="lg"
                >
                  {(!isRunning || !currentActivity) ? '⏳ No Activity to Evaluate' : '🚨 TRIGGER ALERT'}
                </Button>

                {!isRunning ? (
                  <div className="space-y-2">
                    <Button 
                      onClick={startSimulation}
                      className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-dark font-semibold"
                    >
                      Start Extended Simulation (~50 activities)
                    </Button>
                    {currentStep > 0 && (
                      <Button 
                        onClick={resetLab}
                        variant="outline"
                        className="w-full border-gray-600 hover:border-cyber-blue/50"
                      >
                        Reset Lab
                      </Button>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Enhanced Instructions */}
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                <h3 className="font-semibold text-cyber-green mb-2">Enhanced Lab Instructions:</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• <strong>Backup early!</strong> Later backups = higher points</li>
                  <li>• PIN: 2024 for backup, watch for corruption warnings</li>
                  <li>• ~50 randomized activities per simulation</li>
                  <li>• <strong>You decide:</strong> Alert when you suspect malicious activity</li>
                  <li>• Use interactive incident response tools</li>
                  <li>• Actions require PINs/emails and take time</li>
                  <li>• Complete all response actions for maximum score</li>
                  <li>• <strong>Alert anytime:</strong> +15 malicious, +10 suspicious, -5 false</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Enhanced Incident Response Panel - Always unlocked */}
          <Card className="bg-card/50 border-cyber-purple/30 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-cyber-purple" />
                <h2 className="text-xl font-semibold">Incident Response</h2>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="mb-4 p-3 bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg">
                  <p className="text-sm text-cyber-blue font-semibold">🛡️ RESPONSE READY</p>
                  <p className="text-xs text-gray-300 mt-1">All incident response tools are available</p>
                </div>

                {/* Network Isolation with Interactive Icons */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-cyber-red mb-3">NETWORK ISOLATION:</h4>
                  
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <Button
                      onClick={() => performActionWithProgress('wifiDisabled', 2000, 8, 'WiFi successfully disabled')}
                      disabled={incidentResponse.wifiDisabled || actionInProgress === 'wifiDisabled'}
                      className={`p-2 h-12 ${
                        incidentResponse.wifiDisabled 
                          ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                          : 'bg-cyber-amber hover:bg-cyber-amber/80 text-cyber-dark'
                      }`}
                      variant={incidentResponse.wifiDisabled ? 'outline' : 'default'}
                    >
                      {incidentResponse.wifiDisabled ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                    </Button>

                    <Button
                      onClick={() => performActionWithProgress('bluetoothDisabled', 1500, 6, 'Bluetooth successfully disabled')}
                      disabled={incidentResponse.bluetoothDisabled || actionInProgress === 'bluetoothDisabled'}
                      className={`p-2 h-12 ${
                        incidentResponse.bluetoothDisabled 
                          ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                          : 'bg-cyber-amber hover:bg-cyber-amber/80 text-cyber-dark'
                      }`}
                      variant={incidentResponse.bluetoothDisabled ? 'outline' : 'default'}
                    >
                      {incidentResponse.bluetoothDisabled ? <BluetoothOff className="w-4 h-4" /> : <Bluetooth className="w-4 h-4" />}
                    </Button>

                    <Button
                      onClick={() => performActionWithProgress('ethernetDisabled', 1800, 10, 'Ethernet cable disconnected')}
                      disabled={incidentResponse.ethernetDisabled || actionInProgress === 'ethernetDisabled'}
                      className={`p-2 h-12 ${
                        incidentResponse.ethernetDisabled 
                          ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                          : 'bg-cyber-amber hover:bg-cyber-amber/80 text-cyber-dark'
                      }`}
                      variant={incidentResponse.ethernetDisabled ? 'outline' : 'default'}
                    >
                      {incidentResponse.ethernetDisabled ? (
                        <div className="relative">
                          <Router className="w-4 h-4" />
                          <Slash className="w-3 h-3 absolute -top-1 -right-1 text-cyber-red" />
                        </div>
                      ) : (
                        <Cable className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <Button
                    onClick={() => performActionWithProgress('networkIsolated', 3000, 15, 'Complete network isolation achieved')}
                    disabled={incidentResponse.networkIsolated || actionInProgress === 'networkIsolated'}
                    className={`w-full mb-2 ${
                      incidentResponse.networkIsolated 
                        ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                        : 'bg-cyber-red hover:bg-cyber-red/80 text-white'
                    }`}
                    variant={incidentResponse.networkIsolated ? 'outline' : 'default'}
                  >
                    {incidentResponse.networkIsolated ? '✓ Network Fully Isolated' : 'Complete Network Isolation'}
                  </Button>
                </div>

                {/* System Isolation with Interactive Icons */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-cyber-red mb-3">SYSTEM ISOLATION:</h4>
                  
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <Button
                      onClick={() => performActionWithProgress('keyboardDisconnected', 1000, 5, 'Keyboard disconnected')}
                      disabled={incidentResponse.keyboardDisconnected || actionInProgress === 'keyboardDisconnected'}
                      className={`p-2 h-12 ${
                        incidentResponse.keyboardDisconnected 
                          ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                          : 'bg-cyber-amber hover:bg-cyber-amber/80 text-cyber-dark'
                      }`}
                      variant={incidentResponse.keyboardDisconnected ? 'outline' : 'default'}
                    >
                      {incidentResponse.keyboardDisconnected ? <Unplug className="w-4 h-4" /> : <Keyboard className="w-4 h-4" />}
                    </Button>

                    <Button
                      onClick={() => performActionWithProgress('mouseDisconnected', 1000, 5, 'Mouse disconnected')}
                      disabled={incidentResponse.mouseDisconnected || actionInProgress === 'mouseDisconnected'}
                      className={`p-2 h-12 ${
                        incidentResponse.mouseDisconnected 
                          ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                          : 'bg-cyber-amber hover:bg-cyber-amber/80 text-cyber-dark'
                      }`}
                      variant={incidentResponse.mouseDisconnected ? 'outline' : 'default'}
                    >
                      {incidentResponse.mouseDisconnected ? <Unplug className="w-4 h-4" /> : <Mouse className="w-4 h-4" />}
                    </Button>

                    <Button
                      onClick={() => performActionWithProgress('monitorDisconnected', 1200, 6, 'Monitor disconnected')}
                      disabled={incidentResponse.monitorDisconnected || actionInProgress === 'monitorDisconnected'}
                      className={`p-2 h-12 ${
                        incidentResponse.monitorDisconnected 
                          ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                          : 'bg-cyber-amber hover:bg-cyber-amber/80 text-cyber-dark'
                      }`}
                      variant={incidentResponse.monitorDisconnected ? 'outline' : 'default'}
                    >
                      {incidentResponse.monitorDisconnected ? <MonitorOff className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                    </Button>
                  </div>

                  <Button
                    onClick={() => performActionWithProgress('systemIsolated', 2500, 15, 'System fully quarantined')}
                    disabled={incidentResponse.systemIsolated || actionInProgress === 'systemIsolated'}
                    className={`w-full ${
                      incidentResponse.systemIsolated 
                        ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                        : 'bg-cyber-red hover:bg-cyber-red/80 text-white'
                    }`}
                    variant={incidentResponse.systemIsolated ? 'outline' : 'default'}
                  >
                    {incidentResponse.systemIsolated ? '✓ System Quarantined' : 'Complete System Quarantine'}
                  </Button>
                </div>

                {/* Other Response Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={() => performActionWithProgress('evidencePreserved', 4000, 12, 'Digital evidence preserved successfully')}
                    disabled={incidentResponse.evidencePreserved || actionInProgress === 'evidencePreserved'}
                    className={`w-full justify-start ${
                      incidentResponse.evidencePreserved 
                        ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                        : 'bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-dark'
                    }`}
                    variant={incidentResponse.evidencePreserved ? 'outline' : 'default'}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {incidentResponse.evidencePreserved ? '✓ Evidence Preserved' : 'Preserve Digital Evidence'}
                  </Button>

                  <Button
                    onClick={handleManagementNotification}
                    disabled={incidentResponse.managementNotified}
                    className={`w-full justify-start ${
                      incidentResponse.managementNotified 
                        ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                        : 'bg-cyber-purple hover:bg-cyber-purple/80 text-cyber-dark'
                    }`}
                    variant={incidentResponse.managementNotified ? 'outline' : 'default'}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {incidentResponse.managementNotified ? '✓ Management Notified' : 'Notify Management (Email Required)'}
                  </Button>

                  <Button
                    onClick={handleLegalNotification}
                    disabled={incidentResponse.legalNotified}
                    className={`w-full justify-start ${
                      incidentResponse.legalNotified 
                        ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                        : 'bg-cyber-purple hover:bg-cyber-purple/80 text-cyber-dark'
                    }`}
                    variant={incidentResponse.legalNotified ? 'outline' : 'default'}
                  >
                    <ClipboardCheck className="w-4 h-4 mr-2" />
                    {incidentResponse.legalNotified ? '✓ Legal Team Notified' : 'Notify Legal Team (PIN Required)'}
                  </Button>

                  <Button
                    onClick={() => performActionWithProgress('securityTeamContacted', 2000, 10, 'Security team mobilized for incident response')}
                    disabled={incidentResponse.securityTeamContacted || actionInProgress === 'securityTeamContacted'}
                    className={`w-full justify-start ${
                      incidentResponse.securityTeamContacted 
                        ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                        : 'bg-cyber-purple hover:bg-cyber-purple/80 text-cyber-dark'
                    }`}
                    variant={incidentResponse.securityTeamContacted ? 'outline' : 'default'}
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    {incidentResponse.securityTeamContacted ? '✓ Security Team Contacted' : 'Contact Security Team'}
                  </Button>

                  <Button
                    onClick={() => performActionWithProgress('communicationsPrepared', 3000, 8, 'Communications templates prepared for stakeholders')}
                    disabled={incidentResponse.communicationsPrepared || actionInProgress === 'communicationsPrepared'}
                    className={`w-full justify-start ${
                      incidentResponse.communicationsPrepared 
                        ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                        : 'bg-cyber-purple hover:bg-cyber-purple/80 text-cyber-dark'
                    }`}
                    variant={incidentResponse.communicationsPrepared ? 'outline' : 'default'}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {incidentResponse.communicationsPrepared ? '✓ Communications Prepared' : 'Prepare Communications'}
                  </Button>

                  <Button
                    onClick={() => performActionWithProgress('backupVerified', 3500, 10, 'Backup integrity verified successfully')}
                    disabled={incidentResponse.backupVerified || actionInProgress === 'backupVerified'}
                    className={`w-full justify-start ${
                      incidentResponse.backupVerified 
                        ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                        : 'bg-cyber-green hover:bg-cyber-green/80 text-cyber-dark'
                    }`}
                    variant={incidentResponse.backupVerified ? 'outline' : 'default'}
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    {incidentResponse.backupVerified ? '✓ Backups Verified' : 'Verify Backup Integrity'}
                  </Button>

                  <Button
                    onClick={() => performActionWithProgress('recoveryPlanInitiated', 4000, 18, 'Business continuity and recovery plan activated')}
                    disabled={incidentResponse.recoveryPlanInitiated || actionInProgress === 'recoveryPlanInitiated'}
                    className={`w-full justify-start ${
                      incidentResponse.recoveryPlanInitiated 
                        ? 'bg-cyber-green/20 text-cyber-green border-cyber-green' 
                        : 'bg-cyber-green hover:bg-cyber-green/80 text-cyber-dark'
                    }`}
                    variant={incidentResponse.recoveryPlanInitiated ? 'outline' : 'default'}
                  >
                    <Server className="w-4 h-4 mr-2" />
                    {incidentResponse.recoveryPlanInitiated ? '✓ Recovery Plan Initiated' : 'Initiate Recovery Plan'}
                  </Button>
                </div>

                {/* Action Progress Indicator */}
                {actionInProgress && (
                  <div className="mt-4 p-3 bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Loader className="w-4 h-4 animate-spin text-cyber-blue" />
                      <span className="text-sm text-cyber-blue">Action in progress...</span>
                    </div>
                    <Progress value={actionProgress} className="h-2" />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Setup Dialog */}
        <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
          <DialogContent className="bg-cyber-dark border-cyber-blue max-w-md">
            <DialogHeader>
              <DialogTitle className="text-cyber-blue flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Simulation Setup
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Configure your simulation preferences before starting.
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-hints" 
                  checked={showHints}
                  onCheckedChange={(checked) => setShowHints(checked as boolean)}
                />
                <label htmlFor="show-hints" className="text-sm text-gray-300">
                  Show evaluation hints ("Is this suspicious?")
                </label>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={confirmStartSimulation}
                  className="flex-1 bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-dark"
                >
                  Start Simulation
                </Button>
                <Button 
                  onClick={() => setShowSetupDialog(false)}
                  variant="outline"
                  className="border-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Backup PIN Dialog */}
        <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
          <DialogContent className="bg-cyber-dark border-cyber-green max-w-md">
            <DialogHeader>
              <DialogTitle className="text-cyber-green flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Secure Backup Creation
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Enter the backup PIN code to proceed with secure file backup creation.
                <br />
                <strong>Tip:</strong> Earlier backups earn higher points (50→10 based on timing)!
              </p>
              <Input
                type="password"
                placeholder="Enter PIN (hint: current year)"
                value={backupPinCode}
                onChange={(e) => setBackupPinCode(e.target.value)}
                className="bg-gray-800 border-gray-600"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={startBackupProcess}
                  className="flex-1 bg-cyber-green hover:bg-cyber-green/80 text-cyber-dark"
                >
                  Start Backup
                </Button>
                <Button 
                  onClick={() => setShowBackupDialog(false)}
                  variant="outline"
                  className="border-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Management Email Dialog */}
        <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
          <DialogContent className="bg-cyber-dark border-cyber-purple max-w-md">
            <DialogHeader>
              <DialogTitle className="text-cyber-purple flex items-center gap-2">
                <Users className="w-5 h-5" />
                Notify Management
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Enter the email address of management to send the incident notification.
              </p>
              <Input
                type="email"
                placeholder="ceo@company.com"
                value={managementEmail}
                onChange={(e) => setManagementEmail(e.target.value)}
                className="bg-gray-800 border-gray-600"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={sendManagementEmail}
                  className="flex-1 bg-cyber-purple hover:bg-cyber-purple/80 text-cyber-dark"
                >
                  Send Notification
                </Button>
                <Button 
                  onClick={() => setShowEmailDialog(false)}
                  variant="outline"
                  className="border-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Legal PIN Dialog */}
        <Dialog open={showLegalDialog} onOpenChange={setShowLegalDialog}>
          <DialogContent className="bg-cyber-dark border-cyber-purple max-w-md">
            <DialogHeader>
              <DialogTitle className="text-cyber-purple flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" />
                Legal Department Authorization
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Enter the legal department PIN to notify them of the security incident.
                <br />
                <strong>Hint:</strong> Last 4 digits after 456...
              </p>
              <Input
                type="password"
                placeholder="Enter Legal PIN"
                value={legalPinCode}
                onChange={(e) => setLegalPinCode(e.target.value)}
                className="bg-gray-800 border-gray-600"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={sendLegalNotification}
                  className="flex-1 bg-cyber-purple hover:bg-cyber-purple/80 text-cyber-dark"
                >
                  Notify Legal
                </Button>
                <Button 
                  onClick={() => setShowLegalDialog(false)}
                  variant="outline"
                  className="border-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Ransom Note Dialog */}
        <Dialog open={showRansomNote} onOpenChange={setShowRansomNote}>
          <DialogContent className="bg-cyber-dark border-cyber-red max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-cyber-red flex items-center gap-2">
                <Lock className="w-5 h-5" />
                README_RANSOM.txt
              </DialogTitle>
            </DialogHeader>
            <div className="bg-black/50 p-4 rounded-lg border border-cyber-red/30">
              <pre className="text-cyber-red text-sm whitespace-pre-wrap font-mono">
                {ransomNoteContent}
              </pre>
            </div>
            <div className="text-sm text-gray-400 mt-4 p-3 bg-cyber-amber/10 border border-cyber-amber/30 rounded-lg">
              <strong className="text-cyber-amber">⚠️ Educational Note:</strong> This is a simulated ransom note for training purposes. 
              Real ransomware notes often contain similar threats and payment demands. Never pay ransomware demands in real scenarios.
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RansomwareLab;
