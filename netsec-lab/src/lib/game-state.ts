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
];

const initialEdges: Edge[] = [
  { from: '1', to: '2' },
  { from: '1', to: '7' },
  { from: '2', to: '3' },
  { from: '2', to: '9' },
  { from: '3', to: '4' },
  { from: '7', to: '5' },
  { from: '7', to: '6' },
  { from: '4', to: '8' },
  { from: '6', to: '5' },
  { from: '6', to: '10' },
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
  return {
    nodes,
    edges: initialEdges,
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
