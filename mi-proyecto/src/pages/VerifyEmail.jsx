// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { apiVerifyEmail } from '../services/api.js';

function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verificando tu cuenta...');

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Falta el token de verificación en el enlace.');
      return;
    }
    apiVerifyEmail(token)
      .then((data) => {
        setStatus('ok');
        setMessage(data.message || 'Correo verificado correctamente.');
        if (data.token) {
          localStorage.setItem('token', data.token);
          if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        }
        setTimeout(() => navigate('/'), 2500);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Token inválido o ya usado.');
      });
  }, [params, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f2fb', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 32, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ color: '#005A9C' }}>Verificación de correo</h2>
        <p style={{ color: status === 'error' ? '#c62828' : '#333' }}>{message}</p>
        {status === 'loading' && <p>Cargando...</p>}
        {status !== 'loading' && (
          <Link to="/" style={{ color: '#005A9C', fontWeight: 'bold' }}>Ir al inicio</Link>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
