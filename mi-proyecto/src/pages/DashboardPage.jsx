// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PerfilView from './ProfileView';
import ResultadosView from './ResultadosView';
import Sidebar from '../components/Sidebar';

const materias = [
  { id: 1, nombre: "Aritmética", descripcion: "Numeración y Operaciones.", icon: "🧮", ruta: "/aritmetica" },
  { id: 2, nombre: "Álgebra", descripcion: "Ecuaciones y funciones.", icon: "🔣", ruta: "/algebra" },
  { id: 3, nombre: "Geometría y Medición", descripcion: "Figuras y ángulos.", icon: "🔷", ruta: "/geometria" },
  { id: 4, nombre: "Estadística y Probabilidad", descripcion: "Datos y azar.", icon: "📊", ruta: "/estadistica" }
];

// Mismo desglose que las páginas de aprendizaje, para practicar por tema
const ejerciciosPorMateria = [
  {
    id: 1, nombre: "Aritmética", icon: "🧮", ruta: "/aritmetica", slug: "aritmetica",
    temas: [
      "Números Reales",
      "Potencias Enteras Positivas y Leyes de Exponentes",
      "Raíz Cuadrada",
      "Operaciones y Jerarquía",
      "Operaciones con fracciones",
    ],
  },
  {
    id: 2, nombre: "Álgebra", icon: "🔣", ruta: "/algebra", slug: "algebra",
    temas: [
      "Expresiones algebraicas con una variable",
      "Tipo de expresiones",
      "Ecuaciones",
      "Inecuaciones en una variable",
      "Ecuaciones lineales en varias variables",
      "Sistema de ecuaciones con 2 variables (2x2)",
      "Polinomios",
      "Multiplicación y división de polinomios",
      "Factorización de polinomios",
      "Factorización parte 2",
      "Factorización parte 3",
      "Expresiones algebraicas racionales o fracciones algebraicas",
      "Suma y resta de expresiones algebraicas racionales",
      "Multiplicación y división de expresiones algebraicas racionales",
      "Ecuaciones cuadráticas",
      "Plano cartesiano",
      "Funciones y sus gráficas",
      "Sistemas de ecuaciones lineales en dos variables",
    ],
  },
  {
    id: 3, nombre: "Geometría y Medición", icon: "🔷", ruta: "/geometria", slug: "geometria",
    temas: [
      "Ángulos y triángulos",
      "Rectas paralelas cortadas por una secante",
      "Congruencia y semejanza",
      "Teorema de Pitágoras y triángulos especiales",
      "Círculos",
      "Sólidos",
      "Perímetro, área y volumen",
    ],
  },
  {
    id: 4, nombre: "Estadística y Probabilidad", icon: "📊", ruta: "/estadistica", slug: "estadistica",
    temas: [
      "Tablas y gráficas",
      "Medidas de tendencia central de datos",
      "Probabilidad de un evento",
      "Espacio muestral",
    ],
  },
];

function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'aprendizaje');

  // Sincronizar activeTab si viene desde otra página (ej. al volver de Aritmética)
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('avatar');
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Opcional: guardar en el estado de navegación para que persista
    navigate('/dashboard', { state: { activeTab: tab } });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} onLogout={handleLogout} />

      <main className="main-content">
        {activeTab !== 'simulacion' && (
        <header className="top-header" style={activeTab === 'perfil' ? { justifyContent: 'center' } : undefined}>
          <div
            style={
              activeTab === 'perfil'
                ? { color: '#764ba2', fontWeight: 700, fontSize: '1.15rem', flex: 1, textAlign: 'center' }
                : { color: '#5a5a6e', fontWeight: 500 }
            }
          >
            {activeTab === 'perfil' && "Tu información personal y seguridad"}
            {activeTab === 'aprendizaje' && "Explora los módulos"}
            {activeTab === 'ejercicios' && "Practica por tema"}
            {activeTab === 'resultados' && "Historial de evaluaciones"}
          </div>
        </header>
        )}

        {activeTab === 'perfil' && <PerfilView />}

        {activeTab === 'aprendizaje' && (
          <div className="animate-fade-in">
            <section className="progress-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '2rem' }}>📖</div>
                <div>
                  <h2 style={{ margin: 0 }}>Tu Progreso General</h2>
                  <p style={{ margin: 0, opacity: 0.9 }}>Sigue avanzando</p>
                </div>
              </div>
              <div className="progress-bar-container" style={{ marginTop: '20px' }}>
                <div className="progress-fill" style={{ width: '0%' }}></div>
              </div>
            </section>

            <div className="cards-grid">
              {materias.map((materia) => (
                <div key={materia.id} className="module-card">
                  <div className="icon-box">{materia.icon}</div>
                  <h3 style={{ marginBottom: 8 }}>{materia.nombre}</h3>
                  <p style={{ color: '#666', marginBottom: 20 }}>{materia.descripcion}</p>
                  <button
                    className="btn-card-action"
                    onClick={() => navigate(materia.ruta, { state: { fromDashboard: true } })}
                  >
                    Continuar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'simulacion' && (
          <div className="animate-fade-in">
            <section className="progress-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '2rem' }}>📝</div>
                <div>
                  <h2 style={{ margin: 0 }}>Examen Simulación · Piense II UDG</h2>
                  <p style={{ margin: 0, opacity: 0.9 }}>Practica en condiciones reales con preguntas de los 4 módulos</p>
                </div>
              </div>
            </section>

            <div className="contenido-card">
              <h1 className="titulo-seccion">Comenzar con el examen simulación</h1>
              <hr className="divisor" />
              <p className="descripcion">
                El examen simulación solo podría asignarte preguntas de los temas que hayas desbloqueado en orden: Aritmética, Álgebra, Geometría y Estadística.
                Es importante que sigas el orden de desbloqueo para obtener una experiencia de práctica más efectiva y realista.
              </p>
              <button
                className="btn-card-action btn-comenzar"
                onClick={() => navigate('/examen-simulacion', { state: { autostart: true } })}
              >
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
                <li>Guía de preparación interna. Verifica siempre la convocatoria oficial UDG para reglas definitivas.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'ejercicios' && (
          <div className="animate-fade-in">
            <section className="progress-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '2rem' }}>✏️</div>
                <div>
                  <h2 style={{ margin: 0 }}>Ejercicios por tema</h2>
                  <p style={{ margin: 0, opacity: 0.9 }}>Elige un tema y practica con ejercicios</p>
                </div>
              </div>
            </section>

            {ejerciciosPorMateria.map((materia) => (
              <div key={materia.id} className="ejercicio-bloque">
                <div className="ejercicio-header">
                  <span className="icon-box-sm">{materia.icon}</span>
                  <div>
                    <h3 style={{ margin: 0 }}>{materia.nombre}</h3>
                    <small style={{ color: '#666' }}>{materia.temas.length} temas</small>
                  </div>
                </div>
                <ul className="topic-list">
                  {materia.temas.map((tema, idx) => (
                    <li key={tema} className="topic-item">
                      <span className="topic-name">{tema}</span>
                      <button
                        className="btn-start-topic"
                        onClick={() => navigate(`/ejercicios/${materia.slug}/${idx}`)}
                      >
                        Practicar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'resultados' && <ResultadosView />}
      </main>

      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background-color: #f4f2fb;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }
        .main-content { flex: 1; padding: 40px 60px; overflow-y: auto; }
        .top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          background: white;
          padding: 16px 24px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(118,75,162,0.08);
        }
        .progress-banner {
          background: linear-gradient(135deg, #764ba2 0%, #9f7cd9 100%);
          color: white;
          padding: 24px;
          border-radius: 24px;
          margin-bottom: 32px;
          box-shadow: 0 12px 24px -8px rgba(118,75,162,0.3);
        }
        .progress-bar-container {
          height: 10px;
          background-color: rgba(255,255,255,0.3);
          border-radius: 20px;
          overflow: hidden;
        }
        .progress-fill { height: 100%; background-color: white; border-radius: 20px; }
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .module-card {
          background: white;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(118,75,162,0.1);
          transition: 0.2s;
          border: 1px solid #f0e8ff;
        }
        .module-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(118,75,162,0.15);
        }
        .icon-box { font-size: 3rem; margin-bottom: 16px; }
        .icon-box-sm { font-size: 2rem; }
        .ejercicio-bloque { background: white; border-radius: 24px; padding: 24px 28px; box-shadow: 0 8px 24px rgba(118,75,162,0.1); border: 1px solid #f0e8ff; margin-bottom: 24px; }
        .ejercicio-header { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
        .topic-list { list-style: none; padding: 0; margin: 0; }
        .topic-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #f0e8ff; background-color: #ffffff; border-radius: 12px; margin-bottom: 8px; transition: background 0.2s; }
        .topic-item:hover { background-color: #faf8ff; }
        .topic-name { font-size: 1rem; color: #2d1b45; text-align: left; }
        .btn-start-topic { background-color: #764ba2; color: white; border: none; border-radius: 30px; padding: 6px 16px; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s, transform 0.1s; box-shadow: 0 2px 8px rgba(118,75,162,0.2); line-height: 1.4; min-width: 90px; }
        .btn-start-topic:hover { background-color: #5f3b85; transform: scale(1.02); }
        .btn-card-action {
          background-color: #764ba2;
          color: white;
          border: none;
          border-radius: 40px;
          padding: 10px 24px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(118,75,162,0.3);
          width: 100%;
          justify-content: center;
        }
        .btn-card-action:hover { background-color: #5f3b85; transform: scale(1.02); }
        .btn-comenzar { max-width: 420px; padding: 14px 24px; font-size: 1rem; }
        .contenido-card { background: white; border-radius: 24px; padding: 40px 48px; box-shadow: 0 8px 24px rgba(118,75,162,0.1); border: 1px solid #f0e8ff; text-align: left; }
        .titulo-seccion { color: #1a1b3a; font-size: 1.6rem; margin: 0 0 12px; }
        .divisor { border: 0; border-top: 2px solid #ede8f8; margin-bottom: 24px; }
        .descripcion { color: #666; line-height: 1.7; margin-bottom: 28px; font-size: 1.02rem; }
        .reglas-list { padding-left: 20px; margin: 0; color: #333; line-height: 1.8; }
        .reglas-list li { margin-bottom: 10px; }
        .nota { margin-top: 16px; color: #999; font-size: 0.85rem; }
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .main-content { padding: 24px 20px; }
        }
      `}</style>
    </div>
  );
}

export default DashboardPage;