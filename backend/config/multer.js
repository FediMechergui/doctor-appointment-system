const multer = require('multer');
const path = require('path');
require('dotenv').config();
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const patientId = req.params.patient_id;
    const dir = path.join(__dirname, '..', process.env.UPLOADS_DIR || 'uploads', patientId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const customName = req.body.nom_fichier || file.originalname;
    cb(null, customName.replace(/\s+/g, '_'));
  }
});

const upload = multer({ storage });

module.exports = upload;
