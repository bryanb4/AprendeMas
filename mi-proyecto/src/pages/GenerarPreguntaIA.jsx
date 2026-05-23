import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function QuestionGenerate() {
  const navigate = useNavigate();

  const [level, setLevel] = useState('Básico');

  const handleTabChange = (tab) => {
    navigate('/dashboard', { state: { activeTab: tab } });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        activeTab="aprendizaje"
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <div className="header">
          <h1>Admin Evaluation</h1>
          <span>Generación de Preguntas</span>
        </div>

        <div className="content-grid">

          {/* LEFT PANEL */}
          <div className="left-panel">

            <div className="card">
              <h2>⚙️ Configuración de IA</h2>

              <label>MATERIA</label>
              <select>
                <option>Seleccione materia</option>
              </select>

              <label>TEMA ESPECÍFICO</label>
              <select>
                <option>Seleccione tema</option>
              </select>

              <label>NIVEL DE COMPLEJIDAD</label>

              <div className="level-buttons">
                {['Básico', 'Medio', 'Avanzado'].map((item) => (
                  <button
                    key={item}
                    className={level === item ? 'active' : ''}
                    onClick={() => setLevel(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button className="generate-btn">
                ✨ Generar Pregunta con IA
              </button>
            </div>

            {/* HISTORIAL */}
            <div className="card">
              <div className="history-header">
                <h2>🕘 Historial</h2>
                <span>Ver todo</span>
              </div>

              <div className="history-item">
                <small>MATEMÁTICAS</small>
                <p>Resolución de Fracciones mixtas...</p>
              </div>

              <div className="history-item">
                <small>CIENCIAS</small>
                <p>Ciclo del Agua y Condensación</p>
              </div>

              <div className="history-item">
                <small>HISTORIA</small>
                <p>Revolución Industrial...</p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="preview-panel">
            <div className="preview-header">
              <div>
                <h2>👁️ Vista Previa</h2>
                <p>El contenido generado aparecerá aquí</p>
              </div>
            </div>

            <div className="preview-content">
              <div className="robot">🤖</div>

              <h2>Listo para Generar</h2>

              <p>
                Ajusta los parámetros a la izquierda y haz clic
                en el botón para generar contenido.
              </p>
            </div>
          </div>

        </div>
      </main>

      <style>{`
        .dashboard-layout{
          display:flex;
          min-height:100vh;
          background:#f5f3fb;
          font-family:'Segoe UI', sans-serif;
        }

        .main-content{
          flex:1;
          padding:30px;
        }

        .header{
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:30px;
        }

        .header h1{
          font-size:2rem;
          color:#1f1f3d;
          margin:0;
        }

        .header span{
          color:#7c59b0;
          font-weight:600;
        }

        .content-grid{
          display:grid;
          grid-template-columns:350px 1fr;
          gap:24px;
        }

        .left-panel{
          display:flex;
          flex-direction:column;
          gap:20px;
        }

        .card{
          background:white;
          border-radius:20px;
          padding:24px;
          box-shadow:0 4px 20px rgba(0,0,0,0.05);
        }

        .card h2{
          margin-top:0;
          color:#1f1f3d;
          margin-bottom:20px;
        }

        label{
          display:block;
          font-size:0.85rem;
          font-weight:700;
          margin-bottom:8px;
          margin-top:18px;
          color:#6f6685;
        }

        select{
          width:100%;
          padding:14px;
          border-radius:12px;
          border:1px solid #ddd;
          background:#f7f7fc;
          font-size:1rem;
        }

        .level-buttons{
          display:flex;
          gap:10px;
          margin-top:10px;
        }

        .level-buttons button{
          flex:1;
          padding:12px;
          border-radius:12px;
          border:1px solid #ccc;
          background:white;
          cursor:pointer;
          font-weight:600;
        }

        .level-buttons .active{
          background:#6f42c1;
          color:white;
          border:none;
        }

        .generate-btn{
          width:100%;
          margin-top:25px;
          padding:16px;
          border:none;
          border-radius:14px;
          background:#6f42c1;
          color:white;
          font-size:1rem;
          font-weight:700;
          cursor:pointer;
        }

        .preview-panel{
          background:white;
          border-radius:20px;
          overflow:hidden;
          box-shadow:0 4px 20px rgba(0,0,0,0.05);
        }

        .preview-header{
          padding:24px;
          border-bottom:1px solid #eee;
        }

        .preview-header h2{
          margin:0;
          color:#1f1f3d;
        }

        .preview-header p{
          margin-top:6px;
          color:#777;
        }

        .preview-content{
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          height:600px;
          text-align:center;
          padding:40px;
        }

        .robot{
          font-size:5rem;
          margin-bottom:20px;
        }

        .preview-content h2{
          color:#1f1f3d;
        }

        .preview-content p{
          color:#777;
          max-width:400px;
          line-height:1.6;
        }

        .history-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .history-header span{
          color:#6f42c1;
          cursor:pointer;
          font-weight:600;
        }

        .history-item{
          background:#f8f6fd;
          padding:14px;
          border-radius:14px;
          margin-top:14px;
        }

        .history-item small{
          color:#7c59b0;
          font-weight:700;
        }

        .history-item p{
          margin:8px 0 0;
          color:#222;
        }

        @media(max-width:1000px){
          .content-grid{
            grid-template-columns:1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default QuestionGenerate;