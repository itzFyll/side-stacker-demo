import { Router } from 'express';
import { createGame, getGame, makeMove } from '../services/gameManager';
import { AiDifficulty, GameMode } from 'models/types';

/****
 * WIP - TODO
 * Should add params verification and error handling
 * Should add tracing and logging
 * Should add authentication & authorization
 */

const router = Router();

// Create a new game
router.post('/games', async (req, res) => {
  const { gameMode, aiDiff1, aiDiff2 } = req.body as { gameMode?: GameMode; aiDiff1?: AiDifficulty; aiDiff2?: AiDifficulty };
  const game = await createGame(gameMode, aiDiff1, aiDiff2);
  res.status(201).json(game);
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
