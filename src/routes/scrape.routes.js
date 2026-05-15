const express = require('express');
const router = express.Router();
const { scrapeLocal, scrapeUrl } = require('../controllers/scrape.controller');

router.get('/scrape/local', scrapeLocal);
router.get('/scrape', scrapeUrl);

module.exports = router;
