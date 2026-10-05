require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const authenticateUser = require('./middleware/authenticateUser');
const dashboardController = require('./controllers/dashboardController');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.get('/api/dashboard/stats', authenticateUser, dashboardController.getStats);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err.code === 11000) {
    return res.status(409).json({ message: 'A record with this value already exists' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: 'Something went wrong on the server' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    console.log('Please add MONGODB_URI and JWT_SECRET to backend/.env');
    process.exit(1);
  }

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Database connection failed:', error.message);
    });
}

module.exports = app;
