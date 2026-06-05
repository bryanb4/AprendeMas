const { getAIResponse } = require("../services/iaService");
const pool = require("../db/conexion");

const getResponse = async (req, res) => {
  try {
    const { subject, topic, level } = req.body;

    const data = await getAIResponse({ subject, topic, level });

    res.json(data);
  } catch (error) {
    console.error("Error getting AI response: ", error);
    res.status(500).json({ error: "Error getting AI response" });
  }
};

const editarPregunta = async (req, res) => {
  try {
    const { id } = req.params;

    const data = req.body;

    const updQuestion = await pool.query(
      `WITH updated_question AS (
        UPDATE questions q
        SET
          content = $1,
          explanation = $2,
          options = $3,
          status = 'approved'
        WHERE q.id = $4
        RETURNING *
      )

      SELECT 
        updated_question.*,
        temas.nombre AS tema_nombre,
        materias.nombre AS materia_nombre
      FROM updated_question
      JOIN temas 
        ON updated_question.temas_id = temas.id
      JOIN materias 
        ON updated_question.materia_id = materias.id;
        `,
        [data.content, data.explanation, JSON.stringify(data.options), id,],
    );
    return res.json(updQuestion.rows[0]);
  } catch (error) {
    console.error(error);
  }
};

const saveQuestion = async (req, res) => {
  try {
    const {
      materia_solicitada,
      tema_solicitado,
      nivel_solicitado,
      status,
      pregunta,
      opciones,
      respuesta_correcta,
      explicacion,
    } = req.body;

    const newQuestion = await pool.query(
      `
            INSERT INTO questions (materia_id, temas_id, content, options, correct_option, explanation, rating, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `,
      [
        materia_solicitada,
        tema_solicitado,
        pregunta,
        JSON.stringify(opciones),
        respuesta_correcta,
        explicacion,
        nivel_solicitado,
        status,
      ],
    );
    return res.status(200).json({
      message: "Pregunta registrada con exito",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const primeras3Preguntas = async (req, res) => {
  try {
    const result = await pool.query(`SELECT 
            q.id,
            q.temas_id,
            q.materia_id,
            t.nombre AS tema_nombre
            FROM questions q
            JOIN temas t ON q.temas_id = t.id
            WHERE q.status = 'pending_review'
            LIMIT 3;`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerPreguntas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        q.*, 
        t.nombre AS tema_nombre,
        materias.nombre AS materia_nombre
        FROM questions q
        JOIN temas t ON q.temas_id = t.id
        JOIN materias ON q.materia_id = materias.id
        Order by status desc, created_at asc;`,
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getResponse,
  saveQuestion,
  primeras3Preguntas,
  obtenerPreguntas,
  editarPregunta,
};
