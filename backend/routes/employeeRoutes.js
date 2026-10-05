const express = require('express');
const mongoose = require('mongoose');
const controller = require('../controllers/employeeController');
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();
router.use(authenticateUser);

function checkId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid employee ID' });
  }
  next();
}

router.get('/', controller.getEmployees);
router.get('/meta/departments', controller.getDepartments);
router.post('/', authorizeRole('admin'), controller.createEmployee);
router.put('/:id', authorizeRole('admin'), checkId, controller.updateEmployee);
router.delete('/:id', authorizeRole('admin'), checkId, controller.deleteEmployee);

module.exports = router;
