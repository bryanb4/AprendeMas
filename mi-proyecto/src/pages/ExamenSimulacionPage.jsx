// src/pages/ExamenSimulacionPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function ExamenSimulacionPage() {
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    navigate('/dashboard', { state: { activeTab: tab } });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleComenzar = () => {
    // El backend armará el examen solo con lo desbloqueado en orden:
    // 1 Aritmética -> 2 Álgebra -> 3 Geometría -> 4 Estadística
    console.log('Comenzar examen simulación');
  };

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
