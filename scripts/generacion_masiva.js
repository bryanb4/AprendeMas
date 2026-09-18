// Relleno del banco hasta 5 prácticas + 5 teóricas por (tema, tipo).
// Solo Aritmética + Álgebra (temas 1-23). Guarda todo como approved.
// Uso: node scripts/generacion_masiva.js <email> <password> [--fill]
// --fill (default si se omite): calcula faltantes por (tema,tipo,enfoque)
//   hasta META=5 y los genera. Reejecutable: solo hace lo que falte.
// ============================================================
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const path = require("path");
const pool = require("../db/conexion");
const { io } = require("socket.io-client");

const EMAIL = process.argv[2];
const PASSWORD = process.argv[3];
const MASTER_URL = process.env.MASTER_URL || "http://localhost:3001";
const API_URL = (process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");
const TIPOS_ARG = (process.argv.find((a) => a.startsWith("--tipos=")) || "").slice("--tipos=".length);
const TIPOS = TIPOS_ARG ? TIPOS_ARG.split(",").map((s) => s.trim()).filter(Boolean) : ["ejercicios", "evaluacion"];
// Simulación no usa enfoque teórico/práctico: todo se guarda como practica
const ENFOQUES = TIPOS.length === 1 && TIPOS[0] === "simulacion" ? ["practica"] : ["practica", "teorica"];
// --mix-simulacion: ignora TIPOS/ENFOQUES/META y usa mezcla 3+5+2 por nivel
const MIX_SIMULACION = process.argv.includes("--mix-simulacion");
// --plan-20: 20 por apartado y tema.
//   ejercicios/evaluacion: 8 teoricas + 12 practicas (2 bas + 8 med + 2 ava)
//   simulacion: 12 practicas (2 bas + 8 med + 2 ava)
const PLAN_20 = process.argv.includes("--plan-20");
const NIVEL_NOMBRE = { 400: "Basico", 800: "Medio", 1200: "Avanzado" };
// Solo Aritmética+Álgebra (temas 1-23). Geo/Est se harán cuando su
// temario quede fijo en la web.
const SOLO_CON_MATERIAL = true;
const WHERE_MATERIAS = "WHERE m.id IN (1, 2)";
const META = 5;
const PAUSA_MS = 10000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  if (!EMAIL || !PASSWORD) {
    console.error("Uso: node scripts/generacion_masiva.js <email> <password>");
    process.exit(1);
  }

  // 1) Login admin
  const login = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  }).then((r) => r.json());
  if (!login.token) throw new Error("Login falló: " + (login.message || "sin token"));
  console.log(`Login OK (${login.user.email}, rol ${login.user.rol})`);

  // 2) Calcula faltantes por (tema, tipo, enfoque) hasta META
  const { rows: todos } = await pool.query(
    `SELECT t.id AS tema_id, t.nombre AS tema, m.id AS materia_id, m.nombre AS materia
     FROM temas t JOIN materias m ON m.id = t.materia_id
     ${WHERE_MATERIAS} ORDER BY t.id`
  );
  const { rows: hay } = await pool.query(
    `SELECT tema_id, tipo, enfoque, count(*) AS n,
            array_agg(left(pregunta, 120)) AS muestras
     FROM preguntas ${WHERE_MATERIAS ? "WHERE tema_id BETWEEN 1 AND 23" : ""}
     GROUP BY tema_id, tipo, enfoque`
  );
  const mapa = new Map(hay.map((r) => [`${r.tema_id}|${r.tipo}|${r.enfoque}`, r]));

  const trabajos = [];
  if (PLAN_20) {
    // Plan 20 por apartado y tema (solo Aritmética + Álgebra)
    const PLAN = [
      { tipo: "ejercicios", enfoque: "teorica", niveles: { any: 8 } },
      { tipo: "ejercicios", enfoque: "practica", niveles: { 400: 2, 800: 8, 1200: 2 } },
      { tipo: "evaluacion", enfoque: "teorica", niveles: { any: 8 } },
      { tipo: "evaluacion", enfoque: "practica", niveles: { 400: 2, 800: 8, 1200: 2 } },
      { tipo: "simulacion", enfoque: "practica", niveles: { 400: 2, 800: 8, 1200: 2 } },
    ];
    const { rows: det } = await pool.query(
      `SELECT tema_id, tipo, enfoque, nivel, count(*) AS n,
              array_agg(left(pregunta, 120)) AS muestras
       FROM preguntas WHERE tema_id BETWEEN 1 AND 23
       GROUP BY tema_id, tipo, enfoque, nivel`
    );
    const por = (tema, tipo, enfoque, nivel) =>
      det.find((r) => r.tema_id === tema && r.tipo === tipo && r.enfoque === enfoque && (nivel === "any" || Number(r.nivel) === nivel));
    for (const t of todos) {
      for (const p of PLAN) {
        for (const [nivKey, meta] of Object.entries(p.niveles)) {
          let tiene = 0, evitar = [];
          if (nivKey === "any") {
            const filas = det.filter((r) => r.tema_id === t.tema_id && r.tipo === p.tipo && r.enfoque === p.enfoque);
            tiene = filas.reduce((a, r) => a + Number(r.n), 0);
            evitar = filas.flatMap((r) => r.muestras || []);
          } else {
            const reg = por(t.tema_id, p.tipo, p.enfoque, Number(nivKey));
            tiene = reg ? Number(reg.n) : 0;
            evitar = reg && reg.muestras ? reg.muestras : [];
          }
          for (let i = tiene; i < meta; i++) {
            const nivelNum = nivKey === "any" ? 800 : Number(nivKey);
            trabajos.push({
              ...t, tipo: p.tipo, enfoque: p.enfoque,
              levelNombre: NIVEL_NOMBRE[nivelNum], nivelNum,
              evitar: [...evitar],
            });
          }
        }
      }
    }
  } else if (MIX_SIMULACION) {
    // Mezcla por nivel: 3 básico + 5 medio + 2 avanzado por tema
    const MEZCLA = [
      { nivel: 400, nombre: "Basico", meta: 3 },
      { nivel: 800, nombre: "Medio", meta: 5 },
      { nivel: 1200, nombre: "Avanzado", meta: 2 },
    ];
    const { rows: porNivel } = await pool.query(
      `SELECT tema_id, nivel, count(*) AS n, array_agg(left(pregunta, 120)) AS muestras
       FROM preguntas WHERE tipo = 'simulacion' GROUP BY tema_id, nivel`
    );
    const mapaN = new Map(porNivel.map((r) => [`${r.tema_id}|${r.nivel}`, r]));
    for (const t of todos) {
      for (const m of MEZCLA) {
        const reg = mapaN.get(`${t.tema_id}|${m.nivel}`);
        const tiene = reg ? Number(reg.n) : 0;
        const evitar = reg && reg.muestras ? reg.muestras : [];
        for (let i = tiene; i < m.meta; i++) {
          trabajos.push({ ...t, tipo: "simulacion", enfoque: "practica", levelNombre: m.nombre, nivelNum: m.nivel, evitar: [...evitar] });
        }
      }
    }
  } else {
    for (const t of todos) {
      for (const tipo of TIPOS) {
        for (const enfoque of ENFOQUES) {
          const reg = mapa.get(`${t.tema_id}|${tipo}|${enfoque}`);
          const tiene = reg ? Number(reg.n) : 0;
          const evitar = reg && reg.muestras ? reg.muestras : [];
          for (let i = tiene; i < META; i++) {
            trabajos.push({ ...t, tipo, enfoque, levelNombre: "Medio", nivelNum: 800, evitar: [...evitar] });
          }
        }
      }
    }
  }
  console.log(`Faltantes: ${trabajos.length} preguntas`);

  if (!trabajos.length) {
    console.log("Banco completo. Nada que hacer.");
    await pool.end();
    process.exit(0);
  }

  // 3) Socket al Master
  const socket = io(MASTER_URL, { autoConnect: false });
  await new Promise((res, rej) => {
    socket.once("connect", res);
    setTimeout(() => rej(new Error("sin conexión al Master")), 10000);
    socket.connect();
  });
  socket.emit("registro", { rol: "front-admin", token: login.token });
  await new Promise((res, rej) => {
    socket.once("registrado", res);
    socket.once("no_autorizado", (d) => rej(new Error("rechazado: " + d.message)));
    setTimeout(() => rej(new Error("registro sin respuesta")), 10000);
  });
  console.log("Registrado en Master. Iniciando lote...\n");

  let ok = 0, fallos = 0, cuotaSeguidos = 0;
  const fallidas = [];
  let abortar = false;

  for (const t of trabajos) {
    const tag = `[${t.materia} | ${t.tema} | ${t.tipo} | ${t.enfoque}${t.levelNombre && t.levelNombre !== "Medio" ? " | " + t.levelNombre : ""}]`;
    const t0 = Date.now();
    const stamp = () => new Date().toLocaleTimeString();
    try {
      socket.emit("GenerarPregunta", {
        subject: t.materia, topic: t.tema, level: t.levelNombre || "Medio",
        tipo: t.tipo, enfoque: t.enfoque, evitar: t.evitar,
      });
      const gen = await Promise.race([
        new Promise((res) => socket.once("preguntaGenerada", (d) => res({ ok: true, d }))),
        new Promise((res) => socket.once("errorIA", (d) => res({ ok: false, d }))),
        new Promise((_, rej) => setTimeout(() => rej(new Error("timeout 180s")), 180000)),
      ]);
      if (!gen.ok) throw new Error(gen.d.message);

      socket.emit("guardarPreguntaBD", {
        materia_solicitada: t.materia_id,
        tema_solicitado: t.tema_id,
        nivel_solicitado: t.nivelNum || 800, status: "approved",
        tipo: t.tipo, enfoque: gen.d.enfoque || t.enfoque,
        pregunta: gen.d.pregunta, opciones: gen.d.opciones,
        respuesta_correcta: gen.d.respuesta_correcta, explicacion: gen.d.explicacion,
      });
      const g = await Promise.race([
        new Promise((res) => socket.once("preguntaGuardada", (d) => res("id=" + d.id))),
        new Promise((res) => socket.once("errorGuardado", (d) => res("ERR " + d.message))),
        new Promise((_, rej) => setTimeout(() => rej(new Error("timeout save")), 20000)),
      ]);
      ok++;
      cuotaSeguidos = 0; // éxito: reinicia la racha de cuota
      // alimenta evitar para las siguientes del mismo combo en esta corrida
      t.evitar.push(gen.d.pregunta);
      console.log(`OK  [${stamp()} ${((Date.now() - t0) / 1000).toFixed(0)}s] ${tag} -> ${g}`);
    } catch (e) {
      fallos++;
      fallidas.push(`${tag}: ${e.message}`);
      console.log(`FAIL [${stamp()} ${((Date.now() - t0) / 1000).toFixed(0)}s] ${tag}: ${String(e.message).slice(0, 120)}`);
      // Aborta solo si la CUOTA DIARIA DE GROQ falla 3 veces seguidas.
      // (Los 429 por minuto y la cuota diaria de Gemini-respaldo se recuperan solos.)
      const segGroq = (e.message.match(/groq:\s*([^|]*)/i) || [])[1] || "";
      if (/TPD|\bRPD\b|per day|por d[ií]a|diaria|daily/i.test(segGroq)) {
        cuotaSeguidos++;
      } else {
        cuotaSeguidos = 0;
      }
      if (cuotaSeguidos >= 3) {
        console.log("Cuota diaria agotada 3 veces seguidas: abortando. Reejecuta mañana (solo hará lo faltante).");
        abortar = true;
        break;
      }
    }
    await sleep(PAUSA_MS);
  }
  if (abortar) {
    console.log("(abortado por cuota)");
  }

  console.log(`\n===== RESUMEN: ${ok} OK, ${fallos} fallidas =====`);
  fallidas.forEach((f) => console.log(" - " + f));
  socket.disconnect();
  await pool.end();
  process.exit(0);
}

main().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });
