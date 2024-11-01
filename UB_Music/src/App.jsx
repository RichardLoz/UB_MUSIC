import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Home from './components/Home/Home'; 
import Register from './components/Login/Register';
import Favorites from './components/favorites/favorites';
import MainLayout from './components/Home/MainLayout';

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} /> 
              <Route path="/home" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="favorites" element={<Favorites />} />
              </Route>
          </Routes>
      </Router>
  );
}

export default App
