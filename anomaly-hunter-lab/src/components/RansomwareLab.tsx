import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Eye
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
  const [showRansomNote, setShowRansomNote] = useState(false);
  
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
    { id: '10', name: 'backup_2024.zip', type: 'file', encrypted: false, suspicious: false, backedUp: false }
  ]);

  const activities: Activity[] = [
    {
      id: 'normal1',
      description: 'User opens document: report.docx',
      type: 'normal',
      delay: 2500
    },
    {
      id: 'normal2', 
      description: 'User saves changes to report.docx',
      type: 'normal',
      delay: 2000
    },
    {
      id: 'normal3',
      description: 'User opens image: vacation.jpg',
      type: 'normal', 
      delay: 2200
    },
    {
      id: 'normal4',
      description: 'User creates new folder: Work_Projects',
      type: 'normal',
      delay: 1800
    },
    {
      id: 'suspicious1',
      description: 'Unknown process scanning file directory structure',
      type: 'suspicious',
      delay: 1000
    },
    {
      id: 'suspicious2',
      description: 'Multiple files being accessed rapidly in sequence',
      type: 'suspicious',
      delay: 800
    },
    {
      id: 'suspicious3',
      description: 'Unusual network activity detected - connecting to unknown IP',
      type: 'suspicious',
      delay: 1200
    },
    {
      id: 'malicious1',
      description: 'Mass file encryption process initiated',
      type: 'malicious',
      fileChanges: ['2', '3', '4', '5', '9'],
      delay: 1500
    },
    {
      id: 'malicious2',
      description: 'Original files being deleted after encryption',
      type: 'malicious',
      delay: 1000
    },
    {
      id: 'malicious3',
      description: 'Suspicious file created: README_RANSOM.txt',
      type: 'malicious',
      delay: 1200
    },
    {
      id: 'malicious4',
      description: 'Attempting to disable Windows Defender',
      type: 'malicious',
      delay: 1500
    },
    {
      id: 'malicious5',
      description: 'Trying to delete system restore points',
      type: 'malicious',
      delay: 1300
    },
    {
      id: 'malicious6',
      description: 'Encrypting remaining image files',
      type: 'malicious',
      fileChanges: ['7'],
      delay: 1100
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

  const createBackup = () => {
    setFileSystem(prev => prev.map(file => ({ 
      ...file, 
      backedUp: true 
    })));
    setBackupCreated(true);
    setScore(prev => prev + 15);
    toast({
      title: "Backup Created!",
      description: "All files have been backed up. This will help you recover if ransomware strikes!",
      className: "bg-cyber-green text-cyber-dark"
    });
  };

  const startSimulation = () => {
    if (!backupCreated) {
      toast({
        title: "Create Backup First!",
        description: "You must create a backup before starting the simulation. This is a critical security step!",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    setCurrentStep(0);
    setScore(prev => prev); // Keep backup bonus
    setAlertsTriggered(0);
    setCorrectAlerts(0);
    setShowFeedback(false);
    
    // Reset file system but keep backup status
    setFileSystem(prev => prev.map(file => ({ 
      ...file, 
      encrypted: false, 
      suspicious: false 
    })));
    
    runActivity(0);
  };

  const runActivity = (stepIndex: number) => {
    if (stepIndex >= activities.length) {
      setIsRunning(false);
      showFinalResults();
      return;
    }

    const activity = activities[stepIndex];
    setCurrentActivity(activity);
    
    setTimeout(() => {
      // Apply file changes if any
      if (activity.fileChanges) {
        setFileSystem(prev => prev.map(file => 
          activity.fileChanges!.includes(file.id) 
            ? { ...file, encrypted: true, suspicious: true }
            : file
        ));
      }
      
      if (activity.id === 'normal4') {
        setFileSystem(prev => [...prev, {
          id: 'work_folder',
          name: 'Work_Projects',
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
      
      setCurrentStep(stepIndex + 1);
      
      // Auto-proceed to next activity after a delay
      setTimeout(() => {
        runActivity(stepIndex + 1);
      }, activity.delay);
    }, 500);
  };

  const triggerAlert = () => {
    if (!isRunning || !currentActivity) return;
    
    setAlertsTriggered(prev => prev + 1);
    const isCorrect = currentActivity.type === 'suspicious' || currentActivity.type === 'malicious';
    
    if (isCorrect) {
      setCorrectAlerts(prev => prev + 1);
      setScore(prev => prev + 10);
      toast({
        title: "Correct Alert!",
        description: `Good catch! ${currentActivity.type === 'malicious' ? 'This is clearly malicious behavior.' : 'This activity is suspicious and worth monitoring.'}`,
        className: "bg-cyber-green text-cyber-dark"
      });
    } else {
      setScore(prev => Math.max(0, prev - 5));
      toast({
        title: "False Alert",
        description: "This was normal user activity. Try to focus on unusual patterns.",
        variant: "destructive"
      });
    }
    
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  const showFinalResults = () => {
    const accuracy = alertsTriggered > 0 ? Math.round((correctAlerts / alertsTriggered) * 100) : 0;
    const backupBonus = backupCreated ? "Backup created (+15 pts)" : "No backup created";
    toast({
      title: "Simulation Complete!",
      description: `Final Score: ${score} | Accuracy: ${accuracy}% | Threats detected: ${correctAlerts} | ${backupBonus}`,
      className: "bg-cyber-blue text-cyber-dark"
    });
  };

  const resetLab = () => {
    setCurrentStep(0);
    setScore(0);
    setAlertsTriggered(0);
    setCorrectAlerts(0);
    setIsRunning(false);
    setShowFeedback(false);
    setCurrentActivity(null);
    setBackupCreated(false);
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
      { id: '10', name: 'backup_2024.zip', type: 'file', encrypted: false, suspicious: false, backedUp: false }
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
              Ransomware Detection Lab
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Train your eye to spot anomalous behavior that indicates ransomware activity. 
            Create backups first, then watch the file system and trigger alerts when you detect suspicious activity.
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File System Monitor */}
          <Card className="bg-card/50 border-cyber-blue/30 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Folder className="w-5 h-5 text-cyber-blue" />
                <h2 className="text-xl font-semibold">File System Monitor</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {fileSystem.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => handleFileClick(file)}
                    className={`
                      p-3 rounded-lg border transition-all duration-300 file-icon cursor-pointer
                      ${file.suspicious 
                        ? 'border-cyber-red bg-cyber-red/10 animate-threat-pulse' 
                        : 'border-gray-600 bg-gray-800/50 hover:border-cyber-blue/50'
                      }
                      ${file.encrypted ? 'encrypted-file' : ''}
                      ${file.name === 'README_RANSOM.txt' ? 'hover:bg-cyber-red/20' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.type, file.encrypted, file.backedUp)}
                      <span className={`text-sm truncate ${file.encrypted ? 'text-cyber-red' : 'text-gray-200'}`}>
                        {file.name}{file.encrypted ? '.locked' : ''}
                      </span>
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
                  <span>{currentStep}/{activities.length}</span>
                </div>
                <Progress 
                  value={(currentStep / activities.length) * 100} 
                  className="h-2 bg-gray-700"
                />
              </div>

              {/* Current Activity */}
              {currentActivity && (
                <div className={`
                  p-4 rounded-lg mb-4 border-l-4 transition-all duration-300
                  ${currentActivity.type === 'malicious' 
                    ? 'bg-cyber-red/10 border-cyber-red' 
                    : currentActivity.type === 'suspicious'
                    ? 'bg-cyber-amber/10 border-cyber-amber'
                    : 'bg-cyber-blue/10 border-cyber-blue'
                  }
                `}>
                  <div className="flex items-center gap-2 mb-2">
                    {currentActivity.type === 'malicious' ? (
                      <XCircle className="w-4 h-4 text-cyber-red" />
                    ) : currentActivity.type === 'suspicious' ? (
                      <AlertTriangle className="w-4 h-4 text-cyber-amber" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-cyber-blue" />
                    )}
                    <Badge variant={
                      currentActivity.type === 'malicious' ? 'destructive' :
                      currentActivity.type === 'suspicious' ? 'secondary' : 'default'
                    }>
                      {currentActivity.type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-200">{currentActivity.description}</p>
                </div>
              )}

              {/* Controls */}
              <div className="space-y-3">
                {!isRunning ? (
                  <div className="space-y-2">
                    {!backupCreated && (
                      <Button 
                        onClick={createBackup}
                        className="w-full bg-cyber-green hover:bg-cyber-green/80 text-cyber-dark font-semibold"
                      >
                        <HardDrive className="w-4 h-4 mr-2" />
                        Create Backup Files
                      </Button>
                    )}
                    <Button 
                      onClick={startSimulation}
                      disabled={!backupCreated}
                      className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-dark font-semibold disabled:opacity-50"
                    >
                      Start Simulation
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
                ) : (
                  <Button
                    onClick={triggerAlert}
                    className="w-full bg-cyber-red hover:bg-cyber-red/80 text-white font-semibold animate-pulse-glow"
                    size="lg"
                  >
                    🚨 TRIGGER ALERT
                  </Button>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                <h3 className="font-semibold text-cyber-green mb-2">Instructions:</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Create backups before starting (critical security step)</li>
                  <li>• Watch for unusual file system activity</li>
                  <li>• Click "TRIGGER ALERT" when you spot suspicious behavior</li>
                  <li>• Mass encryption and ransom notes are key indicators</li>
                  <li>• Click on README_RANSOM.txt to view the ransom note</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

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
