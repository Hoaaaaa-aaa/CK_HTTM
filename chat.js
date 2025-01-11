const express = require('express');
const router = express.Router();
const { processMessage, getAdvice } = require('../controllers/chat');


router.post('/process-message', processMessage);

// Route cho advice
router.post('/get-advice', getAdvice);

module.exports = router;