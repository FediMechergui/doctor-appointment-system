const db = require('../config/db');

module.exports = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM patients ORDER BY nom, prenom');
    return rows;
  },
  async getById(id) {
    const [rows] = await db.query('SELECT * FROM patients WHERE id = ?', [id]);
    return rows[0];
  },
  async create(patient) {
    const [result] = await db.query(
      'INSERT INTO patients (nom, prenom, date_naissance, sexe, telephone, email, adresse, allergies, maladies_chroniques, maladies_actuelles, antecedents_medicaux, medicaments_actuels, autres_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [patient.nom, patient.prenom, patient.date_naissance, patient.sexe, patient.telephone, patient.email, patient.adresse, patient.allergies, patient.maladies_chroniques, patient.maladies_actuelles, patient.antecedents_medicaux, patient.medicaments_actuels, patient.autres_notes]
    );
    return result.insertId;
  },
  async update(id, patient) {
    await db.query(
      'UPDATE patients SET nom=?, prenom=?, date_naissance=?, sexe=?, telephone=?, email=?, adresse=?, allergies=?, maladies_chroniques=?, maladies_actuelles=?, antecedents_medicaux=?, medicaments_actuels=?, autres_notes=? WHERE id=?',
      [patient.nom, patient.prenom, patient.date_naissance, patient.sexe, patient.telephone, patient.email, patient.adresse, patient.allergies, patient.maladies_chroniques, patient.maladies_actuelles, patient.antecedents_medicaux, patient.medicaments_actuels, patient.autres_notes, id]
    );
  },
  async delete(id) {
    await db.query('DELETE FROM patients WHERE id = ?', [id]);
  }
};
