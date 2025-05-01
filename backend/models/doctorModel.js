const db = require('../config/db');

module.exports = {
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM doctors WHERE email = ?', [email]);
    return rows[0];
  },
  async create({ nom, prenom, email, mot_de_passe }) {
    const [result] = await db.query('INSERT INTO doctors (nom, prenom, email, mot_de_passe) VALUES (?, ?, ?, ?)', [nom, prenom, email, mot_de_passe]);
    return result.insertId;
  },
  async findById(id) {
    const [rows] = await db.query('SELECT id, nom, prenom, email FROM doctors WHERE id = ?', [id]);
    return rows[0];
  }
};
