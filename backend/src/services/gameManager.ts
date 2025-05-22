import { v4 as uuidv4 } from 'uuid';
import { Game, Cell, Player, Status, AiDifficulty, GameMode } from 'models/types';
import * as gameRepo from './prismaGameRepo';

const BOARD_SIZE = 7;

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

function checkWin(board: Cell[][], player: Player): boolean {
  const size = board.length;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Horizontal
      if (col <= size - 4 && board[row][col] === player && board[row][col + 1] === player && board[row][col + 2] === player && board[row][col + 3] === player)
        return true;
      // Vertical
      if (row <= size - 4 && board[row][col] === player && board[row + 1][col] === player && board[row + 2][col] === player && board[row + 3][col] === player)
        return true;
      // Diagonal down-right
      if (
        row <= size - 4 &&
        col <= size - 4 &&
        board[row][col] === player &&
        board[row + 1][col + 1] === player &&
        board[row + 2][col + 2] === player &&
        board[row + 3][col + 3] === player
      )
        return true;
      // Diagonal up-right
      if (
        row >= 3 &&
        col <= size - 4 &&
        board[row][col] === player &&
        board[row - 1][col + 1] === player &&
        board[row - 2][col + 2] === player &&
        board[row - 3][col + 3] === player
      )
        return true;
    }
  }
  return false;
}

function checkDraw(board: Cell[][]): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

export async function createGame(gameMode: GameMode, aiDiff1: AiDifficulty, aiDiff2: AiDifficulty): Promise<Game> {
  const id = uuidv4();
  const board = createEmptyBoard();
  const game: Omit<Game, 'createdAt' | 'updatedAt'> = {
    id,
    board,
    currentPlayer: 'x',
    status: 'in_progress',
    winner: null,
    gameMode,
    aiDifficulty1: aiDiff1 ?? null,
    aiDifficulty2: aiDiff2 ?? null,
  };
  return await gameRepo.createGame(game);
}

export async function getGame(gameId: string): Promise<Game | undefined> {
  return await gameRepo.getGame(gameId);
}

export async function makeMove(gameId: string, row: number, side: 'L' | 'R'): Promise<Game | undefined> {
  const game = await gameRepo.getGame(gameId);
  if (!game || game.status !== 'in_progress') return undefined;
  if (row < 0 || row >= BOARD_SIZE || (side !== 'L' && side !== 'R')) return undefined;

  const board = game.board.map((r) => [...r]);
  const newRow = [...board[row]];
  let placed = false;
  if (side === 'L') {
    const idx = newRow.findIndex((cell) => cell === null);
    if (idx !== -1) {
      newRow[idx] = game.currentPlayer as Player;
      placed = true;
    }
  } else {
    const idx = newRow
      .slice()
      .reverse()
      .findIndex((cell) => cell === null);
    if (idx !== -1) {
      newRow[BOARD_SIZE - 1 - idx] = game.currentPlayer as Player;
      placed = true;
    }
  }
  if (!placed) return undefined;

  board[row] = newRow;
  let status: Status = 'in_progress';
  let winner: Player | null = null;
  if (checkWin(board, game.currentPlayer as Player)) {
    status = 'won';
    winner = game.currentPlayer as Player;
  } else if (checkDraw(board)) {
    status = 'draw';
  }

  const nextPlayer: Player = game.currentPlayer === 'x' ? 'o' : 'x';

  return await gameRepo.updateGame(gameId, {
    board,
    currentPlayer: status === 'in_progress' ? nextPlayer : game.currentPlayer,
    status,
    winner,
  });
}
