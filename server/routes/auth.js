const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Felhasználó regisztráció
router.post('/register', authController.register);

// Felhasználó bejelentkezés
router.post('/login', authController.login);

// Aktuális felhasználó adatainak lekérése
router.get('/user', verifyToken, authController.getCurrentUser);

module.exports = router;
