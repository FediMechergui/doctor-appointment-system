const db = require('../config/db');

module.exports = {
  async getAllByDoctor(doctor_id) {
    const [rows] = await db.query(
      "SELECT * FROM patients WHERE doctor_id = ? ORDER BY nom, prenom",
      [doctor_id]
    );
    return rows;
  },
  async getById(id, doctor_id) {
    const [rows] = await db.query(
      "SELECT * FROM patients WHERE id = ? AND doctor_id = ?",
      [id, doctor_id]
    );
    return rows[0];
  },
  async create(patient, doctor_id) {
    const [result] = await db.query(
      "INSERT INTO patients (nom, prenom, date_naissance, sexe, telephone, email, adresse, allergies, maladies_chroniques, maladies_actuelles, antecedents_medicaux, medicaments_actuels, autres_notes, doctor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        patient.nom,
        patient.prenom,
        patient.date_naissance,
        patient.sexe,
        patient.telephone,
        patient.email,
        patient.adresse,
        patient.allergies,
        patient.maladies_chroniques,
        patient.maladies_actuelles,
        patient.antecedents_medicaux,
        patient.medicaments_actuels,
        patient.autres_notes,
        doctor_id,
      ]
    );
    return result.insertId;
  },
  async update(id, doctor_id, patient) {
    await db.query(
      "UPDATE patients SET nom=?, prenom=?, date_naissance=?, sexe=?, telephone=?, email=?, adresse=?, allergies=?, maladies_chroniques=?, maladies_actuelles=?, antecedents_medicaux=?, medicaments_actuels=?, autres_notes=? WHERE id=? AND doctor_id=?",
      [
        patient.nom,
        patient.prenom,
        patient.date_naissance,
        patient.sexe,
        patient.telephone,
        patient.email,
        patient.adresse,
        patient.allergies,
        patient.maladies_chroniques,
        patient.maladies_actuelles,
        patient.antecedents_medicaux,
        patient.medicaments_actuels,
        patient.autres_notes,
        id,
        doctor_id,
      ]
    );
  },
  async delete(id, doctor_id) {
    await db.query("DELETE FROM patients WHERE id = ? AND doctor_id = ?", [
      id,
      doctor_id,
    ]);
  },
};
