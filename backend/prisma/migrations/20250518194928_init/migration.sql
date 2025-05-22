-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "board" JSONB NOT NULL,
    "currentPlayer" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "winner" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);
