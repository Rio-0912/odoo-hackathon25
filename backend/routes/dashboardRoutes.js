const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/kpis', dashboardController.getKPIs);
router.get('/recent', dashboardController.getRecentActivity);

module.exports = router;
