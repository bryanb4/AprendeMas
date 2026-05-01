// src/pages/AritmeticaPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Componente auxiliar para mostrar fórmulas
const F = ({ children }) => (
  <span style={{
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontStyle: 'italic',
    color: '#4a2878',
    fontSize: '1.05em',
  }}>
    {children}
  </span>
);

// Bloque de fórmula centrado
const Formula = ({ children }) => (
  <div style={{
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontStyle: 'italic',
    color: '#4a2878',
    fontSize: '1.15em',
    textAlign: 'center',
    margin: '16px 0',
    padding: '12px',
    background: '#f5f0ff',
    borderRadius: '10px',
    letterSpacing: '0.03em',
  }}>
    {children}
  </div>
);

// ─── SECCIONES (contenido educativo) ─────────────────────────────────────────

function Seccion11() {
  return (
    <div>
      <p>
        Son un conjunto de números formados por los números racionales e irracionales.
        Los cuales son usados para medir, contar o representar cantidades en la vida
        cotidiana, etc.
      </p>

      <h2 className="subtitulo">Clasificación de números reales</h2>

      <div className="card-bloque">
        <h3 className="subtitulo-card">1) Números Irracionales (I)</h3>
        <p>
          Se conforman por todos los números decimales no periódicos (no tienen patrón
          que se repita).
        </p>
        <p>
          Ejemplos: <F>√2</F>, <F>√3</F>, <F>π</F>, etc.
        </p>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">2) Números Racionales (Q)</h3>
        <p>Se conforman por los números enteros (Z) y fraccionarios.</p>

        <div className="subcard">
          <h4>Enteros (Z)</h4>
          <p>No tienen parte decimal y se dividen en dos clases:</p>

          <div className="subcard" style={{ marginTop: 10 }}>
            <h4>Naturales</h4>
            <p>
              Números positivos incluyendo el 0: 1, 2, 3, 4, 5, 6, 7, 8, 9, 0.
              También pueden representarse como: <F>20/2</F>, <F>√9</F>.
            </p>
          </div>

          <div className="subcard" style={{ marginTop: 10 }}>
            <h4>Enteros Negativos</h4>
            <p>
              Usados para representar la falta de algo o como una deuda:
              −1, −20, etc.
            </p>
          </div>
        </div>

        <div className="subcard" style={{ marginTop: 10 }}>
          <h4>Fraccionarios</h4>
          <p>
            Conocidos también como decimales. Se representan por punto decimal o como
            una fracción cuyo resultado no es entero o exacto:{' '}
            <F>1/2</F>, <F>9/10</F>, <F>3/9</F>…
          </p>
        </div>

        {/* Imagen al final de la clasificación */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <img
            src="/NumerosReales.png"
            alt="Clasificación de números reales"
            style={{
              maxWidth: '100%',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Seccion12() {
  return (
    <div>
      <p>
        Operación en la cual la cantidad llamada <strong>base</strong> se deberá
        multiplicar por sí misma las veces que indique el <strong>exponente</strong>.
        La base es el número "normal", mientras que el exponente es el número pequeño
        que se escribe arriba de la base.
      </p>

      <div className="ejemplo-box">
        <p><strong>Ejemplos:</strong></p>
        <Formula>2⁴ = 2 × 2 × 2 × 2 = 16</Formula>
        <Formula>5³ = 5 × 5 × 5 = 125</Formula>
        <p>
          En el primer ejemplo <F>2</F> es la base y <F>4</F> el exponente.
          En el segundo, <F>5</F> es la base y <F>3</F> el exponente.
        </p>
      </div>

      <h2 className="subtitulo">Leyes de Exponentes</h2>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Multiplicación de potencias</h3>
        <p>Al multiplicar dos variables iguales, los exponentes se <strong>suman</strong>.</p>
        <Formula>aᵐ · aⁿ = aᵐ⁺ⁿ</Formula>
        <p>Ejemplo: <F>x³ · x² = x⁵</F>  o también  <F>2³ · 2² = 2⁵ = 32</F></p>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">División de potencias</h3>
        <p>Al dividir dos variables iguales, los exponentes se <strong>restan</strong>.</p>
        <Formula>aᵐ / aⁿ = aᵐ⁻ⁿ</Formula>
        <p>Ejemplo: <F>x⁵ / x³ = x²</F>  o también  <F>2⁵ / 2³ = 2² = 4</F></p>
        <p>
          El divisor resta la potencia; puede dar exponente negativo.
          Por ejemplo: <F>x³ / x⁵ = x⁻²</F>
        </p>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Potencia de una potencia</h3>
        <p>Al tener una potencia elevada a otra potencia, los exponentes se <strong>multiplican</strong>.</p>
        <Formula>(aᵐ)ⁿ = aᵐ·ⁿ</Formula>
        <p>Ejemplo: <F>(x²)⁴ = x⁸</F>  o también  <F>(3²)⁴ = 3⁸ = 6 561</F></p>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Potencia de un producto</h3>
        <p>Al tener una multiplicación afectada por una potencia, cada factor se eleva a esa potencia.</p>
        <Formula>(a · b)ⁿ = aⁿ · bⁿ</Formula>
        <p>Ejemplo: <F>(x · y)² = x² · y²</F>  o también  <F>(2 · 3)² = 4 · 9 = 36</F></p>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Potenciación de un cociente</h3>
        <p>Al tener una división afectada por una potencia, numerador y denominador se elevan a esa potencia.</p>
        <Formula>(a / b)ⁿ = aⁿ / bⁿ</Formula>
        <p>Ejemplo: <F>(x/y)² = x²/y²</F>  o también  <F>(10/5)² = 100/25 = 4</F></p>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Exponente cero y exponente uno</h3>
        <p>Cualquier número con exponente 0 es igual a 1: <F>x⁰ = 1</F>, <F>20⁰ = 1</F>.</p>
        <p>Cualquier número elevado a la 1 es igual a sí mismo: <F>a¹ = a</F>, <F>3¹ = 3</F>.
          Por eso no es necesario escribir dicho exponente.</p>
      </div>
    </div>
  );
}

function Seccion13() {
  return (
    <div>
      <p>
        Es la operación inversa a las potencias. Específicamente, la raíz cuadrada es
        la operación contraria a un número elevado al cuadrado (<F>x²</F>).
      </p>
      <p>Una raíz tiene dos maneras de expresarse equivalentes:</p>
      <Formula>³√5 = 5^(1/3)</Formula>

      <h2 className="subtitulo">Partes de una raíz</h2>
      <div className="card-bloque">
        <ul className="lista-partes">
          <li><strong>Índice:</strong> Indica cuántas veces debe multiplicarse un mismo número para obtener el radicando.</li>
          <li><strong>Signo radical:</strong> El símbolo √ con el cual se representa la raíz.</li>
          <li><strong>Radicando:</strong> Indica el número del cual se busca la raíz.</li>
          <li><strong>Raíz:</strong> El resultado de realizar la operación.</li>
        </ul>

        {/* Imagen de apoyo: partes de la raíz */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <img
            src="/Raiz.png"
            alt="Partes de una raíz: índice, signo radical, radicando y raíz"
            style={{
              maxWidth: '100%',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
        </div>
      </div>

      <div className="ejemplo-box">
        <p>
          La raíz responde a la pregunta:{' '}
          <em>¿Qué número multiplicado por sí mismo da el radicando?</em>
        </p>
        <p>
          Ejemplo: <F>√25</F> → ¿Qué número × sí mismo = 25?
          → <strong>5</strong>, pues <F>5 × 5 = 25</F>.
        </p>
      </div>

      <h2 className="subtitulo">Signos dentro del radical</h2>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Raíces de índice par (2, 4, 6…)</h3>
        <p>
          En el radicando <strong>jamás</strong> puede existir un signo negativo
          dentro de los números reales. Por ejemplo, <F>⁴√(−256)</F> no tiene
          solución real porque elevar cualquier número real a una potencia par siempre da positivo:
        </p>
        <Formula>4 × 4 × 4 × 4 = 256  y  (−4)⁴ = 256</Formula>
        <p>Por lo tanto no se puede llegar a −256 con índice par.</p>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Raíces de índice impar (3, 5, 7…)</h3>
        <p>Sí puede existir un radicando negativo. Ejemplo:</p>
        <Formula>³√(−27) = −3  porque  (−3) × (−3) × (−3) = −27</Formula>
        <p>
          Como también: <F>³√27 = 3</F>, pues <F>3 × 3 × 3 = 27</F>.
        </p>
      </div>

      <h2 className="subtitulo">Tabla resumen</h2>
      <div className="tabla-wrapper">
        <table className="tabla-bonita">
          <thead>
            <tr>
              <th>¿Solución real?</th>
              <th>Expresión</th>
              <th>Multiplicación</th>
              <th>Solución</th>
              <th>Índice</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>✅ Sí</td><td><F>⁴√256</F></td><td>4 × 4 × 4 × 4</td><td>4</td><td>Par</td>
            </tr>
            <tr>
              <td>❌ No</td><td><F>⁴√(−256)</F></td><td>No existe</td><td>No existe en reales</td><td>Par</td>
            </tr>
            <tr>
              <td>✅ Sí</td><td><F>³√(−27)</F></td><td>(−3) × (−3) × (−3)</td><td>−3</td><td>Impar</td>
            </tr>
            <tr>
              <td>✅ Sí</td><td><F>³√27</F></td><td>3 × 3 × 3</td><td>3</td><td>Impar</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="subtitulo">¿Cómo resolver una raíz cuadrada?</h2>
      <div className="card-bloque">
        <h3 className="subtitulo-card">Si la pregunta es de opción múltiple</h3>
        <p>
          Toma una opción, elévala al cuadrado y verifica si coincide con el radicando.
        </p>
        <div className="ejemplo-box" style={{ marginTop: 10 }}>
          <p>¿Cuál es la solución de <F>√36</F>? a) 3  b) 8  c) 6  d) 8</p>
          <p>Pruebas: <F>6² = 36</F> ✅ → Respuesta: <strong>c) 6</strong></p>
        </div>
      </div>
      <div className="card-bloque">
        <h3 className="subtitulo-card">Si la pregunta no tiene opciones</h3>
        <p>
          Usa aproximaciones: piensa un número y elévalo. Si el resultado es menor,
          aumenta el número; si es mayor, disminúyelo, hasta encontrar la respuesta exacta.
        </p>
      </div>
    </div>
  );
}

function Seccion14() {
  return (
    <div>
      <p>
        La <strong>jerarquía de operaciones</strong> indica el orden en el que se
        resuelven suma, resta, multiplicación, división, potencia y raíz, así como
        la prioridad de los signos de agrupación. Gracias a esto se obtiene siempre
        el resultado correcto.
      </p>

      <div className="jerarquia-steps">
        {[
          { nivel: 'Nivel 1', nombre: 'Signos de agrupación', simbolos: '( )   [ ]   { }' },
          { nivel: 'Nivel 2', nombre: 'Potencia y raíz',       simbolos: 'xⁿ   √' },
          { nivel: 'Nivel 3', nombre: 'Multiplicación y división', simbolos: '×   ÷' },
          { nivel: 'Nivel 4', nombre: 'Sumas y restas',        simbolos: '+   −' },
        ].map((paso, i) => (
          <div key={i} className="jerarquia-step">
            <div className="jerarquia-num">{i + 1}</div>
            <div>
              <strong>{paso.nivel} — {paso.nombre}</strong>
              <p style={{ margin: '4px 0 0', color: '#764ba2', fontWeight: 600 }}>{paso.simbolos}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="subtitulo">Leyes de los signos</h2>
      <div className="tabla-wrapper">
        <table className="tabla-bonita">
          <thead>
            <tr><th>Signo 1</th><th>×</th><th>Signo 2</th><th>=</th><th>Resultado</th></tr>
          </thead>
          <tbody>
            <tr><td>+</td><td>×</td><td>+</td><td>=</td><td style={{ color: '#27ae60', fontWeight: 700 }}>+</td></tr>
            <tr><td>−</td><td>×</td><td>−</td><td>=</td><td style={{ color: '#27ae60', fontWeight: 700 }}>+</td></tr>
            <tr><td>+</td><td>×</td><td>−</td><td>=</td><td style={{ color: '#e74c3c', fontWeight: 700 }}>−</td></tr>
            <tr><td>−</td><td>×</td><td>+</td><td>=</td><td style={{ color: '#e74c3c', fontWeight: 700 }}>−</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Regla fácil: <strong>signos iguales → +</strong>,{' '}
        <strong>signos diferentes → −</strong>.
      </p>

      <h2 className="subtitulo">Ejemplo 1 — Sin paréntesis</h2>
      <Formula>6² ÷ 9 × 4 + √16 × 3 − 10 ÷ 5</Formula>
      <div className="pasos-box">
        <div className="paso"><span className="paso-num">1</span><span>Expresión original.</span></div>
        <div className="paso"><span className="paso-num">2</span>
          <span>Potencia y raíz: <F>6² = 36</F>, <F>√16 = 4</F> → queda: <F>36 ÷ 9 × 4 + 4 × 3 − 10 ÷ 5</F></span>
        </div>
        <div className="paso"><span className="paso-num">3</span>
          <span>Mult/div izq → der: <F>36÷9 = 4</F>, <F>4×4 = 16</F>, <F>4×3 = 12</F>, <F>10÷5 = 2</F> → queda: <F>16 + 12 − 2</F></span>
        </div>
        <div className="paso"><span className="paso-num">4</span>
          <span>Sumas y restas: <F>16 + 12 − 2 = 26</F></span>
        </div>
        <div className="paso resultado"><span className="paso-num">✓</span>
          <span><strong>Resultado = 26</strong></span>
        </div>
      </div>

      <h2 className="subtitulo">Ejemplo 2 — Con paréntesis</h2>
      <Formula>(10 − 2) ÷ 2 × 3 + (8 + 6)(7 − 2) − 12 × 2 ÷ 8</Formula>
      <div className="nota-box">
        💡 Nota: cuando dos paréntesis se tocan como <F>(a)(b)</F>, indica multiplicación.
      </div>
      <div className="pasos-box">
        <div className="paso"><span className="paso-num">1</span><span>Expresión original.</span></div>
        <div className="paso"><span className="paso-num">2</span>
          <span>Interior de paréntesis: <F>(10−2) = 8</F>, <F>(8+6) = 14</F>, <F>(7−2) = 5</F> → queda: <F>8 ÷ 2 × 3 + (14)(5) − 12 × 2 ÷ 8</F></span>
        </div>
        <div className="paso"><span className="paso-num">3</span>
          <span>Mult/div izq → der: <F>8÷2 = 4</F>, <F>14×5 = 70</F>, <F>12×2 = 24</F> → queda: <F>4 × 3 + 70 − 24 ÷ 8</F></span>
        </div>
        <div className="paso"><span className="paso-num">4</span>
          <span>Continúa: <F>4×3 = 12</F>, <F>24÷8 = 3</F> → queda: <F>12 + 70 − 3</F></span>
        </div>
        <div className="paso"><span className="paso-num">5</span>
          <span>Sumas y restas: <F>12 + 70 − 3 = 79</F></span>
        </div>
        <div className="paso resultado"><span className="paso-num">✓</span>
          <span><strong>Resultado = 79</strong></span>
        </div>
      </div>

      <div className="nota-box" style={{ marginTop: 24 }}>
        📌 Dentro de un mismo nivel jerárquico (p. ej. multiplicación y división),
        siempre se resuelve <strong>de izquierda a derecha</strong>.
      </div>
    </div>
  );
}

// ─── Secciones registradas ────────────────────────────────────────────────────
const secciones = [
  { id: 1, titulo: 'Números Reales',                                      Componente: Seccion11 },
  { id: 2, titulo: 'Potencias Enteras Positivas y Leyes de Exponentes',   Componente: Seccion12 },
  { id: 3, titulo: 'Raíz Cuadrada',                                       Componente: Seccion13 },
  { id: 4, titulo: 'Operaciones y Jerarquía',                             Componente: Seccion14 },
];

// ─── Componente principal ─────────────────────────────────────────────────────
function AritmeticaPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSeccionId, setSelectedSeccionId] = useState(location.state?.seccionId || null);

  const handleTabChange = (tab) => {
    navigate('/dashboard', { state: { activeTab: tab } });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Modo detalle (cuando hay una sección seleccionada)
  if (selectedSeccionId) {
    const seccionActual = secciones.find(s => s.id === selectedSeccionId) || secciones[0];
    const { Componente, titulo } = seccionActual;

    return (
      <div className="dashboard-layout">
        <Sidebar activeTab="aprendizaje" onTabChange={handleTabChange} onLogout={handleLogout} />
        <main className="main-content">
          <button className="btn-volver" onClick={() => setSelectedSeccionId(null)}>
            ← Volver a temas de aritmética
          </button>
          <div className="contenido-card">
            <h1 className="titulo-seccion">{titulo}</h1>
            <hr className="divisor" />
            <div className="cuerpo-texto">
              <Componente />
            </div>
          </div>
        </main>
        <style>{`
          .dashboard-layout { display: flex; min-height: 100vh; background-color: #f4f2fb; font-family: 'Segoe UI', system-ui, sans-serif; }
          .main-content { flex: 1; padding: 40px 60px; overflow-y: auto; }
          .btn-volver { background: none; border: none; color: #764ba2; font-weight: 600; font-size: 0.95rem; cursor: pointer; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; padding: 0; }
          .btn-volver:hover { opacity: 0.7; }
          .contenido-card { background: white; border-radius: 20px; padding: 40px 48px; box-shadow: 0 4px 20px rgba(118,75,162,0.08); }
          .titulo-seccion { color: #1a1b3a; font-size: 2rem; margin: 0 0 12px; }
          .divisor { border: 0; border-top: 2px solid #ede8f8; margin-bottom: 28px; }
          .cuerpo-texto { font-size: 1.05rem; line-height: 1.85; color: #333; }
          .cuerpo-texto p { margin: 0 0 14px; }
          .subtitulo { font-size: 1.25rem; color: #764ba2; margin: 28px 0 14px; font-weight: 700; }
          .subtitulo-card { font-size: 1.05rem; color: #1a1b3a; margin: 0 0 10px; font-weight: 700; }
          .card-bloque { background: #f9f7ff; border-left: 4px solid #764ba2; border-radius: 12px; padding: 20px 24px; margin-bottom: 18px; }
          .subcard { background: #ede8f8; border-radius: 10px; padding: 14px 18px; }
          .subcard h4 { margin: 0 0 6px; color: #4a2878; font-size: 0.95rem; }
          .ejemplo-box { background: #f0fbf4; border-left: 4px solid #27ae60; border-radius: 12px; padding: 18px 24px; margin-bottom: 18px; }
          .nota-box { background: #fff8e1; border-left: 4px solid #f39c12; border-radius: 10px; padding: 14px 20px; margin-bottom: 18px; font-size: 0.95rem; color: #7a5c00; }
          .pasos-box { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
          .paso { display: flex; align-items: flex-start; gap: 14px; background: #faf9ff; border-radius: 10px; padding: 12px 18px; border: 1px solid #ede8f8; }
          .paso.resultado { background: #edf8f0; border-color: #27ae60; }
          .paso-num { min-width: 28px; height: 28px; background: #764ba2; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; }
          .paso.resultado .paso-num { background: #27ae60; }
          .jerarquia-steps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
          .jerarquia-step { display: flex; align-items: center; gap: 16px; background: #f9f7ff; border-radius: 12px; padding: 16px 20px; border: 1px solid #ede8f8; }
          .jerarquia-num { min-width: 36px; height: 36px; background: linear-gradient(135deg, #764ba2, #a76dcc); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; flex-shrink: 0; }
          .tabla-wrapper { overflow-x: auto; margin-bottom: 20px; }
          .tabla-bonita { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
          .tabla-bonita th { background: #764ba2; color: white; padding: 10px 14px; text-align: center; font-weight: 600; }
          .tabla-bonita td { padding: 9px 14px; text-align: center; border-bottom: 1px solid #ede8f8; }
          .tabla-bonita tr:nth-child(even) td { background: #faf9ff; }
          .lista-partes { padding-left: 20px; margin: 0; }
          .lista-partes li { margin-bottom: 8px; }
          @media (max-width: 900px) { .main-content { padding: 24px 20px; } .contenido-card { padding: 24px 20px; } }
        `}</style>
      </div>
    );
  }

  // Modo lista (muestra todos los temas)
  return (
    <div className="dashboard-layout">
      <Sidebar activeTab="aprendizaje" onTabChange={handleTabChange} onLogout={handleLogout} />
      <main className="main-content">
        <button className="btn-volver" onClick={() => navigate('/dashboard', { state: { activeTab: 'aprendizaje' } })}>
          ← Volver a los módulos
        </button>
        <div className="contenido-card">
          <h1 className="titulo-seccion">Aritmética</h1>
          <hr className="divisor" />
          <ul className="topic-list">
            {secciones.map((seccion) => (
              <li key={seccion.id} className="topic-item">
                <span className="topic-name">{seccion.titulo}</span>
                <button className="btn-start-topic" onClick={() => setSelectedSeccionId(seccion.id)}>
                  Comenzar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <style>{`
        .dashboard-layout { display: flex; min-height: 100vh; background-color: #f4f2fb; font-family: 'Segoe UI', system-ui, sans-serif; }
        .main-content { flex: 1; padding: 40px 60px; overflow-y: auto; }
        .btn-volver { background: none; border: none; color: #764ba2; font-weight: 600; font-size: 0.95rem; cursor: pointer; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; padding: 0; }
        .btn-volver:hover { opacity: 0.7; }
        .contenido-card { background: white; border-radius: 20px; padding: 40px 48px; box-shadow: 0 4px 20px rgba(118,75,162,0.08); }
        .titulo-seccion { color: #1a1b3a; font-size: 2rem; margin: 0 0 12px; }
        .divisor { border: 0; border-top: 2px solid #ede8f8; margin-bottom: 28px; }
        .topic-list { list-style: none; padding: 0; margin: 0; }
        .topic-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #f0e8ff; background-color: #ffffff; border-radius: 12px; margin-bottom: 8px; transition: background 0.2s; }
        .topic-item:hover { background-color: #faf8ff; }
        .topic-name { font-size: 1.1rem; color: #2d1b45; text-align: left; }
        .btn-start-topic { background-color: #764ba2; color: white; border: none; border-radius: 30px; padding: 6px 16px; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s, transform 0.1s; box-shadow: 0 2px 8px rgba(118,75,162,0.2); line-height: 1.4; min-width: 80px; }
        .btn-start-topic:hover { background-color: #5f3b85; transform: scale(1.02); }
        @media (max-width: 900px) { .main-content { padding: 24px 20px; } .contenido-card { padding: 24px 20px; } }
      `}</style>
    </div>
  );
}

export default AritmeticaPage;