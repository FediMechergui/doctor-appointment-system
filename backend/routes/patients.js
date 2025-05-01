const express = require('express');
const auth = require('../middleware/auth');
const patientController = require('../controllers/patientController');

const router = express.Router();

router.get('/', auth, patientController.getAll);
router.get('/:id', auth, patientController.getById);
router.post('/', auth, patientController.create);
router.put('/:id', auth, patientController.update);
router.delete('/:id', auth, patientController.delete);

module.exports = router;
