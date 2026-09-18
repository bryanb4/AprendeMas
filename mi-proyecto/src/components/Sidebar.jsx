// src/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function getStoredRol() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.rol || 'alumno';
  } catch {
    return 'alumno';
  }
}

function Sidebar({ activeTab, onTabChange, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = getStoredRol() === 'admin';
  const path = location.pathname;
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">🎓 ExamenDone</div>
      <ul className="sidebar-menu">
        <li
          className={`menu-item ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => onTabChange('perfil')}
        >
          <span>👤</span> Perfil
        </li>
        <li
          className={`menu-item ${activeTab === 'aprendizaje' ? 'active' : ''}`}
          onClick={() => onTabChange('aprendizaje')}
        >
          <span>📖</span> Aprendizaje
        </li>
        <li
          className={`menu-item ${activeTab === 'simulacion' ? 'active' : ''}`}
          onClick={() => onTabChange('simulacion')}
        >
          <span>📝</span> Examen simulación
        </li>
        <li
          className={`menu-item ${activeTab === 'resultados' ? 'active' : ''}`}
          onClick={() => onTabChange('resultados')}
        >
          <span>🏆</span> Resultados
        </li>
        {isAdmin && (
          <>
            <li
              className={`menu-item ${path === '/adminIA' ? 'active' : ''}`}
              onClick={() => navigate('/adminIA')}
            >
              <span>🤖</span> Generador IA
            </li>
            <li
              className={`menu-item ${path === '/adminTabla' ? 'active' : ''}`}
              onClick={() => navigate('/adminTabla')}
            >
              <span>🗂</span> Banco preguntas
            </li>
          </>
        )}
        <li className="menu-item" onClick={onLogout} style={{ marginTop: '650px' }}>
          <span>🚪</span> Cerrar sesión
        </li>
      </ul>

      <style>{`
        .sidebar {
          width: 260px;
          min-width: 260px;
          flex-shrink: 0;
          background-color: #2D1B4E;  /* Morado oscuro vibrante */
          border-right: 1px solid #6a11cb40;  /* Borde sutil morado */
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          box-shadow: 4px 0 20px rgba(106, 17, 203, 0.15);  /* Sombra morada */
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }
        .sidebar-logo {
          padding: 0 24px 24px 24px;
          font-size: 22px;
          font-weight: 700;
          color: #f0e6ff;
          border-bottom: 2px solid #6a11cb60;
          margin-bottom: 20px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .menu-item {
          padding: 14px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #e0d0ff;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          border-left: 4px solid transparent;
          font-size: 1rem;
        }
        .menu-item span:first-child {
          font-size: 1.3rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }
        .menu-item:hover {
          background-color: #4A2E8B;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(106, 17, 203, 0.3);
          transform: translateX(2px);
        }
        .menu-item.active {
          background: linear-gradient(90deg, #6a11cb 0%, #8a50c9 100%);
          color: white;
          border-left-color: #c77dff;
          box-shadow: 0 4px 12px rgba(106, 17, 203, 0.4);
          font-weight: 600;
        }
      `}</style>
    </aside>
  );
}

export default Sidebar;