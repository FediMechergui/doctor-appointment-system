const db = require('../config/db');

module.exports = {
  async add({ patient_id, nom_fichier, chemin_fichier, type_fichier }) {
    const [result] = await db.query(
      'INSERT INTO medical_files (patient_id, nom_fichier, chemin_fichier, type_fichier) VALUES (?, ?, ?, ?)',
      [patient_id, nom_fichier, chemin_fichier, type_fichier]
    );
    return result.insertId;
  },
  async getByPatient(patient_id) {
    const [rows] = await db.query(
      'SELECT * FROM medical_files WHERE patient_id = ?',
      [patient_id]
    );
    return rows;
  },
  async rename(file_id, nouveau_nom, newPath) {
    await db.query('UPDATE medical_files SET nom_fichier=?, chemin_fichier=? WHERE id=?', [nouveau_nom, newPath, file_id]);
  },
  async getById(file_id) {
    const [rows] = await db.query('SELECT * FROM medical_files WHERE id = ?', [file_id]);
    return rows[0];
  },
  // Fetch all medical files
  async getAll() {
    const [rows] = await db.query('SELECT * FROM medical_files');
    return rows;
  }
};
