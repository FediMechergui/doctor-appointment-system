const fileModel = require('../models/fileModel');
const path = require('path');
const fs = require('fs');

exports.upload = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const { filename, mimetype } = req.file;
    const chemin_fichier = `/uploads/${patient_id}/${filename}`;
    await fileModel.add({
      patient_id,
      nom_fichier: filename,
      chemin_fichier,
      type_fichier: mimetype
    });
    res.status(201).json({ message: 'Fichier uploadé.', filename });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err });
  }
};

exports.listByPatient = async (req, res) => {
  try {
    const files = await fileModel.getByPatient(req.params.patient_id);
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err });
  }
};

// List all medical files across patients
exports.listAll = async (req, res) => {
  try {
    const files = await fileModel.getAll();
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err });
  }
};

exports.rename = async (req, res) => {
  const { nouveau_nom } = req.body;
  try {
    const file = await fileModel.getById(req.params.file_id);
    if (!file) return res.status(404).json({ message: 'Fichier non trouvé.' });
    const oldPath = path.join(__dirname, '..', file.chemin_fichier);
    const newFilename = Date.now() + '-' + nouveau_nom.replace(/\s+/g, '_');
    const newPath = path.join(__dirname, '..', process.env.UPLOADS_DIR || 'uploads', newFilename);
    fs.renameSync(oldPath, newPath);
    await fileModel.rename(req.params.file_id, newFilename, `/uploads/${newFilename}`);
    res.json({ message: 'Fichier renommé.', newFilename });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err });
  }
};
