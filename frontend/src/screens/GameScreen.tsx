import React, { useEffect, useState } from 'react';
import Board from '@components/Board';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@redux/store';
import { createGame, makeMove, fetchGame, joinGame } from '@redux/gameSlice'; // <-- add joinGame
import { AiDifficulty, GameMode } from 'models/types';
import './GameScreen.css';

const GAME_MODE_LABELS: Record<GameMode, string> = {
  local: 'Player vs Player (local)',
  remote: 'Player vs Player (remote)',
  ai: 'Player vs AI',
  aiOnly: 'AI vs AI',
};

const GAME_MODES: GameMode[] = ['local', 'remote', 'ai', 'aiOnly'];

const GameScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id, board, currentPlayer, status, winner, loading } = useSelector(
    (state: RootState) => state.game,
  );

  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [ai1Difficulty, setAi1Difficulty] = useState<AiDifficulty>('easy');
  const [ai2Difficulty, setAi2Difficulty] = useState<AiDifficulty>('easy');
  const [gameStarted, setGameStarted] = useState(false);

  // For remote join
  const [joinGameId, setJoinGameId] = useState('');
  const [joining, setJoining] = useState(false);

  // Only create the game when user clicks "Start Game"
  useEffect(() => {
    if (gameStarted && gameMode && gameMode !== 'remote') {
      dispatch(createGame({ gameMode, ai1Difficulty, ai2Difficulty }));
    }
  }, [dispatch, gameStarted, gameMode, ai1Difficulty, ai2Difficulty]);

  // Poll for updates every 2s (for multiplayer/AI)
  useEffect(() => {
    if (!id) return;
    const interval = setInterval(() => {
      dispatch(fetchGame(id));
    }, 2000);
    return () => clearInterval(interval);
  }, [id, dispatch]);

  // Determine if user can make a move
  let canMove = false;
  if (gameStarted && gameMode && status === 'in_progress') {
    if (gameMode === 'local') {
      canMove = true;
    } else if (gameMode === 'ai') {
      canMove = currentPlayer === 'x';
    } else if (gameMode === 'remote') {
      // For demo: alternate turns, but in real app, check user id
      canMove = true;
    } else if (gameMode === 'aiOnly') {
      canMove = false;
    }
  }

  // For AI vs AI, show a message
  const aiModeSelected = gameMode === 'ai' || gameMode === 'aiOnly';

  const handleCellClick = (row: number, side: 'L' | 'R') => {
    if (!id || status !== 'in_progress' || !canMove) return;
    dispatch(makeMove({ gameId: id, row, side }));
  };

  const handleGameModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    setGameStarted(false); // Reset if user changes mode
    setJoinGameId('');
    setJoining(false);
  };

  const handleStartGame = () => {
    if (gameMode === 'remote') {
      // For remote, create game and show game ID for sharing
      dispatch(createGame({ gameMode, ai1Difficulty, ai2Difficulty }));
      setGameStarted(true);
    } else if (gameMode) {
      setGameStarted(true);
    }
  };

  const handleRestart = () => {
    setGameMode(null);
    setAi1Difficulty('easy');
    setAi2Difficulty('easy');
    setGameStarted(false);
    setJoinGameId('');
    setJoining(false);
    // Optionally, dispatch a reset action here
  };

  // Handle joining a remote game
  const handleJoinRemoteGame = async () => {
    if (!joinGameId) return;
    setJoining(true);
    await dispatch(joinGame(joinGameId));
    setGameStarted(true);
    setJoining(false);
  };

  return (
    <div className="game-screen">
      <h2>Side-Stacker Game</h2>
      {!gameStarted || !gameMode || status !== 'in_progress' ? (
        <div className="game-screen__setup">
          <div className="game-screen__mode-buttons">
            {GAME_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                className={`game-screen__mode-btn${
                  gameMode === mode ? ' game-screen__mode-btn--active' : ''
                }`}
                onClick={() => handleGameModeSelect(mode)}
              >
                {GAME_MODE_LABELS[mode]}
              </button>
            ))}
          </div>
          {gameMode === 'remote' && !id && (
            <div className="game-screen__remote">
              <button
                className="game-screen__start-btn"
                type="button"
                onClick={handleStartGame}
              >
                Create Remote Game
              </button>
              <div className="game-screen__remote-join">
                <input
                  type="text"
                  placeholder="Enter Game ID"
                  value={joinGameId}
                  onChange={(e) => setJoinGameId(e.target.value)}
                  disabled={joining}
                />
                <button
                  type="button"
                  onClick={handleJoinRemoteGame}
                  disabled={!joinGameId || joining}
                >
                  {joining ? 'Joining...' : 'Join Game'}
                </button>
              </div>
            </div>
          )}
          {gameMode === 'remote' && id && (
            <div className="game-screen__remote-info">
              <div>
                <strong>Share this Game ID:</strong>
                <div className="game-screen__remote-id">{id}</div>
              </div>
              <div>
                <em>Waiting for both players to join and play...</em>
              </div>
            </div>
          )}
          {aiModeSelected && (
            <div className="game-screen__ai-options">
              <div>
                <label>
                  AI 1 Difficulty:
                  <select
                    value={ai1Difficulty}
                    onChange={(e) =>
                      setAi1Difficulty(e.target.value as AiDifficulty)
                    }
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                  </select>
                </label>
              </div>
              {gameMode === 'aiOnly' && (
                <div>
                  <label>
                    AI 2 Difficulty:
                    <select
                      value={ai2Difficulty}
                      onChange={(e) =>
                        setAi2Difficulty(e.target.value as AiDifficulty)
                      }
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                    </select>
                  </label>
                </div>
              )}
            </div>
          )}
          {gameMode !== 'remote' && (
            <button
              className="game-screen__start-btn"
              type="button"
              onClick={handleStartGame}
              disabled={!gameMode}
            >
              Start Game
            </button>
          )}
        </div>
      ) : null}

      {loading && <div>Loading...</div>}

      {gameMode === 'aiOnly' && status === 'in_progress' && (
        <div className="game-screen__status">
          <em>AI vs AI in progress... Sit back and watch!</em>
        </div>
      )}

      {gameMode === 'ai' && status === 'in_progress' && currentPlayer === 'o' && (
        <div className="game-screen__status">
          <em>Waiting for AI to play...</em>
        </div>
      )}

      {gameMode === 'remote' && status === 'in_progress' && (
        <div className="game-screen__status">
          <em>Waiting for the other player to make a move...</em>
        </div>
      )}

      <Board
        board={board}
        onCellClick={handleCellClick}
        currentPlayer={currentPlayer}
        disabled={!canMove}
      />

      {status === 'won' && <div>{winner?.toUpperCase()} wins!</div>}
      {status === 'draw' && <div>Draw!</div>}

      {(status === 'won' || status === 'draw') && (
        <button className="game-screen__restart-btn" onClick={handleRestart}>
          Restart
        </button>
      )}
    </div>
  );
};

export default GameScreen;
