const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/profile', authMiddleware, userController.getUserProfile);

router.put('/profile', authMiddleware, userController.editUserProfile);

module.exports = router;