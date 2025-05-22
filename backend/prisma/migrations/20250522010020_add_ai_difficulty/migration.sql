/*
  Warnings:

  - Added the required column `gameMode` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "aiDifficulty1" TEXT,
ADD COLUMN     "aiDifficulty2" TEXT,
ADD COLUMN     "gameMode" TEXT NOT NULL;
