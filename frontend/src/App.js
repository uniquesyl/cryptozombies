import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MyZombies from './pages/MyZombies';
import Battle from './pages/Battle';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-zombie-dark to-gray-900">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-zombies" element={<MyZombies />} />
            <Route path="/battle" element={<Battle />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 