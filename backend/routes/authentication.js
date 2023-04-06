const express = require('express');
const router = express.Router();

const { registerUser, authUser,googleAuth, recover, resetPassword,reset, profile, logout} = require('../controllers/authentication');
const {nasdaq, stockSearch, addToWatchList, createWatchList, appendWatchlist } = require('../stock/screener');
const  {getUserWatchlist, getList, deleteWatchList, deleteFromWatchlist } = require('../stock/watchlist');
const {SearchObj, SearchArray} = require('../stock/stock');
const {subscribe, cancel, success } = require('../controllers/paypal');
const {createPortfolio, myPortfolios, viewPortfolio, addToPortfolio, renamePortfolio, deletePortfolio} = require('../stock/portfolio')
const { hostedCheckOut, stockData, currentRevenue,revenueGrowth, netProfitGrowth, sharesOutstanding, sharesOutstandingGrowthFraction, earningsPerShare, forwardPE, screener } = require('../controllers/calculator')
const news = require('../controllers/news');
const visaCheckout = require('../controllers/cybersource');

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
router.route('/news').get(news);
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
router.route('/revenue').post(currentRevenue);
router.route('/revenue_growth').post(revenueGrowth);
router.route('/net_profit').post(netProfitGrowth);
router.route('/shares_outstanding').post(sharesOutstanding);
router.route('/shares_outstanding_growth').post(sharesOutstandingGrowthFraction)
router.route('/earnings_per_share').post(earningsPerShare);
router.route('/forward_PE').post(forwardPE);
router.route('/screenerv2').get(screener)
router.route('/stock-data').post(stockData);
router.route('/visa').post(visaCheckout);



module.exports = router;
