const mongoose = require('mongoose');

const TYPES = ['Casual', 'Sick', 'Earned', 'Unpaid'];
const STATUSES = ['Pending', 'Approved', 'Rejected'];

const leaveSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    employeeName: { type: String, required: true },
    type: { type: String, enum: TYPES, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: STATUSES, default: 'Pending' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leave', leaveSchema);
