const express = require('express');
const controller = require('../controllers/authController');
const authenticateUser = require('../middleware/authenticateUser');

const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authenticateUser, controller.me);
router.put('/change-password', authenticateUser, controller.changePassword);

module.exports = router;
