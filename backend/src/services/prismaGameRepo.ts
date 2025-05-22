import { PrismaClient, Game as PrismaGame } from 'generated/prisma';
import { Game, Cell, Player, Status, GameMode, AiDifficulty } from 'models/types';

const prisma = new PrismaClient();

// --- Conversion helper ---

function toDomainGame(prismaGame: PrismaGame): Game {
  return {
    id: prismaGame.id,
    board: Array.isArray(prismaGame.board) ? (prismaGame.board as Cell[][]) : JSON.parse(prismaGame.board as unknown as string),
    currentPlayer: prismaGame.currentPlayer as Player,
    status: prismaGame.status as Status,
    winner: prismaGame.winner as Player | null,
    gameMode: prismaGame.gameMode as GameMode,
    aiDifficulty1: prismaGame.aiDifficulty1 as AiDifficulty | null,
    aiDifficulty2: prismaGame.aiDifficulty2 as AiDifficulty | null,
    createdAt: prismaGame.createdAt,
    updatedAt: prismaGame.updatedAt,
    lastMoveAt: prismaGame.lastMoveAt,
  };
}

// --- Repo methods ---

export async function createGame(game: Omit<Game, 'createdAt' | 'updatedAt' | 'lastMoveAt'>): Promise<Game> {
  const prismaGame = await prisma.game.create({
    data: {
      id: game.id,
      board: game.board,
      currentPlayer: game.currentPlayer,
      status: game.status,
      winner: game.winner,
      gameMode: game.gameMode,
      aiDifficulty1: game.aiDifficulty1,
      aiDifficulty2: game.aiDifficulty2,
      lastMoveAt: new Date(),
    },
  });
  const gameDto = toDomainGame(prismaGame);
  return gameDto;
}

export async function getGame(gameId: string): Promise<Game | undefined> {
  const prismaGame = await prisma.game.findUnique({ where: { id: gameId } });
  if (!prismaGame) return undefined;
  return toDomainGame(prismaGame);
}

export async function updateGame(
  gameId: string,
  data: Partial<Omit<Game, 'id' | 'gameMode' | 'aiDifficulty1' | 'aiDifficulty2' | 'createdAt' | 'updatedAt'>>,
): Promise<Game | undefined> {
  const prismaGame = await prisma.game.update({
    where: { id: gameId },
    data: {
      board: data.board,
      currentPlayer: data.currentPlayer,
      status: data.status,
      winner: data.winner,
      lastMoveAt: new Date(),
    },
  });
  return toDomainGame(prismaGame);
}
