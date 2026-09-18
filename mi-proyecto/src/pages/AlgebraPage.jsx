// src/pages/AlgebraPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// 1. IMPORTAR COMPONENTE DE GRÁFICA DESDE LA CARPETA PUBLIC
import GraficaEcuacionLineal from './Graficas/1GraficaEcuacionLineal.jsx';
import GraficaEcuacionCinco from './Graficas/2GraficaEcuacionCinco.jsx';


// 2. IMPORTAR CSS Y COMPONENTES DE KATEX
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Importas las 3 gráficas desde sus respectivos archivos
import GraficaInterseccion from './Graficas/3GraficaInterseccionSistema.jsx';
import GraficaParalelas from './Graficas/4GraficaRectasParalelas.jsx';
import GraficaCoincidentes from './Graficas/5GraficaRectasSobrepuestas.jsx';
import GraficaParabolaCuadratica from './Graficas/6GraficaParabolaCuadratica.jsx';
import GraficaPlanoCartesiano from './Graficas/7GraficaPlanoCartesiano.jsx';

//Imports del apartado 2.8 Tema Funciones y sus gráficas
import { 
  GraficaTabulacion, 
  GraficaConstante, 
  GraficaPendientePositiva, 
  GraficaPendienteNegativa, 
  GraficaPendienteCero 
} from './Graficas/8GraficaTabulacion.jsx';

import {
  GraficaCaso1,
  GraficaCaso2,
  GraficaCaso3
} from './Graficas/9GraficasFinal.jsx';
// ─── COMPONENTES AUXILIARES PARA FÓRMULAS ──────────────────────────────────

const F = ({ children }) => {
  if (typeof children === 'string') {
    return <InlineMath math={children} />;
  }
  return <InlineMath>{children}</InlineMath>;
};

const Formula = ({ children }) => {
  return (
    <div style={{ margin: '14px 0', overflowX: 'auto', textAlign: 'center' }}>
      {typeof children === 'string' ? (
        <BlockMath math={children} />
      ) : (
        <BlockMath>{children}</BlockMath>
      )}
    </div>
  );
};

// ─── COMPONENTES DE GRÁFICAS CORREGIDAS EN SVG ──────────────────────────────

// Gráfica de intersección (3, 2) corregida en el Cuadrante I
function GraficaInterseccionSistema() {
  return (
    <div style={{ textAlign: 'center', margin: '24px 0' }}>
      <svg viewBox="-1.5 -1.5 8 6" style={{ width: '100%', maxWidth: '450px', background: '#fff', borderRadius: '12px', border: '1px solid #ede8f8', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        {/* Invertimos el eje Y dinámicamente para que Y positivo vaya hacia ARRIBA */}
        <g transform="translate(0, 4) scale(1, -1)">
          {/* Rejilla */}
          {[-1, 0, 1, 2, 3, 4, 5, 6].map(x => (
            <line key={`v${x}`} x1={x} y1={-1} x2={x} y2={4.5} stroke="#f0ebf8" strokeWidth="0.04" />
          ))}
          {[-1, 0, 1, 2, 3, 4].map(y => (
            <line key={`h${y}`} x1={-1} y1={y} x2={6.5} y2={y} stroke="#f0ebf8" strokeWidth="0.04" />
          ))}

          {/* Ejes X e Y */}
          <line x1={-1} y1={0} x2={6.5} y2={0} stroke="#333" strokeWidth="0.06" />
          <line x1={0} y1={-1} x2={0} y2={4.5} stroke="#333" strokeWidth="0.06" />

          {/* Recta 1: x + 2y = 7 => y = (7 - x)/2 (Roja) - Descendente */}
          <line x1={-0.5} y1={3.75} x2={6} y2={0.5} stroke="#e74c3c" strokeWidth="0.08" />

          {/* Recta 2: 3x - 2y = 5 => y = (3x - 5)/2 (Azul) */}
          <line x1={1} y1={-1} x2={4} y2={3.5} stroke="#2980b9" strokeWidth="0.08" />

          {/* Punto de intersección en (3, 2) - Cuadrante I */}
          <circle cx={3} cy={2} r={0.15} fill="#2c3e50" />
        </g>

        {/* Textos y etiquetas en coordenadas normales de pantalla (sin invertir texto) */}
        <g transform="translate(0, 4)">
          {/* Etiquetas del eje X */}
          {[1, 2, 3, 4, 5, 6].map(x => (
            <text key={`tx${x}`} x={x} y={0.35} fontSize="0.25" textAnchor="middle" fill="#666">{x}</text>
          ))}
          {/* Etiquetas del eje Y */}
          {[1, 2, 3, 4].map(y => (
            <text key={`ty${y}`} x={-0.2} y={-y + 0.08} fontSize="0.25" textAnchor="end" fill="#666">{y}</text>
          ))}

          {/* Etiqueta del Punto de Intersección (3, 2) */}
          <g transform="translate(3, -2.5)">
            <rect x="-1" y="-0.3" width="2" height="0.6" rx="0.1" fill="#ffffff" stroke="#2c3e50" strokeWidth="0.02" />
            <text x="0" y="-0.02" fontSize="0.2" fontWeight="bold" textAnchor="middle" fill="#333">Punto (3, 2)</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

// Gráfica de rectas paralelas corregida (Descendentes)
function GraficaRectasParalelas() {
  return (
    <div style={{ textAlign: 'center', margin: '24px 0' }}>
      <svg viewBox="-2 -1 9 8" style={{ width: '100%', maxWidth: '450px', background: '#fff', borderRadius: '12px', border: '1px solid #ede8f8', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        {/* Invertimos el eje Y */}
        <g transform="translate(0, 6) scale(1, -1)">
          {/* Rejilla */}
          {[-1, 0, 1, 2, 3, 4, 5, 6].map(x => (
            <line key={`v${x}`} x1={x} y1={-1} x2={x} y2={6.5} stroke="#f0ebf8" strokeWidth="0.05" />
          ))}
          {[-1, 0, 1, 2, 3, 4, 5, 6].map(y => (
            <line key={`h${y}`} x1={-1.5} y1={y} x2={6.5} y2={y} stroke="#f0ebf8" strokeWidth="0.05" />
          ))}

          {/* Ejes */}
          <line x1={-1.5} y1={0} x2={6.5} y2={0} stroke="#333" strokeWidth="0.08" />
          <line x1={0} y1={-1} x2={0} y2={6.5} stroke="#333" strokeWidth="0.08" />

          {/* Recta 1: x + y = 3 => y = 3 - x (Descendente Gris) */}
          <line x1={-1} y1={4} x2={4.5} y2={-1.5} stroke="#7f8c8d" strokeWidth="0.1" />

          {/* Recta 2: x + y = 5 => y = 5 - x (Descendente Verde) */}
          <line x1={-1} y1={6} x2={6} y2={-1} stroke="#16a085" strokeWidth="0.1" />
        </g>

        {/* Textos y números */}
        <g transform="translate(0, 6)">
          {[1, 2, 3, 4, 5, 6].map(x => (
            <text key={`tx${x}`} x={x} y={0.4} fontSize="0.3" textAnchor="middle" fill="#666">{x}</text>
          ))}
          {[1, 2, 3, 4, 5, 6].map(y => (
            <text key={`ty${y}`} x={-0.25} y={-y + 0.1} fontSize="0.3" textAnchor="end" fill="#666">{y}</text>
          ))}
        </g>
      </svg>
    </div>
  );
}

// ─── SECCIONES (contenido educativo) ─────────────────────────────────────────

function Seccion21() {
  return (
    <div>
      <p>
        Es la combinación entre números, letras y operaciones. Representan valores
        desconocidos o ayudan a modelar situaciones en la vida real.
      </p>
      <p>
        Es importante recordar la ley de los signos, así como la jerarquía de
        operaciones, pues dentro del álgebra es algo que será constantemente usado.
      </p>

      <div className="ejemplo-box">
        <p><strong>Ejemplo de una expresión algebraica:</strong></p>
        <Formula>2x + x^4 - x = x + x^4</Formula>
      </div>

      <p>
        <strong>Términos semejantes:</strong> Existen términos semejantes, los cuales son números,
        variedad de letras, letras elevadas a alguna potencia.
      </p>

      <h2 className="subtitulo">Partes de una expresión</h2>
      <div className="card-bloque">
        <ul className="lista-partes">
          <li>
            <strong>Signo:</strong> Valor que tendrá la expresión (negativo o positivo),
            el cual también indica qué tipo de operación va a realizar al momento de simplificar
            una expresión más compleja.
          </li>
          <li>
            <strong>Coeficiente:</strong> Número que acompaña a la variable, indica una multiplicación
            entre el valor que aún no se conoce y el valor del coeficiente (si la variable aparece sola,
            entonces el valor del coeficiente es 1).
          </li>
          <li>
            <strong>Variable:</strong> Representación de una incógnita, es un valor que aún no se sabe
            exactamente cuál es, también puede ser un valor que podría cambiar, es representado por una
            letra (usualmente <F>x</F>).
          </li>
          <li>
            <strong>Exponente:</strong> La potencia a la cual está elevada nuestra variable.
          </li>
        </ul>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <img 
            src="/5ExpresionAlgebraica.png" 
            alt="Partes de una expresión algebraica" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '250px',
              height: 'auto', 
              borderRadius: '8px' 
            }} 
          />
        </div>
      </div>

      <h2 className="subtitulo">Simplificación</h2>
      <p>
        Para simplificar/realizar dichas expresiones, primero se ocupan resolver todas las operaciones
        posibles en donde se “junten” los valores semejantes.
      </p>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Suma</h3>
        <p>Se suman los coeficientes (números) que acompañen a la variable con el mismo exponente.</p>
        <p>Ejemplo: <F>3x + 5x = 8x</F></p>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Resta</h3>
        <p>Se restan los coeficientes (números) que acompañen a la variable con el mismo exponente.</p>
        <p>Ejemplo: <F>7x - 2x = 5x</F></p>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Multiplicación</h3>
        <p>
          Se multiplican los coeficientes (números) que acompañen a la variable con el mismo
          exponente, y se suman los exponentes (las potencias).
        </p>
        <p>Ejemplo: <F>(2x)(3x) = 6x^2</F></p>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">División</h3>
        <p>
          Se dividen los coeficientes (números) que acompañan a la variable con el mismo exponente,
          y los exponentes se restan.
        </p>
        <p>Ejemplo: <F>{String.raw`(6x^3) \div (2x) = 3x^2`}</F></p>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Potencia</h3>
        <p>Se realiza la potencia tanto al coeficiente como al exponente.</p>
        <p>Ejemplo: <F>(2x)^2 = 4x^2</F></p>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Raíz</h3>
        <p>Se aplica la raíz tanto al coeficiente como al exponente.</p>
        <p>Ejemplo: <F>{String.raw`\sqrt{(9x)^4} = 3x^2`}</F></p>
      </div>
    </div>
  );
}

function Seccion211() {
  return (
    <div>
      <p>
        Para poder simplificar una expresión algebraica, antes habrá que conocer los tipos
        y cómo se resuelven.
      </p>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Expresiones “planas”</h3>
        <p>
          Estas expresiones son las más simples y se conforman por sumas y restas, para realizar
          sumas o restas entre expresiones, es importante hacerlo entre términos semejantes.
        </p>
        <div className="ejemplo-box">
          <p><strong>Ejemplo:</strong> <F>2x^2 + 5x^4 - 12x^2 + x^4 + 6x^2</F></p>
        </div>
        <div className="pasos-box">
          <div className="paso">
            <span className="paso-num">1</span>
            <span><strong>Agrupar términos semejantes:</strong> <F>(2x^2 - 12x^2 + 6x^2) + (5x^4 + x^4)</F></span>
          </div>
          <div className="paso">
            <span className="paso-num">2</span>
            <span><strong>Realizar operaciones:</strong> <F>-4x^2 + 6x^4</F></span>
          </div>
          <div className="paso resultado">
            <span className="paso-num">✓</span>
            <span><strong>Final:</strong> El resultado es: <F>6x^4 - 4x^2</F></span>
          </div>
        </div>
        <div className="nota-box">
          📌 <strong>Nota:</strong> Una vez tienes la simplificación, siempre se debe de reescribir con el factor más grande basándose en las potencias.
        </div>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Expresiones con multiplicación</h3>
        <p>
          Usualmente verás estas expresiones dentro de paréntesis; se multiplica cada término y al tener el resultado se simplifica.
        </p>
        <div className="ejemplo-box">
          <p><strong>Ejemplo:</strong> <F>(2x^2 + 3x)(-4x^2 - 2x + 12x^3)</F></p>
        </div>
        <div className="pasos-box">
          <div className="paso">
            <span className="paso-num">1</span>
            <span>Multiplicar <F>2x^2</F> por cada término de la segunda expresión: <F>24x^5 - 8x^4 - 4x^3</F></span>
          </div>
          <div className="paso">
            <span className="paso-num">2</span>
            <span>Multiplicar <F>3x</F> por cada término de la segunda expresión: <F>36x^4 - 12x^3 - 6x^2</F></span>
          </div>
          <div className="paso">
            <span className="paso-num">3</span>
            <span>Juntar y simplificar las expresiones: <F>24x^5 + (36x^4 - 8x^4) + (-12x^3 - 4x^3) - 6x^2</F></span>
          </div>
          <div className="paso resultado">
            <span className="paso-num">✓</span>
            <span><strong>Final:</strong> El resultado es <F>24x^5 + 28x^4 - 16x^3 - 6x^2</F></span>
          </div>
        </div>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">Expresiones con división</h3>
        <p>
          Se dividen las expresiones con divisiones simples.
        </p>
        <div className="ejemplo-box">
          <p><strong>Ejemplo:</strong> <F>{String.raw`\frac{36x^4 + 6x^3 - 4x^2 - 10x}{2x}`}</F></p>
        </div>
        <div className="pasos-box">
          <div className="paso">
            <span className="paso-num">1</span>
            <span>Separar cada término: <F>{String.raw`\frac{36x^4}{2x} + \frac{6x^3}{2x} - \frac{4x^2}{2x} - \frac{10x}{2x}`}</F></span>
          </div>
          <div className="paso resultado">
            <span className="paso-num">✓</span>
            <span>Realizar la división: <F>18x^3 + 3x^2 - 2x - 5</F></span>
          </div>
        </div>
        <div className="nota-box">
          📌 <strong>Nota:</strong> En caso de que al dividir la expresión no quede en orden del factor más grande al más chico, recordar reorganizarla.
        </div>
      </div>
    </div>
  );
}

function Seccion212() {
  return (
    <div>
      <p>
        Una ecuación contiene una igualdad, dentro de las cuales se busca resolver/encontrar el
        valor de una incógnita (usualmente <F>x</F>).
      </p>

      <div className="ejemplo-box">
        <p><strong>Ejemplo de una ecuación:</strong> <F>x + 10 = 12</F></p>
        <p>Para resolver ecuaciones es necesario saber despejar.</p>
      </div>

      <h2 className="subtitulo">¿Cómo despejar?</h2>
      <p>
        Para despejar se debe de aplicar la misma operación a cada lado de la igualdad. Esto provoca
        que de un lado se elimine/cancele una operación, mientras que del otro se agregará.
      </p>

      <div className="nota-box">
        📌 <strong>Nota:</strong> Usualmente <F>x</F> debe quedar del lado izquierdo y el resultado del
        lado derecho, por ende, suele ser más sencillo despejar del lado izquierdo.
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">1. Sumas y restas</h3>
        <p>Para despejar una ecuación con sumas y restas, se requiere usar la operación contraria.</p>

        <p><strong>Ejemplo de suma:</strong> <F>x + 9 = 27</F></p>
        <div className="pasos-box">
          <div className="paso">
            <span className="paso-num">1</span>
            <span><strong>Aplicar dicha cantidad a cada lado:</strong> <F>x + 9 (-9) = 27 (-9)</F></span>
          </div>
          <div className="paso resultado">
            <span className="paso-num">✓</span>
            <span><strong>Resultado:</strong> <F>x = 18</F>.</span>
          </div>
        </div>

        <p style={{ marginTop: '20px' }}><strong>Ejemplo de resta:</strong> <F>x - 4 = 12</F></p>
        <div className="pasos-box">
          <div className="paso">
            <span className="paso-num">1</span>
            <span><strong>Aplicar dicha cantidad a cada lado:</strong> <F>x - 4 (+4) = 12 (+4)</F></span>
          </div>
          <div className="paso resultado">
            <span className="paso-num">✓</span>
            <span><strong>Resultado:</strong> <F>x = 16</F>.</span>
          </div>
        </div>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">2. Multiplicación y división</h3>

        <p><strong>Ejemplo con multiplicación:</strong> <F>2x = 18</F></p>
        <div className="pasos-box">
          <div className="paso">
            <span className="paso-num">1</span>
            <span>
              Aplicando la división entre 2 a cada lado: <F>{String.raw`\frac{2x}{2} = \frac{18}{2}`}</F>
            </span>
          </div>
          <div className="paso resultado">
            <span className="paso-num">✓</span>
            <span><strong>Resultado:</strong> <F>x = 9</F>.</span>
          </div>
        </div>

        <p style={{ marginTop: '20px' }}>
          <strong>Ejemplo con división:</strong> <F>{String.raw`\frac{x}{4} = 6`}</F>
        </p>
        <div className="pasos-box">
          <div className="paso">
            <span className="paso-num">1</span>
            <span>
              Multiplicar por 4 a cada lado: <F>{String.raw`\left(\frac{x}{4}\right)(4) = (6)(4)`}</F>
            </span>
          </div>
          <div className="paso resultado">
            <span className="paso-num">✓</span>
            <span><strong>Resultado:</strong> <F>x = 24</F>.</span>
          </div>
        </div>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">3. Potencia y raíz</h3>

        <p><strong>Ejemplo con potencia:</strong> <F>x^4 = 81</F></p>
        <div className="pasos-box">
          <div className="paso">
            <span className="paso-num">1</span>
            <span><strong>Aplicar raíz equivalente:</strong> <F>{String.raw`\sqrt[4]{x^4} = \sqrt[4]{81}`}</F></span>
          </div>
          <div className="paso resultado">
            <span className="paso-num">✓</span>
            <span><strong>Resultado:</strong> <F>x = 3</F>.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Seccion213() {
  return (
    <div>
      <p>
        Las inecuaciones son aquellos valores que si cumplen con una condición dada.
      </p>

      <div className="card-bloque">
        <ul className="lista-partes">
          <li><strong>Mayor que:</strong> <F>{String.raw`>`}</F></li>
          <li><strong>Menor que:</strong> <F>{String.raw`<`}</F></li>
          <li><strong>Mayor o igual que:</strong> <F>{String.raw`\ge`}</F></li>
          <li><strong>Menor o igual que:</strong> <F>{String.raw`\le`}</F></li>
        </ul>
      </div>

      <div className="ejemplo-box">
        <p><strong>Ejemplo:</strong> <F>3x - 2 &lt; 8</F></p>
        <p>Verifica cuál de los siguientes elementos son una solución: <strong>[-3, 2, 4, 5]</strong></p>

        <div className="pasos-box" style={{ marginTop: '14px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <span>Sustituyendo con -3: <F>{String.raw`3(-3) - 2 < 8 \rightarrow -11 < 8`}</F> (<strong>Sí cumple</strong>)</span>
          </div>
          <div className="paso">
            <span className="paso-num">2</span>
            <span>Sustituyendo con 2: <F>{String.raw`3(2) - 2 < 8 \rightarrow 4 < 8`}</F> (<strong>Sí cumple</strong>)</span>
          </div>
          <div className="paso">
            <span className="paso-num">3</span>
            <span>Sustituyendo con 4: <F>{String.raw`3(4) - 2 < 8 \rightarrow 10 < 8`}</F> (<strong>No cumple</strong>)</span>
          </div>
          <div className="paso">
            <span className="paso-num">4</span>
            <span>Sustituyendo con 5: <F>{String.raw`3(5) - 2 < 8 \rightarrow 13 < 8`}</F> (<strong>No cumple</strong>)</span>
          </div>
        </div>
      </div>

      <h2 className="subtitulo">Propiedades de desigualdades</h2>
      <div className="card-bloque">
        <ol className="lista-partes" style={{ paddingLeft: '20px' }}>
          <li>Si <F>a &gt; b</F> y <F>b &gt; c</F>, entonces <F>a &gt; c</F></li>
          <li>Si <F>a &gt; b</F>, entonces <F>a + c &gt; b + c</F> y <F>a - c &gt; b - c</F></li>
          <li>Si <F>a &gt; b</F> y <F>c &gt; 0</F>, entonces <F>ac &gt; bc</F> y <F>{String.raw`\frac{a}{c} > \frac{b}{c}`}</F></li>
          <li>Si <F>a &gt; b</F> y <F>c &lt; 0</F>, entonces <F>ac &lt; bc</F> y <F>{String.raw`\frac{a}{c} < \frac{b}{c}`}</F></li>
        </ol>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <img 
            src="/6GraficaDesigualdades.jpg" 
            alt="Tabla de propiedades de desigualdades e intervalos" 
            style={{ maxWidth: '100%', maxHeight: '350px', height: 'auto', borderRadius: '8px' }} 
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 2.2: ECUACIONES LINEALES EN VARIAS VARIABLES
// ─────────────────────────────────────────────────────────────────────────────

function Seccion22() {
  return (
    <div>
      <p>
        Se les llama <strong>ecuaciones lineales</strong> a aquellas ecuaciones las cuales,
        al dibujar el conjunto de sus soluciones en un plano cartesiano, siempre obtendrás una línea recta.
      </p>

      {/* Componente de gráfica de la ecuación */}
      <GraficaEcuacionLineal />

      <p style={{ marginTop: '20px' }}>
        Una ecuación lineal con dos variables tiene <strong>infinitas soluciones</strong>, pero no cualquier par de números sirve: los valores de <F>x</F> e <F>y</F> deben cumplir la ecuación.
      </p>

      {/* EJEMPLO VIDA COTIDIANA */}
      <div className="ejemplo-box">
        <p><strong>Ejemplo en la vida cotidiana:</strong></p>
        <p>
          Imagina que compraste un kilo de arroz y un kilo de frijol y gastaste <strong>$80</strong> en total entre los dos. No sabes cuánto costó cada uno, pero sabes que:
        </p>
        <Formula>x + y = 80</Formula>
        <p>Entonces las posibles soluciones podrían ser:</p>
        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
          <li><F>x = 40, \quad y = 40</F></li>
          <li><F>x = 50, \quad y = 30</F></li>
          <li><F>x = 55, \quad y = 25 \dots</F></li>
        </ul>
        <p style={{ fontSize: '0.95rem', color: '#555', marginTop: '10px' }}>
          En casos como este, difícilmente tendrás respuestas como <F>x = -10, y = 90</F>. Pero dentro de las soluciones posibles en el plano cartesiano, podría llegar a suceder que las respuestas sean negativas.
        </p>
      </div>

      {/* RESTRICCIÓN DE COEFICIENTES */}
      <h2 className="subtitulo">Restricción de los coeficientes</h2>
      <div className="card-bloque">
        <p>
          Es importante tener en cuenta que, en una ecuación lineal de dos variables escrita como <F>Ax + By = C</F> o <F>Ax + By + C = 0</F>, <strong><F>A</F> y <F>B</F> no pueden ser cero al mismo tiempo</strong>.
        </p>
        <p>
          Si ambos fueran cero, la ecuación no dependería de <F>x</F> ni de <F>y</F>, por lo que no sería una ecuación lineal con dos variables. Si tanto <F>A</F> como <F>B</F> fueran cero, entonces:
        </p>
        <ul className="lista-partes" style={{ paddingLeft: '20px', marginTop: '10px' }}>
          <li>
            En la forma <F>Ax + By = C</F> tendríamos <F>0 = C</F>. Para que sea consistente, <F>C</F> debe ser 0; si <F>C \neq 0</F>, es una contradicción.
          </li>
          <li>
            En la forma <F>Ax + By + C = 0</F> tendríamos <F>C = 0</F>. Si <F>C \neq 0</F>, también es contradictorio.
          </li>
        </ul>
      </div>

      {/* EJEMPLO DE PARES ORDENADOS */}
      <div className="ejemplo-box">
        <p><strong>Ejemplo: Para la ecuación <F>x + y = 5</F></strong></p>
        <p style={{ margin: '8px 0' }}>
          Pares de soluciones: <F>(2,3)</F>, <F>(0,5)</F>, <F>(1,4)</F>, <F>(10,-5)</F>.
        </p>
        <p>
          Esos pares de números <F>(x,y)</F> son respuestas para la expresión anterior, pues cumplen con la igualdad, más no son las únicas respuestas posibles.
        </p>
        <GraficaEcuacionCinco />
      </div>
      
    </div>
  );
}


function Seccion222() {
  return (
    <div>
      {/* DEFINICIÓN */}
      <p>
        Un sistema de ecuaciones de 2x2 es un conjunto de dos ecuaciones con dos variables (<F>x</F> e <F>y</F>). Resolverlo significa encontrar un valor para <F>x</F> y un valor para <F>y</F> que cumplan ambas condiciones al mismo tiempo.
      </p>
      <p>
        Para un sistema de ecuaciones, lo que se busca es saber en qué punto del plano cartesiano las dos rectas se cruzan.
      </p>

      {/* 1. PRIMERA GRÁFICA: Intersección en (3, 2) */}
      <GraficaInterseccion />

      {/* MÉTODOS DE RESOLUCIÓN */}
      <h2 className="subtitulo">Método por Sustitución</h2>
      <p>Para resolver por este método, es necesario seguir los siguientes pasos:</p>

      <div className="card-bloque">
        <ol className="lista-partes" style={{ paddingLeft: '20px' }}>
          <li><strong>Despejar</strong> una variable de una de las ecuaciones.</li>
          <li><strong>Sustituir</strong> esa expresión en la otra ecuación.</li>
          <li><strong>Resolver</strong> la ecuación resultante (que ya tiene una sola variable).</li>
          <li><strong>Sustituir</strong> el valor obtenido en el despeje del paso 1 para hallar la otra variable.</li>
        </ol>
      </div>

      <div className="ejemplo-box">
        <p><strong>Ejemplo:</strong> Resolver el sistema</p>
        <Formula>{String.raw`\begin{cases} x + 2y = 7 \\ 3x - 2y = 5 \end{cases}`}</Formula>

        <div className="pasos-box" style={{ marginTop: '14px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Despejar <F>x</F> en la primera ecuación:</strong>
              <Formula>x = 7 - 2y</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Sustituir el resultado en la segunda ecuación:</strong>
              <Formula>3(7 - 2y) - 2y = 5</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">3</span>
            <div>
              <strong>Resolver la ecuación resultante:</strong>
              <Formula>21 - 6y - 2y = 5 \implies 21 - 8y = 5 \implies -8y = -16 \implies y = 2</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">4</span>
            <div>
              <strong>Sustituir el valor obtenido (<F>y = 2</F>) en el despeje del Paso 1:</strong>
              <Formula>x = 7 - 2(2) \implies x = 7 - 4 \implies x = 3</Formula>
            </div>
          </div>

          <div className="paso resultado">
            <span className="paso-num">✓</span>
            <div>
              <strong>Resultado: <F>(3, 2)</F></strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.95rem' }}>
                Es decir, para este sistema de ecuaciones, el punto en el cual se interceptan es el punto <strong>(3, 2)</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="subtitulo">Método de Reducción (Suma o Resta)</h2>
      <p>
        La idea es sumar o restar una ecuación a otra para eliminar una variable, ya sea <F>x</F> o <F>y</F>.
      </p>

      <div className="card-bloque">
        <ol className="lista-partes" style={{ paddingLeft: '20px' }}>
          <li>
            <strong>Multiplicar</strong> una o ambas ecuaciones por números convenientes para que los coeficientes de una variable sean iguales u opuestos.
          </li>
          <li>
            <strong>Sumar o restar</strong> las ecuaciones para eliminar esa variable.
          </li>
          <li>
            <strong>Resolver</strong> la ecuación resultante.
          </li>
          <li>
            <strong>Sustituir</strong> el valor obtenido en cualquiera de las ecuaciones originales para hallar la otra variable.
          </li>
        </ol>
      </div>

      <div className="ejemplo-box">
        <p><strong>Ejemplo 1 (Directo):</strong> Resolver el sistema</p>
        <Formula>{String.raw`\begin{cases} x + 2y = 7 \\ 3x - 2y = 5 \end{cases}`}</Formula>

        <p>
          Para este caso, tenemos <F>2y</F> y <F>-2y</F>. Si sumamos ambas ecuaciones se elimina la variable <F>y</F> directamente:
        </p>

        <Formula>{String.raw`\begin{aligned} x + 2y &= 7 \\ {}+ (3x - 2y &= 5) \\ \hline 4x &= 12 \implies x = 3 \end{aligned}`}</Formula>

        <p>Al tener el valor de <F>x = 3</F>, lo sustituimos en cualquiera de las dos ecuaciones:</p>

        <div className="pasos-box" style={{ marginTop: '10px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Sustitución en Ecuación 1:</strong>
              <Formula>(3) + 2y = 7 \implies 2y = 7 - 3 \implies 2y = 4 \implies y = 2</Formula>
            </div>
          </div>
          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Sustitución en Ecuación 2:</strong>
              <Formula>3(3) - 2y = 5 \implies 9 - 2y = 5 \implies -2y = -4 \implies y = 2</Formula>
            </div>
          </div>
          <div className="paso resultado">
            <span className="paso-num">✓</span>
            <div><strong>Respuesta final: <F>(3, 2)</F></strong></div>
          </div>
        </div>
      </div>

      <div className="ejemplo-box">
        <p><strong>Ejemplo 2 (Con multiplicación):</strong> Resolver el sistema</p>
        <Formula>{String.raw`\begin{cases} 2x + 3y = 8 \\ 3x + 2y = 7 \end{cases}`}</Formula>

        <p>
          Para eliminar <F>y</F>, multiplicamos la primera ecuación por <F>2</F> y la segunda por <F>3</F>:
        </p>

        <Formula>{String.raw`\begin{cases} 2(2x + 3y = 8) \implies 4x + 6y = 16 \\ 3(3x + 2y = 7) \implies 9x + 6y = 21 \end{cases}`}</Formula>

        <p>Ahora restamos la segunda ecuación de la primera (o multiplicamos por <F>-3</F>):</p>

        <Formula>{String.raw`\begin{aligned} 4x + 6y &= 16 \\ {}- (9x + 6y &= 21) \\ \hline -5x &= -5 \implies x = 1 \end{aligned}`}</Formula>

        <p>Sustituimos <F>x = 1</F> en la primera ecuación multiplicada:</p>
        <Formula>4(1) + 6y = 16 \implies 6y = 12 \implies y = 2</Formula>

        <div className="paso resultado" style={{ marginTop: '10px' }}>
          <span className="paso-num">✓</span>
          <div><strong>Respuesta final: <F>(1, 2)</F></strong></div>
        </div>
      </div>

      {/* CRITERIOS DE SOLUCIÓN */}
      <h2 className="subtitulo">Criterios de Solución de un Sistema</h2>
      <p>Existen tres posibilidades al resolver un sistema de ecuaciones lineales:</p>

      <div className="card-bloque">
        <h3 className="subtitulo-card">1) Una sola solución</h3>
        <p>
          Es el caso en que las dos rectas se cortan en un único punto <F>(x, y)</F>, como en los ejemplos anteriores.
        </p>
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">2) Sin solución (Rectas paralelas)</h3>
        <p>
          Ocurre cuando las dos rectas son paralelas y nunca se cruzan. No existe ningún punto <F>(x, y)</F> en el que coincidan.
        </p>
        <div className="ejemplo-box">
          <p><strong>Ejemplo:</strong></p>
          <Formula>{String.raw`\begin{cases} x + y = 3 \\ x + y = 5 \end{cases}`}</Formula>
          <p>
            Los coeficientes de <F>x</F> e <F>y</F> son idénticos, por lo que tienen la misma pendiente, pero su término independiente cambia. Jamás se interceptarán.
          </p>
        </div>

        {/* 2. SEGUNDA GRÁFICA: Rectas paralelas */}
        <GraficaParalelas />
      </div>

      <div className="card-bloque">
        <h3 className="subtitulo-card">3) Soluciones infinitas (Misma recta)</h3>
        <p>
          Ocurre cuando ambas ecuaciones representan exactamente la misma recta. Se identifican fácilmente porque sus coeficientes y términos independientes guardan la misma proporción.
        </p>
        <div className="ejemplo-box">
          <p><strong>Ejemplo:</strong></p>
          <Formula>{String.raw`\begin{cases} x + y = 2 \\ 2x + 2y = 4 \end{cases}`}</Formula>
          <p>
            Cualquier par <F>(x, y)</F> que satisfaga la primera ecuación también satisfará la segunda. Se cumple la regla de proporcionalidad entre coeficientes:
          </p>
          <Formula>{String.raw`\frac{a_1}{a_2} = \frac{b_1}{b_2} = \frac{c_1}{c_2} \implies \frac{1}{2} = \frac{1}{2} = \frac{2}{4}`}</Formula>
          <p style={{ marginTop: '10px', fontSize: '0.95rem' }}>
            Gráficamente, ambas ecuaciones se enciman perfectamente en una sola recta continua, compartiendo todos y cada uno de sus puntos:
          </p>

          {/* 3. TERCERA GRÁFICA: Rectas coincidentes / infinitas soluciones */}
          <GraficaCoincidentes />
        </div>
      </div>
    </div>
  );
}

function Seccion23() {
  return (
    <div>
      <p>
        Los <strong>polinomios</strong> son expresiones algebraicas, compuestas de varios términos algebraicos; puede verse como la suma o resta de varios términos algebraicos.
      </p>

      <h2 className="subtitulo">Clasificación de Polinomios</h2>
      <p>Existen diferentes clasificaciones según la cantidad de términos que poseen:</p>

      <div className="card-bloque">
        <ol className="lista-partes" style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '12px' }}>
            <strong>Monomio:</strong> Solo cuentan con 1 término en la expresión.
            <div style={{ marginTop: '4px' }}>
              • Ejemplo: <Formula>-3x^2</Formula>
            </div>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>Binomio:</strong> Cuenta con 2 términos no semejantes separados por un signo de <F>+</F> o de <F>-</F> (también puede ser la suma o resta de un número).
            <div style={{ marginTop: '4px' }}>
              • Ejemplo: <Formula>-2x^2 + 5x</Formula>
            </div>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>Trinomio:</strong> Cuenta con 3 términos no semejantes separados por un signo de <F>+</F> o de <F>-</F>.
            <div style={{ marginTop: '4px' }}>
              • Ejemplo: <Formula>-2x^2 + 5x + 8</Formula>
            </div>
          </li>
          <li>
            <strong>Polinomio:</strong> Se les dice así tanto a las expresiones anteriores como a expresiones con más de 3 términos.
            <div style={{ marginTop: '4px' }}>
              • Ejemplo: <Formula>-x^3 - 2x^2 + 5x + 8 + \dots</Formula>
            </div>
          </li>
        </ol>
      </div>

      <p>
        Los polinomios pueden tener multivariable, pueden ser también algo como: <Formula>2x + y - 5z</Formula>. Si bien podría verse más complejo al realizar operaciones con ellos, esto es exactamente igual que en la sección de expresiones algebraicas, ya que cuando realices una operación siempre debe ser con <strong>términos semejantes</strong>.
      </p>

      {/* 1. SUMA DE POLINOMIOS */}
      <h2 className="subtitulo">Suma de Polinomios</h2>
      <p>
        Puedes sumarlo como sea de tu mejor agrado, una buena forma de hacerlo al tener 3 expresiones es acomodar la suma como cuando te enseñaron a sumar, acomodando los términos semejantes uno abajo del otro.
      </p>

      <div className="ejemplo-box">
        <p><strong>Ejemplo 1:</strong> Sumar las siguientes tres expresiones</p>
        <Formula>(3x - 7y - 3z + 5) + (-10x + 4z) + (-x + 2y + z - 8)</Formula>

        <p style={{ marginTop: '12px' }}>Acomodando verticalmente por términos semejantes:</p>
        <Formula>{String.raw`\begin{aligned} 
          3x - 7y - 3z + 5 \\
          -10x \phantom{ - 7y} + 4z \phantom{ + 5} \\
          {}+ (-x + 2y + z - 8) \\
          \hline
          -8x - 5y + 2z - 3
        \end{aligned}`}</Formula>

        <div className="paso resultado" style={{ marginTop: '14px' }}>
          <span className="paso-num">✓</span>
          <div>
            <strong>Respuesta: <F>-8x - 5y + 2z - 3</F></strong>
          </div>
        </div>
      </div>

      <p>
        También las variables pueden estar con potencias de otras variables y quedarían igual.
      </p>

      <div className="ejemplo-box">
        <p><strong>Ejemplo 2 (Con fracciones y potencias):</strong></p>
        <Formula>{String.raw`\left( \frac{2}{3}x^2y + \frac{1}{2}xy^2 - 4 \right) + \left( \frac{1}{3}x^2y - \frac{5}{2}xy^2 + 9 \right)`}</Formula>

        <p style={{ marginTop: '12px' }}>Acomodo vertical:</p>
        <Formula>{String.raw`\begin{aligned}
          \frac{2}{3}x^2y + \frac{1}{2}xy^2 - 4 \\
          {}+ \left( \frac{1}{3}x^2y - \frac{5}{2}xy^2 + 9 \right) \\
          \hline
          x^2y - 2xy^2 + 5
        \end{aligned}`}</Formula>

        <div className="paso resultado" style={{ marginTop: '14px' }}>
          <span className="paso-num">✓</span>
          <div>
            <strong>Respuesta: <F>x^2y - 2xy^2 + 5</F></strong>
            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#666' }}>
              (Si tienes duda respecto a los resultados, consultar el tema de operaciones con fracción, previamente visto).
            </p>
          </div>
        </div>
      </div>

      {/* 2. RESTA DE POLINOMIOS (NUEVA REDACCIÓN) */}
      <h2 className="subtitulo">Resta de Polinomios</h2>
      <p>
        Para restar polinomios, lo más importante es no olvidar la ley de los signos, especialmente que menos por menos es más <F>(- \times - = +)</F>. El signo "menos" de la resta va a cambiarle el signo a todo el polinomio que esté restando.
      </p>

      <div className="ejemplo-box">
        <p><strong>Ejemplo 1 (En horizontal):</strong></p>
        <Formula>(5a - 3b - 8c) - (2a - 4b - 9c)</Formula>

        <p style={{ marginTop: '10px' }}>
          Aquí, el signo de resta afecta a todo el segundo paréntesis:
        </p>
        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
          <li>El <F>2a</F> positivo pasa a ser <F>-2a</F>.</li>
          <li>El <F>-4b</F> pasa a ser <F>+4b</F>.</li>
          <li>El <F>-9c</F> pasa a ser <F>+9c</F>.</li>
        </ul>

        <p>La expresión reescrita nos queda así:</p>
        <Formula>5a - 2a - 3b + 4b - 8c + 9c</Formula>

        <p style={{ marginTop: '10px' }}>Agrupamos los términos semejantes y resolvemos:</p>
        <div className="paso resultado" style={{ marginTop: '10px' }}>
          <span className="paso-num">✓</span>
          <div>
            <strong>Resultado: <F>3a + b + c</F></strong>
          </div>
        </div>
      </div>

      <div className="ejemplo-box">
        <p><strong>Ejemplo 2 (Acomodo vertical convencional):</strong></p>
        <p style={{ fontSize: '0.95rem' }}>
          Para no confundirte con los signos al restar hacia abajo, un truco buenísimo es multiplicar mentalmente el signo "menos" por todo el segundo polinomio antes de escribirlo. Así, solo tienes que hacer una suma directa de columnas, lo cual es mucho más fácil y rápido.
        </p>

        <p style={{ marginTop: '12px' }}>Resta de:</p>
        <Formula>(10x^2 - 9x - 8) - (4x^2 - 4x + 4)</Formula>

        <p style={{ marginTop: '12px' }}>
          Le cambiamos los signos al segundo polinomio al realizar la multuiplicacion del signo (<F>-</F>) por toda la expresion (<F>-4x^2 + 4x - 4</F>) y lo acomodamos debajo:
        </p>

        <div style={{ marginTop: '14px' }}>
          <Formula>{String.raw`\begin{aligned}
            10x^2 - 9x - 8 \\
            {}+ (-4x^2 + 4x - 4) \\
            \hline
            6x^2 - 5x - 12
          \end{aligned}`}</Formula>
        </div>

        <div className="paso resultado" style={{ marginTop: '14px' }}>
          <span className="paso-num">✓</span>
          <div>
            <strong>Resultado: <F>6x^2 - 5x - 12</F></strong>
          </div>
        </div>
      </div>

      <p>
        Como puedes ver, restar es exactamente igual que sumar; solo tienes que recordar hacer el cambio de signos al polinomio que resta antes de empezar a operar.
      </p>
    </div>
  );
}







// Subcomponente reutilizable para renderizar la "casita" de división escolar limpia
const CasitaDivision = ({ cociente, divisor, dividendo, pasos = [] }) => {
  return (
    <div style={{
      display: 'inline-block',
      fontFamily: 'KaTeX_Main, "Times New Roman", serif',
      fontSize: '1.2rem',
      backgroundColor: '#f9fbfd',
      padding: '16px 24px',
      borderRadius: '8px',
      border: '1px solid #e1e8ed',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      margin: '12px 0'
    }}>
      {/* Fila del Cociente */}
      <div style={{ paddingLeft: '75px', minHeight: '28px', color: '#d32f2f', fontWeight: 'bold' }}>
        {cociente}
      </div>

      {/* Fila Principal: Divisor | Casita (Dividendo) */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ paddingRight: '8px', color: '#2c3e50', fontWeight: 'bold' }}>
          {divisor}
        </span>
        
        {/* Borde izquierdo (paréntesis/línea) y borde superior (techo de la casita) */}
        <div style={{
          borderLeft: '2px solid #333',
          borderTop: '2px solid #333',
          borderTopLeftRadius: '4px',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '4px',
          fontWeight: 'bold'
        }}>
          {dividendo}
        </div>
      </div>

      {/* Pasos / Restas intermedias debajo de la casita */}
      {pasos.length > 0 && (
        <div style={{ paddingLeft: '75px', marginTop: '6px' }}>
          {pasos.map((paso, idx) => (
            <div 
              key={idx} 
              style={{ 
                borderBottom: paso.lineaFinal ? '2px solid #333' : 'none',
                paddingBottom: paso.lineaFinal ? '4px' : '0',
                marginBottom: '4px',
                color: paso.color || '#333'
              }}
            >
              {paso.texto}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function Seccion231() {
  return (
    <div>
      <h2 className="subtitulo">1. Multiplicación y división de polinomios</h2>

      {/* ========================================================
          MULTIPLICACIÓN DE POLINOMIOS 
          ======================================================== */}

      {/* 1. MONOMIO POR MONOMIO */}
      <div className="card-bloque" style={{ marginBottom: '16px' }}>
        <h3 className="subtitulo-card">Multiplicación de monomio por monomio</h3>
        <p style={{ marginBottom: '12px' }}>
          En la multiplicación las bases (variables) se suman:
        </p>
        <Formula>
          {String.raw`(-7x^4 y^3 z^2)(3x^5 y^9 z^5) \rightarrow (-7)(3) x^{4+5} y^{3+9} z^{2+5} = -21x^9 y^{12} z^7`}
        </Formula>
      </div>

      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Respuesta: </strong>
          <F>{String.raw`-21x^9 y^{12} z^7`}</F>
        </div>
      </div>

      {/* 2. POLINOMIO POR MONOMIO */}
      <div className="card-bloque" style={{ marginBottom: '16px' }}>
        <h3 className="subtitulo-card">Multiplicación de polinomio por monomio</h3>
        <p style={{ marginBottom: '12px' }}>
          Se multiplica cada término del polinomio por el monomio.
        </p>
        
        <div style={{ paddingLeft: '8px', lineHeight: '1.8' }}>
          <p style={{ margin: '4px 0' }}>
            <strong>Polinomio: </strong>
            <F>{String.raw`{\color{#4ba3e3}-7x^4y^3z^2} + {\color{#d977d9}3x^2y^6} {\color{#88cc66}- 4x^4z^2}`}</F>
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>Monomio: </strong>
            <F>{String.raw`{\color{#e69875}-2x^2y^3z^4}`}</F>
          </p>
        </div>
      </div>

      <div className="ejemplo-box" style={{ marginBottom: '25px' }}>
        <p><strong>Ejemplo 1:</strong></p>

        <Formula>
          {String.raw`{\color{#e69875}(-2x^2y^3z^4)}({\color{#4ba3e3}{-7x^4y^3z^2}} + {\color{#d977d9}{3x^2y^6}} \quad {\color{#88cc66}{- 4x^4z^2}})`}
        </Formula>

        <div style={{ margin: '16px 0', overflowX: 'auto' }}>
          <Formula>
            {String.raw`
              \begin{array}{ccc}
                {\color{#e69875}(-2x^2y^3z^4)}{\color{#4ba3e3}(-7x^4y^3z^2)} & + \quad {\color{#e69875}(-2x^2y^3z^4)}{\color{#d977d9}(3x^2y^6)} & + \quad {\color{#e69875}(-2x^2y^3z^4)}{\color{#88cc66}(-4x^4z^2)} \\[12pt]
                14x^6y^6z^6 & -6x^4y^9z^4 & +8x^6y^3z^6
              \end{array}
            `}
          </Formula>
        </div>

        <div className="paso resultado" style={{ marginTop: '16px' }}>
          <span className="paso-num">✓</span>
          <div>
            <strong>Resultado: </strong>
            <F>{String.raw`14x^6y^6z^6 - 6x^4y^9z^4 + 8x^6y^3z^6`}</F>
          </div>
        </div>
      </div>

      {/* 3. POLINOMIO POR POLINOMIO */}
      <div className="card-bloque" style={{ marginBottom: '16px' }}>
        <h3 className="subtitulo-card">Multiplicación de polinomio por polinomio</h3>
        <p style={{ margin: 0 }}>
          Se debe multiplicar cada componente del polinomio por cada componente. Es más fácil verlo como si fuera una multiplicación normal, solo que inicias multiplicando de izquierda a derecha y no de derecha a izquierda como se acostumbra.
        </p>
      </div>

      <div className="ejemplo-box" style={{ marginBottom: '16px' }}>
        <p><strong>Ejemplo:</strong></p>

        <div style={{ margin: '16px 0', overflowX: 'auto' }}>
          <Formula>{String.raw`
            (2x^4 + 3x^2 - 4)(-3x^4 - x^3 + 5)
          `}</Formula>

          <Formula>{String.raw`
            \begin{array}{rcccccccc}
              & {\color{#4ba3e3}{2x^4}} & & & {\color{#4ba3e3}{+ 3x^2}} & & {\color{#4ba3e3}{- 4}} \\
              \times & {\color{#d977d9}{-3x^4}} & {\color{#d977d9}{- x^3}} & & & & {\color{#d977d9}{+ 5}} \\
              \hline
              & {\color{#e69875}{-6x^8}} & & {\color{#e69875}{- 9x^6}} & & {\color{#e69875}{+ 12x^4}} \\
              & & {\color{#88cc66}{-2x^7}} & & {\color{#88cc66}{+ 3x^5}} & & {\color{#88cc66}{+ 4x^3}} \\
              & & & & & {\color{#d977d9}{-10x^4}} & & {\color{#d977d9}{+ 15x^2}} & {\color{#d977d9}{- 20}} \\
              \hline
              & \mathbf{-6x^8} & \mathbf{-2x^7} & \mathbf{-9x^6} & \mathbf{+3x^5} & \mathbf{+2x^4} & \mathbf{+4x^3} & \mathbf{+15x^2} & \mathbf{-20}
            \end{array}
          `}</Formula>
        </div>

        <div className="paso resultado" style={{ marginTop: '16px' }}>
          <span className="paso-num">✓</span>
          <div>
            <strong>Resultado: </strong>
            <F>{String.raw`-6x^8 - 2x^7 - 9x^6 + 3x^5 + 2x^4 + 4x^3 + 15x^2 - 20`}</F>
          </div>
        </div>
      </div>

      {/* NOTA ACLARATORIA */}
      <div 
        className="nota-box" 
        style={{ 
          backgroundColor: '#fffde7', 
          borderLeft: '4px solid #fbc02d', 
          padding: '12px 16px', 
          borderRadius: '6px', 
          marginBottom: '25px' 
        }}
      >
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#574300', lineHeight: '1.5' }}>
          <strong>Nota:</strong> Acomodamos de manera ascendente el resultado de la suma de estos polinomios.
        </p>
      </div>

      <hr style={{ margin: '30px 0', borderColor: '#eee' }} />

      {/* ========================================================
          DIVISIÓN DE POLINOMIOS 
          ======================================================== */}
      <h2 className="subtitulo">División</h2>

      {/* 1. MONOMIO POR MONOMIO */}
      <div className="card-bloque" style={{ marginBottom: '16px' }}>
        <h3 className="subtitulo-card">División de monomio por monomio</h3>
        <p style={{ marginBottom: '12px' }}>
          Para la división los exponentes de las bases (variables) se restan y los coeficientes se dividen.
        </p>
        <Formula>
          {String.raw`\frac{10a^5b^{10}c^7}{5a^2b^6c^2} \rightarrow \left(\frac{10}{5}\right) a^{5-2} b^{10-6} c^{7-2} = 2a^3b^4c^5`}
        </Formula>
      </div>

      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Resultado: </strong>
          <F>{String.raw`2a^3b^4c^5`}</F>
        </div>
      </div>

      {/* 2. POLINOMIO ENTRE MONOMIO */}
      <div className="card-bloque" style={{ marginBottom: '16px' }}>
        <h3 className="subtitulo-card">División entre polinomio y monomio</h3>
        <p style={{ marginBottom: '12px' }}>
          Se divide cada término del polinomio entre el monomio.
        </p>
        <Formula>
          {String.raw`\frac{12x^{10} + 6x^7 - 9x^5}{2x^2} = \frac{12x^{10}}{2x^2} \quad \frac{6x^7}{2x^2} \quad \frac{-9x^5}{2x^2}`}
        </Formula>
      </div>

      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Resultado: </strong>
          <F>{String.raw`6x^8 + 3x^5 - 3x^3`}</F>
        </div>
      </div>

      {/* 3. POLINOMIO ENTRE POLINOMIO */}
      <div className="card-bloque" style={{ marginBottom: '16px' }}>
        <h3 className="subtitulo-card">División de polinomio entre otro polinomio</h3>
        <p style={{ margin: 0 }}>
          Este tipo de división suele ser más larga, aunque se parece mucho al método de resolver una división numérica.
        </p>
      </div>

      {/* EJEMPLO CON PASO A PASO Y CASITA LIMPIA */}
      <div className="ejemplo-box" style={{ marginBottom: '25px' }}>
        <p style={{ marginBottom: '16px' }}>
          <strong>Ejemplo con paso a paso:</strong> Dividir <F>2x^2 + 5x + 3</F> entre <F>x + 1</F>
        </p>

        <ul className="lista-partes" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
          <li style={{ marginBottom: '20px' }}>
            <strong>Paso 1:</strong> Ordenar los polinomios de mayor a menor exponente, en caso de que no se encuentren en orden.
            <div style={{ marginTop: '8px' }}>
              <Formula>{String.raw`\frac{2x^2 + 5x + 3}{x + 1}`}</Formula>
            </div>
          </li>

          <li style={{ marginBottom: '20px' }}>
            <strong>Paso 2:</strong> Se divide el primer término del dividendo entre el primer término del divisor. El resultado obtenido lo escribes en el cociente.
            <div style={{ marginTop: '10px' }}>
              <CasitaDivision 
                cociente={<F>{String.raw`\mathbf{2x}`}</F>}
                divisor={<F>{String.raw`x + 1`}</F>}
                dividendo={<F>{String.raw`2x^2 + 5x + 3`}</F>}
              />
            </div>
          </li>

          <li style={{ marginBottom: '20px' }}>
            <strong>Paso 3:</strong> Multiplicar el divisor (x+1) por el resultado de dividir el primer término del dividendo por el primer término del divisor.
            <div style={{ marginTop: '8px' }}>
              <Formula>{String.raw`(x + 1)(2x) = 2x^2 + 2x`}</Formula>
            </div>
          </li>

          <li style={{ marginBottom: '20px' }}>
            <strong>Paso 4:</strong> Escribimos el resultado de la multiplicación debajo del dividendo, siempre alineando términos semejantes.
            <div style={{ marginTop: '10px' }}>
              <CasitaDivision 
                cociente={<F>{String.raw`2x`}</F>}
                divisor={<F>{String.raw`x + 1`}</F>}
                dividendo={<F>{String.raw`2x^2 + 5x + 3`}</F>}
                pasos={[
                  { texto: <F>{String.raw`-2x^2 - 2x`}</F>, color: '#d32f2f' }
                ]}
              />
            </div>
          </li>

          <li style={{ marginBottom: '20px' }}>
            <strong>Paso 5:</strong> Le restamos el resultado al dividendo.
            <div style={{ marginTop: '10px' }}>
              <CasitaDivision 
                cociente={<F>{String.raw`2x`}</F>}
                divisor={<F>{String.raw`x + 1`}</F>}
                dividendo={<F>{String.raw`2x^2 + 5x + 3`}</F>}
                pasos={[
                  { texto: <F>{String.raw`-2x^2 - 2x`}</F>, lineaFinal: true },
                  { texto: <F>{String.raw`3x + 3`}</F>, color: '#1976d2' }
                ]}
              />
            </div>
          </li>

          <li style={{ marginBottom: '20px' }}>
            <strong>Paso 6:</strong> Repetir el proceso hasta que el residuo quede en 0 a ser posible.
            <div style={{ marginTop: '8px' }}>
              <Formula>{String.raw`(x + 1)(3) = 3x + 3`}</Formula>
            </div>
          </li>

          <li style={{ marginBottom: '20px' }}>
            <strong>Paso 7:</strong> Volver a escribir debajo del nuevo residuo el resultado de la multiplicación y posteriormente restar la cantidad.
            <div style={{ marginTop: '10px' }}>
              <CasitaDivision 
                cociente={<F>{String.raw`2x + 3`}</F>}
                divisor={<F>{String.raw`x + 1`}</F>}
                dividendo={<F>{String.raw`2x^2 + 5x + 3`}</F>}
                pasos={[
                  { texto: <F>{String.raw`-2x^2 - 2x`}</F>, lineaFinal: true },
                  { texto: <F>{String.raw`3x + 3`}</F> },
                  { texto: <F>{String.raw`-3x - 3`}</F>, color: '#d32f2f', lineaFinal: true },
                  { texto: <F>{String.raw`0`}</F>, color: '#388e3c' }
                ]}
              />
            </div>
          </li>
        </ul>

        <div className="paso resultado" style={{ marginTop: '20px' }}>
          <span className="paso-num">✓</span>
          <div>
            <strong>Resultado: </strong> Al haber llegado a 0, entendemos que el resultado es: <F>2x + 3</F>
          </div>
        </div>
      </div>

    </div>
  );
}




function Seccion24() {
  return (
    <div>
      <p>
        La <strong>factorización</strong> es el proceso de transformar un polinomio en el producto de factores más simples. Podría verse como el proceso inverso a desarrollar una multiplicación.
      </p>

      <p>
        Existen diferentes formas o métodos para factorizar dependiendo de la estructura del polinomio.
      </p>

      <h2 className="subtitulo">Factorización por Factor Común</h2>
      
      <div className="card-bloque">
        <p>
          Lo que se tiene que hacer es encontrar el <strong>factor común</strong>, es decir, el término que "aparece" o "cabe" dentro de cada uno de los componentes de la expresión.
        </p>
      </div>

      {/* EJEMPLO 1 */}
      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo 1:</strong></p>
        <Formula>{String.raw`x^7 - x^6 + x^4`}</Formula>
        
        <p style={{ marginTop: '10px' }}>
          Analizamos cada uno de los términos:
        </p>
        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
          <li><F>{String.raw`x^7 = (x^4)(x^3)`}</F></li>
          <li><F>{String.raw`x^6 = (x^4)(x^2)`}</F></li>
          <li><F>{String.raw`x^4 = (x^4)(1)`}</F></li>
        </ul>

        <p style={{ margin: 0 }}>
          En este ejemplo, el término que "cabe en cada componente" es <strong><F>x^4</F></strong>, por lo que extraemos ese factor:
        </p>

        <Formula>{String.raw`x^7 - x^6 + x^4 = x^4(x^3 - x^2 + 1)`}</Formula>
      </div>

      {/* RESULTADO EJEMPLO 1 (FUERA DE LA CAJA) */}
      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Resultado factorizado: </strong> <F>{String.raw`x^4(x^3 - x^2 + 1)`}</F>
        </div>
      </div>

      {/* EJEMPLO 2 */}
      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo 2 (Numérico / Examen):</strong></p>
        <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '10px' }}>
          Es importante saber que probablemente en el examen vendrán ejercicios más sencillos como el siguiente:
        </p>

        <Formula>{String.raw`10x^2 - 20x`}</Formula>

        <p style={{ margin: 0 }}>
          Buscamos el máximo común divisor de los números (10) y la variable de menor exponente (<F>x</F>). El factor común es <strong><F>10x</F></strong>:
        </p>
      </div>

      {/* RESULTADO EJEMPLO 2 (FUERA DE LA CAJA) */}
      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Resultado factorizado: </strong> <F>{String.raw`10x(x - 2)`}</F>
        </div>
      </div>

      <div className="nota-box">
        📌 <strong>Nota de examen:</strong> Si multiplicas de nuevo el factor externo por cada término dentro del paréntesis, <F>10x(x - 2) = 10x^2 - 20x</F>, debes recuperar exactamente la expresión original. ¡Es una excelente forma de comprobar tu respuesta!
      </div>
    </div>
  );
}

function Seccion241() {
  return (
    <div>
      <p>
        <strong>Diferencia de cuadrados: </strong> es un método de factorización que se aplica a binomios muy específicos.
      </p>

      <h2 className="subtitulo">Condiciones para su aplicación</h2>
      <div className="card-bloque">
        <p style={{ marginBottom: '10px' }}>
          Para usar la diferencia de cuadrados se deben cumplir las siguientes reglas:
        </p>
        <ol className="lista-partes" style={{ paddingLeft: '20px' }}>
          <li>La expresión es un <strong>binomio</strong> (solo tiene 2 componentes).</li>
          <li>Los términos deben estar separados por un signo menos (<strong><F>-</F></strong>), es decir, el segundo término resta al primero.</li>
          <li>Ambos componentes tienen <strong>raíz cuadrada exacta</strong>.</li>
        </ol>
      </div>

      <p>
        Si la expresión cumple con todas estas condiciones, aplicamos la siguiente fórmula:
      </p>
      <Formula>{String.raw`a^2 - b^2 = (a + b)(a - b)`}</Formula>

      {/* EJEMPLO 1 */}
      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo 1 (Básico):</strong> Factorizar <F>{String.raw`x^2 - 25`}</F></p>
        
        <div className="pasos-box" style={{ marginTop: '12px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Aplicar raíz cuadrada a cada término:</strong>
              <p style={{ margin: '4px 0 0' }}>
                <F>{String.raw`\sqrt{x^2} = x`}</F> &nbsp;y&nbsp; <F>{String.raw`\sqrt{25} = 5`}</F>
              </p>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Escribir la factorización siguiendo la fórmula:</strong>
              <p style={{ margin: '4px 0 0' }}><F>(x + 5)(x - 5)</F></p>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADO EJEMPLO 1 */}
      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Resultado factorizado: </strong> <F>(x + 5)(x - 5)</F>
        </div>
      </div>

      <div className="nota-box">
        📌 <strong>Nota:</strong> Este método también puede usarse con fracciones o expresiones con potencias pares mayores.
      </div>

      {/* EJEMPLO 2 */}
      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo 2 (Con Fracciones):</strong> Factorizar <F>{String.raw`\frac{x^2}{4} - \frac{9}{16}`}</F></p>
        
        <div className="pasos-box" style={{ marginTop: '12px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Aplicar raíz cuadrada a cada término:</strong>
              <p style={{ margin: '4px 0 0' }}>
                <F>{String.raw`\sqrt{\frac{x^2}{4}} = \frac{x}{2}`}</F> &nbsp;y&nbsp; <F>{String.raw`\sqrt{\frac{9}{16}} = \frac{3}{4}`}</F>
              </p>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Escribir la factorización siguiendo la fórmula:</strong>
              <p style={{ margin: '4px 0 0' }}>
                <F>{String.raw`\left(\frac{x}{2} + \frac{3}{4}\right)\left(\frac{x}{2} - \frac{3}{4}\right)`}</F>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADO EJEMPLO 2 */}
      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Resultado factorizado: </strong> <F>{String.raw`\left(\frac{x}{2} + \frac{3}{4}\right)\left(\frac{x}{2} - \frac{3}{4}\right)`}</F>
        </div>
      </div>

      {/* EJEMPLO 3 */}
      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo 3 (Con Potencias Mayores):</strong> Factorizar <F>{String.raw`16x^4 - 81y^6`}</F></p>
        
        <div className="pasos-box" style={{ marginTop: '12px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Aplicar raíz cuadrada a cada término:</strong>
              <p style={{ margin: '4px 0 0' }}>
                <F>{String.raw`\sqrt{16x^4} = 4x^2`}</F> &nbsp;y&nbsp; <F>{String.raw`\sqrt{81y^6} = 9y^3`}</F>
              </p>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Escribir la factorización siguiendo la fórmula:</strong>
              <p style={{ margin: '4px 0 0' }}>
                <F>{String.raw`(4x^2 + 9y^3)(4x^2 - 9y^3)`}</F>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADO EJEMPLO 3 */}
      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Resultado factorizado: </strong> <F>{String.raw`(4x^2 + 9y^3)(4x^2 - 9y^3)`}</F>
        </div>
      </div>
    </div>
  );
}

function Seccion242() {
  return (
    <div>
      <p>
        El <strong>trinomio de la forma <F>x^2 + bx + c</F></strong> es una de las formas de factorización más comunes y requeridas en exámenes.
      </p>

      <h2 className="subtitulo">Requisitos para identificar esta forma</h2>
      <div className="card-bloque">
        <p style={{ marginBottom: '10px' }}>
          Para aplicar esta técnica, debes verificar que la expresión cumpla con las siguientes cuatro condiciones:
        </p>
        <ol className="lista-partes" style={{ paddingLeft: '20px' }}>
          <li>Cuenta con <strong>exactamente tres términos</strong>.</li>
          <li>
            El primer término (<F>x^2</F>) es cuadrático, positivo y su coeficiente es 1 (por ejemplo: <F>x^2</F>).
          </li>
          <li>
            El segundo término (<F>bx</F>) tiene la misma variable con exponente 1, y su coeficiente <F>b</F> puede ser cualquier número (positivo o negativo, por ejemplo: <F>+6x</F>).
          </li>
          <li>
            El tercer término (<F>c</F>) es un número independiente (positivo o negativo, por ejemplo: <F>-16</F>).
          </li>
        </ol>
      </div>

      <p>
        Una vez identificas que se cumplen estas reglas, procedemos a factorizar de la siguiente manera:
      </p>

      {/* EJEMPLO 1 (PASO A PASO EXPLICADO) */}
      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo 1 (Paso a paso):</strong> Factorizar <F>x^2 + 6x - 16</F></p>

        <div className="pasos-box" style={{ marginTop: '12px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Extraer raíz del primer componente:</strong>
              <p style={{ margin: '4px 0 0' }}>
                Se calcula <F>{String.raw`\sqrt{x^2} = x`}</F> y se prepara en dos paréntesis: <F>(x \quad)(x \quad)</F>
              </p>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Determinar los signos de cada paréntesis:</strong>
              <ul style={{ paddingLeft: '20px', margin: '4px 0 0' }}>
              <li>
                Primer paréntesis: toma el signo del segundo término (<F>{String.raw`+6x \rightarrow \mathbf{+}`}</F>).
              </li>
              <li>
                Segundo paréntesis: resulta de multiplicar el signo del segundo término por el del tercero (<F>{String.raw`(+)(-)=\mathbf{-}`}</F>).
              </li>
              </ul>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">3</span>
            <div>
              <strong>Colocar los signos en las estructuras:</strong>
              <p style={{ margin: '4px 0 0' }}><F>(x + \quad)(x - \quad)</F></p>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">4</span>
            <div>
              <strong>Buscar los números requeridos:</strong>
              <p style={{ margin: '4px 0 6px' }}>
                Como los signos son <i>diferentes</i> (<F>+</F> y <F>-</F>), buscamos dos números que <strong>restados den 6</strong> (coeficiente del segundo término) y <strong>multiplicados den 16</strong> (tercer término).
              </p>
              <ul style={{ paddingLeft: '20px', margin: '0', fontSize: '0.95rem', color: '#555' }}>
                <li><F>16 \times 1 = 16</F>, pero <F>16 - 1 = 15</F> ❌</li>
                <li><F>4 \times 4 = 16</F>, pero <F>4 - 4 = 0</F> ❌</li>
                <li><F>8 \times 2 = 16</F>, y <F>8 - 2 = 6</F> ✔️</li>
              </ul>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">5</span>
            <div>
              <strong>Escribir los factores:</strong>
              <p style={{ margin: '4px 0 0' }}>
                El número mayor se coloca en el primer paréntesis: <F>(x + 8)(x - 2)</F>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADO EJEMPLO 1 */}
      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Resultado factorizado: </strong> <F>(x + 8)(x - 2)</F>
        </div>
      </div>

      {/* EJEMPLO 2 (MÉTODO DIRECTO) */}
      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo 2 (Método directo):</strong> Factorizar <F>x^2 + 4x - 21</F></p>

        <div className="pasos-box" style={{ marginTop: '12px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div><strong>Base:</strong> <F>(x \quad)(x \quad)</F></div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div><strong>Signos:</strong> Segundo término es <F>+4x</F> (<F>+</F>). Signo combinado: <F>(+)(-)= -</F></div>
          </div>

          <div className="paso">
            <span className="paso-num">3</span>
            <div><strong>Estructura:</strong> <F>(x + \quad)(x - \quad)</F></div>
          </div>

          <div className="paso">
            <span className="paso-num">4</span>
            <div>
              <strong>Combinaciones para multiplicados 21 y restados 4:</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.95rem' }}>
                <F>21 \times 1 = 21 \implies 21 - 1 = 20</F> ❌<br />
                <F>7 \times 3 = 21 \implies 7 - 3 = 4</F> ✔️
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADO EJEMPLO 2 */}
      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Resultado factorizado: </strong> <F>(x + 7)(x - 3)</F>
        </div>
      </div>

      <div className="nota-box">
        📌 <strong>Regla rápida de signos:</strong> Si los signos de los paréntesis son iguales (ej: ambos positivos o ambos negativos), buscas números que <strong>sumados</strong> den el centro de la expresión original. Si los signos son distintos (uno positivo y uno negativo), buscas números que <strong>restados</strong> den el centro de la expresión original.
      </div>
    </div>
  );
}

function Seccion25() {
  return (
    <div>
      <p>
        Una <strong>expresión algebraica racional</strong> tiene la forma <F>{String.raw`\frac{P(x)}{Q(x)}`}</F> en donde tanto <F>P(x)</F> como <F>Q(x)</F> son polinomios y <F>Q(x)</F> nunca puede ser 0. Un buen ejemplo podría ser el siguiente:
      </p>

      {/* EJEMPLO INICIAL DE INTRODUCCIÓN */}
      <Formula>{String.raw`\frac{5x + 10}{2x - 5}`}</Formula>

      <p style={{ marginTop: '12px' }}>
        Si <F>Q(x)</F> fuera 0, entonces sería una división entre 0 la cual no es posible, dado a que es un error matemático. Por eso <F>Q(x)</F> tiene que ser diferente de 0.
      </p>

      <h2 className="subtitulo">Simplificación de Fracciones Algebraicas</h2>
      <div className="card-bloque">
        <p>
          La simplificación consta de "hacer más chica" la expresión (por ejemplo, como cuando <F>{String.raw`\frac{4}{8} = \frac{2}{4} = \frac{1}{2}`}</F>). Al realizar la simplificación, buscamos expresar la división de manera más sencilla y sin modificar su valor original.
        </p>
      </div>

      {/* EJEMPLO DE SIMPLIFICACIÓN */}
      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo:</strong> Simplificar la expresión</p>
        <Formula>{String.raw`\frac{x^2 - 9}{x^2 + 5x + 6}`}</Formula>

        <div className="pasos-box" style={{ marginTop: '14px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Factorizar el numerador (parte de arriba):</strong>
              <p style={{ margin: '4px 0 0' }}>
                Es una diferencia de cuadrados. Aplicamos la fórmula <F>{String.raw`(a+b)(a-b)`}</F>:
              </p>
              <p style={{ margin: '4px 0 0', fontWeight: '500' }}>
                <F>{String.raw`x^2 - 9 = (x + 3)(x - 3)`}</F>
              </p>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Factorizar el denominador (parte de abajo):</strong>
              <p style={{ margin: '4px 0 0' }}>
                Es un trinomio de la forma <F>{String.raw`x^2 + bx + c`}</F>. Buscamos dos números que multiplicados den <F>6</F> y sumados den <F>5</F>:
              </p>
              <p style={{ margin: '4px 0 0', fontWeight: '500' }}>
                <F>{String.raw`x^2 + 5x + 6 = (x + 3)(x + 2)`}</F>
              </p>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">3</span>
            <div>
              <strong>Acomodar las factorizaciones en la división:</strong>
              <Formula>{String.raw`\frac{(x + 3)(x - 3)}{(x + 3)(x + 2)}`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">4</span>
            <div>
              <strong>Eliminar factores comunes:</strong>
              <p style={{ margin: '4px 0 6px' }}>
                Los términos que se repiten en la parte de arriba y de abajo se eliminan, ya que equivalen a dividir algo entre sí mismo (<F>{String.raw`\frac{1}{1}`}</F>):
              </p>
              <Formula>{String.raw`\frac{\cancel{(x + 3)}(x - 3)}{\cancel{(x + 3)}(x + 2)}`}</Formula>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADO (FUERA DE LA CAJA) */}
      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Respuesta: </strong> <F>{String.raw`\frac{x - 3}{x + 2}`}</F>
        </div>
      </div>

      {/* NOTA ACLARATORIA */}
      <div className="nota-box">
        <p style={{ margin: '0 0 8px 0' }}>
          📌 <strong>Nota:</strong> Nunca canceles términos que estén sumando o restando directamente (por ejemplo: no puedes cancelar las <F>x</F> en <F>{String.raw`\frac{x - 3}{x + 2}`}</F>). Solo se pueden cancelar factores que estén <strong>multiplicando</strong> a todo el bloque.
        </p>

        <hr style={{ border: 'none', borderTop: '1px dashed #ccc', margin: '8px 0' }} />

        <p style={{ margin: 0 }}>
          <strong>✔️ Lo que SÍ se puede cancelar:</strong>
          <br />
          Si la <F>x</F> está multiplicando a todo arriba y a todo abajo, sí la puedes simplificar:
          <br />
          <F>{String.raw`\frac{\cancel{x}(x - 3)}{\cancel{x}(x + 2)} = \frac{x - 3}{x + 2}`}</F>
        </p>
      </div>
    </div>
  );
}

function Seccion252() {
  return (
    <div>
      <div className="card-bloque">
        <p>
          Para la suma y resta de fracciones existen dos posibles casos: cuando los denominadores son <strong>iguales</strong> o cuando son <strong>diferentes</strong>.
        </p>
      </div>

      {/* CASO 1: DENOMINADORES IGUALES */}
      <h3 className="subtitulo-secundario" style={{ marginTop: '20px' }}>
        Cuando los denominadores son iguales
      </h3>
      <p>
        Cuando son iguales, el denominador no cambia, simplemente se realiza la suma o resta al numerador (la parte de arriba).
      </p>

      {/* EJEMPLO DENOMINADORES IGUALES */}
      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo:</strong></p>
        <Formula>{String.raw`\frac{3x - 2}{x^2 - 1} + \frac{-x + 4}{x^2 - 1}`}</Formula>

        <div className="pasos-box" style={{ marginTop: '14px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Realizar la suma de los numeradores:</strong>
              <Formula>{String.raw`\frac{(3x - 2) + (-x + 4)}{x^2 - 1} = \frac{2x + 2}{x^2 - 1}`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Factorizar y simplificar:</strong>
              <p style={{ margin: '4px 0 6px' }}>
                Por diferencia de cuadrados factorizamos el denominador, después descartamos los valores iguales que se encuentran tanto en el numerador como en el denominador.
              </p>
              <Formula>{String.raw`\frac{2(x + 1)}{(x + 1)(x - 1)} = \frac{2}{x - 1}`}</Formula>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADO EJEMPLO 1 */}
      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Resultado: </strong> <F>{String.raw`\frac{2}{x - 1}`}</F>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '30px 0' }} />

      {/* CASO 2: DENOMINADORES DIFERENTES */}
      <h3 className="subtitulo-secundario">
        Cuando los denominadores son diferentes
      </h3>
      <p>
        Al ser sumas de fracciones las cuales cuentan con denominador diferente, se necesita encontrar el <strong>mínimo común múltiplo (M.C.M)</strong>, es decir buscar que los denominadores sean iguales. Esto se puede lograr multiplicando la fracción por algún número para igualar el denominador, o multiplicar las dos fracciones por algún número o por alguna letra (<F>x</F> o <F>y</F> comúnmente) para que las dos compartan denominador.
      </p>

      {/* EJEMPLO 1 DENOMINADORES DIFERENTES */}
      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo 1:</strong></p>
        <Formula>{String.raw`\frac{3x}{2} + \frac{x}{4}`}</Formula>

        <div className="pasos-box" style={{ marginTop: '14px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Igualar denominadores y sumar:</strong>
              <p style={{ margin: '4px 0 6px' }}>
                Al observar esta operación, podemos notar que si multiplicamos por 2 la primera fracción, podríamos tener el mismo denominador de la segunda fracción, así que realizamos esa multiplicación y posteriormente la suma de fracción.
              </p>
              <Formula>{String.raw`2\left(\frac{3x}{2}\right) + \frac{x}{4} = \frac{6x + x}{4} \rightarrow \frac{7x}{4}`}</Formula>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADO EJEMPLO 1 DIFERENTES */}
      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Resultado: </strong> <F>{String.raw`\frac{7x}{4}`}</F>
        </div>
      </div>

      {/* EJEMPLO 2 DENOMINADORES DIFERENTES */}
      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo 2:</strong></p>
        <Formula>{String.raw`\frac{x + 2}{y} + \frac{6x - 10}{xy}`}</Formula>

        <div className="pasos-box" style={{ marginTop: '14px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Multiplicar para igualar denominadores:</strong>
              <p style={{ margin: '4px 0 6px' }}>
                La primera fracción requiere ser multiplicada por <F>x</F>, para obtener el mismo denominador de la segunda fracción.
              </p>
              <Formula>{String.raw`x\left(\frac{x + 2}{y}\right) + \frac{6x - 10}{xy} = \frac{x^2 + 2x}{xy} + \frac{6x - 10}{xy}`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Sumar términos semejantes:</strong>
              <Formula>{String.raw`\frac{(x^2 + 2x) + (6x - 10)}{xy} \rightarrow \frac{x^2 + 8x - 10}{xy}`}</Formula>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADO EJEMPLO 2 DIFERENTES */}
      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Resultado: </strong> <F>{String.raw`\frac{x^2 + 8x - 10}{xy}`}</F>
        </div>
      </div>

      <div className="nota-box">
        📌 <strong>Nota:</strong> A ser posible se debe siempre simplificar / factorizar, pero el polinomio que se encuentra en el numerador (<F>{String.raw`x^2 + 8x - 10`}</F>) no es posible que se factorice, por eso esa sería la respuesta final.
      </div>
    </div>
  );
}

function Seccion253() {
  return (
    <div>

      {/* SECCIÓN MULTIPLICACIÓN */}
      <h3 className="subtitulo-secundario">Multiplicación</h3>
      <div className="card-bloque">
        <p style={{ margin: '0 0 10px 0' }}>
          Para la multiplicación es bastante sencillo pues se realiza de manera <strong>lineal</strong> como vimos previamente en el tema de operaciones con fracciones. La única diferencia es que al final de realizar la multiplicación, es importante tener en cuenta que de ser posible debe de simplificarse / factorizarse.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '12px 0' }} />

        <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#2d3748' }}>
          Multiplicación de Variables Algebraicas
        </h4>
        <ul style={{ margin: 0, paddingLeft: '18px' }}>
          <li style={{ marginBottom: '6px' }}>
            <strong>Variables diferentes:</strong> Cuando multiplicas variables distintas (como <F>x</F> y <F>y</F>), el resultado es simplemente la unión de ambas.
            <br />
            <em>Ejemplo:</em> <F>{String.raw`x \cdot y = xy`}</F>
          </li>
          <li style={{ marginBottom: '6px' }}>
            <strong>Variables iguales (Misma base):</strong> Cuando multiplicas una variable por sí misma (como <F>x</F> por <F>x</F>), se suman sus exponentes (recuerda que una variable sola siempre tiene un exponente invisible de 1). Esto ocurre incluso si uno de los términos está acompañado por otra variable distinta.
            <br />
            <em>Ejemplo simple:</em> <F>{String.raw`x \cdot x = x^2`}</F> (ya que <F>{String.raw`x^1 \cdot x^1 = x^{1+1}`}</F>)
            <br />
            <em>Ejemplo combinado:</em> <F>{String.raw`x \cdot (xy) = x^2 y`}</F>
          </li>
        </ul>
      </div>

      {/* NOTA AMARILLA CON LA REGLA CLAVE */}
      <div 
        className="nota-box" 
        style={{ 
          backgroundColor: '#fffbe6', 
          borderColor: '#ffe58f', 
          color: '#8c6b00',
          margin: '16px 0 20px 0' 
        }}
      >
        💡 <strong>Nota:</strong> Al multiplicar variables, las letras diferentes solo se juntan, mientras que las letras iguales suman sus exponentes.
      </div>

      {/* EJEMPLO MULTIPLICACIÓN */}
      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo 1:</strong></p>
        <Formula>{String.raw`\frac{3x}{3y} \times \frac{5xy}{2x}`}</Formula>

        <div className="pasos-box" style={{ marginTop: '14px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Multiplicar de manera lineal:</strong>
              <Formula>{String.raw`\frac{3x}{3y} \times \frac{5xy}{2x} = \frac{15x^2 y}{6xy}`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Factorizar y cancelar términos:</strong>
              <p style={{ margin: '4px 0 6px' }}>
                Por último se factoriza a ser posible, en este caso debemos descomponer cada componente y tachar los posibles.
              </p>
              <Formula>{String.raw`\frac{(3)(5)(x)(x)(y)}{(2)(3)(x)(y)} = \frac{\cancel{(3)}(5)\cancel{(x)}(x)\cancel{(y)}}{(2)\cancel{(3)}\cancel{(x)}\cancel{(y)}} = \frac{5x}{2}`}</Formula>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADO MULTIPLICACIÓN */}
      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Resultado: </strong> <F>{String.raw`\frac{5x}{2}`}</F>
        </div>
      </div>

      <div className="nota-box" style={{ marginBottom: '30px' }}>
        📌 <strong>Nota:</strong> Dentro del examen o los ejercicios, en algunos casos las respuestas pueden venir sin factorizar, otras factorizadas, entonces depende de eso el tipo de respuesta que se busca o hasta qué punto será necesario desarrollar la operación.
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '30px 0' }} />

      {/* SECCIÓN DIVISIÓN */}
      <h3 className="subtitulo-secundario">División</h3>
      <div className="card-bloque">
        <p>
          Para la división se realiza una multiplicación de manera <strong>cruzada</strong> como se vio previamente en el tema de operaciones con fracciones.
        </p>
      </div>

      <div className="nota-box" style={{ marginBottom: '16px' }}>
        📌 <strong>Nota sobre los signos:</strong> Siempre tener en cuenta los signos, tanto en la multiplicación como en la división. Siempre recordar las leyes de los signos, pues podría verse el caso en el que un número deba quedar en negativo o dos negativos se vuelvan positivos.
      </div>

      {/* EJEMPLO DIVISIÓN */}
      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo:</strong></p>
        <Formula>{String.raw`\frac{6x}{2x} \div \frac{7y}{4}`}</Formula>

        <div className="pasos-box" style={{ marginTop: '14px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Multiplicar de manera cruzada:</strong>
              <Formula>{String.raw`\frac{6x}{2x} \div \frac{7y}{4} = \frac{24x}{14xy}`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Descomponer y simplificar factores:</strong>
              <Formula>{String.raw`\frac{(2)(12)(x)}{(2)(7)(x)(y)} = \frac{\cancel{(2)}(12)\cancel{(x)}}{\cancel{(2)}(7)\cancel{(x)}(y)} = \frac{12}{7y}`}</Formula>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADO DIVISIÓN */}
      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Resultado: </strong> <F>{String.raw`\frac{12}{7y}`}</F>
        </div>
      </div>
    </div>
  );
}

export function Seccion26() {
  return (
    <div>

      <div className="card-bloque">
        <p style={{ margin: '0 0 10px 0' }}>
          Las ecuaciones cuadráticas tienen diferentes clasificaciones:
        </p>
        <ol style={{ margin: 0, paddingLeft: '18px' }}>
          <li style={{ marginBottom: '6px' }}>
            <strong>Completas:</strong> Tienen la forma <F>{String.raw`ax^2 + bx + c = 0`}</F>
          </li>
          <li>
            <strong>Incompletas:</strong> Estas se dividen en dos tipos:
            <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px' }}>
              <li><strong>a) Mixtas:</strong> <F>{String.raw`ax^2 + bx = 0`}</F></li>
              <li><strong>b) Puras:</strong> <F>{String.raw`ax^2 + c = 0`}</F></li>
            </ul>
          </li>
        </ol>
      </div>

      <div className="nota-box" style={{ marginBottom: '20px' }}>
        📌 <strong>Nota:</strong> Para el examen Piense II (examen de ingreso a la preparatoria UDG) solo suelen venir preguntas en donde la ecuación cuadrática es completa. Pero en caso de que aparezca otro tipo, basta con realizar el consejo que aparece al final de la lección.
      </div>

      <div className="card-bloque">
        <p style={{ margin: '0 0 8px 0' }}>
          Resolver una ecuación de segundo grado (cuadrática) significa encontrar los <strong>"Ceros"</strong>, es decir, descubrir qué valores de <F>x</F> hacen que la ecuación sea igual a 0.
        </p>
        <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#4a5568' }}>
          <em>Formalmente a las respuestas de una ecuación cuadrática se les conoce como soluciones, raíces o ceros.</em>
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '10px 0' }} />

        <strong>Tipos de soluciones que puedes encontrar:</strong>
        <ol style={{ margin: '6px 0 0 0', paddingLeft: '18px' }}>
          <li><strong>Dos soluciones:</strong> La curva pasa por el cero dos veces.</li>
          <li><strong>Única solución:</strong> La curva toca el cero en un solo punto.</li>
          <li><strong>Sin solución:</strong> La curva no toca el cero nunca.</li>
        </ol>
        <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem' }}>
          La más común en el examen será en donde la curva pasa por el cero dos veces o encontrar dos números.
        </p>
      </div>

      <p style={{ marginTop: '16px' }}>
        Si en el examen te ponen un plano cartesiano, ¡encontrar la respuesta es facilísimo!
      </p>

      <div className="card-bloque">
        <ul style={{ margin: 0, paddingLeft: '18px' }}>
          <li style={{ marginBottom: '6px' }}>
            Gráficamente, una función cuadrática siempre forma una curva en forma de "U" llamada <strong>Parábola</strong>.
          </li>
          <li>
            La respuesta visual son los puntos exactos donde la curva cruza o toca el eje horizontal (<F>X</F>), que es donde la altura (<F>Y</F>) vale cero.
          </li>
        </ul>
      </div>

      {/* 2. Renderizado del componente de la gráfica importado */}
      <GraficaParabolaCuadratica />

      <p>
        En este caso puedes observar que las respuestas o los ceros serían el <strong>1</strong> y el <strong>2</strong>. Pues son el punto en el que la parábola en U cruza por 0 en el eje Y (la altura).
      </p>

      <div className="card-bloque">
        <p style={{ margin: 0 }}>
          Para aplicar cualquier método de solución, la ecuación <strong>DEBE estar igualada a 0</strong>. Si te la dan desordenada, tienes que pasar todos los términos a un solo lado cambiando sus signos.
        </p>
      </div>

      {/* EJEMPLO DESORDEN */}
      <div className="ejemplo-box" style={{ marginBottom: '25px' }}>
        <p><strong>Ejemplo de desorden:</strong></p>
        <Formula>{String.raw`x^2 + 5x = 1 - x`}</Formula>

        <div className="pasos-box" style={{ marginTop: '12px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Pasando todo a la izquierda:</strong>
              <Formula>{String.raw`x^2 + 5x - 1 + x = 0`}</Formula>
            </div>
          </div>
          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Simplificando términos semejantes:</strong>
              <Formula>{String.raw`x^2 + 6x - 1 = 0`}</Formula>
            </div>
          </div>
        </div>
      </div>

      <h2 className="subtitulo" style={{ marginTop: '30px' }}>Métodos de Resolución</h2>

      {/* MÉTODO 1: FACTORIZACIÓN */}
      <h3 className="subtitulo-secundario">MÉTODO 1: Por Factorización (El más rápido para el examen)</h3>
      <div className="card-bloque">
        <p style={{ margin: 0 }}>
          Es ideal cuando la <F>x^2</F> está sola (<F>a = 1</F>).
        </p>
      </div>

      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo:</strong> Resolver la ecuación</p>
        <Formula>{String.raw`x^2 + 5x + 6 = 0`}</Formula>

        <div className="pasos-box" style={{ marginTop: '14px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Abrir dos paréntesis con una <F>x</F>:</strong>
              <Formula>{String.raw`(x \quad)(x \quad) = 0`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Definir los signos:</strong>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px' }}>
                <li>El signo del primer paréntesis es el del término del medio: <F>+</F></li>
                <li>El signo del segundo es la multiplicación de los dos signos de la ecuación (<F>+ \cdot + = +</F>): <F>+</F></li>
              </ul>
              <Formula>{String.raw`(x + \quad)(x + \quad) = 0`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">3</span>
            <div>
              <strong>Buscar los números mágicos:</strong>
              <p style={{ margin: '4px 0 0' }}>
                Buscamos dos números que multiplicados den <F>6</F> y sumados den <F>5</F>. Los números son <strong>3</strong> y <strong>2</strong>.
              </p>
              <Formula>{String.raw`(x + 3)(x + 2) = 0`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">4</span>
            <div>
              <strong>Despejar (Cambiar el signo):</strong>
              <p style={{ margin: '4px 0 6px' }}>
                Para hallar las respuestas finales, igualamos cada paréntesis a cero (lo que equivale a simplemente cambiarles el signo):
              </p>
              <Formula>{String.raw`x + 3 = 0 \rightarrow x_1 = -3`}</Formula>
              <Formula>{String.raw`x + 2 = 0 \rightarrow x_2 = -2`}</Formula>
            </div>
          </div>
        </div>
      </div>

      <div className="paso resultado" style={{ marginBottom: '20px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Respuestas: </strong> <F>x_1 = -3</F> y <F>x_2 = -2</F>
        </div>
      </div>

      <div className="nota-box" style={{ marginBottom: '30px' }}>
        📌 <strong>Para comprobar:</strong> Sustituye el <F>-3</F> o el <F>-2</F> en la ecuación original. Si la operación final te da <F>0</F>, ¡tu respuesta es correcta!
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '30px 0' }} />

      {/* MÉTODO 2: FÓRMULA GENERAL */}
      <h3 className="subtitulo-secundario">MÉTODO 2: Por Fórmula General (Para cualquier ecuación)</h3>
      <div className="card-bloque">
        <p style={{ margin: '0 0 8px 0' }}>
          Se usa cuando la ecuación es más difícil o la <F>x^2</F> tiene un número al lado (<F>a \neq 1</F>). La fórmula es:
        </p>
        <Formula>{String.raw`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`}</Formula>
      </div>

      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo:</strong> Resolver <F>{String.raw`3x^2 + 2x - 8 = 0`}</F></p>

        <div className="pasos-box" style={{ marginTop: '14px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Identificar los valores de <F>a</F>, <F>b</F> y <F>c</F>:</strong>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px' }}>
                <li><F>a = 3</F> (término cuadrático)</li>
                <li><F>b = 2</F> (término lineal)</li>
                <li><F>c = -8</F> (número solo)</li>
              </ul>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Sustituir en la fórmula y resolver ordenadamente:</strong>
              <Formula>{String.raw`x = \frac{-(2) \pm \sqrt{(2)^2 - 4(3)(-8)}}{2(3)}`}</Formula>
              <Formula>{String.raw`x = \frac{-2 \pm \sqrt{4 + 96}}{6}`}</Formula>
              <Formula>{String.raw`x = \frac{-2 \pm \sqrt{100}}{6}`}</Formula>
              <Formula>{String.raw`x = \frac{-2 \pm 10}{6}`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">3</span>
            <div>
              <strong>Separar en las dos respuestas (<F>\pm</F>):</strong>
              <p style={{ margin: '4px 0 4px 0' }}>
                <strong>Para <F>x_1</F> (usando el <F>+</F>):</strong>
              </p>
              <Formula>{String.raw`x_1 = \frac{-2 + 10}{6} = \frac{8}{6} = \frac{4}{3}`}</Formula>

              <p style={{ margin: '8px 0 4px 0' }}>
                <strong>Para <F>x_2</F> (usando el <F>-</F>):</strong>
              </p>
              <Formula>{String.raw`x_2 = \frac{-2 - 10}{6} = \frac{-12}{6} = -2`}</Formula>
            </div>
          </div>
        </div>
      </div>

      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Respuestas: </strong> <F>{String.raw`x_1 = \frac{4}{3}`}</F> y <F>x_2 = -2</F>
        </div>
      </div>

      {/* SECCIÓN DE SUSTITUCIÓN DIRECTA (ACTUALIZADA) */}
      <div 
        className="nota-box" 
        style={{ 
          backgroundColor: '#fffbe6', 
          borderColor: '#ffe58f', 
          color: '#8c6b00',
          margin: '25px 0' 
        }}
      >
        💡 <strong>Tip para el examen:</strong> Es importante conocer el método por si lo necesitas, pero un gran tip es que, en el examen Piense II, vendrán opciones múltiples, por lo que es mucho más rápido sustituir en la fórmula por medio de la respuesta sin realizar el procedimiento completo.
      </div>

      <div className="ejemplo-box" style={{ marginBottom: '12px' }}>
        <p><strong>Ejemplo con sustitución:</strong></p>
        <p style={{ margin: '4px 0 10px 0' }}>
          ¿Cuál de las siguientes opciones contiene las soluciones de la ecuación cuadrática <F>{String.raw`x^2 - 2x - 15 = 0`}</F>?
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', background: '#fff', padding: '10px', borderRadius: '6px' }}>
          <div><strong>A)</strong> <F>x_1 = -5, x_2 = 3</F></div>
          <div><strong>B)</strong> <F>x_1 = 5, x_2 = -3</F></div>
          <div><strong>C)</strong> <F>x_1 = 2, x_2 = -5</F></div>
          <div><strong>D)</strong> <F>x_1 = -2, x_2 = 15</F></div>
        </div>

        <div className="pasos-box">
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Probamos con la Opción A:</strong>
              <p style={{ margin: '4px 0 4px 0' }}>
                La opción A dice que la primera respuesta es <F>x = -5</F>. Vamos a cambiar las <F>x</F> por un <F>-5</F>:
              </p>
              <Formula>{String.raw`(-5)^2 - 2(-5) - 15 = 0`}</Formula>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                Hacemos las operaciones mentalmente (cuidado con los signos):
              </p>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', fontSize: '0.9rem' }}>
                <li><F>(-5)^2</F> se vuelve <strong>25 positivo</strong>.</li>
                <li><F>-2 \times -5</F> se vuelve <strong>+10 positivo</strong>.</li>
                <li>La cuenta queda: <F>25 + 10 - 15 \rightarrow 35 - 15 = 20</F></li>
              </ul>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', color: '#e53e3e' }}>
                Como el resultado fue 20 y <strong>no dio 0</strong>, la Opción A queda descartada.
              </p>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Probamos con la Opción B:</strong>
              <p style={{ margin: '4px 0 4px 0' }}>
                La opción B dice que la primera respuesta es <F>x = 5</F>. Cambiamos las <F>x</F> por un <F>5</F>:
              </p>
              <Formula>{String.raw`(5)^2 - 2(5) - 15`}</Formula>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', fontSize: '0.9rem' }}>
                <li><F>(5)^2 = 25</F></li>
                <li><F>-2 \times 5 = -10</F></li>
                <li>La cuenta queda: <F>25 - 10 - 15 \rightarrow 15 - 15 = 0</F> ✔️</li>
              </ul>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem' }}>
                Como <F>x = 5</F> sí da 0, comprobamos el segundo número (<F>x = -3</F>):
              </p>
              <Formula>{String.raw`(-3)^2 - 2(-3) - 15`}</Formula>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', fontSize: '0.9rem' }}>
                <li><F>(-3)^2 = 9</F></li>
                <li><F>-2 \times -3 = +6</F></li>
                <li>La cuenta queda: <F>9 + 6 - 15 \rightarrow 15 - 15 = 0</F> ✔️</li>
              </ul>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem' }}>
                Como ambos números cumplen con la igualdad a cero, confirmamos la solución.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="paso resultado" style={{ marginBottom: '25px' }}>
        <span className="paso-num">✓</span>
        <div>
          <strong>Respuesta Correcta: B)</strong> <F>x_1 = 5, x_2 = -3</F>
        </div>
      </div>
    </div>
  );
}


export function Seccion27() {
  return (
    <div>
      <p>
        El plano cartesiano es un sistema de coordenadas formado por dos rectas numéricas perpendiculares que se cruzan en un punto llamado origen <F>(0,0)</F>.
      </p>

      {/* Definición de Ejes */}
      <div className="card-bloque">
        <ul className="lista-partes">
          <li><strong>Eje X (Abscisas):</strong> Es la recta horizontal (↔)</li>
          <li><strong>Eje Y (Ordenadas):</strong> Es la recta vertical (↕)</li>
        </ul>
      </div>

      {/* Localización de puntos */}
      <div className="card-bloque">
        <h3 className="subtitulo-card">¿Cómo localizar un punto en el plano cartesiano?</h3>
        <p>
          Siempre iniciamos en el origen <F>(0,0)</F>. El primer número que tenemos indica cuántas veces será necesario moverse a la derecha o izquierda, mientras que el segundo indicará el movimiento que tendremos hacia arriba o abajo.
        </p>
      </div>

      {/* Cuadrantes y Gráfica */}
      <div className="card-bloque">
        <h3 className="subtitulo-card">Cuadrantes en el plano cartesiano</h3>
        <p>
          El plano cartesiano se divide en 4 secciones a las cuales llamamos cuadrantes, se numeran en sentido contrario al reloj.
        </p>

        <ul className="lista-partes">
          <li><strong>Cuadrante I:</strong> (+, +)  X positiva, Y positiva.</li>
          <li><strong>Cuadrante II:</strong> (-, +)  X negativa, Y positiva.</li>
          <li><strong>Cuadrante III:</strong> (-, -)  X negativa, Y negativa.</li>
          <li><strong>Cuadrante IV:</strong> (+, -)  X positiva, Y negativa.</li>
        </ul>

        {/* Llamada al recurso visual independiente */}
        <GraficaPlanoCartesiano />
      </div>

      {/* Distancia entre dos puntos */}
      <h2 className="subtitulo">Distancia entre dos puntos</h2>
      <div className="card-bloque">
        <p>
          Para medir qué tan lejos está un punto de otro, aplicamos una versión del Teorema de Pitágoras adaptada al plano.
        </p>

        <p><strong>Fórmula:</strong></p>
        <Formula>{String.raw`d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`}</Formula>

        <p><strong>Ejemplo:</strong> Puntos <F>A(-2,1)</F> y <F>B(1,7)</F></p>
        <Formula>{String.raw`d = \sqrt{(1 - (-2))^2 + (7 - 1)^2} = \sqrt{3^2 + 6^2} = \sqrt{9 + 36} = \sqrt{45}`}</Formula>
      </div>

      {/* CONSEJO PARA EL EXAMEN (AHORA EN AMARILLO) */}
      <div 
        className="nota-box" 
        style={{ 
          backgroundColor: '#fffbe6', 
          borderColor: '#ffe58f', 
          color: '#8c6b00',
          margin: '25px 0' 
        }}
      >
        💡 <strong>Consejo para el examen:</strong>
        <ul className="lista-partes" style={{ marginTop: '8px', paddingLeft: '18px' }}>
          <li>
            <strong>Raíces difíciles:</strong> A veces en el examen la respuesta se queda expresada como raíz (ej: <F>{String.raw`\sqrt{45}`}</F>).
          </li>
          <li>
            <strong>Truco inverso:</strong> Si el resultado dentro de la raíz es 81 y las opciones son números enteros (como 12, 4, 9, 15), eleva cada opción al cuadrado (<F>{String.raw`9^2 = 81`}</F>). Así sabrás que la respuesta correcta es 9.
          </li>
        </ul>
      </div>
    </div>
  );
}

export function Seccion28() {
  return (
    <div>

      {/* BLOQUE 1: CONCEPTO DE FUNCIONES */}
      <div className="card-bloque">
        <h3 className="subtitulo-card">Funciones lineales en el plano cartesiano</h3>
        <p>
          Una función es como una ecuación en donde sustituyes el valor de <F>{String.raw`x`}</F> para obtener el valor de <F>{String.raw`y`}</F>.
        </p>
        <p style={{ marginTop: '8px' }}>
          Existe una pregunta esencial para entender el comportamiento de una función lineal la cual es: <strong>cuando <F>{String.raw`X`}</F> vale 1, ¿cuánto vale <F>{String.raw`Y`}</F>?</strong>
        </p>
        <p>
          De esta manera realizas una <strong>tabulación</strong>, asignando valores a <F>{String.raw`x`}</F> para ir conociendo el comportamiento de <F>{String.raw`y`}</F>.
        </p>
      </div>

      {/* EJEMPLO CON TABLA Y GRÁFICA */}
      <div className="ejemplo-box" style={{ margin: '20px 0' }}>
        <p style={{ marginBottom: '12px' }}><strong>Ejemplo:</strong> Para la función <F>{String.raw`f(x) = 2x + 5`}</F></p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            backgroundColor: '#ffffff', 
            textAlign: 'center', 
            border: '1px solid #cbd5e1', 
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#5e4ca0', color: '#ffffff' }}>
                <th style={{ padding: '12px 10px', borderRight: '1px solid #334155' }}>
                  Valor de X
                </th>
                <th style={{ padding: '12px 10px', borderRight: '1px solid #334155' }}>
                  Sustitución en <span style={{ color: '#ffffff' }}><F>{String.raw`f(x) = 2x + 5`}</F></span>
                </th>
                <th style={{ padding: '12px 10px' }}>
                  Coordenada <span style={{ color: '#ffffff' }}><F>{String.raw`(X, Y)`}</F></span>
                </th>
              </tr>
            </thead>
            <tbody style={{ color: '#1e293b' }}>
              <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '10px', borderRight: '1px solid #e2e8f0' }}><strong>X = -1</strong></td>
                <td style={{ padding: '10px', borderRight: '1px solid #e2e8f0' }}><F>{String.raw`2(-1) + 5 = 3`}</F></td>
                <td style={{ padding: '10px', color: '#010202' }}><strong>(-1, 3)</strong></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                <td style={{ padding: '10px', borderRight: '1px solid #e2e8f0' }}><strong>X = 0</strong></td>
                <td style={{ padding: '10px', borderRight: '1px solid #e2e8f0' }}><F>{String.raw`2(0) + 5 = 5`}</F></td>
                <td style={{ padding: '10px', color: '#000000' }}><strong>(0, 5)</strong></td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '10px', borderRight: '1px solid #e2e8f0' }}><strong>X = 1</strong></td>
                <td style={{ padding: '10px', borderRight: '1px solid #e2e8f0' }}><F>{String.raw`2(1) + 5 = 7`}</F></td>
                <td style={{ padding: '10px', color: '#000000' }}><strong>(1, 7)</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: '12px' }}>
          Al tener estos puntos, comenzamos a localizarlos en el plano para trazar la recta:
        </p>

        <GraficaTabulacion />
      </div>

      {/* TIPOS DE FUNCIONES */}
      <h2 className="subtitulo">Tipos de Funciones</h2>

      {/* 1. Función Constante */}
      <div className="card-bloque">
        <h3 className="subtitulo-card">1. Función Constante</h3>
        <p>
          Para las funciones constantes el valor de <F>{String.raw`y`}</F> siempre será el mismo sin importar cuánto valga <F>{String.raw`x`}</F>, o viceversa. Gráficamente se ve como una línea totalmente recta (horizontal o vertical).
        </p>
        <GraficaConstante />
      </div>

      {/* 2. Función Lineal */}
      <div className="card-bloque" style={{ marginTop: '20px' }}>
        <h3 className="subtitulo-card">2. Función Lineal</h3>
        <p>
          La función <F>{String.raw`y = 2x + 5`}</F> es una función lineal. Se le llama así porque al graficar se forma una línea recta inclinada donde ni <F>{String.raw`x`}</F> ni <F>{String.raw`y`}</F> son constantes.
        </p>
        <p style={{ marginTop: '8px' }}>
          Tienen una pendiente y se representan con la fórmula general:
        </p>
        <Formula>{String.raw`y = mx + b`}</Formula>
        <ul className="lista-partes">
          <li><strong>m:</strong> Representa la <strong>pendiente</strong> (inclinación) de la recta.</li>
          <li><strong>b:</strong> Representa la <strong>ordenada al origen</strong> (el punto exacto donde la recta corta al eje Y).</li>
        </ul>
      </div>

      {/* EJEMPLO DE PENDIENTE (NOTA INDEPENDIENTE) */}
      <div className="nota-box" style={{ 
        backgroundColor: '#f0fdf4', 
        borderColor: '#bbf7d0', 
        color: '#166534', 
        marginTop: '15px' 
      }}>
        📌 <strong>Ejemplo en <F>{String.raw`y = 2x + 5`}</F>:</strong>
        <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px' }}>
          <li><F>{String.raw`m = 2`}</F> (Pendiente positiva)</li>
          <li><F>{String.raw`b = 5`}</F> (Corta al eje Y en el punto 5)</li>
        </ul>
      </div>

      {/* PENDIENTE Y SUS COMPORTAMIENTOS */}
      <h2 className="subtitulo" style={{ marginTop: '30px' }}>Pendiente de una Recta</h2>
      <div className="card-bloque">
        <p>
          La pendiente (<F>{String.raw`m`}</F>) nos indica qué tan inclinada está una recta. Se analiza siempre de <strong>izquierda a derecha</strong>:
        </p>

        <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '12px' }}>
          <li style={{ marginBottom: '15px' }}>
            <strong>• <F>{String.raw`m > 0`}</F>: Pendiente positiva</strong> (La recta sube hacia la derecha).
            <GraficaPendientePositiva />
          </li>
          <li style={{ marginBottom: '15px' }}>
            <strong>• <F>{String.raw`m < 0`}</F>: Pendiente negativa</strong> (La recta baja hacia la derecha).
            <GraficaPendienteNegativa />
          </li>
          <li style={{ marginBottom: '15px' }}>
            <strong>• <F>{String.raw`m = 0`}</F>: Pendiente cero</strong> (No hay inclinación, es una línea horizontal).
            <GraficaPendienteCero />
          </li>
        </ul>
      </div>

      {/* FÓRMULA DE PENDIENTE CON DOS PUNTOS */}
      <div className="card-bloque" style={{ marginTop: '20px' }}>
        <h3 className="subtitulo-card">¿Cómo calcular la pendiente con dos puntos?</h3>
        <p>Para calcular el valor de la pendiente entre dos puntos se utiliza la fórmula:</p>
        <Formula>{String.raw`m = \frac{y_2 - y_1}{x_2 - x_1}`}</Formula>
      </div>

      {/* CAJA VERDE DEL EJEMPLO */}
      <div className="ejemplo-box" style={{ marginTop: '20px' }}>
        <p><strong>Ejemplo:</strong> Dados los puntos <F>{String.raw`A(-2, 1)`}</F> y <F>{String.raw`B(1, 7)`}</F></p>
        
        <div className="pasos-box" style={{ marginTop: '10px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Identificamos coordenadas:</strong>
              <p><F>{String.raw`x_1 = -2, \quad y_1 = 1 \quad | \quad x_2 = 1, \quad y_2 = 7`}</F></p>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Sustituimos en la fórmula:</strong>
              <Formula>{String.raw`m = \frac{7 - 1}{1 - (-2)} = \frac{6}{1 + 2} = \frac{6}{3} = 2`}</Formula>
            </div>
          </div>
        </div>
      </div> {/* FIN DE LA CAJA DEL EJEMPLO */}

      {/* RESULTADO FUERA CON FONDO VERDE Y TEXTO NEGRO */}
      <div style={{ 
        marginTop: '15px', 
        backgroundColor: '#f0fdf4', 
        border: '1.5px solid #16a34a', 
        borderRadius: '8px', 
        padding: '12px 16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px' 
      }}>
        <span style={{ 
          backgroundColor: '#16a34a', 
          color: '#ffffff', 
          borderRadius: '50%', 
          width: '28px', 
          height: '28px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: 'bold',
          flexShrink: 0
        }}>✓</span>
        <div style={{ color: '#0f172a', fontSize: '15px' }}>
          <strong>Resultado:</strong> La pendiente tiene un valor de <F>{String.raw`m = 2`}</F>.
        </div>
      </div>
    </div>
  );
}

export function Seccion29() {
  return (
    <div>
      <h2 className="subtitulo">2.9 Sistemas de Ecuaciones Lineales en Dos Variables</h2>

      {/* INTRODUCCIÓN */}
      <div className="card-bloque">
        <h3 className="subtitulo-card">Concepto General</h3>
        <p>
          Un sistema de ecuaciones busca encontrar los valores de dos incógnitas que satisfagan ambas ecuaciones simultáneamente, se busca el punto de intersección de ambas ecuaciones. Cada ecuación representa una recta en el plano cartesiano.
        </p>
        <p style={{ marginTop: '10px' }}>
          Existen 3 casos que se pueden encontrar.
        </p>
      </div>

      {/* CASO 1 */}
      <div className="card-bloque" style={{ marginTop: '20px' }}>
        <h3 className="subtitulo-card">Caso 1: Las rectas se intersecan (se cruzan)</h3>
        <p>
          Las rectas se intersecan (se cruzan) en un punto, por lo tanto se dice que el sistema tiene una solución.
        </p>
      </div>

      <div className="ejemplo-box" style={{ marginTop: '15px' }}>
        <p><strong>Ejemplo:</strong> Para las ecuaciones <F>{String.raw`x + 2y = 4`}</F> y <F>{String.raw`3x - y = 5`}</F></p>
        <GraficaCaso1 />
      </div>

      <div style={{ 
        marginTop: '15px', 
        backgroundColor: '#f0fdf4', 
        border: '1.5px solid #16a34a', 
        borderRadius: '8px', 
        padding: '12px 16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px' 
      }}>
        <span style={{ 
          backgroundColor: '#16a34a', 
          color: '#ffffff', 
          borderRadius: '50%', 
          width: '28px', 
          height: '28px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: 'bold',
          flexShrink: 0
        }}>✓</span>
        <div style={{ color: '#0f172a', fontSize: '15px' }}>
          <strong>Solución:</strong> La solución de este sistema es <F>{String.raw`(2, 1)`}</F> pues es donde cruzan las 2 ecuaciones.
        </div>
      </div>

      {/* CASO 2 */}
      <div className="card-bloque" style={{ marginTop: '25px' }}>
        <h3 className="subtitulo-card">Caso 2: Las rectas son coincidentes</h3>
        <p>
          Se dice que son coincidentes cuando una de las ecuaciones es múltiplo de la otra.
        </p>
      </div>

      <div className="ejemplo-box" style={{ marginTop: '15px' }}>
        <p><strong>Ejemplo:</strong> <F>{String.raw`x - 2y = 6`}</F> y <F>{String.raw`3x - 6y = 18`}</F></p>
        <p style={{ marginTop: '8px' }}>
          Si la primera ecuación la multiplicamos por 3, nos daría la segunda ecuación.
        </p>
        <GraficaCaso2 />
      </div>

      <div style={{ 
        marginTop: '15px', 
        backgroundColor: '#f0fdf4', 
        border: '1.5px solid #16a34a', 
        borderRadius: '8px', 
        padding: '12px 16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px' 
      }}>
        <span style={{ 
          backgroundColor: '#16a34a', 
          color: '#ffffff', 
          borderRadius: '50%', 
          width: '28px', 
          height: '28px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: 'bold',
          flexShrink: 0
        }}>✓</span>
        <div style={{ color: '#0f172a', fontSize: '15px' }}>
          <strong>Solución:</strong> Las rectas coinciden en todos sus puntos, por lo tanto el sistema tiene un conjunto infinito de soluciones.
        </div>
      </div>

      {/* CASO 3 */}
      <div className="card-bloque" style={{ marginTop: '25px' }}>
        <h3 className="subtitulo-card">Caso 3: Las rectas son paralelas</h3>
        <p>
          Cuando son paralelas, las rectas no tienen ningún punto en común por lo que el sistema no podría llegar a tener ninguna solución.
        </p>
      </div>

      <div className="ejemplo-box" style={{ marginTop: '15px' }}>
        <p><strong>Ejemplo:</strong> <F>{String.raw`2x - y = 4`}</F> y <F>{String.raw`4x - 2y = -12`}</F></p>
        <GraficaCaso3 />
      </div>

      <div style={{ 
        marginTop: '15px', 
        backgroundColor: '#f0fdf4', 
        border: '1.5px solid #16a34a', 
        borderRadius: '8px', 
        padding: '12px 16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px' 
      }}>
        <span style={{ 
          backgroundColor: '#16a34a', 
          color: '#ffffff', 
          borderRadius: '50%', 
          width: '28px', 
          height: '28px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: 'bold',
          flexShrink: 0
        }}>✓</span>
        <div style={{ color: '#0f172a', fontSize: '15px' }}>
          <strong>Solución:</strong> El conjunto de soluciones es un conjunto vacío pues jamás coinciden por ende no existen soluciones.
        </div>
      </div>

      {/* MÉTODOS DE RESOLUCIÓN */}
      <h2 className="subtitulo" style={{ marginTop: '35px' }}>Métodos de resolución</h2>

      {/* MÉTODO DE SUMA Y RESTA */}
      <div className="card-bloque">
        <h3 className="subtitulo-card">Método de suma y resta</h3>
        <p>
          Se realiza una manipulación de ecuaciones a tu conveniencia para eliminar una de las variables al sumarlas.
        </p>
      </div>

      <div className="ejemplo-box" style={{ marginTop: '15px' }}>
        <p><strong>Ejemplo:</strong></p>
        <Formula>{String.raw`\begin{aligned} 2x + y &= 11 \\ 3x + 4y &= 24 \end{aligned}`}</Formula>

        <div className="pasos-box" style={{ marginTop: '10px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Paso 1: Igualar coeficientes.</strong> Multiplicamos la primera ecuación por <F>{String.raw`-4`}</F> para eliminar <F>{String.raw`y`}</F>.
              <Formula>{String.raw`(-4)(2x + y = 11) \implies -8x - 4y = -44`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Paso 2: Sumar las ecuaciones.</strong>
              <Formula>{String.raw`\begin{alignedat}{2} -8x - 4y &= -44 \\ 3x + 4y &= 24 \\ \hline -5x \phantom{+ 0y} &= -20 \end{alignedat}`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">3</span>
            <div>
              <strong>Paso 3: Despejar la variable.</strong>
              <Formula>{String.raw`-5x = -20 \implies x = \frac{-20}{-5} \implies x = 4`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">4</span>
            <div>
              <strong>Paso 4: Sustituir en cualquiera de las ecuaciones originales.</strong>
              <Formula>{String.raw`2(4) + y = 11 \implies 8 + y = 11 \implies y = 11 - 8 \implies y = 3`}</Formula>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '15px', 
        backgroundColor: '#f0fdf4', 
        border: '1.5px solid #16a34a', 
        borderRadius: '8px', 
        padding: '12px 16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px' 
      }}>
        <span style={{ 
          backgroundColor: '#16a34a', 
          color: '#ffffff', 
          borderRadius: '50%', 
          width: '28px', 
          height: '28px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: 'bold',
          flexShrink: 0
        }}>✓</span>
        <div style={{ color: '#0f172a', fontSize: '15px' }}>
          <strong>Solución:</strong> <F>{String.raw`x = 4`}</F>, <F>{String.raw`y = 3`}</F>. El resultado indica el punto en donde las rectas se cruzan (en donde x, y coinciden).
        </div>
      </div>

      {/* MÉTODO DE SUSTITUCIÓN */}
      <div className="card-bloque" style={{ marginTop: '25px' }}>
        <h3 className="subtitulo-card">Método de sustitución</h3>
        <p>
          Se despeja una variable en la ecuación y sustituyes su valor en la otra ecuación.
        </p>
      </div>

      <div className="ejemplo-box" style={{ marginTop: '15px' }}>
        <p><strong>Ejemplo:</strong></p>
        <Formula>{String.raw`\begin{aligned} x + 3y &= 10 \\ 2x - y &= 6 \end{aligned}`}</Formula>

        <div className="pasos-box" style={{ marginTop: '10px' }}>
          <div className="paso">
            <span className="paso-num">1</span>
            <div>
              <strong>Paso 1: Despejar una variable.</strong> Despejamos <F>{String.raw`x`}</F> en la primera ecuación, pues es la más sencilla.
              <Formula>{String.raw`x + 3y = 10 \implies x = 10 - 3y`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">2</span>
            <div>
              <strong>Paso 2: Sustituir en la otra ecuación.</strong>
              <Formula>{String.raw`2(10 - 3y) - y = 6`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">3</span>
            <div>
              <strong>Paso 3: Resolver la operación.</strong>
              <Formula>{String.raw`20 - 6y - y = 6 \implies -7y = 6 - 20 \implies -7y = -14 \implies y = 2`}</Formula>
            </div>
          </div>

          <div className="paso">
            <span className="paso-num">4</span>
            <div>
              <strong>Paso 4: Obtener la segunda variable.</strong> Sustituyendo el valor obtenido en cualquier expresión (también puede usarse la expresión despejada al inicio).
              <Formula>{String.raw`x = 10 - 3(2) \implies x = 4`}</Formula>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '15px', 
        backgroundColor: '#f0fdf4', 
        border: '1.5px solid #16a34a', 
        borderRadius: '8px', 
        padding: '12px 16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px' 
      }}>
        <span style={{ 
          backgroundColor: '#16a34a', 
          color: '#ffffff', 
          borderRadius: '50%', 
          width: '28px', 
          height: '28px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: 'bold',
          flexShrink: 0
        }}>✓</span>
        <div style={{ color: '#0f172a', fontSize: '15px' }}>
          <strong>Resultado:</strong> <F>{String.raw`x = 4`}</F>, <F>{String.raw`y = 2`}</F>
        </div>
      </div>

      {/* CONSEJO INDEPENDIENTE */}
<div className="nota-box" style={{ 
        backgroundColor: '#fefce8', 
        borderColor: '#fef08a', 
        color: '#854d0e', 
        marginTop: '20px' 
      }}>
        💡 <strong>Consejo:</strong> Siempre elige la ecuación con los números más pequeños o la variable que ya esté casi "sola" para facilitar los cálculos.
      </div>
    </div>
  );
}

// ─── REGISTRO DE TEMAS ───────────────────────────────────────────────────────

const secciones = [
  { id: 1, titulo: 'Expresiones algebraicas con una variable', Componente: Seccion21 },
  { id: 2, titulo: 'Tipo de expresiones', Componente: Seccion211 },
  { id: 3, titulo: 'Ecuaciones', Componente: Seccion212 },
  { id: 4, titulo: 'Inecuaciones en una variable', Componente: Seccion213 },
  { id: 5, titulo: 'Ecuaciones lineales en varias variables', Componente: Seccion22 },
  { id: 6, titulo: 'Sistema de ecuaciones con 2 variables (2x2)', Componente: Seccion222 },
  { id: 7, titulo: 'Polinomios', Componente: Seccion23 },
  { id: 8, titulo: 'Multiplicación y división de polinomios', Componente: Seccion231 },
  { id: 9, titulo: 'Factorización de polinomios', Componente: Seccion24 },
  { id: 10, titulo: 'Factorización parte 2', Componente: Seccion241 },
  { id: 11, titulo: 'Factorización parte 3', Componente: Seccion242 },
  { id: 12, titulo: 'Expresiones algebraicas racionales o fracciones algebraicas', Componente: Seccion25 },
  { id: 13, titulo: 'Suma y resta de expresiones algebraicas racionales', Componente: Seccion252 },
  { id: 14, titulo: 'Multiplicación y división de expresiones algebraicas racionales', Componente: Seccion253 },
  { id: 15, titulo: 'Ecuaciones cuadráticas', Componente: Seccion26 },
  { id: 17, titulo: 'Plano cartesiano', Componente: Seccion27 },
  { id: 18, titulo: 'Funciones y sus gráficas', Componente: Seccion28 },
  { id: 19, titulo: 'Sistemas de ecuaciones lineales en dos variables', Componente: Seccion29 },
];

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

function AlgebraPage() {
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

  if (selectedSeccionId) {
    const seccionActual = secciones.find(s => s.id === selectedSeccionId) || secciones[0];
    const { Componente, titulo } = seccionActual;

    return (
      <div className="dashboard-layout">
        <Sidebar activeTab="aprendizaje" onTabChange={handleTabChange} onLogout={handleLogout} />
        <main className="main-content">
          <button className="btn-volver" onClick={() => setSelectedSeccionId(null)}>
            ← Volver a temas de álgebra
          </button>
          <div className="contenido-card">
            <h1 className="titulo-seccion">{titulo}</h1>
            <hr className="divisor" />
            <div className="cuerpo-texto">
              <Componente />
            </div>
            <hr className="divisor" style={{ marginTop: 32 }} />
            <button
              className="btn-evaluacion"
              onClick={() => {
                const idx = secciones.findIndex((s) => s.id === selectedSeccionId);
                navigate(`/evaluacion/algebra/${idx >= 0 ? idx : 0}`);
              }}
            >
              Comenzar con examen evaluación →
            </button>
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
          .ejemplo-box { background: #f0fbf4; border-left: 4px solid #27ae60; border-radius: 12px; padding: 18px 24px; margin-bottom: 18px; }
          .nota-box { background: #fff8e1; border-left: 4px solid #f39c12; border-radius: 10px; padding: 14px 20px; margin-bottom: 18px; font-size: 0.95rem; color: #7a5c00; }
          .pasos-box { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
          .paso { display: flex; align-items: flex-start; gap: 14px; background: #faf9ff; border-radius: 10px; padding: 12px 18px; border: 1px solid #ede8f8; }
          .paso.resultado { background: #edf8f0; border-color: #27ae60; }
          .paso-num { min-width: 28px; height: 28px; background: #764ba2; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; }
          .paso.resultado .paso-num { background: #27ae60; }
          .lista-partes { padding-left: 20px; margin: 0; }
          .lista-partes li { margin-bottom: 8px; }
          .tabla-datos { width: 100%; border-collapse: collapse; margin: 15px 0; background-color: #fff; border-radius: 8px; overflow: hidden; }
          .tabla-datos th, .tabla-datos td { border: 1px solid #ede8f8; padding: 10px; text-align: center; }
          .tabla-datos th { background-color: #764ba2; color: white; }
          .btn-evaluacion { background-color: #764ba2; color: white; border: none; border-radius: 40px; padding: 14px 24px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: 0.2s; width: 100%; box-shadow: 0 4px 12px rgba(118,75,162,0.3); margin-top: 8px; }
          .btn-evaluacion:hover { background-color: #5f3b85; transform: scale(1.01); }
          @media (max-width: 900px) { .main-content { padding: 24px 20px; } .contenido-card { padding: 24px 20px; } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab="aprendizaje" onTabChange={handleTabChange} onLogout={handleLogout} />
      <main className="main-content">
        <button className="btn-volver" onClick={() => navigate('/dashboard', { state: { activeTab: 'aprendizaje' } })}>
          ← Volver a los módulos
        </button>
        <div className="contenido-card">
          <h1 className="titulo-seccion">Álgebra</h1>
          <hr className="divisor" />
          <ul className="topic-list">
            {secciones.map((seccion) => (
              <li key={seccion.id} className="topic-item">
                <span className="topic-name">
                  {seccion.titulo}
                </span>
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
        .topic-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid #f0e8ff; background-color: #ffffff; border-radius: 12px; margin-bottom: 8px; transition: background 0.2s; }
        .topic-item:hover { background-color: #faf8ff; }
        .topic-name { font-size: 1.05rem; color: #2d1b45; text-align: left; font-weight: 600; }
        .btn-start-topic { background-color: #764ba2; color: white; border: none; border-radius: 30px; padding: 8px 18px; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s, transform 0.1s; box-shadow: 0 2px 8px rgba(118,75,162,0.2); line-height: 1.4; min-width: 80px; }
        .btn-start-topic:hover { background-color: #5f3b85; transform: scale(1.02); }
        @media (max-width: 900px) { 
          .main-content { padding: 24px 20px; } 
          .contenido-card { padding: 24px 20px; } 
        }
      `}</style>
    </div>
  );
}

export default AlgebraPage;