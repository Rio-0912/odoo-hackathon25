const express = require('express');
const router = express.Router();
const operationController = require('../controllers/operationController');

router.post('/', operationController.createOperation);
router.get('/', operationController.getOperations);
router.get('/stock', operationController.getAllStock);
router.get('/stock/:id', operationController.getProductStock);
router.get('/:id', operationController.getOperationById);
router.patch('/:id/status', operationController.updateOperationStatus);

module.exports = router;
