const db = require('../config/db');

module.exports = {
  async getByPatient(patient_id) {
    const [rows] = await db.query('SELECT * FROM ordonnances WHERE patient_id = ? ORDER BY date_ajout DESC', [patient_id]);
    return rows;
  },
  async add({ patient_id, contenu }) {
    const [result] = await db.query('INSERT INTO ordonnances (patient_id, contenu) VALUES (?, ?)', [patient_id, contenu]);
    return result.insertId;
  }
};
