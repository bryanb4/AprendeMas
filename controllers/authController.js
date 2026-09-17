const pool = require('../db/conexion');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transporter = require('./verificacion/mailer');


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
    // Verificar si ya existe para verificar usuario
const pendingUserExists = await pool.query(
  "SELECT * FROM usuarios_pendientes WHERE email = $1",
  [email]
);

if (pendingUserExists.rows.length > 0) {
  return res.status(400).json({
    message: "Ya existe una solicitud pendiente para este correo"
  });
}
    

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario_pendiente
    const verificationToken =
      crypto.randomBytes(32).toString('hex');

    await pool.query(
    `
    INSERT INTO usuarios_pendientes
    (
     nombre,
     primer_apellido,
     segundo_apellido,
     fecha_nacimiento,
     institucion,
     email,
     password,
     verification_token
    )
    VALUES($1,$2,$3,$4,$5,$6,$7,$8)
    `,
    [
     nombre,
     primerApellido,
     segundoApellido,
     fechaNacimiento,
     institucion,
     email,
     hashedPassword,
     verificationToken
]
);

    // Enviar correo
    const verificationLink =
    `http://localhost:5000/api/auth/verify/${verificationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verifica tu cuenta',
      html: `
        <h2>Bienvenido</h2>
        <p>Da clic para verificar tu cuenta:</p>
        <a href="${verificationLink}"
           style="
             background:#005A9C;
             color:white;
             padding:10px 20px;
             text-decoration:none;
             border-radius:5px;">
             Verificar cuenta
        </a>`
});

    // Correo enviado
    res.status(200).json({
      message: "Se ha enviado un correo de verificación"
    });

  } catch (error) {

    console.error("Error en registro:", error);

    res.status(500).json({
      message: "Error al registrar usuario"
    });

  }

};



// Verificar mail y borrar el usuario pendiente
exports.verifyEmail = async (req, res) => {

    try {

        const { token } = req.params;

        const pendingUser = await pool.query(
            `SELECT *
             FROM usuarios_pendientes
             WHERE verification_token = $1`,
            [token]
        );

        if (pendingUser.rows.length === 0) {

            return res.status(400).send(
                "Token inválido o expirado"
            );

        }

        const user = pendingUser.rows[0];

        const existingUser = await pool.query(
          "SELECT id FROM usuarios WHERE email = $1",
          [user.email]
);

if (existingUser.rows.length > 0) {
  return res.status(400).send(
    "El usuario ya fue verificado"
  );
}

        // Crear usuario definitivo
        await pool.query(
        `
        INSERT INTO usuarios
        (
            nombre,
            primer_apellido,
            segundo_apellido,
            fecha_nacimiento,
            institucion,
            email,
            password
        )
        VALUES($1,$2,$3,$4,$5,$6,$7)
        `,
        [
            user.nombre,
            user.primer_apellido,
            user.segundo_apellido,
            user.fecha_nacimiento,
            user.institucion,
            user.email,
            user.password
        ]
        );

        // Eliminar registro temporal
        await pool.query(
            `DELETE FROM usuarios_pendientes
             WHERE id = $1`,
            [user.id]
        );

        res.send(`
            <h2>Correo verificado correctamente</h2>
            <p>Ya puedes iniciar sesión.</p>
        `);

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Error al verificar correo"
        );

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