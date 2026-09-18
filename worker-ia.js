// ============================================================
// Worker IA — nodo especializado del Módulo 3 (Sistemas Distribuidos)
// Procesa, valida y normaliza las peticiones pesadas de la IA.
// Se conecta al Master (:3001) y atiende trabajos "generar_pregunta"
// con salida JSON estructurada.
// Proveedores: Groq (rápido, gratis sin tarjeta) con respaldo en Gemini.
// Se elige con AI_PROVIDER=groq|gemini|auto en el .env.
// Uso: node worker-ia.js
// ============================================================
require("dotenv").config();
const { io } = require("socket.io-client");
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const MASTER_URL = process.env.MASTER_URL || "http://localhost:3001";
const WORKER_KEY = process.env.MASTER_WORKER_KEY || "dev-worker-key";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";
const fs = require("fs");
const path = require("path");

// Lee el material oficial del tema extraído de la web (scripts/extraer_contenidos.js)
function cargarMaterial(temaId) {
  if (!temaId) return null;
  try {
    const p = path.join(__dirname, "contenidos", `tema_${Number(temaId)}.txt`);
    if (!fs.existsSync(p)) return null;
    return fs.readFileSync(p, "utf8").slice(0, 3500);
  } catch {
    return null;
  }
}

const NIVEL_ALIAS = {
  "básico": "Basico", "basico": "Basico",
  "medio": "Medio",
  "avanzado": "Avanzado",
  "400": "Basico", "800": "Medio", "1200": "Avanzado",
};

const TIPO_INSTRUCCION = {
  ejercicios: "Es un EJERCICIO de práctica: la explicación debe ser breve y didáctica, máximo 4 pasos cortos.",
  evaluacion: "Es un reactivo de EXAMEN DE EVALUACIÓN estilo Piense II (UDG): enunciado preciso, sin pistas en las opciones, explicación breve máximo 3 pasos.",
  simulacion: "Es un reactivo de EXAMEN DE SIMULACIÓN estilo Piense II (UDG): debe poder resolverse en ~2 minutos, con distractores que reflejen errores comunes del alumno, explicación breve máximo 3 pasos.",
};

function normalizarNivel(level) {
  const k = String(level || "Medio").trim().toLowerCase();
  return NIVEL_ALIAS[k] || "Medio";
}

function buildPrompt({ subject, topic, level, tipo, material }) {
  const nivel = normalizarNivel(level);
  const t = TIPO_INSTRUCCION[tipo] || TIPO_INSTRUCCION.ejercicios;
  const dificultad =
    nivel === "Basico" ? "básico (aplicación directa de una regla)" :
    nivel === "Avanzado" ? "avanzado (requiere combinar 2-3 pasos de razonamiento)" :
    "medio (requiere un procedimiento de 2 pasos)";

  let prompt = `Eres un profesor de matemáticas de tercero de secundaria en México. Genera UN reactivo de opción múltiple para el examen de admisión a preparatorias UDG (Piense II).

Materia: ${subject}
Tema específico: ${topic}
Nivel: ${dificultad}
${t}

Reglas estrictas:
- La pregunta debe ser del tema indicado, sin salirte de él.
- Exactamente 4 opciones, solo UNA correcta. Los distractores deben ser errores típicos de alumnos, no respuestas absurdas.
- respuesta_correcta debe ser EXACTAMENTE igual a una de las 4 opciones.
- Usa LaTeX para las matemáticas: $...$ para fórmulas en línea y $$...$$ para centradas. Nada de texto plano como "x^2" fuera de LaTeX. Nada de caracteres unicode como x²: SIEMPRE escribe $x^2$.
- Sé conciso: nada de saludos ni introducciones largas, ve directo al reactivo.
- Redacta en español neutro mexicano, claro para un alumno de 15 años.
- FORMATO DE SALIDA OBLIGATORIO (objeto plano, sin anidar, sin letras en las opciones):
{"pregunta": "texto con $LaTeX$", "opciones": ["op1", "op2", "op3", "op4"], "respuesta_correcta": "op2", "explicacion": "pasos breves"}`;

  if (material) {
    prompt += `

MATERIAL DE ESTUDIO OFICIAL DE LA PLATAFORMA (única fuente permitida):
---
${material}
---
REGLA DE ORO: genera el reactivo usando EXCLUSIVAMENTE los conceptos, definiciones, ejemplos y métodos del material anterior. No introduzcas fórmulas, procedimientos ni temas que no aparezcan ahí. Si el material no alcanza para el nivel pedido, baja la dificultad pero sin salirte del material.`;
  }
  return prompt;
}

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    pregunta: { type: SchemaType.STRING },
    opciones: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    respuesta_correcta: { type: SchemaType.STRING },
    explicacion: { type: SchemaType.STRING },
  },
  required: ["pregunta", "opciones", "respuesta_correcta", "explicacion"],
};

// Normaliza variantes de formato (algunos modelos anidan el objeto
// o devuelven las opciones como [{letra, texto}]) al esquema plano.
function normalizarRespuesta(parsed) {
  let o = parsed || {};
  // Desanida un nivel común: {reactivo: {...}}, {pregunta: {...}} etc.
  for (const k of ["reactivo", "pregunta_obj", "question_obj", "result"]) {
    if (o[k] && typeof o[k] === "object" && !Array.isArray(o[k])) { o = o[k]; break; }
  }
  // Cuidado: {pregunta: "texto..."} es válido; solo desanidar si es objeto
  if (o.pregunta && typeof o.pregunta === "object" && !Array.isArray(o.pregunta)) o = o.pregunta;

  const str = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));
  let opciones = o.opciones ?? o.options ?? o.alternativas ?? [];
  let letras = [];
  if (Array.isArray(opciones) && opciones.length && typeof opciones[0] === "object") {
    letras = opciones.map((x) => str(x.letra || x.letter || ""));
    opciones = opciones.map((x) => str(x.texto ?? x.text ?? x.opcion ?? x.valor ?? x.label ?? ""));
  }
  let respuesta = str(o.respuesta_correcta ?? o.respuesta ?? o.correcta ?? o.answer ?? o.opcion_correcta ?? "");
  // Si la respuesta es una letra ("B") y hay letras, resuelve al texto
  if (/^[A-Da-d]$/.test(respuesta.trim()) && letras.length === opciones.length) {
    const idx = "ABCD".indexOf(respuesta.trim().toUpperCase());
    if (idx >= 0 && opciones[idx]) respuesta = opciones[idx];
  }
  // Quita prefijos "A) ", "B. " si el modelo los pegó al texto
  opciones = (Array.isArray(opciones) ? opciones : []).map((t) =>
    String(t).replace(/^[A-Da-d][).\-:]\s*/, "")
  );
  if (/^[A-Da-d][).\-:]\s*/.test(respuesta)) respuesta = respuesta.replace(/^[A-Da-d][).\-:]\s*/, "");
  // Re-resuelve por si la respuesta quedó como letra suelta tras limpiar
  if (!opciones.includes(respuesta) && /^[A-Da-d]$/.test(respuesta.trim()) && letras.length === opciones.length) {
    const idx = "ABCD".indexOf(respuesta.trim().toUpperCase());
    if (idx >= 0 && opciones[idx]) respuesta = opciones[idx];
  }

  return {
    pregunta: str(o.pregunta ?? o.enunciado ?? o.question ?? ""),
    opciones,
    respuesta_correcta: respuesta,
    explicacion: str(o.explicacion ?? o.explicacion_paso_a_paso ?? o.explanation ?? o.solucion ?? ""),
  };
}

// Extrae el JSON de la respuesta cruda y lo normaliza al esquema plano
function extraerPregunta(raw) {
  const ini = String(raw || "").indexOf("{");
  const fin = String(raw || "").lastIndexOf("}");
  const recortado = ini >= 0 && fin > ini ? String(raw).slice(ini, fin + 1) : String(raw || "");
  let parsed;
  try {
    parsed = JSON.parse(recortado);
  } catch {
    throw new Error("La IA devolvió JSON inválido");
  }
  return validar(normalizarRespuesta(parsed));
}

function validar(pregunta) {
  if (!pregunta || typeof pregunta.pregunta !== "string" || !pregunta.pregunta.trim()) {
    throw new Error("La IA devolvió una pregunta vacía");
  }
  if (!Array.isArray(pregunta.opciones) || pregunta.opciones.length !== 4) {
    throw new Error("La IA debe devolver exactamente 4 opciones");
  }
  if (!pregunta.opciones.includes(pregunta.respuesta_correcta)) {
    throw new Error("La respuesta correcta no coincide con ninguna opción");
  }
  const out = {
    pregunta: pregunta.pregunta.trim(),
    opciones: pregunta.opciones.map((o) => String(o)),
    respuesta_correcta: String(pregunta.respuesta_correcta),
    explicacion: String(pregunta.explicacion || ""),
  };
  // Validación LaTeX: al menos un fragmento matemático ($...$, $$...$$,
  // \(...\) o \[...\]) entre enunciado, opciones y respuesta
  const textoTotal = [out.pregunta, ...out.opciones, out.respuesta_correcta].join(" ");
  const tieneLatex = /\$\$[^$]+\$\$|\$[^$\n]+\$|\\\(|\\\[/.test(textoTotal);
  if (!tieneLatex) {
    throw new Error("La IA no usó formato LaTeX");
  }
  return out;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function esReintentable(err) {
  return /503|429|500|overloaded|high demand|service unavailable|timeout|timed out|fetch failed/i.test(
    String((err && err.message) || err || "")
  );
}

async function generarConGemini(job) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Falta GEMINI_API_KEY en el .env del worker");
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const prompt = buildPrompt(job);

  // Cadena de modelos: si el principal se satura (503), se intenta
  // con los siguientes antes de rendirse.
  const modelos = [...new Set([
    GEMINI_MODEL,
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-flash-latest",
  ])];

  let ultimoError = null;
  for (const modelo of modelos) {
    for (let intento = 1; intento <= 2; intento++) {
      try {
        console.log(`[worker-ia] Intentando ${modelo} (intento ${intento})...`);
        const model = genAI.getGenerativeModel({
          model: modelo,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        });
        const result = await model.generateContent(prompt);
        return extraerPregunta(result.response.text());
      } catch (err) {
        const msg = String((err && err.message) || err || "");
        // JSON inválido o sin LaTeX: se reintenta (nuevo muestreo con la
        // misma instrucción reforzada por el historial del fallo)
        const reintentableContenido = msg === "La IA devolvió JSON inválido" || msg === "La IA no usó formato LaTeX";
        if (!esReintentable(err) && !reintentableContenido) throw err;
        ultimoError = err;
        console.warn(`[worker-ia] ${modelo} saturado, esperando antes de reintentar...`);
        await sleep(2500 * intento);
      }
    }
  }
  throw ultimoError || new Error("Gemini no respondió en ningún modelo");
}

// ---- Proveedor Groq (rápido, gratis sin tarjeta, API OpenAI-compatible) ----
async function generarConGroq(job) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Falta GROQ_API_KEY en el .env del worker");
  }
  const prompt = buildPrompt(job);
  let ultimoError = null;

  for (let intento = 1; intento <= 2; intento++) {
    try {
      console.log(`[worker-ia] Intentando Groq/${GROQ_MODEL} (intento ${intento})...`);
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.GROQ_API_KEY,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0.7,
          max_completion_tokens: 900,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "Generas reactivos de matemáticas en español con LaTeX ($...$ en línea, $$...$$ centrado). Respondes ÚNICAMENTE con un objeto JSON válido, sin texto adicional.",
            },
            { role: "user", content: prompt },
          ],
        }),
        signal: AbortSignal.timeout(45000),
      });
      if (!res.ok) {
        const detalle = await res.text().catch(() => "");
        throw new Error(`Groq ${res.status}: ${detalle.slice(0, 150)}`);
      }
      const data = await res.json();
      const raw = (((data.choices || [])[0] || {}).message || {}).content || "";
      return extraerPregunta(raw);
    } catch (err) {
      const msg = String((err && err.message) || err || "");
      // 401/403/400 = key o modelo inválido: no reintentar, pasar al siguiente proveedor
      if (/Groq 40[013]/.test(msg)) throw err;
      const reintentableContenido = msg === "La IA devolvió JSON inválido" || msg === "La IA no usó formato LaTeX";
      if (!esReintentable(err) && !reintentableContenido) throw err;
      ultimoError = err;
      console.warn(`[worker-ia] Groq saturado, esperando antes de reintentar...`);
      await sleep(2000 * intento);
    }
  }
  throw ultimoError || new Error("Groq no respondió");
}

// ---- Cadena de proveedores: Groq primero, Gemini de respaldo ----
async function generarPregunta(job) {
  const pref = String(process.env.AI_PROVIDER || "auto").toLowerCase();
  const cadena = [];
  if (pref === "groq") cadena.push(["groq", generarConGroq], ["gemini", generarConGemini]);
  else if (pref === "gemini") cadena.push(["gemini", generarConGemini], ["groq", generarConGroq]);
  else {
    if (process.env.GROQ_API_KEY) cadena.push(["groq", generarConGroq]);
    if (process.env.GEMINI_API_KEY) cadena.push(["gemini", generarConGemini]);
  }
  if (!cadena.length) {
    throw new Error("Sin proveedores de IA: configura GROQ_API_KEY o GEMINI_API_KEY en el .env");
  }
  const errores = [];
  for (const [nombre, fn] of cadena) {
    try {
      console.log(`[worker-ia] Proveedor activo: ${nombre}`);
      return await fn(job);
    } catch (err) {
      console.warn(`[worker-ia] Proveedor ${nombre} falló: ${err.message}`);
      errores.push(`${nombre}: ${err.message}`);
    }
  }
  throw new Error("Ningún proveedor respondió (" + errores.join(" | ") + ")");
}

function conectar() {
  console.log(`[worker-ia] Conectando al Master ${MASTER_URL} ...`);
  const socket = io(MASTER_URL, { reconnectionDelay: 2000 });

  socket.on("connect", () => {
    console.log("[worker-ia] Conectado. Registrándose como worker-ia...");
    socket.emit("registro", { rol: "worker-ia", key: WORKER_KEY });
  });

  socket.on("registrado", (info) => {
    console.log("[worker-ia] Registro aceptado:", info);
  });

  socket.on("no_autorizado", (info) => {
    console.error("[worker-ia] Registro rechazado:", info && info.message);
  });

  socket.on("disconnect", (razon) => {
    console.log("[worker-ia] Desconectado del Master:", razon);
  });

  // El Master delega aquí el trabajo pesado con callback (ack)
  socket.on("generar_pregunta", async (job, callback) => {
    const responder = typeof callback === "function" ? callback : () => {};
    console.log(`[worker-ia] Trabajo recibido: ${job.topic} (${job.level}, ${job.tipo || "ejercicios"})`);
    try {
      // Ejercicios y evaluación: SOLO con el material oficial de la web
      const tipo = job.tipo || "ejercicios";
      let material = null;
      if (tipo === "ejercicios" || tipo === "evaluacion") {
        material = cargarMaterial(job.tema_id);
        if (!material) {
          responder({
            ok: false,
            error: `El tema "${job.topic}" aún no tiene material de estudio en la plataforma. Sube el contenido en la web y ejecuta: node scripts/extraer_contenidos.js`,
          });
          return;
        }
      }
      const normalizada = await generarPregunta({ ...job, material });
      responder({
        ok: true,
        pregunta: {
          materia_solicitada: job.subject,
          tema_solicitado: job.topic,
          nivel_solicitado: normalizarNivel(job.level),
          ...normalizada,
        },
      });
      console.log("[worker-ia] Trabajo completado y validado.");
    } catch (err) {
      console.error("[worker-ia] Error generando:", err.message);
      responder({ ok: false, error: err.message });
    }
  });
}

conectar();
