// src/components/PerfilView.jsx
import React, { useState, useEffect } from 'react';
import { apiGetProfile, apiUpdateProfile, apiChangePassword } from '../services/api.js';

const AVATARES = [
  '/avatars/1PerroAvatar.png',
  '/avatars/2HamsterAvatar.png',
  '/avatars/3PuercoespinAvatar.png',
  '/avatars/4GatoAvatarr.png',
  '/avatars/5Hamster2Avatar.png',
  '/avatars/6RataAvatar.png',
  '/avatars/7Perro2Avatar.png',
  '/avatars/8PericoAvatar.png',
  '/avatars/9PezAvatar.png',
  '/avatars/10TortugaAvatar.png',
  '/avatars/11CamaleonAvatar.png',
  '/avatars/12ConejoAvatar.png',
  '/avatars/13PerrosalchichaAvatar.png',
  '/avatars/14NaranjosoAvatar.png',
];

const PerfilView = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    passwordActual: '',
    passwordNueva: '',
    passwordConfirmar: '',
  });
  const [email, setEmail] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [msgDatos, setMsgDatos] = useState(null);
  const [msgPass, setMsgPass] = useState(null);
  const [msgAvatar, setMsgAvatar] = useState(null);
  const [savingDatos, setSavingDatos] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [avatar, setAvatar] = useState(() => localStorage.getItem('avatar') || '');
  const [avatarTemp, setAvatarTemp] = useState(avatar);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadError('No hay sesión activa. Inicia sesión de nuevo.');
      setLoading(false);
      return;
    }
    apiGetProfile(token)
      .then((data) => {
        setFormData((prev) => ({
          ...prev,
          nombres: data.nombre || data.nombres || '',
          primerApellido: data.primer_apellido || '',
          segundoApellido: data.segundo_apellido || '',
          fechaNacimiento: data.fecha_nacimiento ? String(data.fecha_nacimiento).slice(0, 10) : '',
        }));
        setEmail(data.email || '');
        setInstitucion(data.institucion || '');
        if (data.avatar) {
          setAvatar(data.avatar);
          setAvatarTemp(data.avatar);
          localStorage.setItem('avatar', data.avatar);
        }
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActualizarDatos = async (e) => {
    e.preventDefault();
    setMsgDatos(null);
    setSavingDatos(true);
    try {
      const token = localStorage.getItem('token');
      const data = await apiUpdateProfile(token, {
        nombre: formData.nombres,
        primerApellido: formData.primerApellido,
        segundoApellido: formData.segundoApellido,
        fechaNacimiento: formData.fechaNacimiento || null,
      });
      setMsgDatos({ ok: true, text: data.message || 'Datos actualizados correctamente' });
    } catch (err) {
      setMsgDatos({ ok: false, text: err.message });
    } finally {
      setSavingDatos(false);
    }
  };

  const handleCambiarContrasena = async (e) => {
    e.preventDefault();
    setMsgPass(null);
    if (formData.passwordNueva !== formData.passwordConfirmar) {
      setMsgPass({ ok: false, text: 'La nueva contraseña y su confirmación no coinciden' });
      return;
    }
    setSavingPass(true);
    try {
      const token = localStorage.getItem('token');
      const data = await apiChangePassword(token, formData.passwordActual, formData.passwordNueva);
      setMsgPass({ ok: true, text: data.message || 'Contraseña actualizada correctamente' });
      setFormData((prev) => ({ ...prev, passwordActual: '', passwordNueva: '', passwordConfirmar: '' }));
    } catch (err) {
      setMsgPass({ ok: false, text: err.message });
    } finally {
      setSavingPass(false);
    }
  };

  const handleGuardarAvatar = async () => {
    if (!avatarTemp) return;
    setMsgAvatar(null);
    setSavingAvatar(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await apiUpdateProfile(token, { avatar: avatarTemp });
      }
      setAvatar(avatarTemp);
      localStorage.setItem('avatar', avatarTemp);
      setShowSelector(false);
      setMsgAvatar({ ok: true, text: 'Avatar actualizado' });
    } catch (err) {
      // Sin backend: queda solo en localStorage
      setAvatar(avatarTemp);
      localStorage.setItem('avatar', avatarTemp);
      setShowSelector(false);
      setMsgAvatar({ ok: false, text: 'Se guardó solo localmente: ' + err.message });
    } finally {
      setSavingAvatar(false);
    }
  };

  if (loading) {
    return <div className="perfil-view animate-fade-in"><p>Cargando tus datos...</p></div>;
  }

  if (loadError) {
    return <div className="perfil-view animate-fade-in"><p style={{ color: 'red' }}>{loadError}</p></div>;
  }

  return (
    <div className="perfil-view animate-fade-in">
      <style>{`
        .perfil-view {
          padding: 24px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .perfil-view h2 {
          margin-bottom: 30px;
          color: #1a1b3a;
          font-weight: 600;
          font-size: 28px;
          letter-spacing: -0.3px;
        }
        .perfil-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 30px;
          align-items: start;
        }
        /* Tarjetas */
        .card-left, .card-right {
          background: white;
          padding: 30px;
          border-radius: 24px;
          box-shadow: 0 15px 35px rgba(118, 75, 162, 0.12);
          border: 1px solid #f0e8ff;
          transition: all 0.2s;
        }
        .card-left {
          text-align: center;
        }
        .card-right {
          padding: 30px;
        }
        /* Foto */
        .avatar-wrapper {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: linear-gradient(145deg, #764ba2, #9f7cd9);
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          color: white;
          border: 4px solid white;
          box-shadow: 0 10px 25px rgba(118, 75, 162, 0.3);
          overflow: hidden;
        }
        .avatar-img { width: 100%; height: 100%; object-fit: contain; object-position: center; background: #FFFAF0; padding: 8px; }
        .avatar-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 18px 0 12px; }
        .avatar-option { border: 3px solid transparent; border-radius: 18px; padding: 6px; cursor: pointer; background: #FFFAF0; transition: 0.15s; }
        .avatar-option img { width: 100%; aspect-ratio: 1; object-fit: contain; object-position: center; border-radius: 12px; display: block; background: #FFFAF0; }
        .avatar-option:hover { transform: scale(1.05); }
        .avatar-option.selected { border-color: #764ba2; box-shadow: 0 0 0 3px rgba(118,75,162,0.25); }
        .avatar-preview-name { font-size: 0.85rem; color: #764ba2; font-weight: 600; margin-top: 8px; min-height: 20px; }
        .avatar-actions { display: flex; gap: 10px; justify-content: center; margin-top: 6px; }
        /* Botones de acción (estilo consistente) */
        .btn-outline-purple {
          background: transparent;
          border: 2px solid #764ba2;
          color: #764ba2;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 24px;
          border-radius: 40px;
          cursor: pointer;
          transition: 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-outline-purple:hover {
          background: #764ba2;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(118, 75, 162, 0.3);
        }
        .btn-solid-purple {
          background: #764ba2;
          border: none;
          color: white;
          font-weight: 600;
          font-size: 15px;
          padding: 14px 32px;
          border-radius: 40px;
          cursor: pointer;
          transition: 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 12px 20px -10px #764ba2;
        }
        .btn-solid-purple:hover {
          background: #5f3b85;
          transform: translateY(-2px);
          box-shadow: 0 18px 25px -10px #764ba2;
        }
        /* Información estática */
        .info-static {
          text-align: left;
          margin-top: 20px;
        }
        .info-static .label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 700;
          color: #7a6a8a;
          margin-bottom: 4px;
        }
        .info-static .value {
          font-size: 18px;
          font-weight: 600;
          color: #1e1e2f;
          margin: 0 0 20px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        /* Formulario: etiquetas e inputs */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 25px;
          margin-bottom: 20px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .input-group label {
          font-weight: 600;
          font-size: 14px;
          color: #3a2a4a;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .input-field-modern {
          border: 2px solid #ede7f6;
          border-radius: 18px;
          padding: 14px 18px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          background-color: #fefdff;
          transition: all 0.2s;
          outline: none;
          color: #1a1a2c;
          width: 100%;
        }
        .input-field-modern:focus {
          border-color: #764ba2;
          box-shadow: 0 0 0 4px rgba(118, 75, 162, 0.15);
          background-color: #ffffff;
        }
        .input-field-modern::placeholder {
          color: #b7a9d3;
          font-weight: 400;
        }
        /* Seguridad: apilado */
        .security-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 20px;
        }
        .security-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        /* Responsive */
        @media (max-width: 900px) {
          .perfil-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <h2>⚙️ Configuración del Perfil</h2>

      <div className="perfil-grid">
        {/* COLUMNA IZQUIERDA: foto y datos estáticos */}
        <div className="card-left">
          <div className="avatar-wrapper">
            {(showSelector ? avatarTemp : avatar)
              ? <img src={showSelector ? avatarTemp : avatar} alt="Avatar" className="avatar-img" />
              : <span>👤</span>}
          </div>
          {showSelector && avatarTemp && (
            <div className="avatar-preview-name">{avatarTemp.split('/').pop().replace(/Avatar\.png$/i, '').replace(/^\d+/, '') || 'Vista previa'}</div>
          )}
          <button
            className="btn-outline-purple"
            onClick={() => { setAvatarTemp(avatar || AVATARES[0]); setShowSelector((v) => !v); }}
          >
            <i className="fas fa-camera"></i> {showSelector ? 'Cerrar' : 'Cambiar foto'}
          </button>

          {showSelector && (
            <div>
              <div className="avatar-grid">
                {AVATARES.map((src) => (
                  <button
                    key={src}
                    type="button"
                    className={`avatar-option ${avatarTemp === src ? 'selected' : ''}`}
                    onClick={() => setAvatarTemp(src)}
                    title={src.split('/').pop()}
                  >
                    <img src={src} alt="avatar" />
                  </button>
                ))}
              </div>
              <div className="avatar-actions">
                <button className="btn-solid-purple" style={{ padding: '10px 20px', fontSize: 14 }} onClick={handleGuardarAvatar} disabled={savingAvatar}>
                  {savingAvatar ? 'Guardando...' : 'Guardar avatar'}
                </button>
              </div>
              {msgAvatar && (
                <p style={{ color: msgAvatar.ok ? '#2e7d32' : '#c62828', fontSize: '0.9rem', textAlign: 'center' }}>
                  {msgAvatar.text}
                </p>
              )}
            </div>
          )}

          <div className="info-static">
            <div className="label">Correo asociado</div>
            <div className="value">
              <i className="fas fa-check-circle" style={{ color: '#2ecc71' }}></i>
              {email || '—'}
            </div>

            <div className="label">Institución</div>
            <div className="value">
              <i className="fas fa-graduation-cap" style={{ color: '#764ba2' }}></i>
              {institucion || '—'}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: formularios apilados */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {/* Sección Datos Personales */}
          <div className="card-right">
            <h3 style={{ marginTop: 0, marginBottom: 25, borderBottom: '2px solid #764ba2', paddingBottom: 10, fontWeight: 600 }}>
              <i className="fas fa-id-card" style={{ marginRight: 10, color: '#764ba2' }}></i>
              Datos Personales
            </h3>
            <div className="form-grid">
              <div className="input-group">
                <label><i className="fas fa-user"></i> Nombre(s)</label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="input-field-modern"
                  placeholder="Ej. María José"
                />
              </div>
              <div className="input-group">
                <label><i className="fas fa-user-tag"></i> Primer Apellido</label>
                <input
                  type="text"
                  name="primerApellido"
                  value={formData.primerApellido}
                  onChange={handleChange}
                  className="input-field-modern"
                  placeholder="Ej. García"
                />
              </div>
              <div className="input-group">
                <label><i className="fas fa-user-tag"></i> Segundo Apellido</label>
                <input
                  type="text"
                  name="segundoApellido"
                  value={formData.segundoApellido}
                  onChange={handleChange}
                  className="input-field-modern"
                  placeholder="Ej. López"
                />
              </div>
              <div className="input-group">
                <label><i className="fas fa-calendar-alt"></i> Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="input-field-modern"
                />
              </div>
            </div>
            {msgDatos && (
              <p style={{ color: msgDatos.ok ? '#2e7d32' : '#c62828', fontSize: '0.9rem' }}>
                {msgDatos.text}
              </p>
            )}
            <button className="btn-solid-purple" onClick={handleActualizarDatos} disabled={savingDatos}>
              <i className="fas fa-sync-alt"></i> {savingDatos ? 'Guardando...' : 'Actualizar Datos'}
            </button>
          </div>

          {/* Sección Seguridad */}
          <div className="card-right">
            <h3 style={{ marginTop: 0, marginBottom: 25, borderBottom: '2px solid #764ba2', paddingBottom: 10, fontWeight: 600 }}>
              <i className="fas fa-lock" style={{ marginRight: 10, color: '#764ba2' }}></i>
              Seguridad
            </h3>
            <div className="security-stack">
              <div className="input-group">
                <label><i className="fas fa-key"></i> Contraseña Actual</label>
                <input
                  type="password"
                  name="passwordActual"
                  value={formData.passwordActual}
                  onChange={handleChange}
                  className="input-field-modern"
                  placeholder="••••••••"
                />
              </div>
              <div className="security-row">
                <div className="input-group">
                  <label><i className="fas fa-key"></i> Nueva Contraseña</label>
                  <input
                    type="password"
                    name="passwordNueva"
                    value={formData.passwordNueva}
                    onChange={handleChange}
                    className="input-field-modern"
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                <div className="input-group">
                  <label><i className="fas fa-check-double"></i> Confirmar Contraseña</label>
                  <input
                    type="password"
                    name="passwordConfirmar"
                    value={formData.passwordConfirmar}
                    onChange={handleChange}
                    className="input-field-modern"
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>
            </div>
            {msgPass && (
              <p style={{ color: msgPass.ok ? '#2e7d32' : '#c62828', fontSize: '0.9rem' }}>
                {msgPass.text}
              </p>
            )}
            <button className="btn-solid-purple" onClick={handleCambiarContrasena} disabled={savingPass}>
              <i className="fas fa-key"></i> {savingPass ? 'Guardando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilView;