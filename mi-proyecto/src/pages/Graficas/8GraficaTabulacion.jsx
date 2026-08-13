import React from 'react';

// Flecha reutilizable para las puntas de los ejes
const MarcadorFlecha = () => (
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b" />
    </marker>
  </defs>
);

// 1. Gráfica de f(x) = 2x + 5 (GraficaTabulacion)
export function GraficaTabulacion() {
  const xTicks = [-3, -2, -1, 1, 2, 3];
  const yTicks = [-1, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <svg width="340" height="300" viewBox="-4.5 -2.5 9 12" style={{ background: '#fafafa', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
        <MarcadorFlecha />
        
        {/* GRUPO CON EJE Y INVERTIDO */}
        <g transform="scale(1, -1) translate(0, -8)">
          {/* Malla/Cuadrícula de fondo */}
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`h-${i}`} x1="-4.5" y1={i - 2} x2="4.5" y2={i - 2} stroke="#e2e8f0" strokeWidth="0.06" />
          ))}
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`v-${i}`} x1={i - 5} y1="-2.5" x2={i - 5} y2="9.5" stroke="#e2e8f0" strokeWidth="0.06" />
          ))}

          {/* Ejes X e Y con Flechas */}
          <line x1="-4.2" y1="0" x2="4.2" y2="0" stroke="#1e293b" strokeWidth="0.12" markerEnd="url(#arrow)" />
          <line x1="0" y1="-2.2" x2="0" y2="9.2" stroke="#1e293b" strokeWidth="0.12" markerEnd="url(#arrow)" />

          {/* Marcas de los Ticks */}
          {xTicks.map(val => (
            <line key={`xtick-${val}`} x1={val} y1="-0.18" x2={val} y2="0.18" stroke="#1e293b" strokeWidth="0.1" />
          ))}
          {yTicks.map(val => (
            <line key={`ytick-${val}`} x1="-0.18" y1={val} x2="0.18" y2={val} stroke="#1e293b" strokeWidth="0.1" />
          ))}

          {/* Recta f(x) = 2x + 5 */}
          <line x1="-3.5" y1="-2" x2="1.8" y2="8.6" stroke="#0d9488" strokeWidth="0.3" strokeLinecap="round" />

          {/* Puntos de tabulación */}
          <circle cx="-1" cy="3" r="0.22" fill="#2563eb" stroke="#ffffff" strokeWidth="0.05" />
          <circle cx="0" cy="5" r="0.22" fill="#2563eb" stroke="#ffffff" strokeWidth="0.05" />
          <circle cx="1" cy="7" r="0.22" fill="#2563eb" stroke="#ffffff" strokeWidth="0.05" />
        </g>

        {/* NÚMEROS Y ETIQUETAS (Texto normal) */}
        {xTicks.map(val => (
          <text key={`xtext-${val}`} x={val} y="8.7" fontSize="0.45" fill="#334155" textAnchor="middle" fontWeight="bold">{val}</text>
        ))}
        {yTicks.map(val => (
          <text key={`ytext-${val}`} x="-0.35" y={8 - val + 0.14} fontSize="0.45" fill="#334155" textAnchor="end" fontWeight="bold">{val}</text>
        ))}

        {/* Etiquetas de Puntos */}
        <text x="-1.4" y="5.2" fontSize="0.5" fill="#1e40af" fontWeight="bold">C(-1,3)</text>
        <text x="0.4" y="3.1" fontSize="0.5" fill="#1e40af" fontWeight="bold">A(0,5)</text>
        <text x="1.4" y="1.1" fontSize="0.5" fill="#1e40af" fontWeight="bold">B(1,7)</text>

        {/* Nombres de los ejes */}
        <text x="4.1" y="7.5" fontSize="0.65" fill="#1e293b" fontWeight="bold">X</text>
        <text x="0.4" y="-1.0" fontSize="0.65" fill="#1e293b" fontWeight="bold">Y</text>
      </svg>
    </div>
  );
}

// 2. Gráfica de Función Constante y = 3
export function GraficaConstante() {
  const xTicks = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
  const yTicks = [-1, 1, 2, 3, 4];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <svg width="340" height="230" viewBox="-6.5 -2.5 13 8" style={{ background: '#fafafa', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
        <MarcadorFlecha />
        <g transform="scale(1, -1) translate(0, -3)">
          {/* Cuadrícula */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h-${i}`} x1="-6.5" y1={i - 2} x2="6.5" y2={i - 2} stroke="#e2e8f0" strokeWidth="0.06" />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`v-${i}`} x1={i - 7} y1="-2.5" x2={i - 7} y2="5.5" stroke="#e2e8f0" strokeWidth="0.06" />
          ))}

          {/* Ejes */}
          <line x1="-6.0" y1="0" x2="6.0" y2="0" stroke="#1e293b" strokeWidth="0.12" markerEnd="url(#arrow)" />
          <line x1="0" y1="-2.2" x2="0" y2="5.2" stroke="#1e293b" strokeWidth="0.12" markerEnd="url(#arrow)" />

          {/* Ticks */}
          {xTicks.map(val => (
            <line key={`xt-${val}`} x1={val} y1="-0.18" x2={val} y2="0.18" stroke="#1e293b" strokeWidth="0.1" />
          ))}
          {yTicks.map(val => (
            <line key={`yt-${val}`} x1="-0.18" y1={val} x2="0.18" y2={val} stroke="#1e293b" strokeWidth="0.1" />
          ))}

          {/* Recta y = 3 */}
          <line x1="-6.2" y1="3" x2="6.2" y2="3" stroke="#0d9488" strokeWidth="0.3" strokeLinecap="round" />
        </g>

        {/* Números de ejes */}
        {xTicks.map(val => (
          <text key={`xtxt-${val}`} x={val} y="3.7" fontSize="0.45" fill="#334155" textAnchor="middle" fontWeight="bold">{val}</text>
        ))}
        {yTicks.map(val => (
          <text key={`ytxt-${val}`} x="-0.35" y={3 - val + 0.14} fontSize="0.45" fill="#334155" textAnchor="end" fontWeight="bold">{val}</text>
        ))}

        <text x="3.8" y="-0.3" fontSize="0.55" fill="#0d9488" fontWeight="bold">y = 3</text>
        <text x="5.8" y="2.5" fontSize="0.65" fill="#1e293b" fontWeight="bold">X</text>
        <text x="0.4" y="-1.8" fontSize="0.65" fill="#1e293b" fontWeight="bold">Y</text>
      </svg>
    </div>
  );
}

// 3. Gráfica Pendiente Positiva m > 0 (ASCENDENTE)
export function GraficaPendientePositiva() {
  const xTicks = [-4, -3, -2, -1, 1, 2, 3, 4];
  const yTicks = [-2, -1, 1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
      <svg width="300" height="220" viewBox="-5.5 -3.5 11 10" style={{ background: '#fafafa', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
        <MarcadorFlecha />
        <g transform="scale(1, -1) translate(0, -3)">
          {/* Cuadrícula */}
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`h-${i}`} x1="-5.5" y1={i - 3} x2="5.5" y2={i - 3} stroke="#e2e8f0" strokeWidth="0.06" />
          ))}
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`v-${i}`} x1={i - 6} y1="-3.5" x2={i - 6} y2="6.5" stroke="#e2e8f0" strokeWidth="0.06" />
          ))}

          {/* Ejes */}
          <line x1="-5.0" y1="0" x2="5.0" y2="0" stroke="#1e293b" strokeWidth="0.12" markerEnd="url(#arrow)" />
          <line x1="0" y1="-3.0" x2="0" y2="6.2" stroke="#1e293b" strokeWidth="0.12" markerEnd="url(#arrow)" />

          {/* Ticks */}
          {xTicks.map(val => (
            <line key={`px-${val}`} x1={val} y1="-0.18" x2={val} y2="0.18" stroke="#1e293b" strokeWidth="0.1" />
          ))}
          {yTicks.map(val => (
            <line key={`py-${val}`} x1="-0.18" y1={val} x2="0.18" y2={val} stroke="#1e293b" strokeWidth="0.1" />
          ))}

          {/* Recta Positiva */}
          <line x1="-3.5" y1="-2" x2="2.5" y2="5" stroke="#16a34a" strokeWidth="0.3" strokeLinecap="round" />
        </g>

        {/* Números */}
        {xTicks.map(val => (
          <text key={`ptxtx-${val}`} x={val} y="3.7" fontSize="0.45" fill="#334155" textAnchor="middle" fontWeight="bold">{val}</text>
        ))}
        {yTicks.map(val => (
          <text key={`ptxty-${val}`} x="-0.35" y={3 - val + 0.14} fontSize="0.45" fill="#334155" textAnchor="end" fontWeight="bold">{val}</text>
        ))}

        <text x="4.8" y="2.5" fontSize="0.6" fill="#1e293b" fontWeight="bold">X</text>
        <text x="0.4" y="-2.5" fontSize="0.6" fill="#1e293b" fontWeight="bold">Y</text>
      </svg>
    </div>
  );
}

// 4. Gráfica Pendiente Negativa m < 0 (DESCENDENTE)
export function GraficaPendienteNegativa() {
  const xTicks = [-4, -3, -2, -1, 1, 2, 3, 4];
  const yTicks = [-2, -1, 1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
      <svg width="300" height="220" viewBox="-5.5 -3.5 11 10" style={{ background: '#fafafa', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
        <MarcadorFlecha />
        <g transform="scale(1, -1) translate(0, -3)">
          {/* Cuadrícula */}
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`h-${i}`} x1="-5.5" y1={i - 3} x2="5.5" y2={i - 3} stroke="#e2e8f0" strokeWidth="0.06" />
          ))}
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`v-${i}`} x1={i - 6} y1="-3.5" x2={i - 6} y2="6.5" stroke="#e2e8f0" strokeWidth="0.06" />
          ))}

          {/* Ejes */}
          <line x1="-5.0" y1="0" x2="5.0" y2="0" stroke="#1e293b" strokeWidth="0.12" markerEnd="url(#arrow)" />
          <line x1="0" y1="-3.0" x2="0" y2="6.2" stroke="#1e293b" strokeWidth="0.12" markerEnd="url(#arrow)" />

          {/* Ticks */}
          {xTicks.map(val => (
            <line key={`nx-${val}`} x1={val} y1="-0.18" x2={val} y2="0.18" stroke="#1e293b" strokeWidth="0.1" />
          ))}
          {yTicks.map(val => (
            <line key={`ny-${val}`} x1="-0.18" y1={val} x2="0.18" y2={val} stroke="#1e293b" strokeWidth="0.1" />
          ))}

          {/* Recta Negativa */}
          <line x1="-3.5" y1="5" x2="2.5" y2="-2" stroke="#dc2626" strokeWidth="0.3" strokeLinecap="round" />
        </g>

        {/* Números */}
        {xTicks.map(val => (
          <text key={`ntxtx-${val}`} x={val} y="3.7" fontSize="0.45" fill="#334155" textAnchor="middle" fontWeight="bold">{val}</text>
        ))}
        {yTicks.map(val => (
          <text key={`ntxty-${val}`} x="-0.35" y={3 - val + 0.14} fontSize="0.45" fill="#334155" textAnchor="end" fontWeight="bold">{val}</text>
        ))}

        <text x="4.8" y="2.5" fontSize="0.6" fill="#1e293b" fontWeight="bold">X</text>
        <text x="0.4" y="-2.5" fontSize="0.6" fill="#1e293b" fontWeight="bold">Y</text>
      </svg>
    </div>
  );
}

// 5. Gráfica Pendiente Cero m = 0 (HORIZONTAL)
export function GraficaPendienteCero() {
  const xTicks = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
  const yTicks = [-1, 1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
      <svg width="300" height="200" viewBox="-7.5 -2.5 15 9" style={{ background: '#fafafa', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
        <MarcadorFlecha />
        <g transform="scale(1, -1) translate(0, -6)">
          {/* Cuadrícula */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h-${i}`} x1="-7.5" y1={i - 2} x2="7.5" y2={i - 2} stroke="#e2e8f0" strokeWidth="0.06" />
          ))}
          {Array.from({ length: 17 }).map((_, i) => (
            <line key={`v-${i}`} x1={i - 8} y1="-2.5" x2={i - 8} y2="7.5" stroke="#e2e8f0" strokeWidth="0.06" />
          ))}

          {/* Ejes */}
          <line x1="-7.0" y1="0" x2="7.0" y2="0" stroke="#1e293b" strokeWidth="0.12" markerEnd="url(#arrow)" />
          <line x1="0" y1="-2.0" x2="0" y2="7.2" stroke="#1e293b" strokeWidth="0.12" markerEnd="url(#arrow)" />

          {/* Ticks */}
          {xTicks.map(val => (
            <line key={`zx-${val}`} x1={val} y1="-0.18" x2={val} y2="0.18" stroke="#1e293b" strokeWidth="0.1" />
          ))}
          {yTicks.map(val => (
            <line key={`zy-${val}`} x1="-0.18" y1={val} x2="0.18" y2={val} stroke="#1e293b" strokeWidth="0.1" />
          ))}

          {/* Línea Horizontal */}
          <line x1="-7.2" y1="3" x2="7.2" y2="3" stroke="#2563eb" strokeWidth="0.3" strokeLinecap="round" />
        </g>

        {/* Números */}
        {xTicks.map(val => (
          <text key={`ztxtx-${val}`} x={val} y="6.7" fontSize="0.45" fill="#334155" textAnchor="middle" fontWeight="bold">{val}</text>
        ))}
        {yTicks.map(val => (
          <text key={`ztxty-${val}`} x="-0.35" y={6 - val + 0.14} fontSize="0.45" fill="#334155" textAnchor="end" fontWeight="bold">{val}</text>
        ))}

        <text x="6.7" y="5.5" fontSize="0.6" fill="#1e293b" fontWeight="bold">X</text>
        <text x="0.4" y="-0.5" fontSize="0.6" fill="#1e293b" fontWeight="bold">Y</text>
      </svg>
    </div>
  );
}