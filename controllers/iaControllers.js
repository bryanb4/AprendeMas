const { getAIResponse } = require('../services/iaService');
const pool = require('../db/conexion');

const getResponse = async (req, res) => {
    try {
        const { subject, topic, level } = req.body;

        const data = await getAIResponse({ subject, topic, level });

        res.json(data);
    } catch (error) {
        console.error('Error getting AI response: ', error);
        res.status(500).json({ error: 'Error getting AI response' });
    }
};

const saveQuestion = async (req, res) => {
    try{
        const {
            materia_solicitada,
            tema_solicitado,
            nivel_solicitado,
            status,
            pregunta,
            opciones,
            respuesta_correcta,
            explicacion
            } = req.body;

        const newQuestion = await pool.query(
            `
            INSERT INTO questions (materia_id, temas_id, content, options, correct_option, explanation, rating, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [materia_solicitada, tema_solicitado, pregunta, JSON.stringify(opciones), respuesta_correcta, explicacion, nivel_solicitado, status]
        )
        return res.status(200).json({
        message: "Pregunta registrada con exito"
      });
    }catch(error){
        res.status(500).json ({error : error.message})
    }
    


}
module.exports = { getResponse, saveQuestion};