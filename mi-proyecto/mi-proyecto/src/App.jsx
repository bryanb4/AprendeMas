// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage.jsx';
// BORRAMOS: import LoginPage from './pages/LoginPage.jsx'; (Ya no se usa)
import RegisterPage from './pages/RegisterPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Principal (Contiene la Portada + Login Integrado) */}
        <Route path="/" element={<HomePage />} />

        {/* Ruta de Registro */}
        <Route path="/register" element={<RegisterPage />} />

        {/* BORRAMOS LA RUTA /login PORQUE YA NO EXISTE */}

        {/* Cualquier otra dirección te regresa al inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;