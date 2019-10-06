const express = require('express');
const router = express.Router();

const usersController = require('../controllers/details_controller');

router.get('/', usersController.details);

module.exports = router;