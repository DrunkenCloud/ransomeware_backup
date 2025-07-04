import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { generateSystemLogs, LogEntry } from '@/utils/logGenerator';
import { Shield, AlertTriangle, Clock, Filter, RotateCcw, Eye, Target, Play } from 'lucide-react';

const RansomwareSimulation = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLogs, setSelectedLogs] = useState<Set<number>>(new Set());
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [showColoring, setShowColoring] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [missedLogs, setMissedLogs] = useState<number[]>([]);
  const [incorrectLogs, setIncorrectLogs] = useState<number[]>([]);

  useEffect(() => {
    const generatedLogs = generateSystemLogs();
    setLogs(generatedLogs);
    setFilteredLogs(generatedLogs);
  }, []);

  useEffect(() => {
    const filtered = logs.filter(log => 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.process.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
  }, [searchTerm, logs]);

  const startGame = () => {
    setGameStarted(true);
    setSelectedLogs(new Set());
    setScore(0);
    setFeedback('');
    setShowResults(false);
    setShowColoring(false);
    setMissedLogs([]);
    setIncorrectLogs([]);
  };

  const startNextGame = () => {
    const generatedLogs = generateSystemLogs();
    setLogs(generatedLogs);
    setFilteredLogs(generatedLogs);
    setSelectedLogs(new Set());
    setScore(0);
    setFeedback('');
    setShowResults(false);
    setShowColoring(false);
    setMissedLogs([]);
    setIncorrectLogs([]);
  };

  const resetSession = () => {
    const generatedLogs = generateSystemLogs();
    setLogs(generatedLogs);
    setFilteredLogs(generatedLogs);
    setSelectedLogs(new Set());
    setScore(0);
    setFeedback('');
    setShowResults(false);
    setGameStarted(false);
    setShowColoring(false);
    setMissedLogs([]);
    setIncorrectLogs([]);
    setSessionScore(0);
    setGamesPlayed(0);
  };

  const toggleLogSelection = (index: number) => {
    const newSelected = new Set(selectedLogs);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedLogs(newSelected);
  };

  const analyzeSelection = (isSafe: boolean) => {
    const maliciousLogs = logs.filter((log, index) => log.isMalicious ? index : null).map((log, originalIndex) => logs.findIndex(l => l === log)).filter(index => index !== -1);
    const selectedMalicious = Array.from(selectedLogs).filter(index => logs[index].isMalicious);
    const selectedBenign = Array.from(selectedLogs).filter(index => !logs[index].isMalicious);
    
    // Find missed malicious logs
    const missed = maliciousLogs.filter(index => !selectedLogs.has(index));
    setMissedLogs(missed);
    
    // Find incorrectly selected benign logs
    setIncorrectLogs(selectedBenign);

    let calculatedScore = 0;
    let feedbackMessage = '';

    // Determine if system is actually safe or compromised
    const systemIsActuallySafe = maliciousLogs.length === 0;

    if (isSafe) {
      // User classified as safe
      if (systemIsActuallySafe) {
        // Correct classification - system is safe
        if (selectedLogs.size === 0) {
          calculatedScore = 85;
          feedbackMessage = 'Correct! No malicious activity detected. However, you should have identified some suspicious patterns to get full marks.';
        } else {
          calculatedScore = Math.max(50, 85 - (selectedLogs.size * 3));
          feedbackMessage = `Correct classification but you marked ${selectedLogs.size} logs as suspicious. Focus on distinguishing between suspicious but benign activities.`;
        }
      } else {
        // Incorrect classification - system is compromised but user said safe
        calculatedScore = Math.max(0, 20 - (maliciousLogs.length * 2));
        feedbackMessage = `Incorrect! This system was compromised with ${maliciousLogs.length} malicious activities. You missed critical ransomware indicators.`;
      }
    } else {
      // User classified as compromised
      if (!systemIsActuallySafe) {
        // Correct classification - system is compromised
        const detectionRate = maliciousLogs.length > 0 ? selectedMalicious.length / maliciousLogs.length : 0;
        const totalBenignLogs = logs.length - maliciousLogs.length;
        const falsePositiveRate = totalBenignLogs > 0 ? selectedBenign.length / totalBenignLogs : 0;
        
        calculatedScore = Math.round((detectionRate * 70) + ((1 - falsePositiveRate) * 30));
        
        if (detectionRate > 0.8 && falsePositiveRate < 0.1) {
          feedbackMessage = `Excellent work! You detected ${selectedMalicious.length}/${maliciousLogs.length} malicious activities with minimal false positives.`;
        } else if (detectionRate > 0.5) {
          feedbackMessage = `Good detection! You found ${selectedMalicious.length}/${maliciousLogs.length} malicious activities, but had ${selectedBenign.length} false positives.`;
        } else {
          feedbackMessage = `Needs improvement. You only detected ${selectedMalicious.length}/${maliciousLogs.length} malicious activities. Look for file encryption patterns, suspicious executables, and network anomalies.`;
        }
      } else {
        // Incorrect classification - system is safe but user said compromised
        calculatedScore = Math.max(0, 30 - (selectedLogs.size * 2));
        feedbackMessage = `Incorrect! This system was safe. You marked ${selectedLogs.size} benign activities as malicious. Practice distinguishing between suspicious but normal activities and actual threats.`;
      }
    }

    // Ensure score is never NaN
    if (isNaN(calculatedScore)) {
      calculatedScore = 0;
    }

    setScore(calculatedScore);
    setFeedback(feedbackMessage);
    setShowResults(true);
    setShowColoring(true);
    
    // Update session score
    const newSessionScore = sessionScore + calculatedScore;
    const newGamesPlayed = gamesPlayed + 1;
    setSessionScore(newSessionScore);
    setGamesPlayed(newGamesPlayed);
  };

  const getLogTypeColor = (log: LogEntry, index: number) => {
    if (!showColoring) {
      if (log.type === 'FILE_ACCESS') return 'bg-blue-50 border-blue-200';
      if (log.type === 'NETWORK') return 'bg-green-50 border-green-200';
      if (log.type === 'PROCESS') return 'bg-yellow-50 border-yellow-200';
      return 'bg-gray-50 border-gray-200';
    }
    
    // Show coloring after analysis
    if (log.isMalicious) return 'bg-red-100 border-red-300';
    if (missedLogs.includes(index)) return 'bg-orange-100 border-orange-300';
    if (incorrectLogs.includes(index)) return 'bg-purple-100 border-purple-300';
    if (log.type === 'FILE_ACCESS') return 'bg-blue-50 border-blue-200';
    if (log.type === 'NETWORK') return 'bg-green-50 border-green-200';
    if (log.type === 'PROCESS') return 'bg-yellow-50 border-yellow-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getLogBadges = (log: LogEntry, index: number) => {
    const badges = [];
    if (showColoring && log.isMalicious) {
      badges.push(<Badge key="malicious" className="bg-red-600 text-white">Malicious</Badge>);
    }
    if (showColoring && missedLogs.includes(index)) {
      badges.push(<Badge key="missed" className="bg-orange-600 text-white">Missed</Badge>);
    }
    if (showColoring && incorrectLogs.includes(index)) {
      badges.push(<Badge key="incorrect" className="bg-purple-600 text-white">False Positive</Badge>);
    }
    return badges;
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <Shield className="w-16 h-16 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                Ransomware Incident Forensics Simulation
              </CardTitle>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Analyze system logs to reconstruct a potential ransomware attack timeline. 
                Identify malicious activities among normal system operations.
              </p>
              {gamesPlayed > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-800">
                    Session Score: {sessionScore}/{gamesPlayed * 100}
                  </div>
                  <div className="text-sm text-blue-600">
                    Games Played: {gamesPlayed} | Average: {Math.round(sessionScore / gamesPlayed)}
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Clock className="w-5 h-5" />
                      Your Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Review 100+ system log entries</li>
                      <li>• Identify suspicious file operations</li>
                      <li>• Detect malicious process executions</li>
                      <li>• Reconstruct the attack timeline</li>
                      <li>• Classify the incident as safe or compromised</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-700">
                      <AlertTriangle className="w-5 h-5" />
                      What to Look For
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Files being renamed with encryption extensions</li>
                      <li>• Suspicious executable files running</li>
                      <li>• Mass file modification patterns</li>
                      <li>• Ransom notes being created</li>
                      <li>• Unusual network connections</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <div className="text-center">
                <Button 
                  onClick={startGame}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  Start Forensic Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Forensic Analysis Console
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-white text-sm">
              <div className="font-semibold">Session: {sessionScore}/{gamesPlayed * 100}</div>
              <div className="text-xs opacity-75">Games: {gamesPlayed}</div>
            </div>
            <Button onClick={resetSession} variant="outline" className="bg-white/10 text-white border-white/20">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Session
            </Button>
          </div>
        </div>

        {showResults && (
          <Alert className="mb-6 bg-white/95 backdrop-blur-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex justify-between items-center">
                <div>
                  <strong>Analysis Complete - Score: {score}/100</strong>
                  <p className="mt-1">{feedback}</p>
                  {(missedLogs.length > 0 || incorrectLogs.length > 0) && (
                    <p className="mt-2 text-sm text-gray-600">
                      Missed {missedLogs.length} malicious logs, {incorrectLogs.length} false positives. 
                      Coloring is now enabled to show all categories.
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant={score >= 70 ? "default" : "destructive"} className="ml-4">
                    {score >= 70 ? "PASS" : "NEEDS REVIEW"}
                  </Badge>
                  <Button
                    onClick={startNextGame}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Next Game
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    System Logs ({filteredLogs.length} entries)
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    {showResults && (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={showColoring}
                          onCheckedChange={setShowColoring}
                          id="coloring-mode"
                        />
                        <label htmlFor="coloring-mode" className="text-sm">
                          <Eye className="w-4 h-4 inline mr-1" />
                          Show Analysis
                        </label>
                      </div>
                    )}
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Filter className="w-5 h-5 text-gray-400 mt-2" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {filteredLogs.map((log, displayIndex) => {
                      const originalIndex = logs.indexOf(log);
                      return (
                        <div
                          key={`${log.timestamp}-${originalIndex}`}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            getLogTypeColor(log, originalIndex)
                          } ${
                            selectedLogs.has(originalIndex) 
                              ? 'ring-2 ring-blue-500 bg-blue-100' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => toggleLogSelection(originalIndex)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-gray-500">
                                  {log.timestamp}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {log.type}
                                </Badge>
                                <span className="text-xs text-blue-600">{log.user}</span>
                              </div>
                              <p className="text-sm text-gray-800">{log.message}</p>
                              <p className="text-xs text-gray-500 font-mono">{log.process}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {selectedLogs.has(originalIndex) && (
                                <Badge className="bg-blue-600">Selected</Badge>
                              )}
                              {getLogBadges(log, originalIndex)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedLogs.size}</div>
                  <div className="text-sm text-gray-600">Logs Selected</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Logs:</span>
                    <span className="font-mono">{logs.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Filtered:</span>
                    <span className="font-mono">{filteredLogs.length}</span>
                  </div>
                  {showResults && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Missed:</span>
                        <span className="font-mono text-orange-600">{missedLogs.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>False Positives:</span>
                        <span className="font-mono text-purple-600">{incorrectLogs.length}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Make Your Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Based on your analysis, classify this incident:
                </p>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => analyzeSelection(true)}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={showResults}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    System is Safe
                  </Button>
                  
                  <Button
                    onClick={() => analyzeSelection(false)}
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={showResults}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    System Compromised
                  </Button>
                </div>

                {showResults && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Actual Malicious Logs:</div>
                    <div className="text-xs text-gray-600">
                      {logs.filter(log => log.isMalicious).length} out of {logs.length} logs were malicious
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RansomwareSimulation;
