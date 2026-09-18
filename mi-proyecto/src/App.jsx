// src/App.jsx
import React from 'react';
import 'katex/dist/katex.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AritmeticaPage from './pages/AritmeticaPage.jsx';
import AlgebraPage from './pages/AlgebraPage.jsx';
import GeometriaPage from './pages/GeometriaPage.jsx';
import EstadisticaPage from './pages/EstadisticaPage.jsx';
import GenerarPreguntas from './pages/GenerarPreguntaIA.jsx';
import PaginaTablas from './pages/Preguntas_BD.jsx';
import ExamenSimulacionPage from './pages/ExamenSimulacionPage.jsx';
import EjercicioTemaPage from './pages/EjercicioTemaPage.jsx';
import EvaluacionTemaPage from './pages/EvaluacionTemaPage.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';

function isAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return localStorage.getItem('token') !== null && user?.rol === 'admin';
  } catch {
    return false;
  }
}

function RequireAdmin({ children }) {
  return isAdmin() ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/aritmetica" element={<AritmeticaPage />} />
        <Route path="/algebra" element={<AlgebraPage />} />
        <Route path="/geometria" element={<GeometriaPage />} />
        <Route path="/estadistica" element={<EstadisticaPage />} />
        <Route path="/adminIA" element={<RequireAdmin><GenerarPreguntas /></RequireAdmin>} />
        <Route path="/adminTabla" element={<RequireAdmin><PaginaTablas /></RequireAdmin>} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/examen-simulacion" element={<ExamenSimulacionPage />} />
        <Route path="/ejercicios/:materia/:temaIdx" element={<EjercicioTemaPage />} />
        <Route path="/evaluacion/:materia/:temaIdx" element={<EvaluacionTemaPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;