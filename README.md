# Side-Stacker Demo

A full-stack implementation of the Side-Stacker game (a Connect-Four variant) with support for multiple game modes, AI opponents, and real-time updates.

---

## Features

- **7x7 Side-Stacker Board:**  
  Players take turns adding pieces to either side of any row. Pieces stack horizontally, not vertically.
- **Game Modes:**  
  - Player vs Player (local)
  - Player vs Player (remote/demo) TODO
  - Player vs AI (easy & medium difficulty)
  - AI vs AI (watch two bots play)
- **AI Opponent:**  
  - Easy: random or basic moves
  - Medium: uses heuristics and basic minimax strategies
- **Real-Time Updates:**  
  - No page refresh needed to see opponent or AI moves (frontend polls backend)
- **Persistent Storage:**  
  - All games are stored in a PostgreSQL database

---

## Tech Stack

- **Frontend:** React, TypeScript, CSS (BEM, CSS variables)
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma

---

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure your database:**
   - Set your `DATABASE_URL` in `backend/.env`
   - Run migrations:
     ```sh
     cd backend
     npx prisma migrate dev
     ```

3. **Start the backend:**
   ```sh
   npm start
   ```

4. **Start the frontend:**
   ```sh
   cd ../frontend
   npm start
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## Known Issues

- **Unbound Breakpoints:**  
  Debugging with VS Code may show unbound breakpoints if source maps or launch configs are misconfigured.
- **Remote Multiplayer:**  
  "Remote" mode currently allows both users to play from the same browser/session. True remote multiplayer with user authentication is not implemented.


## Improvements

- **AI Delay:**  
  AI moves are triggered on backend poll with a delay, but may feel less "real-time" than websockets.
- **AI Deterministic:**  
  AI moves are currently deterministic, especially noticeable in AI vs AI games. Introducing randomness by selecting from a list of equally scored moves would make gameplay less predictable.
- **No Hard AI:**  
  Only easy and medium AI are implemented. Hard (ML-based) AI is not yet available.
- **No User Auth:**  
  There is no authentication or user management.
- **No Mobile Layout:**  
  UI is desktop-first; mobile responsiveness could be improved.
- **No Undo/Redo:**  
  Once a move is made, it cannot be undone.
- **No Spectator Mode:**  
  Only players can view games in progress.
- **Missing debug tools**  
  For development, better debug configurable would be required, add a logger & tracing, add error handling & data validation

