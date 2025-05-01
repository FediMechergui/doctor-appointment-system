const express = require('express');
const auth = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

router.get('/', auth, appointmentController.getAllByDoctor);
router.post('/', auth, appointmentController.create);
router.put('/:id', auth, appointmentController.update);
router.delete('/:id', auth, appointmentController.delete);

module.exports = router;
