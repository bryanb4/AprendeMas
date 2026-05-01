const pool = require('../db/conexion');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
      password
    } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message: "El correo ya está registrado"
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const newUser = await pool.query(
      `INSERT INTO usuarios
      (nombre, primer_apellido, segundo_apellido, fecha_nacimiento, institucion, email, password)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id, email`,
      [
        nombre,
        primerApellido,
        segundoApellido,
        fechaNacimiento,
        institucion,
        email,
        hashedPassword
      ]
    );

    // Crear token
    const token = jwt.sign(
      { id: newUser.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
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

    // Crear token
    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email
      }
    });

  } catch (error) {

    console.error("Error en login:", error);

    res.status(500).json({
      message: "Error en el servidor"
    });

  }
};