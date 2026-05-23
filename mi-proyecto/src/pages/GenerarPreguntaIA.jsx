import React, { useState, useEffect} from 'react';
import { data, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function QuestionGenerate() {
  const navigate = useNavigate();

  const [level, setLevel] = useState('Básico');
  const [materias, setMaterias] = useState([]);
  const [temas, setTemas] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState('');
  const [selectedTema, setSelectedTema] = useState('');
  const [preguntaGenerada, setPreguntaGenerada] = useState('');
  const [estadoTitulo, setEstadoTitulo] = useState('Listo para Generar');

  const [opcionesGeneradas, setOpcionesGeneradas] = useState([]);
  const [respuestaGenerada, setRespuestaGenerada] = useState('');
  const [explicacionGenerada, setExplicacionGenerada] = useState('');

  const hardcodeinfo = {materia_solicitada: "Matematicas",
    tema_solicitado: "Exponentes",
    nivel_solicitado: "Avanzado",
    pregunta: "Si $ (5^{2})^{x} = 125^{x+1}$, ¿cuál es el valor de $x$?",
    opciones: [
        "-3",
        "-2",
        "3",
        "0"
    ],
    respuesta_correcta: "-3",
    explicacion: "Primero expresamos ambos lados con la misma base. \n\n- Lado izquierdo: $ (5^{2})^{x}=5^{2x}$.\n- Lado derecho: $125^{x+1}= (5^{3})^{x+1}=5^{3(x+1)}=5^{3x+3}$.\n\nComo las bases son iguales ($5$), los exponentes deben ser iguales:\n$$2x = 3x + 3.$$ \nRestando $3x$ a ambos lados obtenemos $-x = 3$, por lo que $x = -3$.\n\nAsí, la única respuesta correcta es $-3$."};


  const handleTabChange = (tab) => {
    navigate('/dashboard', { state: { activeTab: tab } });
  };

  const fetchTopics = async (materiaId) => {
  try {
    const response = await fetch(
         `http://localhost:5000/api/auth/materias/${materiaId}/temas`
        );
    const data = await response.json();
    setTemas(data);
    } catch (error) {
        console.error(error);
    }
};

const fetchMaterias = async () => {
    try{
        const response = await fetch (`http://localhost:5000/api/auth/materias`);
        const data = await response.json();
        setMaterias(data);
        
    }catch(error){
        console.log(error);
    }
}

const getIAQuestion = async () => {
  const materia = materias.find(m => m.id === parseInt(selectedMateria)).nombre;
  const tema = temas.find(t => t.id === parseInt(selectedTema)).nombre;
  const datos = {
    subject: materia,
    topic: tema,
    level: level
  }

  console.log(JSON.stringify(datos));
  try{
    const response = await fetch(`http://localhost:5000/api/ia/generate`, {
      method: 'POST',
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify(datos)
    });
    const data = await response.json();
    setPreguntaGenerada(data);

  }catch(error){
    console.log(error);
  }
}


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect (() => {fetchMaterias()}, []);
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
              <h2>Configuración de IA</h2>

              <label>MATERIA</label>
              <select 
              value={selectedMateria} 
              onChange={(e) => {
                const materiaId = e.target.value;
                setSelectedMateria(materiaId);
                if (materiaId){
                fetchTopics(materiaId);}
                }}>
                  <option value="">
                        Selecciona una materia
                    </option>
                  
                  {materias.map((materia) => (
                <option key={materia.id} value={materia.id} >
                    {materia.nombre}</option>
                ))}
                </select>

              <label>TEMA ESPECÍFICO</label>
              <select
              value={selectedTema}
              onChange={(e)=> {
                const temaId = e.target.value;
                setSelectedTema(temaId);
              }}>
                <option value="">Seleccione tema</option>

                {temas.map((tema) => (
                  <option key = {tema.id} value = {tema.id} >
                    {tema.nombre}
                  </option>
                ))}
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

              <button className="generate-btn"
               onClick={() => {
              //   if (selectedTema && selectedMateria){
              //   getIAQuestion()
              //   setEstadoTitulo("Pregunta Generada")
              // }
              setEstadoTitulo("Pregunta Generada")
              setPreguntaGenerada(hardcodeinfo.pregunta)  
              setExplicacionGenerada(hardcodeinfo.explicacion)
              setOpcionesGeneradas(hardcodeinfo.opciones)
              setRespuestaGenerada(hardcodeinfo.respuesta_correcta)
            
            }}
              >
                Generar Pregunta con IA
              </button>
            </div>

            {/* HISTORIAL */}
            <div className="card">
              <div className="history-header">
                <h2> Historial</h2>
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
            { !preguntaGenerada ? (
              <>
              <div className="preview-header">
              <div>
                <h2>Vista Previa</h2>
                <p>El contenido generado aparecerá aquí</p>
              </div>
            </div>

            <div className="preview-content">
              <h2>{estadoTitulo}</h2>

              <p>
                Ajusta los parámetros a la izquierda y haz clic en el botón para generar contenido.
              </p>
            </div>
              </>
              
            ) : ( 
              <>
              <div className="preview-content">
              <h2>{estadoTitulo}</h2>
              <div className='question-card'>
                <small>Pregunta: </small>
                <p>{preguntaGenerada} </p>

              </div>
            </div>
              </>
            ) }
            
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
        
        .question-card{
          background:#f8f6fd;
          padding:14px;
          border-radius:14px;
          margin-top:14px;
        }
        
        .question-card small{
          color:#7c59b0;
          font-weight:700;
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