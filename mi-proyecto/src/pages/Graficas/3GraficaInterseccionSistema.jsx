import React from 'react';

export function GraficaInterseccionSistema() {
  return (
    <div style={{ textAlign: 'center', margin: '24px 0' }}>
      <svg 
        viewBox="-1 -1 8 6" 
        style={{ 
          width: '100%', 
          maxWidth: '480px', 
          background: '#fff', 
          borderRadius: '16px', 
          border: '1px solid #eee', 
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)' 
        }}
      >
        <g transform="translate(0, 4.5) scale(1, -1)">
          {/* Rejilla */}
          {[-1, 0, 1, 2, 3, 4, 5, 6, 7].map(x => (
            <line key={`v${x}`} x1={x} y1={-1} x2={x} y2={5} stroke="#f0ebf8" strokeWidth="0.04" />
          ))}
          {[-1, 0, 1, 2, 3, 4, 5].map(y => (
            <line key={`h${y}`} x1={-1} y1={y} x2={7} y2={y} stroke="#f0ebf8" strokeWidth="0.04" />
          ))}

          {/* Ejes X e Y principales */}
          <line x1={-1} y1={0} x2={7} y2={0} stroke="#1f2937" strokeWidth="0.08" />
          <line x1={0} y1={-1} x2={0} y2={5} stroke="#1f2937" strokeWidth="0.08" />

          {/* Recta Azul: 3x - 2y = 5 (pasa por 1.5,0 y 3,2) */}
          <line x1={1.33} y1={-0.5} x2={4} y2={3.5} stroke="#1d70b8" strokeWidth="0.12" strokeLinecap="round" />

          {/* Recta Roja: x + 2y = 7 (pasa por 0,3.5 y 3,2 y 6,0.5) */}
          <line x1={-0.5} y1={3.75} x2={6} y2={0.5} stroke="#e53935" strokeWidth="0.12" strokeLinecap="round" />

          {/* Punto de intersección (3, 2) */}
          <circle cx={3} cy={2} r={0.2} fill="#2c3e50" />
        </g>

        {/* Textos y Etiquetas de los Ejes */}
        <g transform="translate(0, 4.5)">
          {[1, 2, 3, 4, 5, 6].map(x => (
            <text key={`tx${x}`} x={x} y={0.35} fontSize="0.28" fill="#666" textAnchor="middle" fontStyle="normal">{x}</text>
          ))}
          {[1, 2, 3, 4].map(y => (
            <text key={`ty${y}`} x={-0.25} y={-y + 0.08} fontSize="0.28" fill="#666" textAnchor="end">{y}</text>
          ))}

          {/* Etiqueta flotante redondeada "Punto (3, 2)" */}
          <g transform="translate(3, -2.5)">
            <rect x="-1" y="-0.4" width="2" height="0.8" rx="0.2" fill="#ffffff" stroke="#1f2937" strokeWidth="0.02" />
            <text x="0" y="0.08" fontSize="0.22" fontWeight="bold" fill="#1f2937" textAnchor="middle">Punto (3, 2)</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

export default GraficaInterseccionSistema;