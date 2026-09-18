// src/components/Sidebar.jsx
import React from 'react';

function Sidebar({ activeTab, onTabChange, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo sidebar-logo-click" onClick={() => onTabChange('aprendizaje')} title="Ir a Aprendizaje">🎓 Aprende<span className="logo-plus">+</span></div>
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
          className={`menu-item ${activeTab === 'ejercicios' ? 'active' : ''}`}
          onClick={() => onTabChange('ejercicios')}
        >
          <span>✏️</span> Ejercicios
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
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .sidebar-logo-click { cursor: pointer; user-select: none; }
        .sidebar-logo-click:hover { opacity: 0.9; }
        .sidebar-logo-click:hover .logo-plus { transform: rotate(-4deg) scale(1.08); }
        .logo-plus {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 34px;
          height: 34px;
          padding: 0 4px;
          margin-left: 6px;
          border-radius: 12px;
          background: linear-gradient(135deg, #c77dff 0%, #9f7cd9 100%);
          color: #2D1B4E;
          font-size: 28px;
          font-weight: 900;
          line-height: 1;
          box-shadow: 0 4px 14px rgba(199,125,255,0.55), inset 0 1px 0 rgba(255,255,255,0.6);
          transform: rotate(-4deg);
          transition: transform 0.2s;
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