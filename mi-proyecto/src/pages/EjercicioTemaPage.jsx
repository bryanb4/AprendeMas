// src/pages/EjercicioTemaPage.jsx
// PLANTILLA única de práctica por tema. Ruta: /ejercicios/:materia/:temaIdx
// Muestra los ejercicios aprobados del tema con corrección inmediata.
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { apiObtenerEjercicios } from '../services/api.js';

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

  const [fase, setFase] = useState('cargando');
  const [ejercicios, setEjercicios] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [error, setError] = useState(null);

  const handleTabChange = (tab) => navigate('/dashboard', { state: { activeTab: tab } });
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('avatar');
    navigate('/');
  };

  useEffect(() => {
    if (!entry || !temaNombre) {
      setError('Tema no encontrado.');
      setFase('listo');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Inicia sesión para practicar.');
      setFase('listo');
      return;
    }
    apiObtenerEjercicios(token, entry.nombre, temaNombre)
      .then((data) => {
        setEjercicios(data.ejercicios || []);
        setFase('listo');
      })
      .catch((err) => {
        setError(err.message);
        setFase('listo');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const responder = (id, opcion) => {
    setRespuestas((prev) => (prev[id] !== undefined ? prev : { ...prev, [id]: opcion }));
  };

  const correctas = ejercicios.filter((e) => respuestas[e.id] !== undefined && respuestas[e.id] === e.respuesta_correcta).length;
  const respondidas = ejercicios.filter((e) => respuestas[e.id] !== undefined).length;

  const md = (texto) => (
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {String(texto || '')}
    </ReactMarkdown>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab="ejercicios" onTabChange={handleTabChange} onLogout={handleLogout} />
      <main className="main-content">
        <button className="btn-volver" onClick={() => navigate('/dashboard', { state: { activeTab: 'ejercicios' } })}>
          ← Volver a ejercicios
        </button>

        <div className="contenido-card" style={{ textAlign: 'center', padding: '32px 40px', marginBottom: 24 }}>
          <div style={{ fontSize: '2.5rem' }}>{entry ? entry.icon : '🚧'}</div>
          <h1 className="titulo-seccion" style={{ marginTop: 8 }}>
            {temaNombre ? temaNombre : 'Tema no encontrado'}
          </h1>
          {entry && temaNombre && (
            <p style={{ color: '#764ba2', fontWeight: 600, margin: 0 }}>
              {entry.nombre} · Practica a tu ritmo, sin tiempo ni calificación
            </p>
          )}
        </div>

        {fase === 'cargando' && (
          <div className="contenido-card" style={{ textAlign: 'center' }}>
            <p>Cargando ejercicios…</p>
          </div>
        )}

        {error && (
          <div className="contenido-card" style={{ borderLeft: '4px solid #e03939', marginBottom: 16 }}>
            <p style={{ color: '#c62828', fontWeight: 600, margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {fase === 'listo' && ejercicios.length === 0 && !error && (
          <div className="contenido-card" style={{ textAlign: 'center' }}>
            <p>Aún no hay ejercicios aprobados para este tema. Vuelve pronto.</p>
          </div>
        )}

        {fase === 'listo' && ejercicios.length > 0 && (
          <>
            <div className="contenido-card" style={{ padding: '14px 28px', marginBottom: 16 }}>
              <strong style={{ color: '#5f3b85' }}>
                ✅ {correctas} correctas · 📝 {respondidas}/{ejercicios.length} intentados
              </strong>
            </div>
            {ejercicios.map((e, i) => {
              const resp = respuestas[e.id];
              const ya = resp !== undefined;
              const bien = ya && resp === e.respuesta_correcta;
              return (
                <div
                  className="contenido-card"
                  key={e.id}
                  style={{
                    marginBottom: 16,
                    textAlign: 'left',
                    borderLeft: `4px solid ${!ya ? '#ede7f6' : bien ? '#2e9e5b' : '#e03939'}`,
                  }}
                >
                  <p style={{ fontWeight: 700, color: '#5f3b85', marginTop: 0 }}>
                    Ejercicio {i + 1} de {ejercicios.length}
                    {e.enfoque === 'teorica' ? ' · 📖 Teórico' : ' · 🧮 Práctico'}
                  </p>
                  <div style={{ fontSize: '1.05rem', marginBottom: 12 }}>{md(e.pregunta)}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(e.opciones || []).map((op, idx) => {
                        const esElegida = resp === op;
                        const esCorrecta = op === e.respuesta_correcta;
                        return (
                          <button
                            key={op}
                            onClick={() => responder(e.id, op)}
                            disabled={ya}
                            style={{
                              textAlign: 'left',
                              padding: '10px 16px',
                              borderRadius: 12,
                              border: ya && esCorrecta
                                ? '2px solid #2e9e5b'
                                : ya && esElegida
                                  ? '2px solid #e03939'
                                  : '2px solid #ede7f6',
                              background: ya && esCorrecta ? '#e8f7ee' : ya && esElegida ? '#fdecec' : 'white',
                              cursor: ya ? 'default' : 'pointer',
                              fontSize: '0.95rem',
                              display: 'flex',
                              gap: 10,
                              alignItems: 'flex-start',
                            }}
                          >
                            <strong style={{ color: '#5f3b85', minWidth: 24 }}>
                              {"ABCD"[idx] || "•"}&#41;
                            </strong>
                            <span style={{ flex: 1 }}>{md(op)}</span>
                          </button>
                        );
                      })}
                    </div>
                  {ya && (
                    <div style={{ marginTop: 10 }}>
                      <p style={{ fontWeight: 700, color: bien ? '#2e9e5b' : '#c62828', margin: '4px 0' }}>
                        {bien ? '✅ ¡Correcto!' : '❌ Casi… revisa la explicación'}
                      </p>
                      {e.explicacion && (
                        <div style={{ color: '#444', background: '#faf8ff', borderRadius: 12, padding: '10px 16px' }}>
                          <strong>Explicación: </strong>
                          {md(e.explicacion)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
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
