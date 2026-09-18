import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Sidebar from "../components/Sidebar";

function PaginaTablas() {
  const navigate = useNavigate();
  const handleTabChange = (tab) => {
    navigate("/dashboard", { state: { activeTab: tab } });
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  const master = useRef(null);
  const [preguntas, setPreguntas] = useState([]);
  const [authError, setAuthError] = useState(null);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [informacionEditada, setinformacionEditada] = useState(null);
  const [socketKey, setSocketKey] = useState(0);
  const [connState, setConnState] = useState("connecting");
  const [connMotivo, setConnMotivo] = useState(null);
  const [filtro, setFiltro] = useState("todas");

  const esPendiente = (status) => status === "pending_review";
  const etiquetaEstado = (status) => (esPendiente(status) ? "Pendiente" : "Aprobada");
  const claseEstado = (status) =>
    esPendiente(status) ? "clase-pending" : "clase-aprobado";
  const nombreNivel = (nivel) =>
    ({ 400: "Básico", 800: "Medio", 1200: "Avanzado" })[Number(nivel)] || "—";
  const etiquetaTipo = (tipo) =>
    ({ ejercicios: "Ejercicios", evaluacion: "Evaluación", simulacion: "Simulación" })[tipo] || (tipo || "—");

  const totalPendientes = preguntas.filter((p) => esPendiente(p.status)).length;
  const visibles = preguntas.filter((p) => {
    if (filtro === "pendientes") return esPendiente(p.status);
    if (filtro === "aprobadas") return !esPendiente(p.status);
    return true;
  });
  useEffect(() => {
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
            "No se pudo contactar al Master en :3001 tras 3 intentos. Verifica que 'npm run master' esté corriendo.",
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
      setAuthError(null);
      setConnState("connected");
    });
    socket.on("disconnect", (reason) => {
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

    socket.emit("registro", {
      rol: "front-admin",
      token: localStorage.getItem("token"),
    });

    socket.on("no_autorizado", (info) => {
      clearTimeout(reintentoTimer);
      if (!montado) return;
      setAuthError(
        "Sesión no válida como admin (" +
          ((info && info.message) || "sin token") +
          "). Vuelve a iniciar sesión.",
      );
      setConnState("failed");
    });

    socket.connect();

    return () => {
      montado = false;
      clearTimeout(reintentoTimer);
      socket.removeAllListeners();
      socket.disconnect();
      if (master.current === socket) master.current = null;
    };
  }, [socketKey]);

  const reintentarConexion = () => {
    setAuthError(null);
    setConnMotivo(null);
    setConnState("connecting");
    setSocketKey((k) => k + 1);
  };

  const guardar = async () => {
    const aprobada = {
      ...informacionEditada,
      status: "approved",
    };
    setinformacionEditada(aprobada);
    master.current.emit("patchPreguntaBD", {
      informacionEditada: aprobada,
      preguntaSeleccionada,
    });
  };

  const openModal = (pregunta) => {
    setPreguntaSeleccionada(pregunta);

    setinformacionEditada({
      ...pregunta,
    });

    setModalOpen(true);
  };

  const obtPreguntas = async () => {
    master.current.emit("obtenerPreguntas");
  };

  useEffect(() => {
    obtPreguntas();
    master.current.on("preguntasObtBD", (data) => {
      console.log(data);
      setPreguntas(data);
    });

    master.current.on("preguntaPatched", (data) => {
      const updatedQuestion = data;

      setPreguntas((prev) =>
        prev.map((p) => (p.id === updatedQuestion.id ? updatedQuestion : p)),
      );

      setModalOpen(false);
    });
  }, []);
  return (
    <div className="dashboard-layout">
      <Sidebar
        activeTab="aprendizaje"
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />
      {connState === "failed" ? (
        <div className="preview-content" style={{ minHeight: "400px" }}>
          <h2 style={{ color: "#e03939" }}>⚠️ Sin conexión</h2>
          <p>{connMotivo || "El servidor Maestro no está disponible."}</p>
          {authError && (
            <p style={{ color: "#e03939", fontWeight: 600 }}>⚠️ {authError}</p>
          )}
          <button className="botonGuardar" onClick={reintentarConexion}>
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
      ) : (
        <main className="main-content">
          <div className="banco-header-card">
            <div>
              <h2>🗂 Banco de preguntas</h2>
              <p>
                {preguntas.length} en total · {totalPendientes} pendientes de revisión
              </p>
            </div>
            <div className="banco-filtros">
              {[
                { id: "todas", label: "Todas" },
                { id: "pendientes", label: "Pendientes" },
                { id: "aprobadas", label: "Aprobadas" },
              ].map((f) => (
                <button
                  key={f.id}
                  className={`filtro-btn ${filtro === f.id ? "active" : ""}`}
                  onClick={() => setFiltro(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid-dosElementos">
            <table className="tabla-preguntas">
              <thead>
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Área</th>
                  <th className="p-4">Tema</th>
                  <th className="p-4">Destino</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Editar</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((pregunta) => (
                  <tr key={pregunta.id} className="hover-preguntas">
                    <td className="alinea-izq">
                      <p className="color-idpregunta">#{pregunta.id}</p>
                    </td>
                    <td>{pregunta.materia_nombre}</td>
                    <td>{pregunta.tema_nombre}</td>
                    <td>{etiquetaTipo(pregunta.tipo)}</td>
                    <td>
                      <p className={`borde-estado ${claseEstado(pregunta.status)}`}>
                        {etiquetaEstado(pregunta.status)}
                      </p>
                    </td>
                    <td>
                      <button
                        className="botoneditar"
                        onClick={() => {
                          openModal(pregunta);
                        }}
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
                          className="lucide lucide-pencil-icon lucide-pencil"
                        >
                          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibles.length === 0 && (
              <div className="banco-vacio">
                No hay preguntas en este filtro. Genera nuevas en 🤖 Generador IA.
              </div>
            )}
            {modalOpen && preguntaSeleccionada && (
              <div className="modal-overlay">
                <div className="banco-modal">
                  <div className="banco-modal-header">
                    <h2>
                      Editar pregunta #{preguntaSeleccionada.id}{" "}
                      <span className={`borde-estado ${claseEstado(preguntaSeleccionada.status)}`}>
                        {etiquetaEstado(preguntaSeleccionada.status)}
                      </span>
                    </h2>
                    <button
                      className="banco-modal-cerrar"
                      onClick={() => setModalOpen(false)}
                      aria-label="Cerrar"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="banco-modal-body">
                    <div>
                      <div className="banco-campo">
                        <span>Enunciado (acepta LaTeX $...$)</span>
                        <textarea
                          className="banco-input"
                          value={informacionEditada?.content || ""}
                          onChange={(e) =>
                            setinformacionEditada((prev) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="banco-campo">
                        <span>Opciones</span>
                        {informacionEditada?.options?.map((option, index) => (
                          <div className="banco-opcion-row" key={index}>
                            <span className="banco-letra">
                              {"ABCD"[index] || "•"}
                            </span>
                            <textarea
                              className="banco-input"
                              value={option}
                              onChange={(e) => {
                                const nuevasOpciones = [
                                  ...informacionEditada.options,
                                ];

                                nuevasOpciones[index] = e.target.value;

                                setinformacionEditada({
                                  ...informacionEditada,
                                  options: nuevasOpciones,
                                });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="banco-campo">
                        <span>Respuesta correcta (debe coincidir con una opción)</span>
                        <textarea
                          className="banco-input"
                          value={informacionEditada?.correct_option || ""}
                          onChange={(e) =>
                            setinformacionEditada((prev) => ({
                              ...prev,
                              correct_option: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="banco-campo">
                        <span>Explicación</span>
                        <textarea
                          className="banco-input"
                          value={informacionEditada?.explanation || ""}
                          onChange={(e) =>
                            setinformacionEditada((prev) => ({
                              ...prev,
                              explanation: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <aside className="banco-meta">
                      <h3>Datos del reactivo</h3>
                      <div className="banco-chip">
                        <strong>Área:</strong> {preguntaSeleccionada.materia_nombre}
                      </div>
                      <div className="banco-chip">
                        <strong>Tema:</strong> {preguntaSeleccionada.tema_nombre}
                      </div>
                      <div className="banco-chip">
                        <strong>Nivel:</strong> {nombreNivel(preguntaSeleccionada.nivel)}
                      </div>
                      <div className="banco-chip">
                        <strong>Tipo:</strong> {preguntaSeleccionada.tipo || "ejercicios"}
                      </div>
                      <div className="banco-chip">
                        <strong>Rating Elo:</strong> {preguntaSeleccionada.rating ?? "—"}
                      </div>
                      <button className="botonGuardar" onClick={guardar}>
                        ✓ Aprobar y Guardar
                      </button>
                    </aside>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}

export default PaginaTablas;
