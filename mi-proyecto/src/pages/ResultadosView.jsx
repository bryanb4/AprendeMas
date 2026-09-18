// src/pages/ResultadosView.jsx
// Historial real del alumno:
// - Evaluaciones: mejor nota por tema (se conserva la más alta)
// - Simulaciones: cada intento con fecha, hora y calificación
import React, { useState, useEffect } from 'react';
import { apiObtenerHistorial } from '../services/api.js';

function fmtFechaHora(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const fecha = d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  const hora = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  return `${fecha} · ${hora}`;
}

function ResultadosView() {
  const [data, setData] = useState({ evaluaciones: [], simulaciones: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Inicia sesión para ver tu historial.');
      setLoading(false);
      return;
    }
    apiObtenerHistorial(token)
      .then((d) => {
        setData({ evaluaciones: d.evaluaciones || [], simulaciones: d.simulaciones || [] });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando tu historial…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section style={{ background: 'white', padding: 28, borderRadius: 24, textAlign: 'left' }}>
        <h2 style={{ marginTop: 0 }}>📝 Exámenes de evaluación</h2>
        {data.evaluaciones.length === 0 ? (
          <p style={{ color: '#666' }}>Aún no presentas evaluaciones. Aprueba un tema y aparecerá aquí tu mejor nota.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.evaluaciones.map((e) => (
              <div
                key={e.tema_id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                  border: '1px solid #f0e8ff',
                  borderRadius: 16,
                  padding: '12px 18px',
                  borderLeft: `4px solid ${e.aprobado ? '#2e9e5b' : '#e03939'}`,
                }}
              >
                <div>
                  <strong>{e.materia}: {e.tema}</strong>
                  <div style={{ color: '#777', fontSize: '0.85rem' }}>
                    Realizado el {fmtFechaHora(e.fecha)}
                  </div>
                </div>
                <span
                  style={{
                    background: e.aprobado ? '#2e9e5b' : '#e03939',
                    color: 'white',
                    fontWeight: 700,
                    borderRadius: 40,
                    padding: '6px 16px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {e.aprobado ? 'Aprobado' : 'Reprobado'} · {e.mejor}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ background: 'white', padding: 28, borderRadius: 24, textAlign: 'left' }}>
        <h2 style={{ marginTop: 0 }}>⏱ Exámenes de simulación</h2>
        {data.simulaciones.length === 0 ? (
          <p style={{ color: '#666' }}>Aún no realizas simulaciones (disponibles martes y viernes).</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.simulaciones.map((s) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                  border: '1px solid #f0e8ff',
                  borderRadius: 16,
                  padding: '12px 18px',
                }}
              >
                <div>
                  <strong>Intento {s.intento || '—'}</strong>
                  <div style={{ color: '#777', fontSize: '0.85rem' }}>
                    {fmtFechaHora(s.fecha)}
                    {s.aciertos !== null && s.total !== null
                      ? ` · ${s.aciertos}/${s.total} aciertos`
                      : ''}
                  </div>
                </div>
                <span
                  style={{
                    background: '#764ba2',
                    color: 'white',
                    fontWeight: 700,
                    borderRadius: 40,
                    padding: '6px 16px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Calif. {s.calificacion}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ResultadosView;
