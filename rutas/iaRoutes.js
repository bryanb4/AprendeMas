const express = require('express');
const router = express.Router();

const { getResponse } = require('../controllers/iaControllers');

router.post('/generate', getResponse);

module.exports = router;