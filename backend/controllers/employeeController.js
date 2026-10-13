const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const User = require('../models/User');
const Leave = require('../models/Leave');

// Keep these values consistent with your frontend and Employee model.
const EMPLOYEE_STATUSES = ['Active', 'Inactive', 'On Leave'];

// Validate employee data
function validateEmployee(data, isCreating = true) {
  const requiredFields = ['employeeId', 'name', 'email', 'phone', 'department', 'designation', 'joiningDate'];

  if (isCreating) {
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || String(data[field]).trim() === '') {
        return `${field} is required`;
      }
    }
  }

  if (data.email !== undefined && !/^\S+@\S+\.\S+$/.test(data.email)) {
    return 'Please enter a valid email';
  }

  if (data.phone !== undefined && !/^[0-9+()\- ]{7,20}$/.test(data.phone)) {
    return 'Please enter a valid phone number';
  }

  if (data.joiningDate !== undefined) {
    if (!data.joiningDate || Number.isNaN(new Date(data.joiningDate).getTime())) {
      return 'Invalid joining date';
    }
  }

  if (data.status !== undefined && !EMPLOYEE_STATUSES.includes(data.status)) {
    return 'Invalid status';
  }

  return null;
}

// Handle duplicate MongoDB values
function handleError(res, error, operation) {
  console.error(`${operation} error:`, error);

  if (error.code === 11000) {
    return res.status(409).json({
      message: 'Employee ID or email already exists'
    });
  }

  return res.status(500).json({
    message: `${operation} failed`,
    error: error.message
  });
}

// GET ALL EMPLOYEES
exports.getEmployees = async (req, res) => {
  try {
    const { search, department, status } = req.query;

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

    const query = {};

    if (search && search.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const regex = new RegExp(escapedSearch, 'i');

      query.$or = [{ name: regex }, { employeeId: regex }, { email: regex }, { designation: regex }];
    }

    if (department) {
      query.department = department;
    }

    if (status) {
      if (!EMPLOYEE_STATUSES.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status'
        });
      }

      query.status = status;
    }

    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Employee.countDocuments(query);

    return res.status(200).json({
      employees,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit))
    });
  } catch (error) {
    console.error('Get employees error:', error);

    return res.status(500).json({
      message: 'Could not load employees',
      error: error.message
    });
  }
};

// GET DEPARTMENTS
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Employee.distinct('department');

    return res.status(200).json({ departments });
  } catch (error) {
    console.error('Get departments error:', error);

    return res.status(500).json({
      message: 'Could not load departments',
      error: error.message
    });
  }
};

// CREATE EMPLOYEE
exports.createEmployee = async (req, res) => {
  let employee = null;

  try {
    const errorMessage = validateEmployee(req.body);

    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage
      });
    }

    const { employeeId, name, email, phone, department, designation, joiningDate, status, password } = req.body;

    // Validate password
    if (typeof password !== 'string' || password.trim().length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for an existing employee
    const existingEmployee = await Employee.findOne({
      $or: [{ employeeId: employeeId.trim() }, { email: normalizedEmail }]
    });

    if (existingEmployee) {
      return res.status(409).json({
        message: 'Employee ID or email already exists'
      });
    }

    // Check whether a user account already uses this email
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'A user account with this email already exists'
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee record
    employee = await Employee.create({
      employeeId: employeeId.trim(),
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      department: department.trim(),
      designation: designation.trim(),
      joiningDate: new Date(joiningDate),
      status: status || 'Active'
    });

    try {
      // Create the employee's login account
      await User.create({
        name: employee.name,
        email: employee.email,
        password: hashedPassword,
        role: 'employee',
        employee: employee._id
      });
    } catch (userError) {
      // Roll back the employee record if account creation fails
      await Employee.deleteOne({ _id: employee._id });

      employee = null;

      throw userError;
    }

    return res.status(201).json({
      message: 'Employee created successfully',
      employee
    });
  } catch (error) {
    console.error('Create employee error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Employee ID or email already exists'
      });
    }

    return res.status(500).json({
      message: 'Could not create employee',
      error: error.message
    });
  }
};

// UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
  try {
    const errorMessage = validateEmployee(req.body, false);

    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage
      });
    }

    // Prevent changing protected fields through this endpoint
    const allowedFields = ['employeeId', 'name', 'email', 'phone', 'department', 'designation', 'joiningDate', 'status'];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.email !== undefined) {
      updates.email = updates.email.trim().toLowerCase();
    }

    for (const field of ['employeeId', 'name', 'phone', 'department', 'designation']) {
      if (updates[field] !== undefined) {
        if (typeof updates[field] !== 'string' || !updates[field].trim()) {
          return res.status(400).json({
            message: `${field} cannot be empty`
          });
        }

        updates[field] = updates[field].trim();
      }
    }

    if (updates.joiningDate !== undefined) {
      updates.joiningDate = new Date(updates.joiningDate);
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: 'Employee not found'
      });
    }

    // Check whether another employee already uses the ID or email
    const duplicateConditions = [];

    if (updates.employeeId !== undefined) {
      duplicateConditions.push({
        employeeId: updates.employeeId
      });
    }

    if (updates.email !== undefined) {
      duplicateConditions.push({
        email: updates.email
      });
    }

    if (duplicateConditions.length > 0) {
      const duplicate = await Employee.findOne({
        _id: { $ne: employee._id },
        $or: duplicateConditions
      });

      if (duplicate) {
        return res.status(409).json({
          message: 'Employee ID or email already exists'
        });
      }
    }

    // Keep the employee's associated user account synchronized
    const user = await User.findOne({
      employee: employee._id
    });

    if (user && updates.email !== undefined) {
      const emailInUse = await User.findOne({
        email: updates.email,
        _id: { $ne: user._id }
      });

      if (emailInUse) {
        return res.status(409).json({
          message: 'A user account with this email already exists'
        });
      }
    }

    Object.assign(employee, updates);

    await employee.save();

    if (user) {
      if (updates.name !== undefined) {
        user.name = updates.name;
      }

      if (updates.email !== undefined) {
        user.email = updates.email;
      }

      await user.save();
    }

    return res.status(200).json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error('Update employee error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Employee ID or email already exists'
      });
    }

    return res.status(500).json({
      message: 'Could not update employee',
      error: error.message
    });
  }
};

// DELETE EMPLOYEE
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: 'Employee not found'
      });
    }

    // Delete related records
    await Leave.deleteMany({
      employee: employee._id
    });

    await User.deleteOne({
      employee: employee._id
    });

    await Employee.deleteOne({
      _id: employee._id
    });

    return res.status(200).json({
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);

    return res.status(500).json({
      message: 'Could not delete employee',
      error: error.message
    });
  }
};
