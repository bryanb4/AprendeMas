// src/pages/ExamenSimulacionPage.jsx
<<<<<<< HEAD
// Simulacro Piense II: solo preguntas de temas APROBADOS (bandera de
// sección), con temporizador real. El backend arma 20 reactivos 30/50/20.
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { apiObtenerSimulacion, apiCalificarSimulacion, apiEstadoSimulacion } from '../services/api.js';

function ExamenSimulacionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const autoRef = useRef(false);

  const [fase, setFase] = useState('intro'); // intro | examen | calificando | resultado
  const [preguntas, setPreguntas] = useState([]);
  const [temas, setTemas] = useState([]);
  const [infoIntento, setInfoIntento] = useState(null);
  const [estado, setEstado] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [segundos, setSegundos] = useState(0);
  const timerRef = useRef(null);
  const enviandoRef = useRef(false);
=======
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function ExamenSimulacionPage() {
  const navigate = useNavigate();
>>>>>>> 416baaf497d1c56124981100d6c4244b708402fa

  const handleTabChange = (tab) => {
    navigate('/dashboard', { state: { activeTab: tab } });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
<<<<<<< HEAD
    localStorage.removeItem('user');
    localStorage.removeItem('avatar');
    navigate('/');
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  // Estado visible desde la intro: día, intentos y temas desbloqueados
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    apiEstadoSimulacion(token)
      .then((d) => setEstado(d))
      .catch(() => {});
  }, []);

  // Si se llega desde el Dashboard ("Comenzar"), arranca directo sin
  // pedir otro clic. El ref evita doble arranque por StrictMode.
  useEffect(() => {
    if (location.state?.autostart && !autoRef.current) {
      autoRef.current = true;
      handleComenzar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmtTiempo = (s) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  };

  const enviar = async () => {
    if (enviandoRef.current) return;
    enviandoRef.current = true;
    clearInterval(timerRef.current);
    setFase('calificando');
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const payload = preguntas.map((p) => ({ id: p.id, respuesta: respuestas[p.id] || null }));
      const data = await apiCalificarSimulacion(token, payload);
      setResultado(data);
      setFase('resultado');
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message);
      setFase('examen');
    } finally {
      enviandoRef.current = false;
    }
  };

  const handleComenzar = async () => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Inicia sesión para presentar la simulación.');
        return;
      }
      const data = await apiObtenerSimulacion(token, 20);
      if (data.permitido === false || !data.preguntas || !data.preguntas.length) {
        setError(data.message || 'Aún no hay preguntas para tu simulación.');
        return;
      }
      setPreguntas(data.preguntas);
      setTemas(data.temas || []);
      setInfoIntento({
        actual: data.intento_actual,
        restantes: data.intentos_restantes,
        max: data.intentos_max || 3,
        ilimitado: !!data.ilimitado,
      });
      setRespuestas({});
      setResultado(null);
      const total = data.segundos_totales || (data.minutos || 40) * 60;
      setSegundos(total);
      setFase('examen');
      window.scrollTo(0, 0);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setSegundos((s) => {
          if (s <= 1) {
            clearInterval(timerRef.current);
            enviar();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  const responder = (id, opcion) => {
    setRespuestas((prev) => ({ ...prev, [id]: opcion }));
  };

  const respondidas = preguntas.filter((p) => respuestas[p.id] !== undefined).length;

  const md = (texto) => (
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {String(texto || '')}
    </ReactMarkdown>
  );

=======
    navigate('/');
  };

  const handleComenzar = () => {
    // El backend armará el examen solo con lo desbloqueado en orden:
    // 1 Aritmética -> 2 Álgebra -> 3 Geometría -> 4 Estadística
    console.log('Comenzar examen simulación');
  };

>>>>>>> 416baaf497d1c56124981100d6c4244b708402fa
  return (
    <div className="dashboard-layout">
      <Sidebar activeTab="simulacion" onTabChange={handleTabChange} onLogout={handleLogout} />

      <main className="main-content">
        <button className="btn-volver" onClick={() => navigate('/dashboard', { state: { activeTab: 'simulacion' } })}>
          ← Volver a simulación
        </button>

        <section className="progress-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '2rem' }}>📝</div>
            <div>
              <h2 style={{ margin: 0 }}>Examen Simulación · Piense II UDG</h2>
              <p style={{ margin: 0, opacity: 0.9 }}>Preparación para admisión a preparatoria UDG</p>
            </div>
          </div>
        </section>

<<<<<<< HEAD
        {error && (
          <div className="contenido-card" style={{ borderLeft: '4px solid #e03939', marginBottom: 16 }}>
            <p style={{ color: '#c62828', fontWeight: 600, margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {fase === 'intro' && (
          <>
            <div className="contenido-card">
              <h1 className="titulo-seccion">Comenzar con el examen simulación</h1>
              <hr className="divisor" />
              <p className="descripcion">
                El examen simulación solo te asigna preguntas de los temas que ya aprobaste,
                para que practiques bajo presión real sin frustrarte con lo que aún no ves.
                Tienes 50 segundos por pregunta. Disponible <strong>martes y viernes</strong>,
                con <strong>3 intentos por día</strong>. Al terminar verás tu calificación y la
                explicación de cada error.
              </p>

              <button className="btn-card-action btn-comenzar" onClick={handleComenzar}>
                Comenzar con el examen simulación →
              </button>

              {estado && (
                <div
                  style={{
                    marginTop: 16,
                    borderRadius: 16,
                    padding: '14px 20px',
                    background: estado.ilimitado || (estado.permitidoHoy && estado.intentos_restantes > 0) ? '#e8f7ee' : '#fef3e2',
                    border: `1px solid ${estado.ilimitado || (estado.permitidoHoy && estado.intentos_restantes > 0) ? '#2e9e5b' : '#e6a817'}`,
                    textAlign: 'left',
                    fontSize: '0.92rem',
                    color: '#333',
                  }}
                >
                  <div>📅 Hoy es <strong>{estado.hoy}</strong> · Simulacro: <strong>martes y viernes</strong></div>
                  <div>
                    {estado.ilimitado ? (
                      <>🎯 Modo admin: <strong>intentos ilimitados</strong> (llevas {estado.intentos_usados} hoy)</>
                    ) : (
                      <>🎯 Intentos: <strong>{estado.intentos_usados} de {estado.intentos_max} usados</strong>
                        {' '}· Te quedan <strong>{estado.intentos_restantes}</strong></>
                    )}
                  </div>
                  <div>📚 Temas aprobados alimentando tu examen: <strong>{estado.temas_aprobados}</strong></div>
                  <div style={{ marginTop: 4, color: '#666' }}>{estado.mensaje}</div>
                </div>
              )}
            </div>

            <div className="contenido-card" style={{ marginTop: 24 }}>
              <h1 className="titulo-seccion">Reglas y recomendaciones · Piense II</h1>
              <hr className="divisor" />
              <ul className="reglas-list">
                <li><strong>Llega temprano con tu cita y una identificación con foto.</strong> Sin registro no hay ingreso al examen real.</li>
                <li><strong>Lleva lápiz del No. 2, goma y sacapuntas.</strong> Normalmente no se permite calculadora ni celular en el aula.</li>
                <li><strong>Administra tu tiempo por sección.</strong> No te estanques: marca la difícil, avanza y regresa si te sobra tiempo.</li>
                <li><strong>Lee cada pregunta completa antes de ver opciones.</strong> El Piense II mide razonamiento, no solo memoria.</li>
                <li><strong>Contesta todo.</strong> Elimina 1-2 opciones y elige la más lógica, no dejes en blanco en tu práctica.</li>
                <li><strong>Avanza en orden:</strong> domina Aritmética antes de esperar ver Álgebra en tu simulación.</li>
              </ul>
              <p className="nota">Guía de preparación interna. Verifica siempre la convocatoria oficial UDG para reglas definitivas.</p>
            </div>
          </>
        )}

        {(fase === 'examen' || fase === 'calificando') && (
          <>
            <div className="contenido-card" style={{ position: 'sticky', top: 0, zIndex: 5, padding: '16px 32px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#5f3b85' }}>
                  Respondidas: {respondidas}/{preguntas.length}
                  {infoIntento && (
                    <span style={{ marginLeft: 12, color: '#764ba2' }}>
                      {infoIntento.ilimitado
                        ? `· Intento ${infoIntento.actual} (admin ilimitado)`
                        : `· Intento ${infoIntento.actual} de ${infoIntento.max} (te quedan ${infoIntento.restantes})`}
                    </span>
                  )}
                </strong>
                <strong style={{ color: segundos < 300 ? '#c62828' : '#1a1b3a', fontSize: '1.4rem' }}>
                  ⏱ {fmtTiempo(segundos)}
                </strong>
              </div>
            </div>

            {fase === 'calificando' ? (
              <div className="contenido-card" style={{ textAlign: 'center' }}>
                <p>Calificando…</p>
              </div>
            ) : (
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
                    Terminar simulación
                  </button>
                  {respondidas < preguntas.length && (
                    <p style={{ color: '#999', fontSize: '0.85rem' }}>
                      Responde todas para terminar (o espera el temporizador).
                    </p>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {fase === 'resultado' && resultado && (
          <>
            <div className="contenido-card" style={{ textAlign: 'center', borderTop: '6px solid #764ba2' }}>
              <div style={{ fontSize: '3rem' }}>📝</div>
              <h2 style={{ color: '#1a1b3a', margin: '8px 0' }}>
                {resultado.aciertos}/{resultado.total} aciertos · Calif. {resultado.calificacion}
              </h2>
              {resultado.intento && (
                <p style={{ color: '#764ba2', fontWeight: 700, margin: '4px 0' }}>
                  {resultado.ilimitado
                    ? `Intento ${resultado.intento} (admin ilimitado)`
                    : `Intento ${resultado.intento} de 3 del día`}
                </p>
              )}
              <p style={{ fontSize: '1.05rem', color: '#333' }}>{resultado.message}</p>
              {temas.length > 0 && (
                <p style={{ color: '#764ba2', fontSize: '0.9rem' }}>
                  Temas incluidos: {temas.join(' · ')}
                </p>
              )}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/dashboard', { state: { activeTab: 'aprendizaje' } })}
                  style={{ background: '#764ba2', color: 'white', border: 'none', borderRadius: 40, padding: '12px 32px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Volver a estudiar
                </button>
                <button
                  onClick={() => window.location.reload()}
                  style={{ background: 'white', color: '#764ba2', border: '2px solid #764ba2', borderRadius: 40, padding: '12px 32px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Nueva simulación
                </button>
              </div>
            </div>

            <h3 style={{ color: '#1a1b3a', marginTop: 24 }}>Revisión</h3>
            {resultado.detalle.map((d, i) => (
              <div
                className="contenido-card"
                key={d.id}
                style={{ marginBottom: 12, textAlign: 'left', borderLeft: `4px solid ${d.correcta ? '#2e9e5b' : '#e03939'}` }}
              >
                <p style={{ fontWeight: 700, marginTop: 0 }}>
                  {d.correcta ? '✅' : '❌'} Pregunta {i + 1}
                </p>
                <div>{md(d.pregunta)}</div>
                {!d.correcta && (
                  <>
                    <p style={{ margin: '8px 0 4px' }}><strong>Tu respuesta:</strong></p>
                    <div>{md(d.tuRespuesta || '—')}</div>
                    <p style={{ margin: '8px 0 4px' }}><strong>Respuesta correcta:</strong></p>
                    <div>{md(d.respuesta_correcta)}</div>
                    {d.explicacion && (
                      <>
                        <p style={{ margin: '8px 0 4px' }}><strong>Explicación:</strong></p>
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
        <div className="contenido-card">
          <h1 className="titulo-seccion">Comenzar con el examen simulación</h1>
          <hr className="divisor" />
          <p className="descripcion">
            El examen simulacion solo podria asignarte preguntas de los temmas que hayas desbloqueado en orden: Aritmética, Álgebra, Geometría y Estadística.
            Es importante que sigas el orden de desbloqueo para obtener una experiencia de práctica más efectiva y realista.
          </p>

          <button className="btn-card-action btn-comenzar" onClick={handleComenzar}>
            Comenzar con el examen simulación →
          </button>
        </div>

        <div className="contenido-card" style={{ marginTop: 24 }}>
          <h1 className="titulo-seccion">Reglas y recomendaciones · Piense II</h1>
          <hr className="divisor" />
          <ul className="reglas-list">
            <li><strong>Llega temprano con tu cita y una identificación con foto.</strong> Sin registro no hay ingreso al examen real.</li>
            <li><strong>Lleva lápiz del No. 2, goma y sacapuntas.</strong> Normalmente no se permite calculadora ni celular en el aula.</li>
            <li><strong>Administra tu tiempo por sección.</strong> No te estanques: marca la difícil, avanza y regresa si te sobra tiempo.</li>
            <li><strong>Lee cada pregunta completa antes de ver opciones.</strong> El Piense II mide razonamiento, no solo memoria.</li>
            <li><strong>Contesta todo.</strong> Elimina 1-2 opciones y elige la más lógica, no dejes en blanco en tu práctica.</li>
            <li><strong>Avanza en orden:</strong> domina Aritmética antes de esperar ver Álgebra en tu simulación.</li>
          </ul>
          <p className="nota">Guía de preparación interna. Verifica siempre la convocatoria oficial UDG para reglas definitivas.</p>
        </div>
>>>>>>> 416baaf497d1c56124981100d6c4244b708402fa
      </main>

      <style>{`
        .dashboard-layout { display: flex; min-height: 100vh; background-color: #f4f2fb; font-family: 'Segoe UI', system-ui, sans-serif; }
        .main-content { flex: 1; padding: 40px 60px; overflow-y: auto; }
        .btn-volver { background: none; border: none; color: #764ba2; font-weight: 600; font-size: 0.95rem; cursor: pointer; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; padding: 0; }
        .btn-volver:hover { opacity: 0.7; }
        .progress-banner { background: linear-gradient(135deg, #764ba2 0%, #9f7cd9 100%); color: white; padding: 24px; border-radius: 24px; margin-bottom: 32px; box-shadow: 0 12px 24px -8px rgba(118,75,162,0.3); }
        .contenido-card { background: white; border-radius: 24px; padding: 40px 48px; box-shadow: 0 8px 24px rgba(118,75,162,0.1); border: 1px solid #f0e8ff; text-align: left; }
        .titulo-seccion { color: #1a1b3a; font-size: 1.6rem; margin: 0 0 12px; }
        .divisor { border: 0; border-top: 2px solid #ede8f8; margin-bottom: 24px; }
        .descripcion { color: #666; line-height: 1.7; margin-bottom: 28px; font-size: 1.02rem; }
        .btn-card-action { background-color: #764ba2; color: white; border: none; border-radius: 40px; padding: 14px 24px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(118,75,162,0.3); width: 100%; }
        .btn-card-action:hover { background-color: #5f3b85; transform: scale(1.02); }
        .btn-comenzar { max-width: 420px; }
        .reglas-list { padding-left: 20px; margin: 0; color: #333; line-height: 1.8; }
        .reglas-list li { margin-bottom: 10px; }
        .nota { margin-top: 16px; color: #999; font-size: 0.85rem; }
        @media (max-width: 900px) { .main-content { padding: 24px 20px; } .contenido-card { padding: 24px 20px; } }
      `}</style>
    </div>
  );
}

export default ExamenSimulacionPage;
