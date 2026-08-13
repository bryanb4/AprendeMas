// src/public/GraficaEcuacionLineal.jsx
import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export default function GraficaEcuacionLineal() {
  return (
    <div className="card-bloque" style={{ textAlign: 'center', padding: '24px', background: '#faf9fe' }}>
      <h3 className="subtitulo-card" style={{ marginBottom: '8px' }}>
        Gráfica: Ecuación lineal <InlineMath math="y = -x + 4" />
      </h3>
      
      <svg
        viewBox="0 0 300 240"
        style={{
          maxWidth: '360px',
          width: '100%',
          height: 'auto',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #ede8f8',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}
      >
        {/* Rejilla de fondo (Grid) */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0ebf8" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="300" height="240" fill="url(#grid)" />

        {/* Eje Y */}
        <line x1="70" y1="10" x2="70" y2="230" stroke="#8e8ea9" strokeWidth="2" />
        <polygon points="70,5 65,15 75,15" fill="#8e8ea9" />
        <text x="82" y="20" fontSize="12" fill="#555" fontWeight="bold">y</text>

        {/* Eje X */}
        <line x1="10" y1="180" x2="290" y2="180" stroke="#8e8ea9" strokeWidth="2" />
        <polygon points="295,180 285,175 285,185" fill="#8e8ea9" />
        <text x="280" y="170" fontSize="12" fill="#555" fontWeight="bold">x</text>

        {/* Recta y = -x + 4 */}
        <line x1="40" y1="70" x2="210" y2="240" stroke="#e74c3c" strokeWidth="3.5" strokeLinecap="round" />

        {/* Intersecciones */}
        <circle cx="70" cy="100" r="5" fill="#764ba2" />
        <text x="25" y="105" fontSize="11" fill="#764ba2" fontWeight="bold">(0, 4)</text>

        <circle cx="150" cy="180" r="5" fill="#764ba2" />
        <text x="140" y="200" fontSize="11" fill="#764ba2" fontWeight="bold">(4, 0)</text>

        {/* Etiqueta de la función */}
        <text x="140" y="80" fontSize="12" fill="#e74c3c" fontWeight="bold">
          y = -x + 4
        </text>
      </svg>
    </div>
  );
}