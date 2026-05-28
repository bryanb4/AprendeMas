const express = require('express');
const router = express.Router();

const { getResponse, saveQuestion, primeras3Preguntas, obtenerPreguntas, editarPregunta} = require('../controllers/iaControllers');

router.post('/generate', getResponse);
router.post('/guardarPregunta', saveQuestion);

router.get('/primerasPreguntas', primeras3Preguntas);
router.get('/preguntasObtener', obtenerPreguntas);

router.patch('/:id', editarPregunta);


module.exports = router;