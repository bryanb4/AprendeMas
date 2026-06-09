import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Sidebar from "../components/Sidebar";
import logo from "../assets/close_icon_143104.svg";
import { data } from "react-router-dom";

function PaginaTablas() {
  const handleTabChange = (tab) => {
    navigate("/dashboard", { state: { activeTab: tab } });
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const master = useRef(null);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [informacionEditada, setinformacionEditada] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  useEffect(() => {
    master.current = io("http://localhost:3001");

    master.current.on("connect", () => setSocketConnected(true));
    master.current.on("disconnect", () => setSocketConnected(false));

    master.current.emit("registro", { rol: "front-admin" });

    return () => {
      master.current.off("connect");
      master.current.off("disconnect");
      master.current.disconnect();
    };
  }, []);

  const guardar = async () => {
    master.current.emit("patchPreguntaBD", {
      informacionEditada,
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
      {!socketConnected ? (
        <div className="preview-content" style={{ minHeight: "400px" }}>
          <h2 style={{ color: "#e03939" }}>⚠️ Error 404</h2>
          <p>Socket no conectado. El servidor Maestro no está disponible.</p>
          <p style={{ fontSize: "0.85rem", color: "#999" }}>
            Asegúrate de que el servidor Socket.io esté corriendo en el puerto
            3001.
          </p>
        </div>
      ) : (
        <main className="main-content">
          <div className="grid-dosElementos">
            <table className="tabla-preguntas">
              <thead>
                <tr>
                  <th className="p-4">ID de Pregunta</th>
                  <th className="p-4">Materia</th>
                  <th className="p-4">Tema</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Editar</th>
                </tr>
              </thead>
              <tbody>
                {preguntas.map((pregunta) => (
                  <tr key={pregunta.id} className="hover-preguntas">
                    <td className="alinea-izq">
                      <p className="color-idpregunta"># {pregunta.id}</p>
                    </td>
                    <td>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {pregunta.materia_nombre}
                      </p>
                    </td>
                    <td>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {pregunta.tema_nombre}
                      </p>
                    </td>
                    <td>
                      <p
                        className={`borde-estado ${
                          pregunta.status === "pending_review"
                            ? "clase-pending"
                            : "clase-aprobado"
                        }`}
                      >
                        {pregunta.status}
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
            {modalOpen && preguntaSeleccionada && (
              <div className="modal-overlay">
                <div className="card-editar">
                  <div className="grid-dosElementosRow">
                    <div className="contenedorTituloCerrar">
                      <h2 className="alinear-centro texto-blanco">
                        Editar pregunta
                      </h2>
                      <button
                        className="botonCerrar margenBoton"
                        onClick={() => setModalOpen(false)}
                      >
                        <img className="icono-boton" src={logo} alt="Cerrar" />
                      </button>
                    </div>

                    <p className="p-idpregunta color-idpregunta">
                      ID: #{preguntaSeleccionada.id}
                    </p>
                  </div>
                  <div className="grid-dosElementosPreg">
                    <div className="grid-tresRow">
                      <textarea
                        className="cuadro-edicion"
                        value={informacionEditada?.content || ""}
                        onChange={(e) =>
                          setinformacionEditada((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                      />
                      <div className="auto">
                        <p className="texto-blanco"> Opciones:</p>
                      </div>

                      <div className="grid-dosElementospeque">
                        <div className="elementos-flex">
                          {informacionEditada?.options?.map((option, index) => (
                            <textarea
                              className="cuadro-edicionOpc"
                              key={index}
                              type="text"
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
                          ))}
                        </div>
                      </div>
                      <p className="elemento-menos-margen texto-blanco">
                        Respuesta Correcta:{" "}
                      </p>
                      <textarea
                        className="cuadro-edicionOpc"
                        type="text"
                        value={informacionEditada.correct_option}
                        onChange={(e) =>
                          setinformacionEditada((prev) => ({
                            ...prev,
                            correct_option: e.target.value,
                          }))
                        }
                      />
                      <p className="elemento-menos-margen texto-blanco">
                        Explicacion:
                      </p>
                      <textarea
                        className="cuadro-edicion"
                        value={informacionEditada?.explanation || ""}
                        onChange={(e) =>
                          setinformacionEditada((prev) => ({
                            ...prev,
                            explanation: e.target.value,
                          }))
                        }
                      />
                      <div className="contenedor">
                        <p
                          className={`borde-estado ${
                            informacionEditada.status === "pending_review"
                              ? "clase-pending"
                              : "clase-aprobado"
                          }`}
                        >
                          {informacionEditada.status}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="nombre-id">
                        <p className="elemento-menos-margen texto-blanco">
                          Materia: {preguntaSeleccionada.materia_nombre}
                        </p>
                        <p className="elemento-menos-margen color-idpregunta">
                          ID Materia: #{preguntaSeleccionada.materia_id}
                        </p>
                      </div>
                      <div className="nombre-id">
                        <p className="elemento-menos-margen texto-blanco">
                          Tema: {preguntaSeleccionada.tema_nombre}
                        </p>
                        <p className="elemento-menos-margen color-idpregunta">
                          ID Tema: #{preguntaSeleccionada.temas_id}
                        </p>
                        <p className="elemento-menos-margen texto-blanco">
                          Valor en rating: {preguntaSeleccionada.rating}
                        </p>
                      </div>
                      <button className="botonGuardar" onClick={guardar}>
                        Aprobar y Guardar
                      </button>
                    </div>
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
