const express = require("express");
const router = express.Router();
const superAdminController = require("../controllers/superAdmin.controller");
const { isAuth, isSuperAdmin } = require("../middleware/auth"); // تأكد من حماية المسارات

// لجلب الطلبات والإحصائيات
router.get("/super-requests", isAuth, isSuperAdmin, superAdminController.getPendingAdmins);

// لتنفيذ الموافقة أو الرفض
router.post("/super-action", isAuth, isSuperAdmin, superAdminController.handleAdminAction);

module.exports = router;