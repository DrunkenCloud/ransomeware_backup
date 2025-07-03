export type NodeState = 'healthy' | 'infected' | 'hardened';
export type PlayerRole = 'attacker' | 'defender' | null;
export type ActionType = 'deploy_virus' | 'deploy_worm' | 'scan' | 'shield' | 'exfiltrate_data';

export interface Node {
  id: string;
  label: string;
  state: NodeState;
  x: number;
  y: number;
  lastHardened?: number;
  lastInfected?: number;
}

export interface Edge {
  from: string;
  to: string;
}

export interface GameEvent {
  id:string;
  message: string;
  description?: string;
  variant?: 'default' | 'destructive';
  timestamp: number;
}

export interface GameState {
  nodes: Node[];
  edges: Edge[];
  attackerScore: number;
  defenderScore: number;
  cooldowns: {
    [key in ActionType]?: number;
  };
  winner: PlayerRole;
  lastUpdated: number;
  events: GameEvent[];
}
