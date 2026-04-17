const express = require("express");
const router = express.Router();

const isSuperAdmin = require("../middleware/superAdmin.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const superAdminController = require("../controllers/superAdmin.controller");

router.get("/super-requests", authMiddleware, isSuperAdmin, superAdminController.getPendingAdmins);
router.post("/super-action", authMiddleware, isSuperAdmin, superAdminController.handleAdminAction);

module.exports = router;