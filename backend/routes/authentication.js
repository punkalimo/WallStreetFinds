const express = require('express');
const router = express.Router();

const { registerUser, authUser } = require('../controllers/authentication');
router.route('/signup').post(registerUser);
router.route('/login').post(authUser);

module.exports = router;