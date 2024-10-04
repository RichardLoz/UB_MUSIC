import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Home from './components/Home/Home'; 
import Register from './components/Login/Register';

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} /> 
              <Route path="/home" element={<Home />} />
          </Routes>
      </Router>
  );
}

export default App
