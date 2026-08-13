import React from 'react';

export function GraficaParabolaCuadratica() {
  // Puntos generados para la parábola: y = x^2 - 3x + 2
  // Muestreo desde x = -2 hasta x = 5 para dibujar una curva suave
  const puntosParabola = [];
  for (let x = -2; x <= 5; x += 0.05) {
    const y = x * x - 3 * x + 2;
    puntosParabola.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  const dPath = `M ${puntosParabola.join(' L ')}`;

  return (
    <div style={{ textAlign: 'center', margin: '24px 0' }}>
      <svg 
        viewBox="-4.5 -1.8 11 15" 
        style={{ 
          width: '100%', 
          maxWidth: '480px', 
          background: '#fff', 
          borderRadius: '16px', 
          border: '1px solid #eee', 
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)' 
        }}
      >
        <g transform="translate(0, 12) scale(1, -1)">
          {/* Rejilla fina (Grid secundario) */}
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map(x => (
            <line key={`v${x}`} x1={x} y1={-1.5} x2={x} y2={12.5} stroke="#e2e8f0" strokeWidth="0.03" />
          ))}
          {[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(y => (
            <line key={`h${y}`} x1={-4.5} y1={y} x2={6.5} y2={y} stroke="#e2e8f0" strokeWidth="0.03" />
          ))}

          {/* Ejes X e Y principales */}
          <line x1={-4.5} y1={0} x2={6.5} y2={0} stroke="#1f2937" strokeWidth="0.08" />
          <line x1={0} y1={-1.5} x2={0} y2={12.5} stroke="#1f2937" strokeWidth="0.08" />

          {/* Curva de la Parábola (Verde) */}
          <path 
            d={dPath} 
            fill="none" 
            stroke="#165b4c" 
            strokeWidth="0.14" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Puntos destacados en las soluciones (Ceros x=1 y x=2) */}
          <circle cx={1} cy={0} r={0.16} fill="#165b4c" />
          <circle cx={2} cy={0} r={0.16} fill="#165b4c" />
        </g>

        {/* Textos y Etiquetas de los Ejes */}
        <g transform="translate(0, 12)">
          {/* Numeración Eje X */}
          {[-4, -3, -2, -1, 1, 2, 3, 4, 5, 6].map(x => (
            <text key={`tx${x}`} x={x} y={0.45} fontSize="0.32" fill="#4a5568" textAnchor="middle">{x}</text>
          ))}
          
          {/* Numeración Eje Y */}
          {[-1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(y => (
            <text key={`ty${y}`} x={-0.3} y={-y + 0.1} fontSize="0.32" fill="#4a5568" textAnchor="end">{y}</text>
          ))}
          
          <text x={-0.3} y={0.45} fontSize="0.32" fill="#4a5568" textAnchor="end">0</text>

          {/* Etiqueta flotante para los ceros de la función */}
          <g transform="translate(1.5, 1.3)">
            <rect x="-1.8" y="-0.4" width="3.6" height="0.8" rx="0.2" fill="#ffffff" stroke="#165b4c" strokeWidth="0.03" />
            <text x="0" y="0.1" fontSize="0.25" fontWeight="bold" fill="#165b4c" textAnchor="middle">Ceros: x = 1, x = 2</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

export default GraficaParabolaCuadratica;