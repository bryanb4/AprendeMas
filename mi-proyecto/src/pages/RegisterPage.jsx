import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockRegister } from '../services/api.js';

function RegisterPage() {
  // Estados para los nuevos campos
  const [nombre, setNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!nombre || !primerApellido || !fechaNacimiento || !institucion) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        nombre,
        primerApellido,
        segundoApellido,
        fechaNacimiento,
        institucion,
        email,
      };

      await mockRegister(userData, password);

      localStorage.setItem('token', 'token-nuevo-usuario');
      localStorage.setItem('user', JSON.stringify(userData));

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Mitad Izquierda: Imagen */}
      <div className="auth-image"></div>

      {/* Mitad Derecha: Formulario */}
      <div className="auth-form-side">
        {/* Aumentamos el padding y permitimos scroll si es necesario */}
        <div 
          className="form-container" 
          style={{ 
            padding: '2.5rem 2rem',  // más espacio interior
            maxHeight: '100vh', 
            overflowY: 'auto' 
          }}
        >
          <h2 style={{ textAlign: 'left', fontSize: '2rem', color: '#005A9C' }}>
            Crea tu cuenta
          </h2>
          <p style={{ textAlign: 'left', marginBottom: '2rem', color: '#666' }}>
            Únete a Aprende<span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 26, height: 26, marginLeft: 4, borderRadius: 9, background: 'linear-gradient(135deg, #c77dff 0%, #9f7cd9 100%)', color: '#2D1B4E', fontSize: 20, fontWeight: 900, lineHeight: 1, verticalAlign: 'middle', transform: 'rotate(-4deg)' }}>+</span> y prepárate para el éxito.
          </p>

          <form onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}

            {/* ===== NUEVOS CAMPOS con el mismo estilo ===== */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>
                Nombre(s):
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>
                Primer Apellido:
              </label>
              <input
                type="text"
                value={primerApellido}
                onChange={(e) => setPrimerApellido(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>
                Segundo Apellido:
              </label>
              <input
                type="text"
                value={segundoApellido}
                onChange={(e) => setSegundoApellido(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>
                Fecha de Nacimiento:
              </label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>
                Institución (donde estudias o estudiaste):
              </label>
              <input
                type="text"
                value={institucion}
                onChange={(e) => setInstitucion(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            {/* ===== CAMPOS EXISTENTES (con el mismo estilo por consistencia) ===== */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>
                Contraseña:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>
                Confirmar Contraseña:
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-secondary"
              style={{ marginTop: '1rem', width: '100%', padding: '0.8rem' }}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <p style={{ textAlign: 'left', marginTop: '1.5rem' }}>
            ¿Ya tienes cuenta? <Link to="/" style={{ fontWeight: 'bold' }}>Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;