const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/toggle', authMiddleware, favoriteController.toggleFavorite);
router.get('/', authMiddleware, favoriteController.getUserFavorites);

module.exports = router;