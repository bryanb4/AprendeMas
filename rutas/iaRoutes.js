const express = require('express');
const router = express.Router();

const { getResponse, saveQuestion, primeras3Preguntas} = require('../controllers/iaControllers');

router.post('/generate', getResponse);
router.post('/guardarPregunta', saveQuestion);

router.get('/primerasPreguntas', primeras3Preguntas);

module.exports = router;