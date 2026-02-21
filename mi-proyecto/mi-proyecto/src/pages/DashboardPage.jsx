// src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PerfilView from './ProfileView';

function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('aprendizaje');
  const [selectedSubject, setSelectedSubject] = useState(null);

  const materias = [
    { id: 1, nombre: "Aritmética", descripcion: "Numeración y Operaciones.", icon: "🧮", progreso: "0%", temas: ["Números reales...", "Potencias enteras positivas y leyes de exponentes...", "Raíz cuadrada...", "Operaciones..."] },
    { id: 2, nombre: "Álgebra", descripcion: "Ecuaciones y funciones.", icon: "🔣", progreso: "0%", temas: ["Expresiones algebraicas, ecuaciones e inecuaciones en una variable...", "Ecuaciones lineales en varias variables...", "Polinomios...", "Factorización de polinomios...","Expresiones algebraicas racionales o fracciones algebraicas...","Ecuaciones cuadráticas...","El plano cartesiano...","Funciones y sus gráficas...","Sistemas de ecuaciones lineales en dos variables..."] },
    { id: 3, nombre: "Geometría y Medición", descripcion: "Figuras y ángulos.", icon: "🔷", progreso: "0%", temas: ["Ángulos y triángulos...", "Rectas paralelas cortadas por una secante...", "Congruencia y semejanza...", "Teorema de Pitágoras y triángulos especiales...","Círculos...","Sólidos...","Perímetro, área y volumen..."] },
    { id: 4, nombre: "Estadística y Probabilidad", descripcion: "Datos y azar.", icon: "📊", progreso: "0%", temas: ["Tablas y gráficas...", "Medidas de tendencia central de datos...", "Probabilidad de un evento...","Espacio muestral..."] }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate(0);
  };

  const handleStartTopic = (subject, topic) => {
    console.log(`Comenzando tema: ${topic} de ${subject.nombre}`);
    // Aquí puedes navegar a la pantalla de estudio del tema
  };



  return (
    <div className="dashboard-layout">
      {/* Estilos locales para mantener consistencia */}
      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          background-color: #f5f0ff;
        }
        .sidebar {
          width: 260px;
          background-color: #1B1D38;
          border-right: 1px solid #e2d6ff;
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          box-shadow: 4px 0 12px rgba(50, 0, 100, 0.05);
        }
        .sidebar-logo {
          padding: 0 24px 24px 24px;
          font-size: 22px;
          font-weight: 700;
          color: #white;
          border-bottom: 2px solid #1B1D38;
          margin-bottom: 20px;
        }
        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
          flex: 1;
        }
        .menu-item {
          padding: 14px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #ffffff;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 4px solid transparent;
        }
        .menu-item span {
          font-size: 1.2rem;
        }
        .menu-item:hover {
          background-color: #ffffff;
          color: #40548b;
        }
        .menu-item.active {
          background-color: #9e6d6d;
          color: #cdc6d4;
          border-left-color: #653992;
          font-weight: 600;
        }
        .main-content {
          flex: 1;
          padding: 24px 32px;
          overflow-y: auto;
        }
        .top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          background: white;
          padding: 16px 24px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(118, 75, 162, 0.08);
        }
        .progress-banner {
          background: linear-gradient(135deg, #764ba2 0%, #9f7cd9 100%);
          color: white;
          padding: 24px;
          border-radius: 24px;
          margin-bottom: 32px;
          box-shadow: 0 12px 24px -8px rgba(118, 75, 162, 0.3);
        }
        .progress-bar-container {
          height: 10px;
          background-color: rgba(255,255,255,0.3);
          border-radius: 20px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background-color: white;
          border-radius: 20px;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .module-card {
          background: white;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(118, 75, 162, 0.1);
          transition: 0.2s;
          border: 1px solid #f0e8ff;
        }
        .module-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(118, 75, 162, 0.15);
        }
        .icon-box {
          font-size: 3rem;
          margin-bottom: 16px;
        }
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
          box-shadow: 0 4px 12px rgba(118, 75, 162, 0.3);
        }
        .btn-card-action:hover {
          background-color: #5f3b85;
          transform: scale(1.02);
        }
        .subject-detail-view {
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 12px 28px rgba(118, 75, 162, 0.15);
        }
        .subject-detail-view h1 {
          margin-top: 0;
          margin-bottom: 24px;
          color: #1a1b3a;
          font-weight: 700;
          font-size: 2rem;
          border-bottom: 3px solid #764ba2;
          padding-bottom: 12px;
        }
        .topic-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .topic-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #f0e8ff;
          background-color: #ffffff;
          border-radius: 12px;
          margin-bottom: 4px;
          transition: background 0.2s;
        }
        .topic-item:hover {
          background-color: #faf8ff;
        }
        .topic-name {
          font-size: 1.1rem;
          color: #2d1b45;
          text-align: left;
        }
        .btn-start-topic {
          background-color: #764ba2;
          color: white;
          border: none;
          border-radius: 30px;
          padding: 6px 16px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
          box-shadow: 0 2px 8px rgba(118, 75, 162, 0.2);
          line-height: 1.4;
          min-width: 80px;
        }
        .btn-start-topic:hover {
          background-color: #5f3b85;
          transform: scale(1.02);
        }
        .back-button {
          background: none;
          border: none;
          color: #764ba2;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          padding: 8px 16px;
          border-radius: 40px;
          transition: 0.2s;
        }
        .back-button:hover {
          background-color: #f4f0fc;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Barra lateral */}
      <aside className="sidebar">
        <div className="sidebar-logo">🎓 ExamenDone</div>
        <ul className="sidebar-menu">
          <li className={`menu-item ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>
            <span>👤</span> Perfil
          </li>
          <li className={`menu-item ${activeTab === 'aprendizaje' ? 'active' : ''}`} onClick={() => { setActiveTab('aprendizaje'); setSelectedSubject(null); }}>
            <span>📖</span> Aprendizaje
          </li>
          <li className={`menu-item ${activeTab === 'simulacion' ? 'active' : ''}`} onClick={() => setActiveTab('simulacion')}>
            <span>📝</span> Examen simulación
          </li>
          <li className={`menu-item ${activeTab === 'resultados' ? 'active' : ''}`} onClick={() => setActiveTab('resultados')}>
            <span>🏆</span> Resultados
          </li>
          <li className="menu-item" style={{ marginTop: 'auto' }} onClick={handleLogout}>
            <span>🚪</span> Cerrar sesión
          </li>
        </ul>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">
        <header className="top-header">
          <div style={{ color: '#5a5a6e', fontWeight: 500 }}>
            {activeTab === 'perfil' && "Tu información personal y seguridad"}
            {activeTab === 'aprendizaje' && !selectedSubject && "Explora los módulos"}
            {activeTab === 'aprendizaje' && selectedSubject && `Estudiando: ${selectedSubject.nombre}`}
            {activeTab === 'simulacion' && "Prueba tus conocimientos"}
            {activeTab === 'resultados' && "Historial de evaluaciones"}
          </div>
          <div></div>
        </header>

        {activeTab === 'perfil' && <PerfilView />}

        {activeTab === 'aprendizaje' && (
          <>
            {!selectedSubject ? (
              <div className="animate-fade-in">
                <section className="progress-banner">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ fontSize: '2rem' }}>📖</div>
                    <div>
                      <h2 style={{ margin: 0 }}>Tu Progreso General</h2>
                      <p style={{ margin: 0, opacity: 0.9 }}>Sigue avanzando</p>
                    </div>
                  </div>
                  <div className="progress-bar-container" style={{marginTop: '20px'}}>
                    <div className="progress-fill" style={{ width: '0%' }}></div>
                  </div>
                </section>

                <div className="cards-grid">
                  {materias.map((materia) => (
                    <div key={materia.id} className="module-card">
                      <div className="icon-box">{materia.icon}</div>
                      <h3 style={{ marginBottom: 8 }}>{materia.nombre}</h3>
                      <p style={{ color: '#666', marginBottom: 20 }}>{materia.descripcion}</p>
                      <button className="btn-card-action" onClick={() => setSelectedSubject(materia)}>
                        Continuar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="subject-detail-view animate-fade-in">
                <button className="back-button" onClick={() => setSelectedSubject(null)}>
                  ⬅ Volver a los módulos
                </button>
                <h1>{selectedSubject.nombre}</h1>
                <ul className="topic-list">
                  {selectedSubject.temas.map((tema, index) => (
                    <li key={index} className="topic-item">
                      <span className="topic-name">{tema}</span>
                      <button className="btn-start-topic" onClick={() => handleStartTopic(selectedSubject, tema)}>
                        Comenzar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
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
    </div>
  );
}

export default DashboardPage;