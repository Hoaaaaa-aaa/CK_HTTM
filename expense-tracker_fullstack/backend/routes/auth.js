const express = require('express');
const router = express.Router();
const { register, login, forgotPassword } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

module.exports = router; 