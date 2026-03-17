import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js'; // This imports and tests your DB connection!
import appointmentRoutes from './routes/appointmentRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/appointments', appointmentRoutes); // Notice I tweaked this slightly for better organization!
app.use('/api/services', serviceRoutes);
// server/index.js
app.post('/api/appointments/lookup-email', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query("SELECT * FROM patients WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      return res.json({ exists: true, patient: result.rows[0] });
    }
    res.json({ exists: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ message: "Server is perfectly organized and running smoothly!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});