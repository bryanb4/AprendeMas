import React, { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { BlockMath } from "react-katex";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

function QuestionGenerate() {
  const navigate = useNavigate();

  const [level, setLevel] = useState("Básico");
  const [materias, setMaterias] = useState([]);
  const [temas, setTemas] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState("");
  const [selectedTema, setSelectedTema] = useState("");
  const [preguntaGenerada, setPreguntaGenerada] = useState("");
  const [estadoTitulo, setEstadoTitulo] = useState("Listo para Generar");
  const [primeras3preg, setPrimeras3preg] = useState([]);

  const handleTabChange = (tab) => {
    navigate("/dashboard", { state: { activeTab: tab } });
  };

  const fetch3Preg = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/ia/primerasPreguntas`,
      );
      const data = await response.json();
      setPrimeras3preg(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTopics = async (materiaId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/materias/${materiaId}/temas`,
      );
      const data = await response.json();
      setTemas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMaterias = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/materias`);
      const data = await response.json();
      setMaterias(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getIAQuestion = async () => {
    const materia = materias.find(
      (m) => m.id === parseInt(selectedMateria),
    ).nombre;
    const tema = temas.find((t) => t.id === parseInt(selectedTema)).nombre;
    const datos = {
      subject: materia,
      topic: tema,
      level: level,
    };

    console.log(JSON.stringify(datos));
    try {
      const response = await fetch(`http://localhost:5000/api/ia/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const data = await response.json();
      console.log(data);
      setPreguntaGenerada(data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendQuestion = async () => {
    const nivel = {
      Basico: 400,
      Medio: 800,
      Avanzado: 1200,
    };
    const datos = {
      materia_solicitada: materias.find(
        (m) => m.nombre === preguntaGenerada.materia_solicitada,
      ).id,
      tema_solicitado: temas.find(
        (t) => t.nombre === preguntaGenerada.tema_solicitado,
      ).id,
      nivel_solicitado: nivel[preguntaGenerada.nivel_solicitado],
      status: "arppoved",
      pregunta: preguntaGenerada.pregunta,
      opciones: preguntaGenerada.opciones,
      respuesta_correcta: preguntaGenerada.respuesta_correcta,
      explicacion: preguntaGenerada.explicacion,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/ia/guardarPregunta`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        },
      );
      const result = await response.json();
      alert('Guardado correctamente');
    } catch (error) {
      console.log(error);
    }
  };

  const sendQuestionPending = async () => {
    const nivel = {
      Basico: 400,
      Medio: 800,
      Avanzado: 1200,
    };
    const datos = {
      materia_solicitada: materias.find(
        (m) => m.nombre === preguntaGenerada.materia_solicitada,
      ).id,
      tema_solicitado: temas.find(
        (t) => t.nombre === preguntaGenerada.tema_solicitado,
      ).id,
      nivel_solicitado: nivel[preguntaGenerada.nivel_solicitado],
      status: "pending_review",
      pregunta: preguntaGenerada.pregunta,
      opciones: preguntaGenerada.opciones,
      respuesta_correcta: preguntaGenerada.respuesta_correcta,
      explicacion: preguntaGenerada.explicacion,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/ia/guardarPregunta`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        },
      );
      const result = await response.json();
      alert('Guardado para revision correctamente');
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchMaterias();
    fetch3Preg();
  }, []);
  return (
    <div className="dashboard-layout">
      <Sidebar
        activeTab="aprendizaje"
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <div className="header">
          <h1>Panel de Administracion </h1>
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
                  if (materiaId) {
                    fetchTopics(materiaId);

                    console.log(materias);
                  }
                }}
              >
                <option value="">Selecciona una materia</option>

                {materias.map((materia) => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nombre}
                  </option>
                ))}
              </select>

              <label>TEMA ESPECÍFICO</label>
              <select
                value={selectedTema}
                onChange={(e) => {
                  const temaId = e.target.value;
                  setSelectedTema(temaId);
                }}
              >
                <option value="">Seleccione tema</option>

                {temas.map((tema) => (
                  <option key={tema.id} value={tema.id}>
                    {tema.nombre}
                  </option>
                ))}
              </select>

              <label>NIVEL DE COMPLEJIDAD</label>

              <div className="level-buttons">
                {["Basico", "Medio", "Avanzado"].map((item) => (
                  <button
                    key={item}
                    className={level === item ? "active" : ""}
                    onClick={() => setLevel(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button
                className="generate-btn"
                onClick={() => {
                  if (selectedTema && selectedMateria) {
                    getIAQuestion();
                  }
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
          <div className="card">
            {!preguntaGenerada ? (
              <>
                <div className="preview-header">
                  <div>
                    <h2>Vista Previa</h2>
                    <p>El contenido generado aparecerá aquí</p>
                  </div>
                </div>

                <div className="preview-content">
                  <h2> Listo para Generar</h2>

                  <p>
                    Ajusta los parámetros a la izquierda y haz clic en el botón
                    para generar contenido.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="preview-header">
                  <div className="grid-dosElementos">
                    <div>
                      <h2>Vista Previa</h2>
                      <p>El contenido generado aparecerá aquí</p>
                    </div>
                    <button
                      className="boton-eliminar"
                      onClick={() => setPreguntaGenerada(null)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trash-icon lucide-trash"
                      >
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="preview-content">
                  <h2>Pregunta Generada</h2>
                  <div className="header">
                    <small>Pregunta: </small>

                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {preguntaGenerada.pregunta}
                    </ReactMarkdown>
                  </div>
                  <div
                    className="question-card2 "
                    style={{ background: "#6D3FD1" }}
                  >
                    <small>Explicacion: </small>
                    <div className="option-card">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {preguntaGenerada.explicacion}
                      </ReactMarkdown>
                    </div>
                    <div className="question-card">
                      <small>Opciones: </small>
                      {preguntaGenerada.opciones.map((opcion) => (
                        <div className="option-card" key={opcion}>
                          <p>{opcion}</p>
                        </div>
                      ))}
                      <div className="preview-respuesta">
                        <small>Resupuesta Correcta</small>
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {preguntaGenerada.respuesta_correcta}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-grid-buttons">
                  <div className="">
                    <button
                      className="boton-aprobar"
                      onClick={() => {
                        sendQuestion();
                        setPreguntaGenerada(null);
                      }}
                    >
                      Aprobar y Guardar
                    </button>
                  </div>
                  <div className="">
                    <button
                      className="boton-aprobar boton-marcar
                    "
                      onClick={() => {
                        sendQuestionPending();
                        setPreguntaGenerada(null);
                      }}
                    >
                      Marcar para revision
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <style>{`

        .boton-eliminar{
          justify-self: end;
          border-radius:10px;
          background: #e03939ce;
          cursor:pointer;
        }

        .grid-dosElementos{
          display:grid;
          grid-template-columns: 1fr auto ;
          gap:24px;
        }
        

        .preview-respuesta{
          background: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border-bottom:1px solid #eee;
        }

        .boton-aprobar{
          width:100%;
          padding:16px;
          border:none;
          border-radius:14px;
          background: #FFFFFF;
          color: #6D3FD1;
          font-size:1rem;
          font-weight:700;
          cursor:pointer;
        }
          
          .boton-aprobar:hover{
          background:#7C3AED;
          color: white;
        }

        .boton-marcar{
          background: #c0b4e9;
          color: #5B21B6;
        }

        .boton-marcar:hover{
          background: #8B5CF6;
          color: white;
        }

        .content-grid-buttons{
          background: #6D3FD1;
          display:grid;
          grid-template-columns: 1fr 1fr; 
          border-radius:14px;
          padding: 20px;
          gap:10px;
        }

        .columna-botones{
          background: black;
          min-height:100vh;
          font-family:'Segoe UI', sans-serif;
        }

      
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

        .question-card2{
          background:#f8f6fd;
          padding:14px;
          border-radius:14px;
          margin-top:14px;
        }
          .question-card2 small{
          color:white;
          font-weight:700;
        }

        .option-card{
          background: white;
          border-radius:14px;
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
          margin-bottom:15px;
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
          grid-template-columns: 1fr 1fr ;
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
          border-radius:20px;
          display:flex;
          flex-direction: column;
          overflow:hidden;
        }

        .preview-header{
          background: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          padding:20px;
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
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          background: white;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding:10px;
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
          padding: 15px;
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
