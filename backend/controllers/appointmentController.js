const appointmentModel = require('../models/appointmentModel');

exports.getAllByDoctor = async (req, res) => {
  try {
    const appointments = await appointmentModel.getAllByDoctor(req.user.id);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await appointmentModel.create({ doctor_id: req.user.id, ...req.body });
    res.status(201).json({ id, message: 'Rendez-vous ajouté.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err });
  }
};

exports.update = async (req, res) => {
  try {
    await appointmentModel.update(req.params.id, req.user.id, req.body);
    res.json({ message: 'Rendez-vous mis à jour.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err });
  }
};

exports.delete = async (req, res) => {
  try {
    await appointmentModel.delete(req.params.id, req.user.id);
    res.json({ message: 'Rendez-vous supprimé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err });
  }
};
