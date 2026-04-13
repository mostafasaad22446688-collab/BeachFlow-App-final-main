const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

router.get("/test", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized!",
    user: req.user
  });
});

module.exports = router;