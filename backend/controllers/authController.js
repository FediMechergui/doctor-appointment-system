const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const doctorModel = require('../models/doctorModel');

exports.register = async (req, res) => {
  const { nom, prenom, email, mot_de_passe } = req.body;
  try {
    const existing = await doctorModel.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé.' });
    const hash = await bcrypt.hash(mot_de_passe, 10);
    await doctorModel.create({ nom, prenom, email, mot_de_passe: hash });
    res.status(201).json({ message: 'Inscription réussie.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err });
  }
};

exports.login = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  try {
    const doctor = await doctorModel.findByEmail(email);
    if (!doctor) return res.status(401).json({ message: 'Identifiants invalides.' });
    const match = await bcrypt.compare(mot_de_passe, doctor.mot_de_passe);
    if (!match) return res.status(401).json({ message: 'Identifiants invalides.' });
    const token = jwt.sign({ id: doctor.id, email: doctor.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    res.json({ token, doctor: { id: doctor.id, nom: doctor.nom, prenom: doctor.prenom, email: doctor.email } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err });
  }
};
