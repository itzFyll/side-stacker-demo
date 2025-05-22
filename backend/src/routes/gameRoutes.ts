import { Router } from 'express';
import { createGame, getGame, makeMove } from '../services/gameManager';
import { AiDifficulty, GameMode } from 'models/types';

/****
 * WIP - TODO
 * Should add params verification and error handling
 * Should add tracing and logging
 * Should add authentication & authorization
 * Should move logic to controller that will call the service
 * Should add tests
 */

const router = Router();

// Create a new game
router.post('/games', async (req, res) => {
  const { gameMode, ai1Difficulty, ai2Difficulty } = req.body as { gameMode: GameMode; ai1Difficulty: AiDifficulty; ai2Difficulty: AiDifficulty };
  const game = await createGame(gameMode, ai1Difficulty, ai2Difficulty);
  res.status(201).json(game);
}); 

// Join a remote game (Player 2 joins with gameId)
router.get('/games/:gameId/join', async (req, res) => {
  const { gameId } = req.params;
  // In a real app, you'd identify/join the player here (e.g., assign as 'o')
  // For now, just return the game if it exists
  const game = await getGame(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  // Optionally, mark the game as "joined" or assign player 2 here
  res.json(game);
});

// Get game state
router.get('/games/:gameId', async (req, res) => {
  const { gameId } = req.params;
  const game = await getGame(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json(game);
});

// Make a move
// In a real app, you'd check which player is making the move using authentication
router.post('/games/:gameId/move', async (req, res) => {
  const { gameId } = req.params;
  const { row, side } = req.body as { row: number; side: 'L' | 'R' };
  const updatedGame = await makeMove(gameId, row, side);
  if (!updatedGame) {
    return res.status(400).json({ error: 'Invalid move or game not found' });
  }
  res.json(updatedGame);
});

// Healthcheck
router.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
