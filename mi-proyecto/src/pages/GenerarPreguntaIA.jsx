import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { BlockMath } from "react-katex";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { io } from "socket.io-client";

function QuestionGenerate() {
  const navigate = useNavigate();

  const [level, setLevel] = useState("Básico");
  const [tipoExamen, setTipoExamen] = useState("ejercicios");
  const [errorIA, setErrorIA] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [temas, setTemas] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState("");
  const [selectedTema, setSelectedTema] = useState("");
  const [preguntaGenerada, setPreguntaGenerada] = useState("");
  const [estadoTitulo, setEstadoTitulo] = useState("Listo para Generar");
  // connecting: apretón de manos en curso (neutral, sin rojo)
  // connected: listo | failed: error real tras reintentos
  const [connState, setConnState] = useState("connecting");
  const [connMotivo, setConnMotivo] = useState(null);
  const [socketKey, setSocketKey] = useState(0);
  const [msgGuardado, setMsgGuardado] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const timerRef = useRef(null);

  const iniciarTimer = () => {
    setGenerando(true);
    setSegundos(0);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSegundos((s) => s + 1), 1000);
  };

  const detenerTimer = () => {
    setGenerando(false);
    clearInterval(timerRef.current);
  };

  const master = useRef(null);

  useEffect(() => {
    // autoConnect:false + connect() explícito: cada montaje abre una
    // conexión nueva de forma determinística (sin depender de la caché
    // interna del manager, que quedaba colgada al salir y volver).
    const socket = io("http://localhost:3001", { autoConnect: false });
    master.current = socket;
    let intentos = 0;
    let reintentoTimer = null;
    let montado = true;

    const programarReintento = () => {
      clearTimeout(reintentoTimer);
      intentos += 1;
      if (intentos >= 3) {
        if (montado) {
          setConnMotivo(
            "No se pudo contactar al Master en :3001 tras 3 intentos. Verifica que 'npm run master' y 'npm run worker' estén corriendo.",
          );
          setConnState("failed");
        }
        return;
      }
      reintentoTimer = setTimeout(() => {
        if (montado) socket.connect();
      }, 1200 * intentos);
    };

    socket.on("connect", () => {
      intentos = 0;
      clearTimeout(reintentoTimer);
      if (!montado) return;
      setConnMotivo(null);
      setConnState("connected");
    });
    socket.on("disconnect", (reason) => {
      // Expulsión del servidor (ej. rechazo): no reintentar a ciegas
      if (reason === "io server disconnect") {
        if (montado) setConnState("failed");
        return;
      }
      if (montado) setConnState("connecting");
    });
    socket.on("connect_error", () => {
      if (montado) setConnState("connecting");
      programarReintento();
    });

    socket.on("no_autorizado", (info) => {
      clearTimeout(reintentoTimer);
      if (!montado) return;
      setConnMotivo(
        "Sesión no válida como admin (" +
          ((info && info.message) || "sin token") +
          "). Vuelve a iniciar sesión.",
      );
      setConnState("failed");
    });

    socket.on("errorIA", (info) => {
      detenerTimer();
      setErrorIA((info && info.message) || "El worker IA no respondió");
    });

    socket.on("preguntaGuardada", (info) => {
      setMsgGuardado(`✅ Pregunta guardada con ID #${info && info.id}.`);
      setPreguntaGenerada("");
    });

    socket.on("errorGuardado", (info) => {
      setMsgGuardado(null);
      setErrorIA((info && info.message) || "No se pudo guardar la pregunta");
    });

    socket.emit("registro", {
      rol: "front-admin",
      token: localStorage.getItem("token"),
    });

    socket.connect();

    return () => {
      montado = false;
      clearTimeout(reintentoTimer);
      socket.removeAllListeners();
      socket.disconnect();
      clearInterval(timerRef.current);
      if (master.current === socket) master.current = null;
    };
  }, [socketKey]);

  const reintentarConexion = () => {
    setErrorIA(null);
    setConnMotivo(null);
    setConnState("connecting");
    setSocketKey((k) => k + 1);
  };

  const enviarOrdenGenPregunta = () => {
    const materia = materias.find(
      (m) => m.id === parseInt(selectedMateria),
    ).nombre;
    const tema = temas.find((t) => t.id === parseInt(selectedTema)).nombre;
    const datos = {
      subject: materia,
      topic: tema,
      level: level,
      tipo: tipoExamen,
    };
    setErrorIA(null);
    setMsgGuardado(null);
    setPreguntaGenerada("");
    setEstadoTitulo("Generando con IA...");
    iniciarTimer();
    master.current.emit("GenerarPregunta", datos);
  };

  const handleTabChange = (tab) => {
    navigate("/dashboard", { state: { activeTab: tab } });
  };

  const fetchTopics = async (materiaId) => {
    master.current.emit("obtenerTemasBD", materiaId);
  };

  const fetchMaterias = async () => {
    master.current.emit("obtenerMateriasBD");
  };

  const buildDatosGuardar = (status) => {
    const nivel = {
      Basico: 400,
      Medio: 800,
      Avanzado: 1200,
    };
    const mat = materias.find(
      (m) => m.nombre === preguntaGenerada.materia_solicitada,
    );
    const tem = temas.find(
      (t) => t.nombre === preguntaGenerada.tema_solicitado,
    );
    if (!mat || !tem) {
      setErrorIA(
        "No se pudo guardar: la materia o el tema ya no están en la lista. Vuelve a seleccionar y genera de nuevo.",
      );
      return null;
    }
    return {
      materia_solicitada: mat.id,
      tema_solicitado: tem.id,
      nivel_solicitado: nivel[preguntaGenerada.nivel_solicitado] || 800,
      status,
      tipo: preguntaGenerada.tipo || "ejercicios",
      pregunta: preguntaGenerada.pregunta,
      opciones: preguntaGenerada.opciones,
      respuesta_correcta: preguntaGenerada.respuesta_correcta,
      explicacion: preguntaGenerada.explicacion,
    };
  };

  const sendQuestion = async () => {
    const datos = buildDatosGuardar("arppoved");
    if (!datos) return;
    setMsgGuardado("Guardando...");
    master.current.emit("guardarPreguntaBD", datos);
  };

  const sendQuestionPending = async () => {
    const datos = buildDatosGuardar("pending_review");
    if (!datos) return;
    setMsgGuardado("Guardando...");
    master.current.emit("guardarPreguntaBD", datos);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    // Se captura el socket en una constante local: la limpieza usa ESTA
    // instancia y nunca el ref compartido (que la otra limpieza pone en null).
    const socket = master.current;
    if (!socket) return;
    fetchMaterias();
    socket.on("preguntaGenerada", (data) => {
      console.log("Pregunta recibida");

      setErrorIA(null);
      setEstadoTitulo("Listo para Generar");
      detenerTimer();
      setPreguntaGenerada(data);
    });

    socket.on("materiasObtenidasBD", (data) => {
      setMaterias(data);
    });

    socket.on("temasObtenidosBD", (data) => {
      setTemas(data);
    });

    return () => {
      socket.off("preguntaGenerada");
      socket.off("materiasObtenidasBD");
      socket.off("temasObtenidosBD");
    };
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

              <label>ÁREA DE ESTUDIO</label>
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

              <label>TIPO DE REACTIVO</label>

              <div className="level-buttons">
                {[
                  { id: "ejercicios", label: "Ejercicios" },
                  { id: "evaluacion", label: "Examen Evaluación" },
                  { id: "simulacion", label: "Examen Simulación" },
                ].map((item) => (
                  <button
                    key={item.id}
                    className={tipoExamen === item.id ? "active" : ""}
                    onClick={() => setTipoExamen(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                className="generate-btn"
                disabled={generando}
                onClick={() => {
                  if (selectedTema && selectedMateria && !generando) {
                    enviarOrdenGenPregunta();
                  }
                }}
              >
                {generando ? `Generando... ${segundos}s` : "Generar Pregunta con IA"}
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="card">
            {connState === "failed" ? (
              <div className="preview-content" style={{ minHeight: "400px" }}>
                <h2 style={{ color: "#e03939" }}>⚠️ Sin conexión</h2>
                <p>{connMotivo || "El servidor de IA no está disponible."}</p>
                <button className="generate-btn" onClick={reintentarConexion}>
                  Reintentar conexión
                </button>
              </div>
            ) : connState === "connecting" ? (
              <div className="preview-content" style={{ minHeight: "400px" }}>
                <h2 style={{ color: "#6f42c1" }}>Conectando al servidor IA…</h2>
                <p style={{ fontSize: "0.85rem", color: "#999" }}>
                  Estableciendo canal con el Master en el puerto 3001.
                </p>
              </div>
            ) : !preguntaGenerada ? (
              <>
                <div className="preview-header">
                  <div>
                    <h2>Vista Previa</h2>
                    <p>El contenido generado aparecerá aquí</p>
                  </div>
                </div>

                <div className="preview-content">
                  <h2>{estadoTitulo}</h2>

                  {errorIA && (
                    <p style={{ color: "#e03939", fontWeight: 600 }}>
                      ⚠️ {errorIA}
                    </p>
                  )}

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
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {opcion}
                          </ReactMarkdown>
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
                  {msgGuardado && (
                    <p style={{ color: "#fff", fontWeight: 600, gridColumn: "1 / -1", margin: 0 }}>
                      {msgGuardado}
                    </p>
                  )}
                  <div className="">
                    <button
                      className="boton-aprobar"
                      onClick={() => {
                        sendQuestion();
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
