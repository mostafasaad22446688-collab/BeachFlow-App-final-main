const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middleware/auth.middleware'); 

router.get('/my-notifications', authMiddleware, notificationController.getUserNotifications);

module.exports = router;