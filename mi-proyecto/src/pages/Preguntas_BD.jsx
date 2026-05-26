import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

function PaginaTablas() {
  const handleTabChange = (tab) => {
    navigate("/dashboard", { state: { activeTab: tab } });
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const obtPreguntas = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/ia/preguntasObtener`,
      );
      const data = await response.json();
      setPreguntas(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtPreguntas();
    console.log(preguntas);
  }, []);
  return (
    <div className="dashboard-layout">
      <Sidebar
        activeTab="aprendizaje"
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />
      <main className="main-content">
        <div className="div-prueba">
          <table className="tabla-preguntas">
            <thead>
              <tr>
                <th className="p-4">ID de Pregunta</th>
                <th className="p-4">Materia</th>
                <th className="p-4">Tema</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acción</th>
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
                        setPreguntaSeleccionada(pregunta);
                        setModalOpen(true);
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
              <div className="modal">
                <h2>Editar pregunta</h2>

                <p>ID: {preguntaSeleccionada.id}</p>
                <input value={preguntaSeleccionada.pregunta} />

                <p>Materia: {preguntaSeleccionada.materia_nombre}</p>

                <p>Tema: {preguntaSeleccionada.tema_nombre}</p>

                <p>Estado: {preguntaSeleccionada.status}</p>

                <button onClick={() => setModalOpen(false)}>Cerrar</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PaginaTablas;
