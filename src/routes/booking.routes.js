const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, bookingController.createBooking);
router.get("/my-bookings", authMiddleware, bookingController.getUserBookings); 
router.get("/my-beach-bookings", authMiddleware, adminMiddleware, bookingController.getBeachBookings);
module.exports = router;

