const express = require('express');
const router = express.Router();

const { registerUser, authUser, recover, resetPassword,reset } = require('../controllers/authentication');
router.route('/signup').post(registerUser);
router.route('/login').post(authUser);
router.route('/recover').post(recover);
router.get('/reset/:token', reset)
router.post('/reset/:token', resetPassword)
router.route('/reset/:token:').post(reset)
router.route('/reset/:token:').get(reset)


module.exports = router;