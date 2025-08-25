const db = require('../config/db');

module.exports = {
  async add({
    patient_id,
    nom_fichier,
    chemin_fichier,
    type_fichier,
    doctor_id,
  }) {
    const [result] = await db.query(
      "INSERT INTO medical_files (patient_id, nom_fichier, chemin_fichier, type_fichier, doctor_id) VALUES (?, ?, ?, ?, ?)",
      [patient_id, nom_fichier, chemin_fichier, type_fichier, doctor_id]
    );
    return result.insertId;
  },
  async getByPatient(patient_id, doctor_id) {
    const [rows] = await db.query(
      "SELECT * FROM medical_files WHERE patient_id = ? AND doctor_id = ?",
      [patient_id, doctor_id]
    );
    return rows;
  },
  async rename(file_id, nouveau_nom, newPath) {
    await db.query(
      "UPDATE medical_files SET nom_fichier=?, chemin_fichier=? WHERE id=?",
      [nouveau_nom, newPath, file_id]
    );
  },
  async getById(file_id, doctor_id) {
    const [rows] = await db.query(
      "SELECT * FROM medical_files WHERE id = ? AND doctor_id = ?",
      [file_id, doctor_id]
    );
    return rows[0];
  },
  // Fetch all medical files
  async getAllByDoctor(doctor_id) {
    const [rows] = await db.query(
      "SELECT * FROM medical_files WHERE doctor_id = ?",
      [doctor_id]
    );
    return rows;
  },
  async delete(file_id, doctor_id) {
    await db.query("DELETE FROM medical_files WHERE id = ? AND doctor_id = ?", [
      file_id,
      doctor_id,
    ]);
  },
  async deleteByFilename(nom_fichier, doctor_id) {
    await db.query(
      "DELETE FROM medical_files WHERE nom_fichier = ? AND doctor_id = ?",
      [nom_fichier, doctor_id]
    );
  },
};
