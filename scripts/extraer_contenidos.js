// Extrae el texto de estudio por tema desde las páginas del frontend
// y lo guarda en contenidos/tema_<id>.txt + contenidos/manifest.json
// Uso: node scripts/extraer_contenidos.js
// Los IDs corresponden a database/migracion_preguntas.sql
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "mi-proyecto", "src", "pages");
const OUT = path.join(__dirname, "..", "contenidos");

function limpiar(fragmento) {
  let t = fragmento;
  // 0) Protege fórmulas con placeholders (sus llaves no se tocan)
  const mates = [];
  const guardar = (tag, tex) => {
    mates.push({ tag, tex });
    return `\u0001MATE${mates.length - 1}\u0001`;
  };
  t = t.replace(/<(F|Formula)\s+tex="([^"]*)"\s*\/>/g, (_, tag, tex) => guardar(tag, tex));
  t = t.replace(/<F>([^<]*)<\/F>/g, (_, tex) => guardar("F", tex));
  t = t.replace(/<Formula>([^<]*)<\/Formula>/g, (_, tex) => guardar("Formula", tex));
  // 1) Expresiones JS { ... } del fuente
  t = t.replace(/\{\s*['"]\s*['"]\s*\}/g, " ");
  t = t.replace(/\{[^}]*\}/g, " ");
  // 2) Restaura fórmulas como $...$ / $$...$$
  t = t.replace(/\u0001MATE(\d+)\u0001/g, (_, n) => {
    const m = mates[Number(n)] || { tag: "F", tex: "" };
    return m.tag === "Formula" ? ` $$${m.tex}$$ ` : ` $${m.tex}$ `;
  });
  // Imágenes -> su descripción alt
  t = t.replace(/<img[^>]*alt="([^"]*)"[^>]*\/?>/g, (_, alt) => ` [Imagen: ${alt}] `);
  t = t.replace(/<img[^>]*\/?>/g, " ");
  // Tags -> saltos/espacios
  t = t.replace(/<\/(p|div|h\d|li|tr|ul|ol|table|section|article)>/g, "\n");
  t = t.replace(/<(br|hr|img)[^>]*\/?>/g, "\n");
  t = t.replace(/<[^>]+>/g, " ");
  // Entidades comunes
  t = t.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
  // Normaliza espacios
  t = t.split("\n").map((l) => l.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean).join("\n");
  return t;
}

// Corta el cuerpo de function NOMBRE( ... ) hasta la próxima
// function de componente o marca de fin, a nivel de inicio de línea
function extraerFuncion(src, nombre, stops) {
  const inicio = src.search(new RegExp(`^(export\\s+)?function ${nombre}\\s*\\(`, "m"));
  if (inicio < 0) return null;
  let fin = src.length;
  for (const s of stops) {
    const m = src.slice(inicio + 10).search(s);
    if (m >= 0) fin = Math.min(fin, inicio + 10 + m);
  }
  return src.slice(inicio, fin);
}

const STOP = [/^(export\s+)?function [A-Z]\w*\s*\(/m, /^const secciones\s*=/m];

const PLAN = [
  {
    archivo: "AritmeticaPage.jsx", materia: "Aritmética",
    temas: [
      { id: 1, titulo: "Números Reales", comp: "Seccion11" },
      { id: 2, titulo: "Potencias Enteras Positivas y Leyes de Exponentes", comp: "Seccion12" },
      { id: 3, titulo: "Raíz Cuadrada", comp: "Seccion13" },
      { id: 4, titulo: "Operaciones y Jerarquía", comp: "Seccion14" },
      { id: 5, titulo: "Operaciones con fracciones", comp: "Seccion15" },
    ],
  },
  {
    archivo: "AlgebraPage.jsx", materia: "Álgebra",
    temas: [
      { id: 6, titulo: "Expresiones algebraicas con una variable", comp: "Seccion21" },
      { id: 7, titulo: "Tipo de expresiones", comp: "Seccion211" },
      { id: 8, titulo: "Ecuaciones", comp: "Seccion212" },
      { id: 9, titulo: "Inecuaciones en una variable", comp: "Seccion213" },
      { id: 10, titulo: "Ecuaciones lineales en varias variables", comp: "Seccion22" },
      { id: 11, titulo: "Sistema de ecuaciones con 2 variables (2x2)", comp: "Seccion222" },
      { id: 12, titulo: "Polinomios", comp: "Seccion23" },
      { id: 13, titulo: "Multiplicación y división de polinomios", comp: "Seccion231" },
      { id: 14, titulo: "Factorización de polinomios", comp: "Seccion24" },
      { id: 15, titulo: "Factorización parte 2", comp: "Seccion241" },
      { id: 16, titulo: "Factorización parte 3", comp: "Seccion242" },
      { id: 17, titulo: "Expresiones algebraicas racionales o fracciones algebraicas", comp: "Seccion25" },
      { id: 18, titulo: "Suma y resta de expresiones algebraicas racionales", comp: "Seccion252" },
      { id: 19, titulo: "Multiplicación y división de expresiones algebraicas racionales", comp: "Seccion253" },
      { id: 20, titulo: "Ecuaciones cuadráticas", comp: "Seccion26" },
      { id: 21, titulo: "Plano cartesiano", comp: "Seccion27" },
      { id: 22, titulo: "Funciones y sus gráficas", comp: "Seccion28" },
      { id: 23, titulo: "Sistemas de ecuaciones lineales en dos variables", comp: "Seccion29" },
    ],
  },
];

fs.mkdirSync(OUT, { recursive: true });
const manifest = [];
for (const bloque of PLAN) {
  // Las páginas están en UTF-8: leer así para no romper acentos
  const src = fs.readFileSync(path.join(SRC, bloque.archivo), "utf8");
  for (const t of bloque.temas) {
    const crudo = extraerFuncion(src, t.comp, STOP);
    if (!crudo) {
      console.log(`AVISO: no se encontró ${t.comp} en ${bloque.archivo}`);
      continue;
    }
    const texto = limpiar(crudo);
    fs.writeFileSync(path.join(OUT, `tema_${t.id}.txt`), texto);
    manifest.push({ tema_id: t.id, materia: bloque.materia, tema: t.titulo, componente: t.comp, chars: texto.length });
    console.log(`tema_${t.id}.txt (${t.titulo}): ${texto.length} chars`);
  }
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`\nListo: ${manifest.length} temas en ${OUT}`);
