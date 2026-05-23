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

exports.setSubject = async(req, res) => {
  try{
    const {
      nombre,
      descripcion,
      icon
    } = req.body;

    const subjetExist = await pool.query(
      "SELECT * FROM materias WHERE nombre = $1",
      [nombre]
    );


    if (subjetExist.rows.length > 0) {
      return res.status(400).json({
        message: "Materia ya registrada"
      });
    }

    const newSubject = await pool.query(
      `INSERT INTO materias (nombre, descripcion, icon)
      VALUES ($1, $2, $3)
      `,      
      [nombre, descripcion, icon]
    );
  
    return res.status(200).json({
        message: "Materia registrada con exito"
      });

  } catch (error) {
    res.status(500).json ({error : error.message});
  }
}

exports.setTopic = async(req, res) => {
  try{
    const {
      materia_id,
      nombre
    } = req.body;

    const topicExist = await pool.query(
      "SELECT * FROM temas WHERE nombre = $1",
      [nombre]
    );


    if (topicExist.rows.length > 0) {
      return res.status(400).json({
        message: "Tema ya registrado"
      });
    }

    const materiaExist = await pool.query(
      "SELECT * FROM materias WHERE id = $1", 
      [materia_id]
    );

    if (materiaExist.rows.length == 0) {
      return res.status(400).json({
        message: "Materia no existe."
      });
    }

    const newTopic = await pool.query(
      `INSERT INTO temas (materia_id, nombre)
      VALUES ($1, $2)
      `,      
      [materia_id, nombre]
    );
  
    return res.status(200).json({
        message: "Tema registrado con exito"
      });

  } catch (error) {
    res.status(500).json ({error : error.message});
  }
}