import type { GameState, PlayerRole, ActionType, GameEvent } from './types';

const COOLDOWN_SECONDS = {
  deploy_virus: 12,
  deploy_worm: 20,
  scan: 10,
  shield: 25,
  exfiltrate_data: 15,
};

const SHIELD_DURATION_MS = 45 * 1000;
const WIN_SCORE = 25;

function addEvent(state: GameState, event: Omit<GameEvent, 'id' | 'timestamp'>): GameState {
  const newEvent: GameEvent = {
    ...event,
    id: `${Date.now()}-${Math.random()}`,
    timestamp: Date.now(),
  };
  return {
    ...state,
    events: [newEvent, ...state.events].slice(0, 10),
  };
}


export function processTick(state: GameState): GameState {
  const now = Date.now();
  let newState = { ...state };
  
  const timeDiffMs = now - newState.lastUpdated;
  if (timeDiffMs <= 0) {
    return newState;
  }

  newState.nodes = newState.nodes.map(node => {
    let updatedNode = { ...node };

    if (updatedNode.state === 'hardened' && updatedNode.lastHardened && now - updatedNode.lastHardened > SHIELD_DURATION_MS) {
      updatedNode.state = 'healthy';
      updatedNode.lastHardened = undefined;
      newState = addEvent(newState, { message: "Shield Down", description: `Shield on ${updatedNode.label} has expired.` });
    }

    return updatedNode;
  });

  newState.lastUpdated = now;
  return newState;
}

export function performAction(
    state: GameState,
    role: PlayerRole,
    action: ActionType,
    nodeId: string,
): GameState {
    const now = Date.now();
    let newState = { ...state };

    if (newState.winner) return state;

    if (newState.cooldowns[action] && now < newState.cooldowns[action]!) {
        const remaining = Math.ceil((newState.cooldowns[action]! - now) / 1000);
        return addEvent(state, { message: "Action on Cooldown", description: `Please wait ${remaining}s.`, variant: "destructive" });
    }
    
    const nodeIndex = newState.nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) return state;

    const node = { ...newState.nodes[nodeIndex] };
    let actionSuccessful = false;
    
    if (role === 'attacker') {
        switch (action) {
            case 'deploy_virus':
                if (node.state === 'healthy') {
                    node.state = 'infected';
                    node.lastInfected = now;
                    actionSuccessful = true;
                    newState = addEvent(newState, { message: "Success!", description: `Node ${node.label} has been infected.`, variant: "destructive" });
                } else {
                    newState = addEvent(newState, { message: "Failed", description: `Cannot infect a ${node.state} node.`, variant: "destructive" });
                }
                break;
            case 'deploy_worm':
                 if (node.state === 'infected') {
                    const connectedNodeIds = newState.edges.filter(e => e.from === nodeId || e.to === nodeId).map(e => e.from === nodeId ? e.to : e.from);
                    let spread = false;
                    const updatedNodes = [...newState.nodes];

                    for (const connectedId of connectedNodeIds) {
                        const connectedNodeIndex = updatedNodes.findIndex(n => n.id === connectedId);
                        if (connectedNodeIndex !== -1 && updatedNodes[connectedNodeIndex].state === 'healthy') {
                            updatedNodes[connectedNodeIndex] = {...updatedNodes[connectedNodeIndex], state: 'infected', lastInfected: now};
                            spread = true;
                        }
                    }
                    if (spread) {
                        newState.nodes = updatedNodes;
                        actionSuccessful = true;
                        newState = addEvent(newState, { message: "Worm Spread!", description: `Infection spreads from ${node.label}.`, variant: "destructive" });
                    } else {
                        newState = addEvent(newState, { message: "Failed", description: "No healthy neighbors to infect.", variant: "destructive" });
                    }
                } else {
                    newState = addEvent(newState, { message: "Failed", description: "Worms can only spread from infected nodes.", variant: "destructive" });
                }
                break;
            case 'exfiltrate_data':
                if (node.state === 'infected') {
                    node.state = 'healthy';
                    node.lastInfected = undefined;
                    newState.attackerScore += 1;
                    if (newState.attackerScore >= WIN_SCORE) newState.winner = 'attacker';
                    actionSuccessful = true;
                    newState = addEvent(newState, { message: "Data Exfiltrated!", description: `Scored 1 point from ${node.label}.`, variant: "destructive" });
                } else {
                     newState = addEvent(newState, { message: "Failed", description: "Can only exfiltrate from infected nodes.", variant: "destructive" });
                }
                break;
        }
    }
    
    if (role === 'defender') {
        switch (action) {
            case 'scan':
                if (node.state === 'infected') {
                    node.state = 'healthy';
                    node.lastInfected = undefined;
                    newState.defenderScore += 1;
                    if(newState.defenderScore >= WIN_SCORE) newState.winner = 'defender';
                    actionSuccessful = true;
                    newState = addEvent(newState, { message: "Success!", description: `Node ${node.label} has been cleaned.`, variant: "default" });
                } else {
                    newState = addEvent(newState, { message: "Failed", description: `Node is already ${node.state}.`, variant: "destructive" });
                }
                break;
            case 'shield':
                if (node.state === 'healthy') {
                    node.state = 'hardened';
                    node.lastHardened = now;
                    actionSuccessful = true;
                    newState = addEvent(newState, { message: "Success!", description: `Node ${node.label} is now hardened.`, variant: "default" });
                } else {
                    newState = addEvent(newState, { message: "Failed", description: `Cannot harden a ${node.state} node.`, variant: "destructive" });
                }
                break;
        }
    }

    if (actionSuccessful) {
        newState.cooldowns[action] = now + COOLDOWN_SECONDS[action] * 1000;
        newState.nodes[nodeIndex] = node;
    }
    
    return newState;
}
