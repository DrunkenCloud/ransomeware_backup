'use server';

import { getGameState, updateGameState, resetGame as resetGameFile } from '@/lib/game-state';
import { processTick, performAction } from '@/lib/game-logic';
import type { PlayerRole, ActionType, GameState } from '@/lib/types';

export async function getGameStateAction(roomCode: string): Promise<GameState> {
  let state = await getGameState(roomCode);
  state = processTick(state);
  await updateGameState(roomCode, state);
  return state;
}

export async function performPlayerAction(
  roomCode: string,
  role: PlayerRole,
  action: ActionType,
  nodeId: string,
): Promise<GameState> {
    if (!role) {
        throw new Error("Player role is not set.");
    }
  let state = await getGameState(roomCode);
  state = processTick(state);
  state = performAction(state, role, action, nodeId);
  await updateGameState(roomCode, state);
  return state;
}

export async function resetGameAction(roomCode: string): Promise<GameState> {
    return await resetGameFile(roomCode);
}
