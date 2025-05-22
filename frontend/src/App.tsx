import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameScreen from '@screens/GameScreen';

// TODO - Add a home screen
const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<GameScreen />} />
    </Routes>
  </Router>
);

export default App;
