require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

async function createAdmin() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Please set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env');
  }

  if (ADMIN_PASSWORD.length < 8) {
    throw new Error('Admin password must be at least 8 characters');
  }

  await connectDB();

  const existingUser = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existingUser) throw new Error('An account with this email already exists');

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL.toLowerCase(),
    password: hashedPassword,
    role: 'admin'
  });

  console.log('Admin created successfully');
}

createAdmin()
  .catch((error) => console.error(error.message))
  .finally(() => mongoose.disconnect());
