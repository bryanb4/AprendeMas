const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
const resultController = require('../controllers/resultController');
const profileController = require('../controllers/profileController');

// Middleware
const authMiddleware = require('../middleware/authMiddleware');


// -------- AUTH --------
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/verify/:token', authController.verifyEmail);
router.get('/verify', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);


// -------- PERFIL --------
router.get('/profile', authMiddleware, profileController.getProfile);
router.put('/profile', authMiddleware, profileController.updateProfile);
router.put('/profile/password', authMiddleware, profileController.changePassword);


// -------- RESULTADOS --------
router.get('/resultados', authMiddleware, resultController.getResults);


module.exports = router;