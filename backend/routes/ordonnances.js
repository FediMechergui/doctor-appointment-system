const express = require('express');
const auth = require('../middleware/auth');
const ordonnanceController = require('../controllers/ordonnanceController');

const router = express.Router();

router.get('/:patient_id', auth, ordonnanceController.getByPatient);
router.post('/:patient_id', auth, ordonnanceController.add);

module.exports = router;
