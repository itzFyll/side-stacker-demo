import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from '@screens/HomeScreen';
import GameScreen from '@screens/GameScreen';

// TODO - Add a home screen
const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/game" element={<GameScreen />} />
    </Routes>
  </Router>
);

export default App;
