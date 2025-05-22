import { Cell, Player, Game, AiDifficulty, Move } from '../models/types';

// Types for moves

// Utility: clone the board
function cloneBoard(board: Cell[][]): Cell[][] {
  return board.map((row) => [...row]);
}

// Utility: get valid moves (returns [rowIdx, side])
function getValidMoves(board: Cell[][]): Move[] {
  const moves: Move[] = [];
  for (let row = 0; row < board.length; row++) {
    // Check for leftmost available cell
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === null) {
        moves.push({ row, side: 'L' });
        break; // Only add once per row for left
      }
    }
    // Check for rightmost available cell
    for (let col = board[row].length - 1; col >= 0; col--) {
      if (board[row][col] === null) {
        moves.push({ row, side: 'R' });
        break; // Only add once per row for right
      }
    }
  }
  return moves;
}

// Apply a move to the board and return a new board
function applyMove(board: Cell[][], move: Move, player: Player): Cell[][] {
  const newBoard = cloneBoard(board);
  const { row, side } = move;
  if (side === 'L') {
    // Insert at leftmost null
    for (let col = 0; col < newBoard[row].length; col++) {
      if (newBoard[row][col] === null) {
        newBoard[row][col] = player;
        break;
      }
    }
  } else {
    // Insert at rightmost null
    for (let col = newBoard[row].length - 1; col >= 0; col--) {
      if (newBoard[row][col] === null) {
        newBoard[row][col] = player;
        break;
      }
    }
  }
  return newBoard;
}

// Heuristic evaluation function
function evaluateBoard(board: Cell[][], player: Player): number {
  // Simple heuristic: +1000 for win, -1000 for loss, +score for lines of 2/3, -score for opponent
  const opponent: Player = player === 'x' ? 'o' : 'x';

  if (checkWin(board, player)) return 1000;
  if (checkWin(board, opponent)) return -1000;

  // Count 3-in-a-rows and 2-in-a-rows for player and opponent
  let score = 0;
  score += countLines(board, player, 3) * 10;
  score += countLines(board, player, 2) * 3;
  score -= countLines(board, opponent, 3) * 12;
  score -= countLines(board, opponent, 2) * 4;
  return score;
}

// Check if a player has won
function checkWin(board: Cell[][], player: Player): boolean {
  // Horizontal, vertical, diagonal checks
  const N = board.length;
  const M = board[0].length;
  // Horizontal & vertical
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < M; c++) {
      if (c + 3 < M && [0, 1, 2, 3].every((i) => board[r][c + i] === player)) return true;
      if (r + 3 < N && [0, 1, 2, 3].every((i) => board[r + i][c] === player)) return true;
      // Diagonal /
      if (r - 3 >= 0 && c + 3 < M && [0, 1, 2, 3].every((i) => board[r - i][c + i] === player)) return true;
      // Diagonal \
      if (r + 3 < N && c + 3 < M && [0, 1, 2, 3].every((i) => board[r + i][c + i] === player)) return true;
    }
  }
  return false;
}

// Count lines of length n for a player
function countLines(board: Cell[][], player: Player, n: number): number {
  let count = 0;
  const N = board.length;
  const M = board[0].length;
  // Horizontal, vertical, diagonal
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < M; c++) {
      // Horizontal
      if (c + n - 1 < M && [...Array(n).keys()].every((i) => board[r][c + i] === player)) count++;
      // Vertical
      if (r + n - 1 < N && [...Array(n).keys()].every((i) => board[r + i][c] === player)) count++;
      // Diagonal /
      if (r - (n - 1) >= 0 && c + n - 1 < M && [...Array(n).keys()].every((i) => board[r - i][c + i] === player)) count++;
      // Diagonal \
      if (r + n - 1 < N && c + n - 1 < M && [...Array(n).keys()].every((i) => board[r + i][c + i] === player)) count++;
    }
  }
  return count;
}

/***
 * TODO
 * To ameliorate, we can return a list of possible moves and select randomly one of them. Purpose: to avoid deterministic AI
 */

// Minimax with depth limit for medium AI
function minimax(board: Cell[][], depth: number, maximizing: boolean, player: Player, aiPlayer: Player): { score: number; move?: Move } {
  const validMoves = getValidMoves(board);
  if (depth === 0 || validMoves.length === 0 || checkWin(board, 'x') || checkWin(board, 'o')) {
    return { score: evaluateBoard(board, aiPlayer) };
  }

  let bestMove: Move | undefined;
  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const newBoard = applyMove(board, move, aiPlayer);
      const evalResult = minimax(newBoard, depth - 1, false, player === 'x' ? 'o' : 'x', aiPlayer);
      if (evalResult.score > maxEval) {
        maxEval = evalResult.score;
        bestMove = move;
      }
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    const opponent: Player = aiPlayer === 'x' ? 'o' : 'x';
    for (const move of validMoves) {
      const newBoard = applyMove(board, move, opponent);
      const evalResult = minimax(newBoard, depth - 1, true, player === 'x' ? 'o' : 'x', aiPlayer);
      if (evalResult.score < minEval) {
        minEval = evalResult.score;
        bestMove = move;
      }
    }
    return { score: minEval, move: bestMove };
  }
}

// Main AI move function
export function getAINextMove(game: Game, aiPlayer: Player, difficulty: AiDifficulty): Move {
  const validMoves = getValidMoves(game.board);
  if (difficulty === 'easy') {
    // Easy: random valid move
    // WIP to improve, should be a better heuristic
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  // Medium: minimax with heuristics, depth 2 for reasonable perf
  const { move } = minimax(game.board, 2, true, aiPlayer, aiPlayer);
  return move ?? validMoves[0];
}
