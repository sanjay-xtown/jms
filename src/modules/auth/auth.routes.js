const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authMiddleware = require('../../shared/middleware/auth.middleware');

const { validateRegister, validateLogin } = require('./auth.validation');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected Routes
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
