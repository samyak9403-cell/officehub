const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

exports.getLeaves = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const query = {};

    if (req.user.role === 'employee') {
      query.employee = req.user.employee;
    }

    if (req.query.status) query.status = req.query.status;

    const leaves = await Leave.find(query)
      .populate('employee', 'employeeId name department')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Leave.countDocuments(query);

    res.json({ leaves, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) {
    res.status(500).json({ message: 'Could not load leave requests' });
  }
};

exports.createLeave = async (req, res) => {
  try {
    if (!req.user.employee) {
      return res.status(400).json({ message: 'Your account is not linked to an employee' });
    }

    const { type, fromDate, toDate, reason } = req.body;

    if (!type || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: 'All leave fields are required' });
    }

    if (!Leave.TYPES.includes(type)) {
      return res.status(400).json({ message: 'Invalid leave type' });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid leave dates' });
    }

    if (end < start) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    if (reason.trim().length < 3) {
      return res.status(400).json({ message: 'Reason must be at least 3 characters' });
    }

    const employee = await Employee.findById(req.user.employee);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const overlapping = await Leave.findOne({
      employee: employee._id,
      status: { $in: ['Pending', 'Approved'] },
      fromDate: { $lte: end },
      toDate: { $gte: start }
    });

    if (overlapping) {
      return res.status(409).json({ message: 'You already have a leave request for these dates' });
    }

    const leave = await Leave.create({
      employee: employee._id,
      employeeName: employee.name,
      type,
      fromDate: start,
      toDate: end,
      reason
    });

    res.status(201).json({ message: 'Leave request submitted', leave });
  } catch (error) {
    res.status(500).json({ message: 'Could not submit leave request' });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });

    if (leave.status !== 'Pending') {
      return res.status(409).json({ message: 'Only pending requests can be processed' });
    }

    leave.status = status;
    leave.reviewedBy = req.user.id;
    leave.reviewedAt = new Date();
    await leave.save();

    res.json({ message: `Leave ${status.toLowerCase()}`, leave });
  } catch (error) {
    res.status(500).json({ message: 'Could not update leave status' });
  }
};
