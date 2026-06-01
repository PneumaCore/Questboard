const express = require('express');
const router = express.Router();
const rawgController = require('../controllers/rawgController');

router.get('/search', rawgController.searchGames);
router.get('/games/:id', rawgController.getGameDetails);

module.exports = router;
