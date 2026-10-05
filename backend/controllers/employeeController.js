const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const User = require('../models/User');
const Leave = require('../models/Leave');

function validateEmployee(data, isCreating = true) {
  const required = ['employeeId', 'name', 'email', 'phone', 'department', 'designation', 'joiningDate'];

  if (isCreating) {
    for (const field of required) {
      if (!data[field]) return `${field} is required`;
    }
  }

  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) return 'Please enter a valid email';
  if (data.phone && !/^[0-9+()\- ]{7,20}$/.test(data.phone)) return 'Please enter a valid phone number';
  if (data.joiningDate && Number.isNaN(new Date(data.joiningDate).getTime())) return 'Invalid joining date';
  if (data.status && !Employee.STATUSES.includes(data.status)) return 'Invalid status';

  return null;
}

exports.getEmployees = async (req, res) => {
  try {
    const { search, department, status } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const query = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { employeeId: regex },
        { email: regex },
        { designation: regex }
      ];
    }

    if (department) query.department = department;
    if (status) query.status = status;

    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Employee.countDocuments(query);

    res.json({
      employees,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Could not load employees' });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Employee.distinct('department');
    res.json({ departments });
  } catch (error) {
    res.status(500).json({ message: 'Could not load departments' });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const errorMessage = validateEmployee(req.body);
    if (errorMessage) return res.status(400).json({ message: errorMessage });

    const { password, ...employeeData } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password is required and must be at least 8 characters' });
    }

    const existingEmployee = await Employee.findOne({
      $or: [{ employeeId: employeeData.employeeId }, { email: employeeData.email.toLowerCase() }]
    });

    if (existingEmployee) {
      return res.status(409).json({ message: 'Employee ID or email already exists' });
    }

    const employee = await Employee.create({
      ...employeeData,
      email: employeeData.email.toLowerCase()
    });

    try {
      await User.create({
        name: employee.name,
        email: employee.email,
        password: await bcrypt.hash(password, 10),
        role: 'employee',
        employee: employee._id
      });
    } catch (userError) {
      // If account creation fails, remove the employee too.
      await Employee.deleteOne({ _id: employee._id });
      throw userError;
    }

    res.status(201).json({ message: 'Employee created successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Could not create employee' });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const errorMessage = validateEmployee(req.body, false);
    if (errorMessage) return res.status(400).json({ message: errorMessage });

    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    Object.assign(employee, req.body);
    employee.email = employee.email.toLowerCase();
    await employee.save();

    const user = await User.findOne({ employee: employee._id });
    if (user) {
      user.name = employee.name;
      user.email = employee.email;
      await user.save();
    }

    res.json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Email or employee ID already exists' });
    res.status(500).json({ message: 'Could not update employee' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    await Leave.deleteMany({ employee: employee._id });
    await User.deleteOne({ employee: employee._id });
    await Employee.deleteOne({ _id: employee._id });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete employee' });
  }
};
