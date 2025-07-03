import { Bug, Shield, Scan, Wand, ShieldAlert, DatabaseZap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PlayerRole, ActionType, GameState } from '@/lib/types';
import { Progress } from '../ui/progress';
import { useEffect, useState } from 'react';

interface PlayerActionsProps {
  role: PlayerRole;
  onAction: (action: ActionType) => void;
  cooldowns: GameState['cooldowns'];
}

const COOLDOWN_SECONDS: Record<ActionType, number> = {
  deploy_virus: 12,
  deploy_worm: 20,
  scan: 10,
  shield: 25,
  exfiltrate_data: 15,
};

const attackerActions: { id: ActionType; label: string; icon: React.ElementType, description: string }[] = [
  { id: 'deploy_virus', label: 'Deploy Virus', icon: Bug, description: 'Infect a healthy node.' },
  { id: 'deploy_worm', label: 'Deploy Worm', icon: Wand, description: 'Spread from an infected node.' },
  { id: 'exfiltrate_data', label: 'Exfiltrate Data', icon: DatabaseZap, description: 'Score point from an infected node.' },
];

const defenderActions: { id: ActionType; label: string; icon: React.ElementType, description: string }[] = [
  { id: 'scan', label: 'Scan Node', icon: Scan, description: 'Cleanse an infected node.' },
  { id: 'shield', label: 'Shield Node', icon: ShieldAlert, description: 'Harden a healthy node.' },
];

export default function PlayerActions({ role, onAction, cooldowns }: PlayerActionsProps) {
  const actions = role === 'attacker' ? attackerActions : defenderActions;
  const title = role === 'attacker' ? 'Attack Commands' : 'Defense Protocols';
  const Icon = role === 'attacker' ? Bug : Shield;

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="h-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Icon className={`w-8 h-8 ${role === 'attacker' ? 'text-destructive' : 'text-primary'}`} />
            <CardTitle className="text-2xl font-headline">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {actions.map(({ id, label, icon: ActionIcon, description }) => {
            const cooldownEnd = cooldowns[id] || 0;
            const remainingSeconds = Math.max(0, Math.ceil((cooldownEnd - now) / 1000));
            const totalCooldown = COOLDOWN_SECONDS[id];
            const progress = remainingSeconds > 0 ? ((totalCooldown - remainingSeconds) / totalCooldown) * 100 : 100;

            return (
                <div key={id} className="space-y-2">
                    <Button
                        onClick={() => onAction(id)}
                        disabled={remainingSeconds > 0}
                        variant={role === 'attacker' ? 'destructive' : 'default'}
                        className="w-full justify-start h-14 text-left"
                    >
                        <ActionIcon className="w-6 h-6 mr-4" />
                        <div className="flex flex-col">
                            <span className="font-bold text-base">{label}</span>
                             <span className="font-normal text-xs">{description}</span>
                        </div>
                        {remainingSeconds > 0 && <span className="ml-auto font-mono">{remainingSeconds}s</span>}
                    </Button>
                    {remainingSeconds > 0 && <Progress value={progress} className="h-1" />}
                </div>
            )
        })}
      </CardContent>
    </Card>
  );
}
