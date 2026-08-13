import React from 'react';

export default function GraficaEcuacionCinco() {
  return (
    <div style={{ textAlign: 'center', margin: '15px 0' }}>
      <svg
        viewBox="0 0 300 240"
        style={{
          maxWidth: '320px',
          width: '100%',
          height: 'auto',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #d4edda', // Borde suave verde
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        {/* Rejilla de fondo (Grid) */}
        <defs>
          <pattern id="grid5" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0ebf8" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="300" height="240" fill="url(#grid5)" />

        {/* Eje Y */}
        <line x1="80" y1="10" x2="80" y2="230" stroke="#8e8ea9" strokeWidth="2" />
        <polygon points="80,5 75,15 85,15" fill="#8e8ea9" />
        <text x="92" y="20" fontSize="12" fill="#555" fontWeight="bold">y</text>

        {/* Eje X */}
        <line x1="10" y1="170" x2="290" y2="170" stroke="#8e8ea9" strokeWidth="2" />
        <polygon points="295,170 285,165 285,175" fill="#8e8ea9" />
        <text x="280" y="160" fontSize="12" fill="#555" fontWeight="bold">x</text>

        {/* Recta x + y = 5 */}
        <line x1="40" y1="50" x2="220" y2="230" stroke="#27ae60" strokeWidth="3.5" strokeLinecap="round" />

        {/* Puntos destacados */}
        <circle cx="80" cy="90" r="5" fill="#ff5722" />
        <text x="35" y="94" fontSize="11" fill="#ff5722" fontWeight="bold">(0, 5)</text>

        <circle cx="100" cy="110" r="4" fill="#27ae60" />
        <text x="108" y="108" fontSize="10" fill="#333">(1, 4)</text>

        <circle cx="120" cy="130" r="4" fill="#27ae60" />
        <text x="128" y="128" fontSize="10" fill="#333">(2, 3)</text>

        <circle cx="180" cy="170" r="5" fill="#ff5722" />
        <text x="170" y="190" fontSize="11" fill="#ff5722" fontWeight="bold">(5, 0)</text>

        {/* Etiqueta de la función */}
        <text x="180" y="80" fontSize="12" fill="#27ae60" fontWeight="bold">
          x + y = 5
        </text>
      </svg>
    </div>
  );
}