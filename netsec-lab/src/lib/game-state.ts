'use server';

import fs from 'fs/promises';
import path from 'path';
import type { GameState, Node, Edge } from './types';

const gamesDir = path.join(process.cwd(), 'data', 'games');

const initialNodes: Node[] = [
  { id: '1', label: 'Firewall', state: 'healthy', x: 100, y: 300 },
  { id: '2', label: 'Web Server', state: 'healthy', x: 250, y: 150 },
  { id: '3', label: 'App Server', state: 'healthy', x: 450, y: 150 },
  { id: '4', label: 'DB Server', state: 'healthy', x: 650, y: 150 },
  { id: '5', label: 'Admin PC', state: 'healthy', x: 450, y: 450 },
  { id: '6', label: 'Dev PC', state: 'healthy', x: 650, y: 450 },
  { id: '7', label: 'VPN Gateway', state: 'healthy', x: 250, y: 450 },
  { id: '8', label: 'Analytics', state: 'healthy', x: 800, y: 150 },
  { id: '9', label: 'Cache Server', state: 'healthy', x: 450, y: 50 },
  { id: '10', label: 'User PC', state: 'healthy', x: 800, y: 450 },
  { id: '11', label: 'IoT Gateway', state: 'healthy', x: 100, y: 50 },
  { id: '12', label: 'Backup Server', state: 'healthy', x: 100, y: 550 },
  { id: '13', label: 'SCADA System', state: 'healthy', x: 800, y: 50 },
  { id: '14', label: 'Public WiFi', state: 'healthy', x: 800, y: 550 },
  { id: '15', label: 'CEO Laptop', state: 'healthy', x: 450, y: 300 },
];


async function ensureDir() {
  try {
    await fs.access(gamesDir);
  } catch {
    await fs.mkdir(gamesDir, { recursive: true });
  }
}

function getInitialGameState(): GameState {
  const nodes = JSON.parse(JSON.stringify(initialNodes));
  const edges: Edge[] = [];
  const nodeIds = nodes.map((n: Node) => n.id);

  const shuffledNodes = [...nodeIds].sort(() => Math.random() - 0.5);
  for (let i = 0; i < shuffledNodes.length - 1; i++) {
    edges.push({ from: shuffledNodes[i], to: shuffledNodes[i + 1] });
  }
  if (shuffledNodes.length > 1) {
    edges.push({ from: shuffledNodes[shuffledNodes.length - 1], to: shuffledNodes[0] });
  }

  // Add more random edges for complexity.
  // A lower multiplier (e.g., 0.4) results in a sparser graph.
  const numExtraEdges = Math.floor(nodes.length * 0.4);
  const existingEdges = new Set(edges.map(e => `${e.from}-${e.to}`));

  for (let i = 0; i < numExtraEdges; i++) {
    let from: string, to: string;
    let edgeKey: string, reverseEdgeKey: string;
    let attempts = 0;
    
    do {
        from = nodeIds[Math.floor(Math.random() * nodeIds.length)];
        to = nodeIds[Math.floor(Math.random() * nodeIds.length)];
        edgeKey = `${from}-${to}`;
        reverseEdgeKey = `${to}-${from}`;
        attempts++;
    } while ((from === to || existingEdges.has(edgeKey) || existingEdges.has(reverseEdgeKey)) && attempts < 50);

    if (from !== to && !existingEdges.has(edgeKey) && !existingEdges.has(reverseEdgeKey)) {
        edges.push({ from, to });
        existingEdges.add(edgeKey);
        existingEdges.add(reverseEdgeKey);
    }
  }

  return {
    nodes,
    edges,
    attackerScore: 0,
    defenderScore: 0,
    cooldowns: {},
    winner: null,
    lastUpdated: Date.now(),
    events: [],
  };
}

export async function getGameState(roomCode: string): Promise<GameState> {
  await ensureDir();
  const filePath = path.join(gamesDir, `${roomCode}.json`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as GameState;
  } catch (error) {
    const newGame = getInitialGameState();
    await updateGameState(roomCode, newGame);
    return newGame;
  }
}

export async function updateGameState(roomCode: string, state: GameState): Promise<void> {
  await ensureDir();
  const filePath = path.join(gamesDir, `${roomCode}.json`);
  await fs.writeFile(filePath, JSON.stringify(state, null, 2));
}

export async function resetGame(roomCode: string): Promise<GameState> {
    const newGame = getInitialGameState();
    await updateGameState(roomCode, newGame);
    return newGame;
}
