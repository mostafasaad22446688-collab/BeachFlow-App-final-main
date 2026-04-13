const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/initiate", authMiddleware, paymentController.initiatePayment);
router.all("/webhook", paymentController.paymentWebhook);
module.exports = router;





