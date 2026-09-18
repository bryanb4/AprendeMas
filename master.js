// ============================================================
// Master — nodo coordinador del Módulo 3 (Sistemas Distribuidos)
// Escucha en :3001, atiende al front-admin (con JWT + rol admin),
// lee/escribe la BD y delega el trabajo pesado de IA al Worker.
// Uso: node master.js
// ============================================================
require("dotenv").config();
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const pool = require("./db/conexion");

const PORT = Number(process.env.MASTER_PORT || 3001);
const WORKER_KEY = process.env.MASTER_WORKER_KEY || "dev-worker-key";

const io = new Server(PORT, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST"],
  },
});

// ---- helpers ----

function mapPregunta(r) {
  let opciones = r.opciones;
  if (typeof opciones === "string") {
    try { opciones = JSON.parse(opciones); } catch { opciones = []; }
  }
  return {
    id: r.id,
    materia_id: r.materia_id,
    temas_id: r.tema_id,
    materia_nombre: r.materia_nombre,
    tema_nombre: r.tema_nombre,
    status: r.status,
    content: r.pregunta,
    options: Array.isArray(opciones) ? opciones : [],
    correct_option: r.respuesta_correcta,
    explanation: r.explicacion,
    rating: r.rating,
    nivel: r.nivel,
    tipo: r.tipo,
    enfoque: r.enfoque || "practica",
  };
}

const SELECT_PREGUNTAS = `
  SELECT p.id, p.materia_id, p.tema_id, p.nivel, p.tipo, p.enfoque,
         p.pregunta, p.opciones, p.respuesta_correcta, p.explicacion,
         p.status, p.rating,
         m.nombre AS materia_nombre, t.nombre AS tema_nombre
  FROM preguntas p
  LEFT JOIN materias m ON m.id = p.materia_id
  LEFT JOIN temas t ON t.id = p.tema_id`;

function normalizarEnfoque(e) {
  return e === "teorica" ? "teorica" : "practica";
}

function normalizarStatus(s) {
  if (s === "arppoved") return "approved"; // typo histórico del front
  if (["approved", "pending_review"].includes(s)) return s;
  return "pending_review";
}

// Verificación 100% síncrona: el rol viaja firmado dentro del JWT.
// Así el "registro" termina antes de que llegue cualquier otro evento
// y no existe carrera entre verificar y pedir datos.
function verificarAdmin(token) {
  if (!token) throw new Error("Falta token de sesión (vuelve a iniciar sesión)");
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new Error("Sesión expirada o inválida (vuelve a iniciar sesión)");
  }
  if (!decoded || decoded.rol !== "admin") {
    throw new Error("Se requiere rol administrador");
  }
  return decoded;
}

function workerDisponible() {
  for (const [, s] of io.sockets.sockets) {
    if (s.data && s.data.rol === "worker-ia") return s;
  }
  return null;
}

// ---- conexiones ----

io.on("connection", (socket) => {
  socket.data.rol = null;

  socket.on("registro", (payload = {}) => {
    try {
      // ----- Worker IA -----
      if (payload.rol === "worker-ia") {
        if (payload.key !== WORKER_KEY) {
          socket.emit("no_autorizado", { message: "Worker key inválida" });
          return socket.disconnect(true);
        }
        socket.data.rol = "worker-ia";
        console.log(`[master] Worker IA registrado (${socket.id})`);
        return socket.emit("registrado", { rol: "worker-ia" });
      }

      // ----- Front admin -----
      const admin = verificarAdmin(payload.token);
      socket.data.rol = "front-admin";
      socket.data.userId = admin.id;
      console.log(`[master] Admin conectado (id ${admin.id})`);
      socket.emit("registrado", { rol: "front-admin" });
    } catch (err) {
      socket.emit("no_autorizado", { message: err.message });
      socket.disconnect(true);
    }
  });

  const soloAdmin = (fn) => async (...args) => {
    if (socket.data.rol !== "front-admin") {
      const cb = typeof args[args.length - 1] === "function" ? args.pop() : null;
      socket.emit("no_autorizado", { message: "Regístrate como admin primero" });
      if (cb) cb({ ok: false, error: "no_autorizado" });
      return;
    }
    return fn(...args);
  };

  // ----- Catálogo -----
  socket.on("obtenerMateriasBD", soloAdmin(async () => {
    const r = await pool.query("SELECT id, nombre FROM materias ORDER BY id");
    socket.emit("materiasObtenidasBD", r.rows);
  }));

  socket.on("obtenerTemasBD", soloAdmin(async (materiaId) => {
    const r = await pool.query(
      "SELECT id, nombre FROM temas WHERE materia_id=$1 ORDER BY id",
      [Number(materiaId)]
    );
    socket.emit("temasObtenidosBD", r.rows);
  }));

  // ----- Generación delegada al Worker -----
  socket.on("GenerarPregunta", soloAdmin(async (datos = {}) => {
    const worker = workerDisponible();
    if (!worker) {
      return socket.emit("errorIA", {
        message: "Worker IA no disponible. Inicia worker-ia.js e inténtalo de nuevo.",
      });
    }
    // Resuelve el tema_id para que el Worker cargue el material oficial
    let temaId = null;
    try {
      const r = await pool.query(
        "SELECT t.id FROM temas t JOIN materias m ON m.id = t.materia_id WHERE m.nombre = $1 AND t.nombre = $2",
        [datos.subject, datos.topic]
      );
      if (r.rows.length) temaId = r.rows[0].id;
    } catch (e) {
      console.error("[master] No se pudo resolver tema_id:", e.message);
    }
    console.log(`[master] Delegando generación al worker: ${datos.topic} (${datos.level}, tema_id=${temaId})`);
    try {
      const resp = await worker.timeout(120000).emitWithAck("generar_pregunta", {
        subject: datos.subject,
        topic: datos.topic,
        level: datos.level,
        tipo: datos.tipo || "ejercicios",
        enfoque: normalizarEnfoque(datos.enfoque),
        tema_id: temaId,
        forzar: datos.forzar === true,
        evitar: Array.isArray(datos.evitar) ? datos.evitar.slice(0, 12) : [],
      });
      if (!resp || !resp.ok) {
        return socket.emit("errorIA", {
          message: (resp && resp.error) || "El worker no pudo generar la pregunta",
        });
      }
      socket.emit("preguntaGenerada", {
        ...resp.pregunta,
        tipo: datos.tipo || "ejercicios",
        enfoque: normalizarEnfoque(datos.enfoque),
      });
    } catch (err) {
      socket.emit("errorIA", { message: "El worker tardó demasiado o se desconectó" });
    }
  }));

  // ----- Guardar aprobada o pendiente -----
  socket.on("guardarPreguntaBD", soloAdmin(async (d = {}) => {
    try {
      const r = await pool.query(
        `INSERT INTO preguntas
         (materia_id, tema_id, nivel, tipo, enfoque, pregunta, opciones, respuesta_correcta, explicacion, status, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
        [
          Number(d.materia_solicitada),
          Number(d.tema_solicitado),
          Number(d.nivel_solicitado) || 800,
          ["evaluacion", "simulacion", "ejercicios"].includes(d.tipo) ? d.tipo : "ejercicios",
          normalizarEnfoque(d.enfoque),
          d.pregunta,
          JSON.stringify(d.opciones || []),
          d.respuesta_correcta,
          d.explicacion || null,
          normalizarStatus(d.status),
          socket.data.userId || null,
        ]
      );
      socket.emit("preguntaGuardada", { id: r.rows[0].id });
    } catch (err) {
      console.error("[master] Error guardando pregunta:", err.message);
      socket.emit("errorGuardado", { message: "No se pudo guardar: " + err.message });
    }
  }));

  // ----- Banco de preguntas -----
  socket.on("obtener3BD", soloAdmin(async () => {
    const r = await pool.query(
      `${SELECT_PREGUNTAS} WHERE p.status='pending_review' ORDER BY p.id DESC LIMIT 3`
    );
    socket.emit("3pregObtenidas", r.rows.map(mapPregunta));
  }));

  socket.on("obtenerPreguntas", soloAdmin(async () => {
    const r = await pool.query(`${SELECT_PREGUNTAS} ORDER BY p.id DESC`);
    socket.emit("preguntasObtBD", r.rows.map(mapPregunta));
  }));

  socket.on("patchPreguntaBD", soloAdmin(async ({ informacionEditada = {}, preguntaSeleccionada = {} } = {}) => {
    const id = Number(preguntaSeleccionada.id || informacionEditada.id);
    if (!id) return;
    await pool.query(
      `UPDATE preguntas SET pregunta=$1, opciones=$2, respuesta_correcta=$3,
        explicacion=$4, status=$5 WHERE id=$6`,
      [
        informacionEditada.content,
        JSON.stringify(informacionEditada.options || []),
        informacionEditada.correct_option,
        informacionEditada.explanation || null,
        normalizarStatus(informacionEditada.status),
        id,
      ]
    );
    const r = await pool.query(`${SELECT_PREGUNTAS} WHERE p.id=$1`, [id]);
    if (r.rows.length) socket.emit("preguntaPatched", mapPregunta(r.rows[0]));
  }));

  socket.on("eliminarPreguntaBD", soloAdmin(async ({ id } = {}) => {
    const numId = Number(id);
    if (!numId) {
      return socket.emit("errorEliminar", { message: "ID de pregunta inválido" });
    }
    try {
      const r = await pool.query("DELETE FROM preguntas WHERE id = $1 RETURNING id", [numId]);
      if (!r.rows.length) {
        return socket.emit("errorEliminar", { message: "La pregunta ya no existe" });
      }
      socket.emit("preguntaEliminada", { id: numId });
    } catch (err) {
      console.error("[master] Error eliminando pregunta:", err.message);
      socket.emit("errorEliminar", { message: "No se pudo eliminar: " + err.message });
    }
  }));

  socket.on("disconnect", () => {
    if (socket.data.rol) console.log(`[master] Desconectado: ${socket.data.rol}`);
  });
});

console.log(`[master] Escuchando en puerto ${PORT}`);
