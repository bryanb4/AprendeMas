const express = require('express');
const router = express.Router();

const examenController = require('../controllers/examenController');
const authMiddleware = require('../middleware/authMiddleware');

// Todo el examen requiere sesión (para calificar y guardar historial)
router.get('/evaluacion', authMiddleware, examenController.obtenerEvaluacion);
router.post('/evaluacion/calificar', authMiddleware, examenController.calificarEvaluacion);
router.get('/progreso', authMiddleware, examenController.obtenerProgreso);
router.get('/historial', authMiddleware, examenController.obtenerHistorial);
router.get('/ejercicios', authMiddleware, examenController.obtenerEjercicios);
router.get('/simulacion', authMiddleware, examenController.obtenerSimulacion);
router.get('/simulacion/estado', authMiddleware, examenController.estadoSimulacion);
router.post('/simulacion/calificar', authMiddleware, examenController.calificarSimulacion);

module.exports = router;
