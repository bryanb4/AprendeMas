const pool = require('../db/conexion');

exports.getResults = async (req, res) => {
  const userId = req.user && req.user.id;

  if (!userId) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM resultados WHERE usuario_id=$1",
      [userId]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};