// src/pages/EjercicioTemaPage.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Mismo catálogo que DashboardPage, para resolver /ejercicios/:materia/:temaIdx
const CATALOGO = {
  aritmetica: {
    nombre: 'Aritmética', icon: '🧮',
    temas: [
      'Números Reales',
      'Potencias Enteras Positivas y Leyes de Exponentes',
      'Raíz Cuadrada',
      'Operaciones y Jerarquía',
      'Operaciones con fracciones',
    ],
  },
  algebra: {
    nombre: 'Álgebra', icon: '🔣',
    temas: [
      'Expresiones algebraicas con una variable',
      'Tipo de expresiones',
      'Ecuaciones',
      'Inecuaciones en una variable',
      'Ecuaciones lineales en varias variables',
      'Sistema de ecuaciones con 2 variables (2x2)',
      'Polinomios',
      'Multiplicación y división de polinomios',
      'Factorización de polinomios',
      'Factorización parte 2',
      'Factorización parte 3',
      'Expresiones algebraicas racionales o fracciones algebraicas',
      'Suma y resta de expresiones algebraicas racionales',
      'Multiplicación y división de expresiones algebraicas racionales',
      'Ecuaciones cuadráticas',
      'Plano cartesiano',
      'Funciones y sus gráficas',
      'Sistemas de ecuaciones lineales en dos variables',
    ],
  },
  geometria: {
    nombre: 'Geometría y Medición', icon: '🔷',
    temas: [
      'Ángulos y triángulos',
      'Rectas paralelas cortadas por una secante',
      'Congruencia y semejanza',
      'Teorema de Pitágoras y triángulos especiales',
      'Círculos',
      'Sólidos',
      'Perímetro, área y volumen',
    ],
  },
  estadistica: {
    nombre: 'Estadística y Probabilidad', icon: '📊',
    temas: [
      'Tablas y gráficas',
      'Medidas de tendencia central de datos',
      'Probabilidad de un evento',
      'Espacio muestral',
    ],
  },
};

function EjercicioTemaPage() {
  const navigate = useNavigate();
  const { materia = '', temaIdx = '' } = useParams();

  const materiaKey = String(materia).toLowerCase();
  const entry = CATALOGO[materiaKey];
  const idx = parseInt(temaIdx, 10);
  const temaNombre = entry && Number.isInteger(idx) ? entry.temas[idx] : null;

  const handleTabChange = (tab) => navigate('/dashboard', { state: { activeTab: tab } });
  const handleLogout = () => { localStorage.removeItem('token'); navigate('/'); };

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab="ejercicios" onTabChange={handleTabChange} onLogout={handleLogout} />
      <main className="main-content">
        <button className="btn-volver" onClick={() => navigate('/dashboard', { state: { activeTab: 'ejercicios' } })}>
          ← Volver a ejercicios
        </button>

        <div className="contenido-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '3.5rem' }}>{entry ? entry.icon : '🚧'}</div>
          <h1 className="titulo-seccion" style={{ marginTop: 16 }}>
            {temaNombre ? temaNombre : 'Tema no encontrado'}
          </h1>
          {entry && temaNombre && <p style={{ color: '#764ba2', fontWeight: 600 }}>{entry.nombre}</p>}
          <hr className="divisor" />
          <h2 style={{ color: '#1a1b3a' }}>🚧 Página en creación</h2>
          <p className="descripcion" style={{ textAlign: 'center' }}>
            Vista aún no obtenida. Aquí podrás resolver los ejercicios de este tema cuando estén disponibles.
          </p>
          <p className="nota">Espacio reservado: /ejercicios/{materiaKey || '...'} /{Number.isInteger(idx) ? idx : '...'}</p>
        </div>
      </main>

      <style>{`
        .dashboard-layout { display: flex; min-height: 100vh; background-color: #f4f2fb; font-family: 'Segoe UI', system-ui, sans-serif; }
        .main-content { flex: 1; padding: 40px 60px; overflow-y: auto; }
        .btn-volver { background: none; border: none; color: #764ba2; font-weight: 600; font-size: 0.95rem; cursor: pointer; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; padding: 0; }
        .btn-volver:hover { opacity: 0.7; }
        .contenido-card { background: white; border-radius: 24px; padding: 40px 48px; box-shadow: 0 8px 24px rgba(118,75,162,0.1); border: 1px solid #f0e8ff; }
        .titulo-seccion { color: #1a1b3a; font-size: 1.8rem; margin: 0 0 12px; }
        .divisor { border: 0; border-top: 2px solid #ede8f8; margin: 24px 0; }
        .descripcion { color: #666; line-height: 1.7; font-size: 1.02rem; }
        .nota { margin-top: 16px; color: #999; font-size: 0.85rem; }
        @media (max-width: 900px) { .main-content { padding: 24px 20px; } .contenido-card { padding: 24px 20px; } }
      `}</style>
    </div>
  );
}

export default EjercicioTemaPage;
