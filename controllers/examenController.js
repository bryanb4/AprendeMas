const pool = require('../db/conexion');

const POR_ENFOQUE = 5;
const MIN_APROBATORIO = 7;
// Simulacro: 50 segundos por pregunta.
// El tiempo total depende de cuántas arroje el banco.
const SIM_TOTAL = 20;
const SEG_POR_PREGUNTA = 50;
// Simulacro disponible solo martes (2) y viernes (5), hora de México,
// con máximo 3 intentos por día disponible.
const DIAS_SIMULACION = [2, 5];
const MAX_INTENTOS_DIA = 3;
const NOMBRES_DIA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function diaSemanaMexico(date = new Date()) {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    weekday: "short",
  }).formatToParts(date);
  const dia = (partes.find((p) => p.type === "weekday") || {}).value;
  const mapa = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return mapa[dia] !== undefined ? mapa[dia] : new Date().getDay();
}

function esDiaSimulacion() {
  return DIAS_SIMULACION.includes(diaSemanaMexico());
}

// Intentos de simulacro usados HOY (día de México) por el usuario
async function intentosSimulacionHoy(userId) {
  const r = await pool.query(
    `SELECT COUNT(*) AS n FROM resultados
     WHERE usuario_id = $1 AND tipo = 'simulacion'
       AND DATE(timezone('America/Mexico_City', fecha)) = DATE(timezone('America/Mexico_City', NOW()))`,
    [userId]
  );
  return Number(r.rows[0].n);
}

// Resuelve tema_id por nombres (los que manda el front)
async function resolverTema(materia, tema) {
  const r = await pool.query(
    `SELECT t.id FROM temas t
     JOIN materias m ON m.id = t.materia_id
     WHERE m.nombre = $1 AND t.nombre = $2`,
    [materia, tema]
  );
  return r.rows.length ? r.rows[0].id : null;
}

// ============================
// GET /api/examen/evaluacion?materia=&tema=
// Devuelve 5 prácticas + 5 teóricas APROBADAS del tema,
// SIN la respuesta correcta (para no exponerla en red).
// ============================
exports.obtenerEvaluacion = async (req, res) => {
  try {
    const { materia, tema } = req.query;
    if (!materia || !tema) {
      return res.status(400).json({ message: "Faltan parámetros materia y tema" });
    }
    const temaId = await resolverTema(materia, tema);
    if (!temaId) {
      return res.status(404).json({ message: "Tema no encontrado", preguntas: [] });
    }

    const practicas = await pool.query(
      `SELECT id, pregunta, opciones FROM preguntas
       WHERE tema_id = $1 AND tipo = 'evaluacion' AND enfoque = 'practica'
         AND status = 'approved'
       ORDER BY RANDOM() LIMIT $2`,
      [temaId, POR_ENFOQUE]
    );
    const teoricas = await pool.query(
      `SELECT id, pregunta, opciones FROM preguntas
       WHERE tema_id = $1 AND tipo = 'evaluacion' AND enfoque = 'teorica'
         AND status = 'approved'
       ORDER BY RANDOM() LIMIT $2`,
      [temaId, POR_ENFOQUE]
    );

    const preguntas = [...practicas.rows, ...teoricas.rows]
      .sort(() => Math.random() - 0.5)
      .map((p) => ({
        id: p.id,
        pregunta: p.pregunta,
        opciones: Array.isArray(p.opciones) ? p.opciones : JSON.parse(p.opciones || "[]"),
      }));

    res.json({
      tema_id: temaId,
      preguntas,
      total: preguntas.length,
      practicas: practicas.rows.length,
      teoricas: teoricas.rows.length,
      // true cuando el banco ya tiene las 10 (5+5) para este tema
      completas: practicas.rows.length === POR_ENFOQUE && teoricas.rows.length === POR_ENFOQUE,
    });
  } catch (error) {
    console.error("Error obteniendo evaluación:", error);
    res.status(500).json({ message: "Error al obtener el examen" });
  }
};


// ============================
// POST /api/examen/evaluacion/calificar
// Body: { respuestas: [{ id, respuesta }] }
// Califica, guarda historial y devuelve detalle con
// explicaciones de las falladas.
// Criterio: 7+ aciertos = aprobado, 6 o menos = reprobado.
// ============================
exports.calificarEvaluacion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { respuestas } = req.body;

    if (!Array.isArray(respuestas) || respuestas.length === 0) {
      return res.status(400).json({ message: "Envía tus respuestas" });
    }

    const ids = respuestas.map((r) => Number(r.id)).filter(Boolean);
    const { rows } = await pool.query(
      "SELECT id, pregunta, opciones, respuesta_correcta, explicacion FROM preguntas WHERE id = ANY($1)",
      [ids]
    );
    const banco = new Map(rows.map((p) => [p.id, p]));

    let aciertos = 0;
    const detalle = respuestas.map(({ id, respuesta }) => {
      const p = banco.get(Number(id));
      if (!p) return { id, correcta: false, error: "Pregunta no encontrada" };
      const correcta =
        String(respuesta || "").trim() === String(p.respuesta_correcta || "").trim();
      if (correcta) aciertos++;
      return {
        id: p.id,
        pregunta: p.pregunta,
        correcta,
        tuRespuesta: respuesta || null,
        respuesta_correcta: p.respuesta_correcta,
        // La explicación se usa en el front solo para las falladas
        explicacion: correcta ? null : p.explicacion,
      };
    });

    const total = detalle.length;
    const aprobado = aciertos >= MIN_APROBATORIO;

    // Guarda historial: SIEMPRE la calificación MÁS ALTA del tema.
    // Si repite y supera su mejor nota, se actualiza; si no, se conserva.
    const calificacion = Math.round((aciertos / total) * 10);
    let temaId = Number(req.body.tema_id) || null;
    let esRecord = true;
    if (!temaId && rows.length) {
      const rt = await pool.query(
        "SELECT tema_id FROM preguntas WHERE id = $1",
        [rows[0].id]
      );
      if (rt.rows.length) temaId = rt.rows[0].tema_id;
    }
    try {
      if (temaId) {
        const prev = await pool.query(
          "SELECT id, calificacion FROM resultados WHERE usuario_id = $1 AND tema_id = $2 AND tipo = 'evaluacion'",
          [userId, temaId]
        );
        if (!prev.rows.length) {
          await pool.query(
            "INSERT INTO resultados (usuario_id, calificacion, tema_id, tipo, aciertos, total) VALUES ($1, $2, $3, 'evaluacion', $4, $5)",
            [userId, calificacion, temaId, aciertos, total]
          );
        } else if (calificacion > prev.rows[0].calificacion) {
          await pool.query(
            "UPDATE resultados SET calificacion = $1, aciertos = $2, total = $3, fecha = NOW() WHERE id = $4",
            [calificacion, aciertos, total, prev.rows[0].id]
          );
        } else {
          esRecord = false;
        }
      } else {
        await pool.query(
          "INSERT INTO resultados (usuario_id, calificacion, aciertos, total) VALUES ($1, $2, $3, $4)",
          [userId, calificacion, aciertos, total]
        );
      }
    } catch (e) {
      console.error("No se pudo guardar resultado:", e.message);
    }

    res.json({
      aciertos,
      total,
      calificacion,
      aprobado,
      record: esRecord,
      message: aprobado
        ? `¡Felicidades! Aprobaste con ${aciertos}/${total}. Puedes continuar con el siguiente tema.`
        : "Lamentablemente no cumpliste con el criterio, vuelve a realizar el examen una vez retomes la lección.",
      detalle,
    });
  } catch (error) {
    console.error("Error calificando:", error);
    res.status(500).json({ message: "Error al calificar el examen" });
  }
};


// ============================
// GET /api/examen/progreso
// Por cada tema: mejor calificación, intentos y bandera aprobado.
// Es la fuente para los letreros junto al botón Comenzar.
// ============================
exports.obtenerProgreso = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      `SELECT r.tema_id, t.nombre AS tema, m.nombre AS materia,
              MAX(r.calificacion) AS mejor, COUNT(*) AS intentos,
              BOOL_OR(r.calificacion >= 7) AS aprobado
       FROM resultados r
       JOIN temas t ON t.id = r.tema_id
       JOIN materias m ON m.id = t.materia_id
       WHERE r.usuario_id = $1 AND r.tema_id IS NOT NULL
       GROUP BY r.tema_id, t.nombre, m.nombre`,
      [userId]
    );
    res.json({ progreso: rows });
  } catch (error) {
    console.error("Error obteniendo progreso:", error);
    res.status(500).json({ message: "Error al obtener progreso" });
  }
};


// ============================
// GET /api/examen/historial
// Vista de Resultados:
// - evaluaciones: mejor nota por tema (se actualiza al superar)
// - simulaciones: cada intento con fecha, hora y calificación
// ============================
exports.obtenerHistorial = async (req, res) => {
  try {
    const userId = req.user.id;

    const evaluaciones = await pool.query(
      `SELECT r.tema_id, t.nombre AS tema, m.nombre AS materia,
              r.calificacion AS mejor, r.aciertos, r.total,
              r.fecha, r.calificacion >= 7 AS aprobado
       FROM resultados r
       JOIN temas t ON t.id = r.tema_id
       JOIN materias m ON m.id = t.materia_id
       WHERE r.usuario_id = $1 AND r.tipo = 'evaluacion' AND r.tema_id IS NOT NULL
       ORDER BY r.fecha DESC`,
      [userId]
    );

    const simulaciones = await pool.query(
      `SELECT id, calificacion, aciertos, total, intento, fecha
       FROM resultados
       WHERE usuario_id = $1 AND tipo = 'simulacion'
       ORDER BY fecha DESC LIMIT 50`,
      [userId]
    );

    res.json({
      evaluaciones: evaluaciones.rows,
      simulaciones: simulaciones.rows,
    });
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    res.status(500).json({ message: "Error al obtener historial" });
  }
};


// ============================
// GET /api/examen/ejercicios?materia=&tema=
// Práctica libre del tema: trae TODO (incluye respuesta y explicación)
// porque aquí el feedback es inmediato, no hay calificación.
// ============================
exports.obtenerEjercicios = async (req, res) => {
  try {
    const { materia, tema } = req.query;
    if (!materia || !tema) {
      return res.status(400).json({ message: "Faltan parámetros materia y tema" });
    }
    const temaId = await resolverTema(materia, tema);
    if (!temaId) {
      return res.status(404).json({ message: "Tema no encontrado", ejercicios: [] });
    }
    const { rows } = await pool.query(
      `SELECT id, pregunta, opciones, respuesta_correcta, explicacion, enfoque, nivel
       FROM preguntas
       WHERE tema_id = $1 AND tipo = 'ejercicios' AND status = 'approved'
       ORDER BY RANDOM()`,
      [temaId]
    );
    res.json({
      tema_id: temaId,
      ejercicios: rows.map((p) => ({
        id: p.id,
        pregunta: p.pregunta,
        opciones: Array.isArray(p.opciones) ? p.opciones : JSON.parse(p.opciones || "[]"),
        respuesta_correcta: p.respuesta_correcta,
        explicacion: p.explicacion,
        enfoque: p.enfoque,
        nivel: p.nivel,
      })),
      total: rows.length,
    });
  } catch (error) {
    console.error("Error obteniendo ejercicios:", error);
    res.status(500).json({ message: "Error al obtener ejercicios" });
  }
};


// ============================
// GET /api/examen/simulacion/estado
// Estado visible en la intro: día, intentos usados/restantes y
// cuántos temas aprobados alimentan el simulacro. No consume intentos.
// ============================
exports.estadoSimulacion = async (req, res) => {
  try {
    const userId = req.user.id;
    const esAdmin = req.user.rol === "admin";
    const hoy = NOMBRES_DIA[diaSemanaMexico()];
    const permitidoHoy = esAdmin || esDiaSimulacion();
    const usados = await intentosSimulacionHoy(userId);
    const { rows } = await pool.query(
      `SELECT COUNT(DISTINCT r.tema_id) AS temas
       FROM resultados r
       WHERE r.usuario_id = $1 AND r.calificacion >= 7 AND r.tipo = 'evaluacion' AND r.tema_id IS NOT NULL`,
      [userId]
    );
    res.json({
      dias: ["martes", "viernes"],
      hoy,
      permitidoHoy,
      ilimitado: esAdmin,
      intentos_usados: usados,
      intentos_restantes: esAdmin ? null : Math.max(0, MAX_INTENTOS_DIA - usados),
      intentos_max: MAX_INTENTOS_DIA,
      intento_actual: usados + 1,
      temas_aprobados: Number(rows[0].temas || 0),
      mensaje: !permitidoHoy
        ? `Hoy es ${hoy}: el simulacro abre martes y viernes.`
        : esAdmin
          ? `Modo admin: intentos ilimitados cualquier día. Llevas ${usados} hoy.`
          : usados >= MAX_INTENTOS_DIA
            ? "Ya usaste tus 3 intentos de hoy. Vuelve el próximo día disponible."
            : `Te quedan ${MAX_INTENTOS_DIA - usados} de ${MAX_INTENTOS_DIA} intentos hoy.`,
    });
  } catch (error) {
    console.error("Error obteniendo estado:", error);
    res.status(500).json({ message: "Error al obtener estado" });
  }
};
// ============================
// GET /api/examen/simulacion?n=20
// Arma el simulacro SOLO con temas aprobados (bandera de sección).
// Mezcla 30% básico / 50% medio / 20% avanzado, sin respuestas.
// ============================
exports.obtenerSimulacion = async (req, res) => {
  try {
    const userId = req.user.id;
    // El admin prueba sin límites: cualquier día e intentos infinitos
    const esAdmin = req.user.rol === "admin";
    const total = Math.min(Math.max(Number(req.query.n) || SIM_TOTAL, 5), 40);
    const hoy = NOMBRES_DIA[diaSemanaMexico()];
    const infoDias = {
      dias: ["martes", "viernes"],
      hoy,
      permitidoHoy: esAdmin || esDiaSimulacion(),
      ilimitado: esAdmin,
    };

    // Regla: solo martes y viernes (el admin la omite)
    if (!infoDias.permitidoHoy) {
      return res.status(200).json({
        preguntas: [], total: 0,
        permitido: false,
        ...infoDias,
        message: `El examen simulación solo está disponible los martes y viernes. Hoy es ${hoy}: usa el día para estudiar y practicar ejercicios.`,
      });
    }

    // Regla: máximo 3 intentos por día disponible (el admin la omite)
    const usados = await intentosSimulacionHoy(userId);
    if (!esAdmin && usados >= MAX_INTENTOS_DIA) {
      return res.status(200).json({
        preguntas: [], total: 0,
        permitido: false,
        ...infoDias,
        intentos_usados: usados,
        intentos_restantes: 0,
        message: "Ya usaste tus 3 intentos de hoy. Vuelve el próximo día disponible (martes o viernes).",
      });
    }

    // Temas aprobados por el alumno (evaluación con 7+)
    const { rows: aprobados } = await pool.query(
      `SELECT DISTINCT r.tema_id, t.nombre AS tema, m.nombre AS materia
       FROM resultados r
       JOIN temas t ON t.id = r.tema_id
       JOIN materias m ON m.id = t.materia_id
       WHERE r.usuario_id = $1 AND r.calificacion >= 7 AND r.tipo = 'evaluacion'`,
      [userId]
    );

    if (!aprobados.length) {
      return res.status(200).json({
        preguntas: [], total: 0,
        permitido: false,
        dias: ["martes", "viernes"],
        hoy: NOMBRES_DIA[diaSemanaMexico()],
        message: "Aún no apruebas ningún tema. Aprueba al menos una evaluación por tema para desbloquear tu simulación.",
      });
    }

    const temaIds = aprobados.map((a) => a.tema_id);
    const nBas = Math.round(total * 0.3);
    const nAv = Math.round(total * 0.2);
    const nMed = total - nBas - nAv;

    const porNivel = async (nivel, n) => (await pool.query(
      `SELECT id, pregunta, opciones FROM preguntas
       WHERE tema_id = ANY($1) AND tipo = 'simulacion' AND nivel = $2
         AND status = 'approved'
       ORDER BY RANDOM() LIMIT $3`,
      [temaIds, nivel, n]
    )).rows;

    const preguntas = [
      ...(await porNivel(400, nBas)),
      ...(await porNivel(800, nMed)),
      ...(await porNivel(1200, nAv)),
    ].sort(() => Math.random() - 0.5)
      .map((p) => ({
        id: p.id,
        pregunta: p.pregunta,
        opciones: Array.isArray(p.opciones) ? p.opciones : JSON.parse(p.opciones || "[]"),
      }));

    res.json({
      preguntas,
      total: preguntas.length,
      segundos_por_pregunta: SEG_POR_PREGUNTA,
      segundos_totales: preguntas.length * SEG_POR_PREGUNTA,
      temas: aprobados.map((a) => `${a.materia}: ${a.tema}`),
      completas: preguntas.length >= total,
      permitido: true,
      dias: ["martes", "viernes"],
      hoy: NOMBRES_DIA[diaSemanaMexico()],
      ilimitado: esAdmin,
      intento_actual: usados + 1,
      intentos_usados: usados,
      intentos_restantes: esAdmin ? null : MAX_INTENTOS_DIA - usados,
      intentos_max: MAX_INTENTOS_DIA,
    });
  } catch (error) {
    console.error("Error armando simulación:", error);
    res.status(500).json({ message: "Error al armar la simulación" });
  }
};


// ============================
// POST /api/examen/simulacion/calificar
// Califica el simulacro (sin aprobado/reprobado: es práctica
// cronometrada) y lo guarda en el historial.
// ============================
exports.calificarSimulacion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { respuestas } = req.body;

    if (!Array.isArray(respuestas) || respuestas.length === 0) {
      return res.status(400).json({ message: "Envía tus respuestas" });
    }

    // Revalida reglas al calificar (por si llamó directo a la API).
    // El admin omite día y tope.
    const esAdminCal = req.user.rol === "admin";
    if (!esAdminCal && !esDiaSimulacion()) {
      return res.status(403).json({
        message: `El examen simulación solo está disponible los martes y viernes. Hoy es ${NOMBRES_DIA[diaSemanaMexico()]}.`,
      });
    }
    const usados = await intentosSimulacionHoy(userId);
    if (!esAdminCal && usados >= MAX_INTENTOS_DIA) {
      return res.status(403).json({
        message: "Ya usaste tus 3 intentos de hoy. Vuelve el próximo día disponible (martes o viernes).",
      });
    }
    const intento = usados + 1;

    const ids = respuestas.map((r) => Number(r.id)).filter(Boolean);
    const { rows } = await pool.query(
      "SELECT id, pregunta, opciones, respuesta_correcta, explicacion FROM preguntas WHERE id = ANY($1)",
      [ids]
    );
    const banco = new Map(rows.map((p) => [p.id, p]));

    let aciertos = 0;
    const detalle = respuestas.map(({ id, respuesta }) => {
      const p = banco.get(Number(id));
      if (!p) return { id, correcta: false, error: "Pregunta no encontrada" };
      const correcta =
        String(respuesta || "").trim() === String(p.respuesta_correcta || "").trim();
      if (correcta) aciertos++;
      return {
        id: p.id,
        pregunta: p.pregunta,
        correcta,
        tuRespuesta: respuesta || null,
        respuesta_correcta: p.respuesta_correcta,
        explicacion: correcta ? null : p.explicacion,
      };
    });

    const total = detalle.length;
    const calificacion = Math.round((aciertos / total) * 10);
    try {
      await pool.query(
        "INSERT INTO resultados (usuario_id, calificacion, tipo, intento, aciertos, total) VALUES ($1, $2, 'simulacion', $3, $4, $5)",
        [userId, calificacion, intento, aciertos, total]
      );
    } catch (e) {
      console.error("No se pudo guardar resultado:", e.message);
    }

    res.json({
      aciertos,
      total,
      calificacion,
      intento,
      ilimitado: esAdminCal,
      intentos_restantes: esAdminCal ? null : MAX_INTENTOS_DIA - intento,
      message: `Simulación terminada (intento ${intento}${esAdminCal ? " · admin" : ` de ${MAX_INTENTOS_DIA}`}: ${aciertos}/${total} aciertos. Revisa tus errores y sigue practicando.`,
      detalle,
    });
  } catch (error) {
    console.error("Error calificando simulación:", error);
    res.status(500).json({ message: "Error al calificar la simulación" });
  }
};
