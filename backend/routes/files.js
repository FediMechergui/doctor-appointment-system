const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../config/multer');
const fileController = require('../controllers/fileController');

const router = express.Router();

// Create a file for a patient
router.post('/:patient_id', auth, upload.single('file'), fileController.upload);
// List all files across patients
router.get('/', auth, fileController.listAll);
// List files for a single patient
router.get('/:patient_id', auth, fileController.listByPatient);
router.put('/rename/:file_id', auth, fileController.rename);

module.exports = router;
