// src/pages/EstadisticaPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { apiObtenerProgreso } from '../services/api.js';

const temasEstadistica = [
  "Tablas y gráficas",
  "Medidas de tendencia central de datos",
  "Probabilidad de un evento",
  "Espacio muestral"
];

function EstadisticaPage() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(null);
  // Bandera por nombre de tema
  const [progreso, setProgreso] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    apiObtenerProgreso(token)
      .then((data) => {
        const map = {};
        (data.progreso || []).forEach((p) => {
          if (p.materia === 'Estadística y Probabilidad') map[p.tema] = !!p.aprobado;
        });
        setProgreso(map);
      })
      .catch(() => {});
  }, []);

  const handleTabChange = (tab) => navigate('/dashboard', { state: { activeTab: tab } });
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (selectedTopic) {
    return (
      <div className="dashboard-layout">
        <Sidebar activeTab="aprendizaje" onTabChange={handleTabChange} onLogout={handleLogout} />
        <main className="main-content">
          <button className="btn-volver" onClick={() => setSelectedTopic(null)}>
            ← Volver a temas de estadística
          </button>
          <div className="contenido-card">
            <h1 className="titulo-seccion">{selectedTopic}</h1>
            <hr className="divisor" />
            <div className="cuerpo-texto">
              <p>📊 Contenido en desarrollo. Próximamente encontrarás explicaciones, ejemplos y ejercicios de este tema.</p>
              <div className="nota-box" style={{ background: '#FFF8E1' }}>💡 ¡Estamos trabajando para traerte el mejor material!</div>
            </div>
            <hr className="divisor" style={{ marginTop: 32 }} />
            <button
              className="btn-evaluacion"
              onClick={() => {
                const idx = temasEstadistica.indexOf(selectedTopic);
                navigate(`/evaluacion/estadistica/${idx >= 0 ? idx : 0}`);
              }}
            >
              Comenzar con examen evaluación →
            </button>
          </div>
        </main>
        <style>{`
          .dashboard-layout { display: flex; min-height: 100vh; background-color: #f4f2fb; font-family: 'Segoe UI', system-ui, sans-serif; }
          .main-content { flex: 1; padding: 40px 60px; overflow-y: auto; }
          .btn-volver { background: none; border: none; color: #764ba2; font-weight: 600; font-size: 0.95rem; cursor: pointer; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; padding: 0; }
          .btn-volver:hover { opacity: 0.7; }
          .contenido-card { background: white; border-radius: 20px; padding: 40px 48px; box-shadow: 0 4px 20px rgba(118,75,162,0.08); }
          .titulo-seccion { color: #1a1b3a; font-size: 2rem; margin: 0 0 12px; }
          .divisor { border: 0; border-top: 2px solid #ede8f8; margin-bottom: 28px; }
          .cuerpo-texto { font-size: 1.05rem; line-height: 1.85; color: #333; }
          .cuerpo-texto p { margin: 0 0 14px; }
          .nota-box { background: #fff8e1; border-left: 4px solid #f39c12; border-radius: 10px; padding: 14px 20px; margin-bottom: 18px; font-size: 0.95rem; color: #7a5c00; }
          .btn-evaluacion { background-color: #764ba2; color: white; border: none; border-radius: 40px; padding: 14px 24px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: 0.2s; width: 100%; box-shadow: 0 4px 12px rgba(118,75,162,0.3); margin-top: 8px; }
          .btn-evaluacion:hover { background-color: #5f3b85; transform: scale(1.01); }
          @media (max-width: 900px) { .main-content { padding: 24px 20px; } .contenido-card { padding: 24px 20px; } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab="aprendizaje" onTabChange={handleTabChange} onLogout={handleLogout} />
      <main className="main-content">
        <button className="btn-volver" onClick={() => navigate('/dashboard', { state: { activeTab: 'aprendizaje' } })}>
          ← Volver a los módulos
        </button>
        <div className="contenido-card">
          <h1 className="titulo-seccion">Estadística y Probabilidad</h1>
          <hr className="divisor" />
          <ul className="topic-list">
            {temasEstadistica.map((tema, idx) => (
              <li key={idx} className="topic-item">
                <span className="topic-name">{tema}</span>
                <span className="badge-wrap">
                  {progreso[tema] === true && (
                    <span className="badge-aprobado">✅ Sección aprobada</span>
                  )}
                  {progreso[tema] !== true && (
                    <span className="badge-pendiente">⏳ Falta por evaluar</span>
                  )}
                  <button className="btn-start-topic" onClick={() => setSelectedTopic(tema)}>
                    Comenzar
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <style>{`
        .dashboard-layout { display: flex; min-height: 100vh; background-color: #f4f2fb; font-family: 'Segoe UI', system-ui, sans-serif; }
        .main-content { flex: 1; padding: 40px 60px; overflow-y: auto; }
        .btn-volver { background: none; border: none; color: #764ba2; font-weight: 600; font-size: 0.95rem; cursor: pointer; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; padding: 0; }
        .btn-volver:hover { opacity: 0.7; }
        .contenido-card { background: white; border-radius: 20px; padding: 40px 48px; box-shadow: 0 4px 20px rgba(118,75,162,0.08); }
        .titulo-seccion { color: #1a1b3a; font-size: 2rem; margin: 0 0 12px; }
        .divisor { border: 0; border-top: 2px solid #ede8f8; margin-bottom: 28px; }
        .topic-list { list-style: none; padding: 0; margin: 0; }
        .topic-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #f0e8ff; background-color: #ffffff; border-radius: 12px; margin-bottom: 8px; transition: background 0.2s; }
        .topic-item:hover { background-color: #faf8ff; }
        .topic-name { font-size: 1.1rem; color: #2d1b45; text-align: left; }
        .btn-start-topic { background-color: #764ba2; color: white; border: none; border-radius: 30px; padding: 6px 16px; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s, transform 0.1s; box-shadow: 0 2px 8px rgba(118,75,162,0.2); line-height: 1.4; min-width: 80px; }
        .btn-start-topic:hover { background-color: #5f3b85; transform: scale(1.02); }
        .badge-wrap { display: flex; align-items: center; }
        .badge-aprobado { background: #764ba2; color: white; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 40px; padding: 7px 16px; margin-right: 8px; white-space: nowrap; border: 2px solid #5f3b85; }
        .badge-pendiente { background: #ede7f6; color: #5f3b85; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 40px; padding: 7px 16px; margin-right: 8px; white-space: nowrap; border: 2px solid #c9b8ec; }
        @media (max-width: 900px) { .main-content { padding: 24px 20px; } .contenido-card { padding: 24px 20px; } }
      `}</style>
    </div>
  );
}

export default EstadisticaPage;