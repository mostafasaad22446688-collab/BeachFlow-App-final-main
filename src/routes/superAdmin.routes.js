const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const isSuperAdmin = require("../middleware/superAdmin.middleware");
const superAdminController = require("../controllers/superAdmin.controller");

// لجلب الطلبات والإحصائيات
router.get("/super-requests", authMiddleware, isSuperAdmin, superAdminController.getPendingAdmins);

// لتنفيذ الموافقة أو الرفض
router.post("/super-action", authMiddleware, isSuperAdmin, superAdminController.handleAdminAction);

module.exports = router;