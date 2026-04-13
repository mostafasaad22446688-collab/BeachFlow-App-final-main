const express = require("express");
const router = express.Router();
const { 
    getAll, getOne, addBeach, updateBeach, deleteBeach, getSearch, getMyBeaches , getTopRatedBeaches
} = require("../controllers/beach.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");


router.get("/", getAll);
router.get("/search", getSearch);
router.get('/top-rated', getTopRatedBeaches);
router.get("/my-beaches", authMiddleware, adminMiddleware, getMyBeaches);
router.post("/", authMiddleware, adminMiddleware, addBeach);
router.put("/:id", authMiddleware, adminMiddleware, updateBeach);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBeach);
router.get("/:id", getOne);


module.exports = router;