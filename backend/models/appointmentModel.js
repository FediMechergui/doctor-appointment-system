const db = require('../config/db');

module.exports = {
  async getAllByDoctor(doctorId) {
    const [rows] = await db.query(
      'SELECT a.*, p.nom AS patient_nom, p.prenom AS patient_prenom FROM appointments a JOIN patients p ON a.patient_id = p.id WHERE a.doctor_id = ? ORDER BY a.date_rdv',
      [doctorId]
    );
    return rows;
  },
  async create({ doctor_id, patient_id, date_rdv, motif, statut, note }) {
    const [result] = await db.query(
      'INSERT INTO appointments (doctor_id, patient_id, date_rdv, motif, statut, note) VALUES (?, ?, ?, ?, ?, ?)',
      [doctor_id, patient_id, date_rdv, motif, statut, note]
    );
    return result.insertId;
  },
  async update(id, doctorId, { date_rdv, motif, statut, note }) {
    await db.query(
      'UPDATE appointments SET date_rdv=?, motif=?, statut=?, note=? WHERE id=? AND doctor_id=?',
      [date_rdv, motif, statut, note, id, doctorId]
    );
  },
  async delete(id, doctorId) {
    await db.query('DELETE FROM appointments WHERE id=? AND doctor_id=?', [id, doctorId]);
  }
};
