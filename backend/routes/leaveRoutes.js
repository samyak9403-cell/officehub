const express = require('express');
const mongoose = require('mongoose');
const controller = require('../controllers/leaveController');
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();
router.use(authenticateUser);

function checkId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid leave ID' });
  }
  next();
}

router.get('/', controller.getLeaves);
router.post('/', controller.createLeave);
router.patch('/:id/status', authorizeRole('admin'), checkId, controller.updateLeaveStatus);

module.exports = router;
