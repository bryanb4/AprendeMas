import React from 'react';

export default function GraficaPlanoCartesiano() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <svg viewBox="-6 -6 12 12" width="100%" maxWidth="450px" height="auto" style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <defs>
          <pattern id="grid" width="1" height="1" patternUnits="userSpaceOnUse">
            <path d="M 1 0 L 0 0 0 1" fill="none" stroke="#f1f5f9" strokeWidth="0.05" />
          </pattern>
        </defs>
        <rect x="-6" y="-6" width="12" height="12" fill="url(#grid)" />

        {/* Ejes principales X e Y */}
        <line x1="-5.5" y1="0" x2="5.5" y2="0" stroke="#64748b" strokeWidth="0.08" />
        <line x1="0" y1="-5.5" x2="0" y2="5.5" stroke="#64748b" strokeWidth="0.08" />

        {/* Divisiones numéricas */}
        {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((val) => (
          <g key={val}>
            <line x1={val} y1="-0.1" x2={val} y2="0.1" stroke="#64748b" strokeWidth="0.05" />
            <text x={val} y="0.45" fontSize="0.32" textAnchor="middle" fill="#94a3b8">{val}</text>
            <line x1="-0.1" y1={-val} x2="0.1" y2={-val} stroke="#64748b" strokeWidth="0.05" />
            <text x="-0.3" y={-val + 0.1} fontSize="0.32" textAnchor="end" fill="#94a3b8">{val}</text>
          </g>
        ))}

        {/* Cuadrantes I, II, III, IV */}
        <text x="3" y="-2.5" fontSize="1.3" fontWeight="bold" fill="#1e293b" textAnchor="middle">I</text>
        <text x="-2.8" y="-2.5" fontSize="1.3" fontWeight="bold" fill="#1e293b" textAnchor="middle">II</text>
        <text x="-3" y="3" fontSize="1.3" fontWeight="bold" fill="#1e293b" textAnchor="middle">III</text>
        <text x="3" y="2.5" fontSize="1.3" fontWeight="bold" fill="#1e293b" textAnchor="middle">IV</text>

        {/* Punto A (4, 3) */}
        <circle cx="4" cy="-3" r="0.15" fill="#3b82f6" />
        <text x="4.2" y="-3.2" fontSize="0.38" fontWeight="bold" fill="#1d4ed8">(4,3)</text>
        <text x="3.6" y="-3.2" fontSize="0.3" fill="#1d4ed8">A</text>

        {/* Punto B (-2, 2) */}
        <circle cx="-2" cy="-2" r="0.15" fill="#3b82f6" />
        <text x="-1.8" y="-2.2" fontSize="0.38" fontWeight="bold" fill="#1d4ed8">(-2,2)</text>
        <text x="-2.3" y="-2.3" fontSize="0.3" fill="#1d4ed8">B</text>

        {/* Punto C (-1, -2) */}
        <circle cx="-1" cy="2" r="0.15" fill="#3b82f6" />
        <text x="-2.3" y="2" fontSize="0.38" fontWeight="bold" fill="#1d4ed8">(-1,-2)</text>
        <text x="-0.8" y="1.7" fontSize="0.3" fill="#1d4ed8">C</text>

        {/* Punto D (2, -3) */}
        <circle cx="2" cy="3" r="0.15" fill="#3b82f6" />
        <text x="2.3" y="3.1" fontSize="0.38" fontWeight="bold" fill="#1d4ed8">(2,-3)</text>
        <text x="1.6" y="2.7" fontSize="0.3" fill="#1d4ed8">D</text>
      </svg>
    </div>
  );
}