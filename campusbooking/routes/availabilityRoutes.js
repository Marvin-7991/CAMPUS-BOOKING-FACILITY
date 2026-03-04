const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

router.get('/', availabilityController.checkAvailability);

module.exports = router;
