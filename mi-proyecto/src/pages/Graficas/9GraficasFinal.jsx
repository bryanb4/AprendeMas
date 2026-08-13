import React from 'react';

// Caso 1: Rectas que se intersecan (x + 2y = 4  y  3x - y = 5)
export function GraficaCaso1() {
  const xTicks = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7];
  const yTicks = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
      <svg width="360" height="320" viewBox="-5.5 -7.5 13.5 13.5" style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
        {/* Malla de fondo */}
        <defs>
          <pattern id="grid1" width="1" height="1" patternUnits="userSpaceOnUse">
            <path d="M 1 0 L 0 0 0 1" fill="none" stroke="#e2e8f0" strokeWidth="0.04" />
          </pattern>
        </defs>
        <rect x="-5.5" y="-7.5" width="13.5" height="13.5" fill="url(#grid1)" />

        {/* Ejes principales X e Y */}
        <line x1="-5.5" y1="0" x2="8" y2="0" stroke="#334155" strokeWidth="0.08" />
        <line x1="0" y1="-7.5" x2="0" y2="6" stroke="#334155" strokeWidth="0.08" />

        {/* Números en el Eje X */}
        {xTicks.map(x => (
          <text key={`x1-${x}`} x={x} y="0.45" fontSize="0.32" textAnchor="middle" fill="#64748b" fontWeight="500">{x}</text>
        ))}

        {/* Números en el Eje Y */}
        {yTicks.map(y => (
          <text key={`y1-${y}`} x="-0.25" y={-y + 0.1} fontSize="0.32" textAnchor="end" fill="#64748b" fontWeight="500">{y}</text>
        ))}

        {/* Trazado con eje Y matemático (positivo hacia arriba) */}
        <g transform="scale(1, -1)">
          {/* Recta verde: x + 2y = 4  =>  y = 2 - 0.5x */}
          <line x1="-5" y1="4.5" x2="8" y2="-2" stroke="#115e59" strokeWidth="0.1" />

          {/* Recta azul: 3x - y = 5  =>  y = 3x - 5 */}
          <line x1="0.33" y1="-4" x2="4" y2="7" stroke="#2563eb" strokeWidth="0.1" />

          {/* Punto de intersección en (2, 1) */}
          <circle cx="2" cy="1" r="0.16" fill="#ef4444" />
        </g>

        {/* Etiqueta del punto (2, 1) */}
        <text x="2.3" y="-1.2" fontSize="0.4" fontWeight="bold" fill="#ef4444">(2, 1)</text>
      </svg>
    </div>
  );
}

// Caso 2: Rectas coincidentes (x - 2y = 6  y  3x - 6y = 18)
// Muestra dos capas: una línea base azul gruesa y una línea naranja punteada encimada
export function GraficaCaso2() {
  const xTicks = [-2, -1, 1, 2, 3, 4, 5, 6, 7, 8];
  const yTicks = [-5, -4, -3, -2, -1, 1, 2];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
      <svg width="360" height="280" viewBox="-3 -3 11.5 9" style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
        <defs>
          <pattern id="grid2" width="1" height="1" patternUnits="userSpaceOnUse">
            <path d="M 1 0 L 0 0 0 1" fill="none" stroke="#e2e8f0" strokeWidth="0.04" />
          </pattern>
        </defs>
        <rect x="-3" y="-3" width="11.5" height="9" fill="url(#grid2)" />

        {/* Ejes X e Y */}
        <line x1="-3" y1="0" x2="8.5" y2="0" stroke="#334155" strokeWidth="0.08" />
        <line x1="0" y1="-3" x2="0" y2="6" stroke="#334155" strokeWidth="0.08" />

        {/* Numeración Eje X */}
        {xTicks.map(x => (
          <text key={`x2-${x}`} x={x} y="0.45" fontSize="0.32" textAnchor="middle" fill="#64748b" fontWeight="500">{x}</text>
        ))}

        {/* Numeración Eje Y */}
        {yTicks.map(y => (
          <text key={`y2-${y}`} x="-0.25" y={-y + 0.1} fontSize="0.32" textAnchor="end" fill="#64748b" fontWeight="500">{y}</text>
        ))}

        {/* Rectas Encimadas */}
        <g transform="scale(1, -1)">
          {/* Ecuación 1 (Azul continua y más ancha abajo) */}
          <line x1="-2" y1="-4" x2="8" y2="1" stroke="#2563eb" strokeWidth="0.22" strokeLinecap="round" />

          {/* Ecuación 2 (Naranja discontinua encima) */}
          <line x1="-2" y1="-4" x2="8" y2="1" stroke="#f97316" strokeWidth="0.12" strokeDasharray="0.5 0.3" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

// Caso 3: Rectas paralelas (2x - y = 4  y  4x - 2y = -12)
export function GraficaCaso3() {
  const xTicks = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
  const yTicks = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
      <svg width="360" height="320" viewBox="-6.5 -7 12.5 13" style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
        <defs>
          <pattern id="grid3" width="1" height="1" patternUnits="userSpaceOnUse">
            <path d="M 1 0 L 0 0 0 1" fill="none" stroke="#e2e8f0" strokeWidth="0.04" />
          </pattern>
        </defs>
        <rect x="-6.5" y="-7" width="12.5" height="13" fill="url(#grid3)" />

        {/* Ejes X e Y */}
        <line x1="-6.5" y1="0" x2="6" y2="0" stroke="#334155" strokeWidth="0.08" />
        <line x1="0" y1="-7" x2="0" y2="6" stroke="#334155" strokeWidth="0.08" />

        {/* Numeración Eje X */}
        {xTicks.map(x => (
          <text key={`x3-${x}`} x={x} y="0.45" fontSize="0.32" textAnchor="middle" fill="#64748b" fontWeight="500">{x}</text>
        ))}

        {/* Numeración Eje Y */}
        {yTicks.map(y => (
          <text key={`y3-${y}`} x="-0.25" y={-y + 0.1} fontSize="0.32" textAnchor="end" fill="#64748b" fontWeight="500">{y}</text>
        ))}

        <g transform="scale(1, -1)">
          {/* Recta 1: y = 2x - 4 */}
          <line x1="0" y1="-4" x2="5" y2="6" stroke="#2563eb" strokeWidth="0.1" />

          {/* Recta 2: y = 2x + 6 */}
          <line x1="-5" y1="-4" x2="0" y2="6" stroke="#4b5563" strokeWidth="0.1" />
        </g>
      </svg>
    </div>
  );
}