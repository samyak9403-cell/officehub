const Employee = require('../models/Employee');
const Leave = require('../models/Leave');

exports.getStats = async (req, res) => {
  try {
    const employees = await Employee.find();
    const leaves = await Leave.find();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let activeEmployees = 0;
    let inactiveEmployees = 0;
    let onLeaveEmployees = 0;

    for (const employee of employees) {
      if (employee.status === 'Inactive') inactiveEmployees++;
      else {
        const isOnApprovedLeave = leaves.some((leave) =>
          leave.employee.toString() === employee._id.toString() &&
          leave.status === 'Approved' &&
          new Date(leave.fromDate) <= today &&
          new Date(leave.toDate) >= today
        );

        if (employee.status === 'On Leave' || isOnApprovedLeave) onLeaveEmployees++;
        else activeEmployees++;
      }
    }

    const pendingLeaves = leaves.filter((leave) => leave.status === 'Pending').length;
    const approvedLeaves = leaves.filter((leave) => leave.status === 'Approved').length;
    const rejectedLeaves = leaves.filter((leave) => leave.status === 'Rejected').length;

    const departments = {};
    employees.forEach((employee) => {
      departments[employee.department] = (departments[employee.department] || 0) + 1;
    });

    const departmentBreakdown = Object.keys(departments)
      .map((department) => ({ department, count: departments[department] }))
      .sort((a, b) => b.count - a.count);

    res.json({
      stats: {
        totalEmployees: employees.length,
        activeEmployees,
        inactiveEmployees,
        onLeaveEmployees,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
        departmentBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Could not load dashboard' });
  }
};
