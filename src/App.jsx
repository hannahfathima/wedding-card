import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Invitation from './components/Invitation';
import Admin from './components/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Invitation />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
