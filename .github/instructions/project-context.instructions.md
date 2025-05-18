---
applyTo: '**'
---
## Coding standards, domain knowledge, and preferences that AI should follow.

For a coding demo, here are some of the requirements and preferences:

Difficulty: Advanced (senior full-stack applicants)
Side-Stacker Game
This is essentially connect-four, but the pieces stack on either side of the board instead of bottom-up.
Two players see a board, which is a grid of 7 rows and 7 columns. They take turn adding pieces to a row, on one of the sides. The pieces stack on top of each other, and the game ends when there are no spaces left available, or when a player has four consecutive pieces on a diagonal, column, or row.
For example, the board might look like this:
0 [ _ _ _ _ _ _ _ ]
1 [ o x _ _ _ _ o ]
2 [ x _ _ _ _ _ x ]
3 [ x _ _ _ _ _ o ]
4 [ o _ _ _ _ _ _ ]
5 [ _ _ _ _ _ _ _ ]
6 [ _ _ _ _ _ _ _ ]
in this case, it is x’s turn. If x plays (2, R), the board will look like this:
0 [ _ _ _ _ _ _ _ ]
1 [ o x _ _ _ _ o ]
2 [ x _ _ _ _ x x ]
3 [ x _ _ _ _ _ o ]
4 [ o _ _ _ _ _ _ ]
5 [ _ _ _ _ _ _ _ ]
6 [ _ _ _ _ _ _ _ ]
The take-home task is to implement the 2-player version of this game, where each player sees the board in their frontend and can place moves that the other player sees, and the game should display “player 1 won” “player 2 lost” when the game is complete.

The implementation should include an AI bot that integrates with the game so players can compete against it.

The bot can have different difficulty levels, but at least medium difficulty is required:

Easy: the bot makes semi-random moves with basic rules
Medium: the bot uses basic strategies and machine learning fundamentals
Hard: the bot uses a complete ML model
The game can have multiple game modes:

Player vs Player (required)
Player vs AI Bot (required)
AI Bot vs AI Bot (optional)
Please store the game in the backend using a relational database; how you define your models is up to you. You should not have to refresh the page to see your opponent’s moves.


### Tech Stack
- Frontend: React, Typescript
- Backend: Node.js, Express, Typescript
- Database: PostgreSQL
