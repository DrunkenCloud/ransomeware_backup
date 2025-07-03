"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Bug, ShieldCheck } from 'lucide-react';
import type { Edge, PlayerRole, ActionType, GameState } from '@/lib/types';
import NetworkGraph from '@/components/game/NetworkGraph';
import PlayerActions from '@/components/game/PlayerActions';
import RoleSelector from '@/components/game/RoleSelector';
import { useToast } from '@/hooks/use-toast';
import GameOverDialog from './GameOverDialog';
import { getGameStateAction, performPlayerAction, resetGameAction } from '@/app/game/actions';

const initialEdges: Edge[] = [
  { from: '1', to: '2' },
  { from: '1', to: '3' },
  { from: '2', to: '4' },
  { from: '3', to: '4' },
  { from: '4', to: '5' },
  { from: '4', to: '6' },
];

export default function GameBoard({ roomCode }: { roomCode: string }) {
  const [playerRole, setPlayerRole] = useState<PlayerRole>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const processedEventIds = useRef(new Set<string>());
  
  const { toast } = useToast();

  const handleAction = useCallback((action: ActionType) => {
    if (!gameState) return;
    const now = Date.now();
    const cooldownEnd = gameState.cooldowns[action];
    if (cooldownEnd && now < cooldownEnd) {
        const remaining = Math.ceil((cooldownEnd - now) / 1000);
        toast({ title: "Action on Cooldown", description: `Please wait ${remaining}s.`, variant: "destructive" });
        return;
    }
    setActiveAction(action);
    toast({ title: "Action Selected", description: `Click on a target node to ${action.replace('_', ' ')}.`, variant: "default" });
  }, [gameState, toast]);

  const handleNodeClick = useCallback(async (nodeId: string) => {
    if (!activeAction || !playerRole || isPerformingAction) {
      if (!activeAction) {
        toast({ title: "No Action Selected", description: "Please select an action first.", variant: "destructive" });
      }
      return;
    }
    
    setIsPerformingAction(true);
    try {
        const newState = await performPlayerAction(roomCode, playerRole, activeAction, nodeId);
        setGameState(newState);
    } catch (error) {
        console.error("Error performing action:", error);
        toast({ title: "Error", description: "Could not perform action.", variant: "destructive" });
    } finally {
        setActiveAction(null);
        setIsPerformingAction(false);
    }
  }, [activeAction, playerRole, roomCode, toast, isPerformingAction]);

  const resetGame = useCallback(async () => {
    processedEventIds.current.clear();
    const newState = await resetGameAction(roomCode);
    setGameState(newState);
    setPlayerRole(null);
  }, [roomCode]);

  useEffect(() => {
    if (!playerRole) return;

    const interval = setInterval(async () => {
      if (document.hidden) return;
      const newState = await getGameStateAction(roomCode);
      setGameState(newState);
    }, 2000);

    getGameStateAction(roomCode).then(setGameState);

    return () => clearInterval(interval);
  }, [roomCode, playerRole]);
  
  useEffect(() => {
    if (!gameState?.events) return;

    gameState.events.forEach(event => {
      if (!processedEventIds.current.has(event.id)) {
        toast({
          title: event.message,
          description: event.description,
          variant: event.variant,
        });
        processedEventIds.current.add(event.id);
      }
    });
  }, [gameState?.events, toast]);


  if (!playerRole) {
    return <RoleSelector onSelectRole={setPlayerRole} />;
  }

  if (!gameState) {
    return <div className="flex min-h-screen items-center justify-center"><p>Loading Game...</p></div>;
  }
  
  const { nodes, attackerScore, defenderScore, winner, cooldowns } = gameState;

  return (
    <div className="flex flex-col min-h-screen p-4 gap-4">
      <GameOverDialog winner={winner} onPlayAgain={resetGame} />
      <header className="flex justify-between items-center bg-card p-4 rounded-lg shadow-md">
        <div>
          <h1 className="text-2xl font-bold font-headline text-primary">NetSec Duel</h1>
          <p className="text-sm text-muted-foreground">Room: <span className="font-mono bg-muted px-2 py-1 rounded">{roomCode}</span></p>
        </div>
        <div className="flex gap-8 items-center">
            <div className="text-center">
                <div className="flex items-center gap-2 text-lg font-semibold text-destructive">
                    <Bug className="w-6 h-6" /> Attacker
                </div>
                <p className="text-3xl font-bold">{attackerScore}</p>
            </div>
             <div className="text-center">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <ShieldCheck className="w-6 h-6" /> Defender
                </div>
                <p className="text-3xl font-bold">{defenderScore}</p>
            </div>
        </div>
         <div>
            <p className="text-lg">Your Role: <span className={`font-bold ${playerRole === 'attacker' ? 'text-destructive' : 'text-primary'}`}>{playerRole.charAt(0).toUpperCase() + playerRole.slice(1)}</span></p>
         </div>
      </header>

      <main className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 bg-card rounded-lg shadow-md p-4 relative overflow-hidden">
            <NetworkGraph nodes={nodes} edges={initialEdges} onNodeClick={handleNodeClick} activeAction={activeAction} />
        </div>
        <div className="md:col-span-1">
            <PlayerActions role={playerRole} onAction={handleAction} cooldowns={cooldowns} />
        </div>
      </main>
    </div>
  );
}
