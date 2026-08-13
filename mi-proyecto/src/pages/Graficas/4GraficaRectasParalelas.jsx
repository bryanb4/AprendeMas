import React from 'react';

export function GraficaRectasParalelas() {
  return (
    <div style={{ textAlign: 'center', margin: '24px 0' }}>
      <svg 
        viewBox="-1 -1 8 7" 
        style={{ 
          width: '100%', 
          maxWidth: '480px', 
          background: '#fff', 
          borderRadius: '16px', 
          border: '1px solid #eee', 
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)' 
        }}
      >
        <g transform="translate(0, 5.5) scale(1, -1)">
          {/* Rejilla */}
          {[-1, 0, 1, 2, 3, 4, 5, 6, 7].map(x => (
            <line key={`v${x}`} x1={x} y1={-1} x2={x} y2={6.5} stroke="#f0ebf8" strokeWidth="0.04" />
          ))}
          {[-1, 0, 1, 2, 3, 4, 5, 6].map(y => (
            <line key={`h${y}`} x1={-1} y1={y} x2={7} y2={y} stroke="#f0ebf8" strokeWidth="0.04" />
          ))}

          {/* Ejes X e Y principales */}
          <line x1={-1} y1={0} x2={7} y2={0} stroke="#1f2937" strokeWidth="0.08" />
          <line x1={0} y1={-1} x2={0} y2={6.5} stroke="#1f2937" strokeWidth="0.08" />

          {/* Recta Gris: x + y = 3 (pasa por 0,3 y 3,0) */}
          <line x1={-0.5} y1={3.5} x2={3.5} y2={-0.5} stroke="#607d8b" strokeWidth="0.12" strokeLinecap="round" />

          {/* Recta Verde: x + y = 5 (pasa por 0,5 y 5,0) */}
          <line x1={-0.5} y1={5.5} x2={5.5} y2={-0.5} stroke="#009688" strokeWidth="0.12" strokeLinecap="round" />
        </g>

        {/* Textos y Etiquetas de los Ejes */}
        <g transform="translate(0, 5.5)">
          {[1, 2, 3, 4, 5, 6].map(x => (
            <text key={`tx${x}`} x={x} y={0.35} fontSize="0.28" fill="#666" textAnchor="middle">{x}</text>
          ))}
          {[1, 2, 3, 4, 5, 6].map(y => (
            <text key={`ty${y}`} x={-0.25} y={-y + 0.08} fontSize="0.28" fill="#666" textAnchor="end">{y}</text>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default GraficaRectasParalelas;