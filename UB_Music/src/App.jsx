import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'; // Asegúrate de que el componente Login esté importado
import Home from './components/Home/Home';   // Importa tu componente Home
import Register from './components/Register';

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
