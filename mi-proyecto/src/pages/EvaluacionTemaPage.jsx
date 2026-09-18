// src/pages/EvaluacionTemaPage.jsx
<<<<<<< HEAD
// PLANTILLA única del examen de evaluación por tema.
// Ruta: /evaluacion/:materia/:temaIdx (los botones "Comenzar examen
// evaluación" al final de cada tema navegan aquí).
// El backend entrega 5 prácticas + 5 teóricas aprobadas del tema y califica.
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { apiObtenerEvaluacion, apiCalificarEvaluacion } from '../services/api.js';
=======
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
>>>>>>> 416baaf497d1c56124981100d6c4244b708402fa

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

function EvaluacionTemaPage() {
  const navigate = useNavigate();
  const { materia = '', temaIdx = '' } = useParams();

  const materiaKey = String(materia).toLowerCase();
  const entry = CATALOGO[materiaKey];
  const idx = parseInt(temaIdx, 10);
  const temaNombre = entry && Number.isInteger(idx) ? entry.temas[idx] : null;

<<<<<<< HEAD
  const [fase, setFase] = useState('cargando'); // cargando | examen | calificando | resultado
  const [preguntas, setPreguntas] = useState([]);
  const [temaId, setTemaId] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [aviso, setAviso] = useState(null);

  const handleTabChange = (tab) => navigate('/dashboard', { state: { activeTab: tab } });
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('avatar');
    navigate('/');
  };

  // Volver a la lección del tema (cada página usa su propio estado)
  const volverALeccion = () => {
    if (materiaKey === 'aritmetica') {
      navigate('/aritmetica', { state: { seccionId: idx + 1 } });
    } else if (materiaKey === 'algebra') {
      const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19];
      navigate('/algebra', { state: { seccionId: ids[idx] ?? null } });
    } else {
      navigate(`/${materiaKey}`);
    }
  };

  useEffect(() => {
    if (!entry || !temaNombre) {
      setError('Tema no encontrado.');
      setFase('examen');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Inicia sesión para presentar el examen.');
      setFase('examen');
      return;
    }
    apiObtenerEvaluacion(token, entry.nombre, temaNombre)
      .then((data) => {
        setPreguntas(data.preguntas || []);
        setTemaId(data.tema_id || null);
        if (!data.completas) {
          setAviso(
            `Este tema aún tiene ${data.practicas || 0} prácticas y ${data.teoricas || 0} teóricas aprobadas (meta 5+5). Se presenta con las disponibles.`,
          );
        }
        setFase('examen');
      })
      .catch((err) => {
        setError(err.message);
        setFase('examen');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const responder = (id, opcion) => {
    setRespuestas((prev) => ({ ...prev, [id]: opcion }));
  };

  const respondidas = preguntas.filter((p) => respuestas[p.id] !== undefined).length;

  const enviar = async () => {
    setFase('calificando');
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const payload = preguntas.map((p) => ({ id: p.id, respuesta: respuestas[p.id] || null }));
      const data = await apiCalificarEvaluacion(token, payload, temaId);
      setResultado(data);
      setFase('resultado');
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message);
      setFase('examen');
    }
  };

  const md = (texto) => (
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {String(texto || '')}
    </ReactMarkdown>
  );
=======
  const handleTabChange = (tab) => navigate('/dashboard', { state: { activeTab: tab } });
  const handleLogout = () => { localStorage.removeItem('token'); navigate('/'); };
>>>>>>> 416baaf497d1c56124981100d6c4244b708402fa

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab="aprendizaje" onTabChange={handleTabChange} onLogout={handleLogout} />
      <main className="main-content">
<<<<<<< HEAD
        <button className="btn-volver" onClick={volverALeccion}>
          ← Volver a la lección
        </button>

        <div className="contenido-card" style={{ textAlign: 'center', padding: '32px 40px', marginBottom: 24 }}>
          <div style={{ fontSize: '2.5rem' }}>{entry ? entry.icon : '🚧'}</div>
          <h1 className="titulo-seccion" style={{ marginTop: 8 }}>
            {temaNombre ? `Evaluación · ${temaNombre}` : 'Tema no encontrado'}
          </h1>
          {entry && temaNombre && (
            <p style={{ color: '#764ba2', fontWeight: 600, margin: 0 }}>
              {entry.nombre} · 10 preguntas · Apruebas con 7+
            </p>
          )}
        </div>

        {fase === 'cargando' && (
          <div className="contenido-card" style={{ textAlign: 'center' }}>
            <p>Cargando tu examen…</p>
          </div>
        )}

        {error && (
          <div className="contenido-card" style={{ borderLeft: '4px solid #e03939', marginBottom: 16 }}>
            <p style={{ color: '#c62828', fontWeight: 600, margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {aviso && fase === 'examen' && (
          <div className="contenido-card" style={{ borderLeft: '4px solid #e6a817', marginBottom: 16 }}>
            <p style={{ color: '#7a5c00', margin: 0 }}>⚠️ {aviso}</p>
          </div>
        )}

        {fase === 'examen' && preguntas.length > 0 && (
          <>
            {preguntas.map((p, i) => (
              <div className="contenido-card" key={p.id} style={{ marginBottom: 16, textAlign: 'left' }}>
                <p style={{ fontWeight: 700, color: '#5f3b85', marginTop: 0 }}>
                  Pregunta {i + 1} de {preguntas.length}
                </p>
                <div style={{ fontSize: '1.05rem', marginBottom: 12 }}>{md(p.pregunta)}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(p.opciones || []).map((op, idx) => (
                    <button
                      key={op}
                      onClick={() => responder(p.id, op)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 16px',
                        borderRadius: 12,
                        border: respuestas[p.id] === op ? '2px solid #764ba2' : '2px solid #ede7f6',
                        background: respuestas[p.id] === op ? '#f4efff' : 'white',
                        cursor: 'pointer',
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
                  ))}
                </div>
              </div>
            ))}
            <div className="contenido-card" style={{ textAlign: 'center' }}>
              <p style={{ color: '#666' }}>
                Respondidas: {respondidas}/{preguntas.length}
              </p>
              <button
                onClick={enviar}
                disabled={respondidas < preguntas.length}
                style={{
                  background: respondidas < preguntas.length ? '#c9b8ec' : '#764ba2',
                  color: 'white',
                  border: 'none',
                  borderRadius: 40,
                  padding: '14px 48px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: respondidas < preguntas.length ? 'not-allowed' : 'pointer',
                }}
              >
                Enviar examen
              </button>
              {respondidas < preguntas.length && (
                <p style={{ color: '#999', fontSize: '0.85rem' }}>Responde todas para enviar.</p>
              )}
            </div>
          </>
        )}

        {fase === 'calificando' && (
          <div className="contenido-card" style={{ textAlign: 'center' }}>
            <p>Calificando…</p>
          </div>
        )}

        {fase === 'resultado' && resultado && (
          <>
            <div
              className="contenido-card"
              style={{
                textAlign: 'center',
                borderTop: `6px solid ${resultado.aprobado ? '#2e9e5b' : '#e03939'}`,
              }}
            >
              <div style={{ fontSize: '3rem' }}>{resultado.aprobado ? '🎉' : '📚'}</div>
              <h2 style={{ color: resultado.aprobado ? '#2e9e5b' : '#c62828', margin: '8px 0' }}>
                {resultado.aciertos}/{resultado.total} aciertos
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#333' }}>{resultado.message}</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                {!resultado.aprobado && (
                  <button
                    onClick={volverALeccion}
                    style={{ background: '#764ba2', color: 'white', border: 'none', borderRadius: 40, padding: '12px 32px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Retomar la lección
                  </button>
                )}
                <button
                  onClick={() => window.location.reload()}
                  style={{ background: 'white', color: '#764ba2', border: '2px solid #764ba2', borderRadius: 40, padding: '12px 32px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Reintentar examen
                </button>
                <button
                  onClick={() => navigate(`/${materiaKey || 'dashboard'}`)}
                  style={{ background: '#ede7f6', color: '#5f3b85', border: '2px solid #c9b8ec', borderRadius: 40, padding: '12px 32px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Volver al área de estudio
                </button>
              </div>
            </div>

            <h3 style={{ color: '#1a1b3a', marginTop: 24 }}>Revisión</h3>
            {resultado.detalle.map((d, i) => (
              <div
                className="contenido-card"
                key={d.id}
                style={{
                  marginBottom: 12,
                  textAlign: 'left',
                  borderLeft: `4px solid ${d.correcta ? '#2e9e5b' : '#e03939'}`,
                }}
              >
                <p style={{ fontWeight: 700, marginTop: 0 }}>
                  {d.correcta ? '✅' : '❌'} Pregunta {i + 1}
                </p>
                <div>{md(d.pregunta)}</div>
                {!d.correcta && (
                  <>
                    <p style={{ margin: '8px 0 4px' }}>
                      <strong>Tu respuesta:</strong>
                    </p>
                    <div>{md(d.tuRespuesta || '—')}</div>
                    <p style={{ margin: '8px 0 4px' }}>
                      <strong>Respuesta correcta:</strong>
                    </p>
                    <div>{md(d.respuesta_correcta)}</div>
                    {d.explicacion && (
                      <>
                        <p style={{ margin: '8px 0 4px' }}>
                          <strong>Explicación:</strong>
                        </p>
                        <div style={{ color: '#444' }}>{md(d.explicacion)}</div>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </>
        )}
=======
        <button className="btn-volver" onClick={() => navigate('/dashboard', { state: { activeTab: 'aprendizaje' } })}>
          ← Volver a aprendizaje
        </button>

        <div className="contenido-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '3.5rem' }}>{entry ? '📝' : '🚧'}</div>
          <h1 className="titulo-seccion" style={{ marginTop: 16 }}>
            {temaNombre ? `Evaluación · ${temaNombre}` : 'Tema no encontrado'}
          </h1>
          {entry && temaNombre && <p style={{ color: '#764ba2', fontWeight: 600 }}>{entry.nombre} · Examen teórico</p>}
          <hr className="divisor" />
          <h2 style={{ color: '#1a1b3a' }}>🚧 Página en creación</h2>
          <p className="descripcion" style={{ textAlign: 'center' }}>
            Vista aún no obtenida. Aquí podrás comenzar el examen teórico de este tema cuando esté disponible.
          </p>
          <p className="nota">Espacio reservado: /evaluacion/{materiaKey || '...'} /{Number.isInteger(idx) ? idx : '...'}</p>
        </div>
>>>>>>> 416baaf497d1c56124981100d6c4244b708402fa
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

export default EvaluacionTemaPage;
