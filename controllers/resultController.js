const pool = require('../db/conexion');

exports.getResults = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT * FROM resultados WHERE usuarios_id=$1",
      [userId]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};