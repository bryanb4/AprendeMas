// src/pages/HomePage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import { mockLogin } from '../services/api.js'; // Importamos la función de login

function HomePage() {
  const navigate = useNavigate();

  // Estados para el formulario de la derecha
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Verificamos si ya hay usuario
  const isAuthenticated = localStorage.getItem('token') !== null;

  // 1. Si SÍ está logueado -> Muestra el Dashboard
  if (isAuthenticated) {
    return <DashboardPage />;
  }

  // Lógica de Login (para el formulario de la derecha)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await mockLogin(email, password);
      localStorage.setItem('token', data.token);
      navigate(0); // Recarga para entrar al Dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Si NO está logueado -> Muestra la FUSIÓN (Tu diseño + Login)
  return (
    <div className="hero-login-container">
      
      {/* --- IZQUIERDA: TU DISEÑO ORIGINAL --- */}
      <div className="hero-visual-side">
        <div className="hero-content-original">
          {/* Aquí está TEXTUALMENTE lo que tú tenías */}
          <h2>Bienvenido a ExamenDone</h2>

          <p>
            ¿Te gustaría practicar para tu examen de admisión?
            <br />
            ¿Te gustaría aprender temas que vendrán en el examen?
          </p>

          <p style={{ fontStyle: 'italic', color: '#f0f0f0', marginTop: '2rem', opacity: 0.9 }}>
            Regístrate o inicia sesión para formar parte de esta plataforma y 
            aprender nuevos temas o retomar temas que podrías requerir reforzar.
          </p>
          
          {/* Nota: Quité los botones de aquí porque el login ya está a la derecha, 
              pero dejé el texto intacto */}
        </div>
      </div>

      {/* --- DERECHA: EL FORMULARIO DE LOGIN --- */}
      <div className="login-form-side">
        <div className="login-box">
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Ingresa a tu cuenta</h3>
          
          <form onSubmit={handleLogin}>
            {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
            
            <div className="input-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                placeholder="ejemplo@correo.com"
              />
            </div>
            
            <div className="input-group">
              <label>Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                placeholder="******"
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
            ¿No tienes cuenta? <br/>
            <Link to="/register" style={{ color: '#005A9C', fontWeight: 'bold' }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default HomePage;