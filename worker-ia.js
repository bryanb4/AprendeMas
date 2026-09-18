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
// Lista de rotación: cada modelo tiene presupuesto diario propio.
// GROQ_MODELS="modelo-a,modelo-b" o un solo GROQ_MODEL (compat).
const GROQ_MODELS = String(
  process.env.GROQ_MODELS || process.env.GROQ_MODEL || "qwen/qwen3.8-27b"
).split(",").map((m) => m.trim()).filter(Boolean);
const CEREBRAS_MODEL = process.env.CEREBRAS_MODEL || "gpt-oss-120b";
const fs = require("fs");
const path = require("path");

// Lee el material oficial del tema extraído de la web (scripts/extraer_contenidos.js)
function cargarMaterial(temaId) {
  if (!temaId) return null;
  try {
    const p = path.join(__dirname, "contenidos", `tema_${Number(temaId)}.txt`);
    if (!fs.existsSync(p)) return null;
    // Tope 2000 chars: suficiente contexto (definiciones + ejemplos)
    // sin quemar la cuota diaria de tokens
    return fs.readFileSync(p, "utf8").slice(0, 2000);
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

// Enfoque (solo ejercicios y evaluación): teórica = comprensión literal
// del material; práctica = problema numérico o aplicado.
const ENFOQUE_INSTRUCCION = {
  teorica: `ENFOQUE TEÓRICO: pregunta de COMPRENSIÓN LITERAL del material de estudio. La respuesta correcta debe estar escrita casi textualmente en el material (una definición, propiedad o regla). Ejemplo: si el material dice "las raíces pueden ser decimales", una pregunta válida es "¿Las raíces pueden ser decimales?" y la respuesta se toma de ese fragmento. Los distractores deben ser negaciones o alteraciones plausibles de ese mismo fragmento, NO cálculos ni problemas nuevos.`,
  practica: `ENFOQUE PRÁCTICO: problema para RESOLVER con lápiz: una operación directa (ej. "¿Cuánto es $2x+20$ si $x=...$") o un problema aplicado de vida cotidiana con los métodos del tema (ej. "Si Alejandro tiene 2 veces más $20$ que yo... ¿cuánto tiene?"). La pregunta SIEMPRE exige calcular o aplicar un procedimiento, nunca solo recordar una definición.`,
};

function normalizarEnfoque(e) {
  return String(e || "").toLowerCase() === "teorica" ? "teorica" : "practica";
}

function normalizarNivel(level) {
  const k = String(level || "Medio").trim().toLowerCase();
  return NIVEL_ALIAS[k] || "Medio";
}

function buildPrompt({ subject, topic, level, tipo, enfoque, material, evitar }) {
  const nivel = normalizarNivel(level);
  const t = TIPO_INSTRUCCION[tipo] || TIPO_INSTRUCCION.ejercicios;
  const enf = normalizarEnfoque(enfoque);
  const e = (tipo === "ejercicios" || tipo === "evaluacion")
    ? `\n${ENFOQUE_INSTRUCCION[enf]}`
    : "";
  const dificultad =
    nivel === "Basico" ? "básico (aplicación directa de una regla)" :
    nivel === "Avanzado" ? "avanzado (requiere combinar 2-3 pasos de razonamiento)" :
    "medio (requiere un procedimiento de 2 pasos)";

  let prompt = `Eres un profesor de matemáticas de tercero de secundaria en México. Genera UN reactivo de opción múltiple para el examen de admisión a preparatorias UDG (Piense II).

Materia: ${subject}
Tema específico: ${topic}
Nivel: ${dificultad}
${t}${e}

Reglas estrictas:
- La pregunta debe ser del tema indicado, sin salirte de él.
- Exactamente 4 opciones, solo UNA correcta. Los distractores deben ser errores típicos de alumnos, no respuestas absurdas.
- respuesta_correcta debe ser EXACTAMENTE igual a una de las 4 opciones.
- Usa LaTeX para las matemáticas: $...$ para fórmulas en línea y $$...$$ para centradas. Nada de texto plano como "x^2" fuera de LaTeX. Nada de caracteres unicode como x²: SIEMPRE escribe $x^2$.
- PROHIBIDO usar diagonales como comandos: NUNCA escribas /div, /times, /sqrt, /frac o /cdot. Siempre con backslash: \div, \times, \sqrt, \frac, \cdot.
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

  if (Array.isArray(evitar) && evitar.length) {
    prompt += `

PREGUNTAS QUE YA EXISTEN (no las repitas ni generes variantes casi idénticas):
---
${evitar.slice(0, 12).map((t, i) => `${i + 1}. ${String(t).slice(0, 120)}`).join("\n")}
---`;
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

// Repara comandos con diagonal (/div -> \div) SOLO dentro de $...$
// (fuera de matemáticas, "Mult/div" es texto válido y no se toca)
function repararDiagonales(s) {
  return String(s).replace(/\$\$[^$]*\$\$|\$[^$\n]*\$/g, (m) =>
    m.replace(/\/(div|times|sqrt|frac|cdot|pm|geq|leq|neq|infty|alpha|beta|theta|pi|sum|prod|int)\b/g, "\\$1")
  );
}

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
    repararDiagonales(String(t).replace(/^[A-Da-d][).\-:]\s*/, ""))
  );
  if (/^[A-Da-d][).\-:]\s*/.test(respuesta)) respuesta = respuesta.replace(/^[A-Da-d][).\-:]\s*/, "");
  // Re-resuelve por si la respuesta quedó como letra suelta tras limpiar
  if (!opciones.includes(respuesta) && /^[A-Da-d]$/.test(respuesta.trim()) && letras.length === opciones.length) {
    const idx = "ABCD".indexOf(respuesta.trim().toUpperCase());
    if (idx >= 0 && opciones[idx]) respuesta = opciones[idx];
  }

  return {
    pregunta: repararDiagonales(str(o.pregunta ?? o.enunciado ?? o.question ?? "")),
    opciones,
    respuesta_correcta: repararDiagonales(respuesta),
    explicacion: repararDiagonales(str(o.explicacion ?? o.explicacion_paso_a_paso ?? o.explanation ?? o.solucion ?? "")),
  };
}

// Extrae el JSON de la respuesta cruda y lo normaliza al esquema plano.
// exigirLatex=false en teóricas puras (pueden no llevar matemáticas).
function extraerPregunta(raw, exigirLatex = true) {
  const ini = String(raw || "").indexOf("{");
  const fin = String(raw || "").lastIndexOf("}");
  const recortado = ini >= 0 && fin > ini ? String(raw).slice(ini, fin + 1) : String(raw || "");
  let parsed;
  try {
    parsed = JSON.parse(recortado);
  } catch {
    throw new Error("La IA devolvió JSON inválido");
  }
  return validar(normalizarRespuesta(parsed), exigirLatex);
}

function validar(pregunta, exigirLatex = true) {
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
  // \(...\) o \[...\]) entre enunciado, opciones y respuesta.
  // Se omite en teóricas puras, que pueden no llevar matemáticas.
  const textoTotal = [out.pregunta, ...out.opciones, out.respuesta_correcta].join(" ");
  const tieneLatex = /\$\$[^$]+\$\$|\$[^$\n]+\$|\\\(|\\\[/.test(textoTotal);
  if (exigirLatex && !tieneLatex) {
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
        return extraerPregunta(result.response.text(), job.enfoque !== "teorica");
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
// Rota entre modelos: cada uno tiene presupuesto diario propio. Ante
// cuota/429 del modelo actual, pasa al siguiente sin quemar reintentos.
async function generarConGroq(job) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Falta GROQ_API_KEY en el .env del worker");
  }
  const prompt = buildPrompt(job);
  let ultimoError = null;

  for (const modelo of GROQ_MODELS) {
    for (let intento = 1; intento <= 2; intento++) {
      try {
        console.log(`[worker-ia] Intentando Groq/${modelo} (intento ${intento})...`);
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.GROQ_API_KEY,
          },
          body: JSON.stringify({
            model: modelo,
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
          throw new Error(`Groq ${res.status} [${modelo}]: ${detalle.slice(0, 150)}`);
        }
        const data = await res.json();
        const raw = (((data.choices || [])[0] || {}).message || {}).content || "";
        return extraerPregunta(raw, job.enfoque !== "teorica");
      } catch (err) {
        const msg = String((err && err.message) || err || "");
        // 401/403/400/404 = key o modelo inválido: saltar al siguiente modelo
        if (/Groq 40[134]/.test(msg)) {
          console.warn(`[worker-ia] ${modelo} inválido, rotando...`);
          ultimoError = err;
          break;
        }
        // Cuota/límite del modelo actual: rotar sin quemar más intentos aquí
        if (/429|TPD|\bRPD\b|rate.limit|cuota|quota/i.test(msg)) {
          console.warn(`[worker-ia] ${modelo} topado, rotando...`);
          ultimoError = err;
          break;
        }
        const reintentableContenido = msg === "La IA devolvió JSON inválido" || msg === "La IA no usó formato LaTeX";
        if (!esReintentable(err) && !reintentableContenido) throw err;
        ultimoError = err;
        console.warn(`[worker-ia] Groq/${modelo} falló, esperando antes de reintentar...`);
        await sleep(2000 * intento);
      }
    }
  }
  throw ultimoError || new Error("Groq no respondió en ningún modelo");
}

// ---- Proveedor Cerebras (rapidísimo, ~3000 tok/s, API OpenAI-compatible) ----
async function generarConCerebras(job) {
  if (!process.env.CEREBRAS_API_KEY) {
    throw new Error("Falta CEREBRAS_API_KEY en el .env del worker");
  }
  const prompt = buildPrompt(job);
  let ultimoError = null;

  for (let intento = 1; intento <= 2; intento++) {
    try {
      console.log(`[worker-ia] Intentando Cerebras/${CEREBRAS_MODEL} (intento ${intento})...`);
      const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.CEREBRAS_API_KEY,
        },
        body: JSON.stringify({
          model: CEREBRAS_MODEL,
          temperature: 0.7,
          max_completion_tokens: 1200,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "Generas reactivos de matemáticas en español con LaTeX ($...$ en línea, $$...$$ centrado). Respondes ÚNICAMENTE con un objeto JSON válido, sin texto adicional.",
            },
            { role: "user", content: prompt },
          ],
        }),
        signal: AbortSignal.timeout(60000),
      });
      if (!res.ok) {
        const detalle = await res.text().catch(() => "");
        throw new Error(`Cerebras ${res.status}: ${detalle.slice(0, 150)}`);
      }
      const data = await res.json();
      const raw = (((data.choices || [])[0] || {}).message || {}).content || "";
      return extraerPregunta(raw, job.enfoque !== "teorica");
    } catch (err) {
      const msg = String((err && err.message) || err || "");
      // 401/403/404 = key o modelo inválido: no reintentar aquí
      if (/Cerebras 40[134]/.test(msg)) throw err;
      const reintentableContenido = msg === "La IA devolvió JSON inválido" || msg === "La IA no usó formato LaTeX";
      if (!esReintentable(err) && !reintentableContenido) throw err;
      ultimoError = err;
      console.warn(`[worker-ia] Cerebras falló, esperando antes de reintentar...`);
      await sleep(2000 * intento);
    }
  }
  throw ultimoError || new Error("Cerebras no respondió");
}

// ---- Cadena de proveedores: Cerebras > Groq > Gemini ----
async function generarPregunta(job) {
  const pref = String(process.env.AI_PROVIDER || "auto").toLowerCase();
  const cadena = [];
  const conCerebras = async () => generarConCerebras(job);
  const conGroq = async () => generarConGroq(job);
  const conGemini = async () => generarConGemini(job);
  if (pref === "cerebras") cadena.push(["cerebras", conCerebras], ["groq", conGroq], ["gemini", conGemini]);
  else if (pref === "groq") cadena.push(["groq", conGroq], ["cerebras", conCerebras], ["gemini", conGemini]);
  else if (pref === "gemini") cadena.push(["gemini", conGemini], ["cerebras", conCerebras], ["groq", conGroq]);
  else {
    if (process.env.CEREBRAS_API_KEY) cadena.push(["cerebras", conCerebras]);
    if (process.env.GROQ_API_KEY) cadena.push(["groq", conGroq]);
    if (process.env.GEMINI_API_KEY) cadena.push(["gemini", conGemini]);
  }
  if (!cadena.length) {
    throw new Error("Sin proveedores de IA: configura CEREBRAS_API_KEY, GROQ_API_KEY o GEMINI_API_KEY en el .env");
  }
  const errores = [];
  for (const [nombre, fn] of cadena) {
    try {
      console.log(`[worker-ia] Proveedor activo: ${nombre}`);
      const out = await fn(job);
      out.proveedor = nombre;
      return out;
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
      // Ejercicios y evaluación: SOLO con el material oficial de la web.
      // forzar:true (bootstrap admin) omite el requisito para temas
      // que aún no tienen contenido extraído.
      const tipo = job.tipo || "ejercicios";
      let material = null;
      if ((tipo === "ejercicios" || tipo === "evaluacion") && !job.forzar) {
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
