// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PerfilView from './ProfileView';
import Sidebar from '../components/Sidebar';

const materias = [
  { id: 1, nombre: "Aritmética", descripcion: "Numeración y Operaciones.", icon: "🧮", ruta: "/aritmetica" },
  { id: 2, nombre: "Álgebra", descripcion: "Ecuaciones y funciones.", icon: "🔣", ruta: "/algebra" },
  { id: 3, nombre: "Geometría y Medición", descripcion: "Figuras y ángulos.", icon: "🔷", ruta: "/geometria" },
  { id: 4, nombre: "Estadística y Probabilidad", descripcion: "Datos y azar.", icon: "📊", ruta: "/estadistica" }
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
        <header className="top-header">
          <div style={{ color: '#5a5a6e', fontWeight: 500 }}>
            {activeTab === 'perfil' && "Tu información personal y seguridad"}
            {activeTab === 'aprendizaje' && "Explora los módulos"}
            {activeTab === 'simulacion' && "Prueba tus conocimientos"}
            {activeTab === 'resultados' && "Historial de evaluaciones"}
          </div>
        </header>

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
          <div className="animate-fade-in" style={{ background: 'white', padding: 32, borderRadius: 24, textAlign: 'left' }}>
            <h2>Sección de Simulación</h2>
            <p>Próximamente podrás practicar con exámenes simulados.</p>
          </div>
        )}

        {activeTab === 'resultados' && (
          <div className="animate-fade-in" style={{ background: 'white', padding: 32, borderRadius: 24, textAlign: 'left' }}>
            <h2>Sección de Resultados</h2>
            <p>Aquí verás tu historial de calificaciones.</p>
          </div>
        )}
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