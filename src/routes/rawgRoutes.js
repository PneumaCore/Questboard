const express = require('express');
const router = express.Router();
const rawgController = require('../controllers/rawgController');

router.get('/search', rawgController.searchGames);

module.exports = router;
