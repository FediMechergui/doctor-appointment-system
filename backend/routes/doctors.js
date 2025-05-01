const express = require('express');
const auth = require('../middleware/auth');
const doctorController = require('../controllers/doctorController');

const router = express.Router();

router.get('/me', auth, doctorController.getProfile);

module.exports = router;
