const patientModel = require('../models/patientModel');

exports.getAll = async (req, res) => {
  try {
    const patients = await patientModel.getAllByDoctor(req.user.id);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur.", error: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const patient = await patientModel.getById(req.params.id, req.user.id);
    if (!patient)
      return res.status(404).json({ message: "Patient non trouvé." });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur.", error: err });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await patientModel.create(req.body, req.user.id);
    res.status(201).json({ id, message: "Patient ajouté." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur.", error: err });
  }
};

exports.update = async (req, res) => {
  try {
    await patientModel.update(req.params.id, req.user.id, req.body);
    res.json({ message: "Patient mis à jour." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur.", error: err });
  }
};

exports.delete = async (req, res) => {
  try {
    await patientModel.delete(req.params.id, req.user.id);
    res.json({ message: "Patient supprimé." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur.", error: err });
  }
};
