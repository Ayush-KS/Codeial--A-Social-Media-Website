const express = require('express');
const router = express.Router();

const UsersAPI = require('../../../controllers/api/v1/users_api');
router.post('/create-session', UsersAPI.createSession);

module.exports = router;