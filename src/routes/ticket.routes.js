const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
router.get("/:bookingId", authMiddleware, ticketController.generateTicket);
router.post('/verify-checkin', authMiddleware, adminMiddleware, ticketController.verifyAndCheckIn);
module.exports = router;