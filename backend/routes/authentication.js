const express = require('express');
const router = express.Router();

const { registerUser, authUser,googleAuth, recover, resetPassword,reset, profile, logout} = require('../controllers/authentication');
const {nasdaq, stockSearch, addToWatchList, createWatchList, appendWatchlist } = require('../stock/screener');
const  {getUserWatchlist, getList, deleteWatchList, deleteFromWatchlist } = require('../stock/watchlist');
const news = require('../stock/news');
const {SearchObj, SearchArray} = require('../stock/stock');
const {subscribe, cancel, success } = require('../controllers/paypal');
const {createPortfolio, myPortfolios, viewPortfolio, addToPortfolio, renamePortfolio, deletePortfolio} = require('../stock/portfolio')

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
router.route('/stock/search').post(stockSearch);
router.route('/my_watchlists').get(getUserWatchlist);
router.route('/create_watchlist').post(createWatchList);
router.route('/get_list/').post(getList);
router.route('/home/news').get(news);
router.route('/watchlist/delete').post(deleteWatchList);
router.route('/search').post(SearchObj);
router.route('/search/array').post(SearchArray);
router.route('/create/portfolio').post(createPortfolio)
router.route('/portfolios').get(myPortfolios);
router.route('/portfolios/view').post(viewPortfolio);
router.route('/portfolios/add').post(addToPortfolio);
router.route('/renamePortfolio').post(renamePortfolio);
router.route('/deletePortfolio').post(deletePortfolio)
router.route('/delete_from_list').post(deleteFromWatchlist);
router.route('/watchlist/update').post(appendWatchlist);
//google auth
router.route('/google-auth').get(googleAuth);
router.route('/subscribe/paypal').post(subscribe);
router.route('/cancel').get(cancel);
router.route('/success').get(success);


module.exports = router;
