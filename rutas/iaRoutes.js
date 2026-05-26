const express = require('express');
const router = express.Router();

const { getResponse, saveQuestion, primeras3Preguntas, obtenerPreguntas} = require('../controllers/iaControllers');

router.post('/generate', getResponse);
router.post('/guardarPregunta', saveQuestion);

router.get('/primerasPreguntas', primeras3Preguntas);
router.get('/preguntasObtener', obtenerPreguntas);

module.exports = router;