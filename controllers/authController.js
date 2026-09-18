const pool = require('../db/conexion');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/mailer');

function buildVerifyUrl(token) {
  const base = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
  return `${base}/verify?token=${token}`;
}


// ============================
// REGISTRO DE USUARIO
// ============================

exports.register = async (req, res) => {

  try {

    const {
      nombre,
      primerApellido,
      segundoApellido,
      fechaNacimiento,
      institucion,
      email,
      password,
      avatar
    } = req.body;

    if (!nombre || !primerApellido || !email || !password) {
      return res.status(400).json({
        message: "Faltan campos obligatorios (nombre, primerApellido, email, password)"
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await pool.query(
      "SELECT id, email_verified FROM usuarios WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      // Si existe pero no verificó, reenviar correo en vez de dar error duro
      if (userExists.rows[0].email_verified === false) {
        const newToken = crypto.randomBytes(32).toString("hex");
        await pool.query(
          "UPDATE usuarios SET verification_token=$1, token_created_at=NOW() WHERE email=$2",
          [newToken, email]
        );
        const verifyUrl = buildVerifyUrl(newToken);
        await sendVerificationEmail(email, verifyUrl);
        return res.status(200).json({
          message: "Tu cuenta ya existía pero no estaba verificada. Revisa tu correo, te reenviamos el enlace."
        });
      }
      return res.status(400).json({
        message: "El correo ya está registrado"
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Insertar usuario (no verificado hasta que confirme el correo)
    let newUser;
    try {
      newUser = await pool.query(
        `INSERT INTO usuarios
        (nombre, primer_apellido, segundo_apellido, fecha_nacimiento, institucion, email, password, avatar, email_verified, verification_token)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,false,$9)
        RETURNING id, email`,
        [
          nombre,
          primerApellido,
          segundoApellido || null,
          fechaNacimiento || null,
          institucion || null,
          email,
          hashedPassword,
          avatar || null,
          verificationToken
        ]
      );
    } catch (e) {
      // Fallback si las migraciones de columnas aún no se aplicaron
      if (e.code === "42703") {
        newUser = await pool.query(
          `INSERT INTO usuarios
          (nombre, primer_apellido, segundo_apellido, fecha_nacimiento, institucion, email, password)
          VALUES ($1,$2,$3,$4,$5,$6,$7)
          RETURNING id, email`,
          [nombre, primerApellido, segundoApellido || null, fechaNacimiento || null, institucion || null, email, hashedPassword]
        );
      } else {
        throw e;
      }
    }

    const verifyUrl = buildVerifyUrl(verificationToken);
    await sendVerificationEmail(email, verifyUrl);

    // NO devolvemos JWT aquí: debe verificar el correo primero
    res.status(201).json({
      message: "Registro exitoso. Revisa tu correo para confirmar tu cuenta.",
      user: newUser.rows[0]
    });

  } catch (error) {

    console.error("Error en registro:", error);

    res.status(500).json({
      message: "Error al registrar usuario"
    });

  }
};



// ============================
// VERIFICAR CORREO
// ============================

exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token || req.query.token;

    if (!token) {
      return res.status(400).json({ message: "Token de verificación requerido" });
    }

    const found = await pool.query(
      "SELECT id, email, rol FROM usuarios WHERE verification_token=$1",
      [token]
    );

    if (found.rows.length === 0) {
      return res.status(400).json({ message: "Token inválido o ya usado" });
    }

    await pool.query(
      "UPDATE usuarios SET email_verified=true, verification_token=NULL WHERE id=$1",
      [found.rows[0].id]
    );

    // Al verificar, sí le damos su JWT para entrar directo (con rol incluido)
    const sessionToken = jwt.sign(
      { id: found.rows[0].id, rol: found.rows[0].rol || "alumno" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Correo verificado correctamente. Ya puedes iniciar sesión.",
      token: sessionToken,
      user: found.rows[0]
    });
  } catch (error) {
    // Si la columna no existe aún, avisar que falta migración
    if (error.code === "42703") {
      return res.status(500).json({
        message: "Falta aplicar la migración database/migracion_verificacion.sql en Postgres"
      });
    }
    console.error("Error en verifyEmail:", error);
    res.status(500).json({ message: "Error al verificar correo" });
  }
};


// ============================
// REENVIAR VERIFICACIÓN
// ============================

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email requerido" });

    const found = await pool.query(
      "SELECT id, email_verified FROM usuarios WHERE email=$1",
      [email]
    );
    if (found.rows.length === 0) {
      return res.status(404).json({ message: "Correo no registrado" });
    }
    if (found.rows[0].email_verified) {
      return res.json({ message: "Tu cuenta ya está verificada, inicia sesión." });
    }

    const newToken = crypto.randomBytes(32).toString("hex");
    await pool.query(
      "UPDATE usuarios SET verification_token=$1, token_created_at=NOW() WHERE id=$2",
      [newToken, found.rows[0].id]
    );
    await sendVerificationEmail(email, buildVerifyUrl(newToken));
    res.json({ message: "Enlace reenviado. Revisa tu correo." });
  } catch (error) {
    console.error("Error en resend:", error);
    res.status(500).json({ message: "Error al reenviar verificación" });
  }
};



// ============================
// LOGIN DE USUARIO
// ============================

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    // Buscar usuario
    const user = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({
        message: "Usuario no encontrado"
      });
    }

    // Comparar contraseña
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Contraseña incorrecta"
      });
    }

    // Bloquear si no verificó el correo (solo si la columna existe)
    if (user.rows[0].email_verified === false) {
      return res.status(403).json({
        message: "Debes confirmar tu correo antes de entrar. Revisa tu bandeja o pide reenvío.",
        needsVerification: true
      });
    }

    // Crear token (el rol va firmado dentro: el Master lo verifica sin BD)
    const token = jwt.sign(
      { id: user.rows[0].id, rol: user.rows[0].rol || "alumno" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        rol: user.rows[0].rol || "alumno"
      }
    });

  } catch (error) {

    console.error("Error en login:", error);

    res.status(500).json({
      message: "Error en el servidor"
    });

  }
};
