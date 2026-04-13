const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/add", authMiddleware, reviewController.addReview);
module.exports = router;
