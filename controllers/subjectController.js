const pool = require('../db/conexion');

exports.getSubjects = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM materias");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopics = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM temas WHERE materia_id=$1",
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};