const pool = require('../db/conexion');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT nombre, primer_apellido, segundo_apellido,
       fecha_nacimiento, email, institucion
       FROM usuarios WHERE id=$1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Recibimos 'nombres' desde React y lo desestructuramos
    const {
      nombre,
      primerApellido,
      segundoApellido,
      fechaNacimiento
    } = req.body;

    // Ejecutamos UPDATE mapeando a la columna 'nombre' de Postgres
    await pool.query(
      `UPDATE usuarios 
       SET nombre=$1,
       primer_apellido=$2,
       segundo_apellido=$3,
       fecha_nacimiento=$4
       WHERE id=$5`,
      [nombre, primerApellido, segundoApellido, fechaNacimiento, userId]
    );

    res.json({ message: "Perfil actualizado correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { passwordActual, passwordNueva } = req.body;

    const result = await pool.query(
      "SELECT password FROM usuarios WHERE id=$1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const valid = await bcrypt.compare(passwordActual, result.rows[0].password);

    if (!valid) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    const hashedPassword = await bcrypt.hash(passwordNueva, 10);

    await pool.query(
      "UPDATE usuarios SET password=$1 WHERE id=$2",
      [hashedPassword, userId]
    );

    res.json({ message: "Contraseña actualizada correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};