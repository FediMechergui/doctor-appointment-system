const doctorModel = require('../models/doctorModel');

exports.getProfile = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.user.id);
    if (!doctor) return res.status(404).json({ message: 'Médecin non trouvé.' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err });
  }
};
