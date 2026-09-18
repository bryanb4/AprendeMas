// Requiere authMiddleware antes: usa req.user.id
const pool = require("../db/conexion");

module.exports = async (req, res, next) => {
  try {
    const r = await pool.query("SELECT rol FROM usuarios WHERE id=$1", [req.user.id]);
    if (r.rows.length === 0 || r.rows[0].rol !== "admin") {
      return res.status(403).json({ message: "Se requiere rol administrador" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error verificando rol" });
  }
};
