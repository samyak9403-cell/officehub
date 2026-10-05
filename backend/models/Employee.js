const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  designation: {
    type: String,
    required: true
  },

  joiningDate: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
