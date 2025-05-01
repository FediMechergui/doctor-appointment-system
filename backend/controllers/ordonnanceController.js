const ordonnanceModel = require('../models/ordonnanceModel');

exports.getByPatient = async (req, res) => {
  try {
    const ordonnances = await ordonnanceModel.getByPatient(req.params.patient_id);
    res.json(ordonnances);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err });
  }
};

exports.add = async (req, res) => {
  try {
    const id = await ordonnanceModel.add({ patient_id: req.params.patient_id, contenu: req.body.contenu });
    res.status(201).json({ id, message: 'Ordonnance ajoutée.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err });
  }
};
