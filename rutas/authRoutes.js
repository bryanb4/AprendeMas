const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
const resultController = require('../controllers/resultController');
const subjectController = require('../controllers/subjectController');
const profileController = require('../controllers/profileController');

// Middleware
const authMiddleware = require('../middleware/authMiddleware');


// -------- AUTH --------
router.post('/login', authController.login);
router.post('/register', authController.register);


// -------- MATERIAS --------
router.get('/materias', subjectController.getSubjects);
router.get('/materias/:id/temas', subjectController.getTopics);


// -------- PERFIL --------
router.get('/profile', authMiddleware, profileController.getProfile);
router.put('/profile', authMiddleware, profileController.updateProfile);
router.put('/profile/password', authMiddleware, profileController.changePassword);


// -------- RESULTADOS --------
router.get('/resultados', resultController.getResults);


module.exports = router;