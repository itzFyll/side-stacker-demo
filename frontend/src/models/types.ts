export type Cell = 'x' | 'o' | null;
export type Player = 'x' | 'o';
export type Status = 'in_progress' | 'won' | 'draw';
export type GameMode = 'local' | 'remote' | 'ai' | 'aiOnly';
export type AiDifficulty = 'easy' | 'medium';

export interface Game {
  id: string;
  board: Cell[][];
  currentPlayer: 'x' | 'o';
  status: 'in_progress' | 'won' | 'draw';
  winner: 'x' | 'o' | null;
  gameMode: GameMode;
  aiDifficulty1: AiDifficulty | null;
  aiDifficulty2: AiDifficulty | null;
  createdAt: Date;
  updatedAt: Date;
  lastMoveAt: Date;
}
