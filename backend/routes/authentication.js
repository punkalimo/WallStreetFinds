const express = require('express');
const router = express.Router();

const { registerUser, authUser, recover, resetPassword,reset, profile, checkToken, logout} = require('../controllers/authentication');
const {nasdaq, stockSearch, addToWatchList } = require('../stock/screener')
router.route('/signup').post(registerUser);
router.route('/login').post(authUser);
router.route('/recover').post(recover);
router.get('/reset/:token', reset)
router.post('/reset/:token', resetPassword)
router.route('/reset/:token:').post(reset)
router.route('/reset/:token:').get(reset)
router.get('/screener', nasdaq)
router.route('/screener').post(stockSearch)
router.route('/profile').get(profile);
router.route('/logout').get(logout);
router.route('/addwatchlist').post(addToWatchList)


module.exports = router;