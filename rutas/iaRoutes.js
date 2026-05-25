const express = require('express');
const router = express.Router();

const { getResponse, saveQuestion} = require('../controllers/iaControllers');

router.post('/generate', getResponse);
router.post('/guardarPregunta', saveQuestion);

module.exports = router;