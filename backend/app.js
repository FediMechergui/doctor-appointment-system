require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const fileRoutes = require('./routes/files');
const ordonnanceRoutes = require('./routes/ordonnances');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static serving for uploaded files
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOADS_DIR || 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/ordonnances', ordonnanceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée.' });
});

const db = require('./config/db');

const PORT = process.env.PORT || 5000;
// Test database connection before starting the server
(async () => {
  try {
    await db.query('SELECT 1');
    app.listen(PORT, () => {
      console.log(`Serveur backend démarré sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
    process.exit(1);
  }
})();
