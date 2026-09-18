const pool = require('../db/conexion');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const result = await pool.query(
<<<<<<< HEAD
      `SELECT nombre, primer_apellido, segundo_apellido,
=======
      `SELECT nombres, primer_apellido, segundo_apellido,
>>>>>>> 416baaf497d1c56124981100d6c4244b708402fa
       fecha_nacimiento, email, institucion, avatar
       FROM usuarios WHERE id=$1`,
      [userId]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};


exports.updateProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const {
      nombre,
      nombres,
      primerApellido,
      segundoApellido,
      fechaNacimiento,
      avatar
    } = req.body;

<<<<<<< HEAD
    const nombreFinal = nombre || nombres;

=======
>>>>>>> 416baaf497d1c56124981100d6c4244b708402fa
    if (avatar !== undefined) {
      await pool.query(
        `UPDATE usuarios SET avatar=$1 WHERE id=$2`,
        [avatar, userId]
      );
    }

<<<<<<< HEAD
    if (nombreFinal !== undefined) {
      await pool.query(
        `UPDATE usuarios
         SET nombre=$1,
=======
    if (nombres !== undefined) {
      await pool.query(
        `UPDATE usuarios
         SET nombres=$1,
>>>>>>> 416baaf497d1c56124981100d6c4244b708402fa
         primer_apellido=$2,
         segundo_apellido=$3,
         fecha_nacimiento=$4
         WHERE id=$5`,
<<<<<<< HEAD
        [nombreFinal, primerApellido, segundoApellido, fechaNacimiento, userId]
=======
        [nombres, primerApellido, segundoApellido, fechaNacimiento, userId]
>>>>>>> 416baaf497d1c56124981100d6c4244b708402fa
      );
    }

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