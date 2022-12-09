const Watchlist = require('../models/watchListModel');
const User = require('../models/userModel');
const yahooFinance = require('yahoo-finance');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const nasdaq= async (req, res)=>{
    let url = 'http://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&exchange=%s&download=true';
    axios.get(url)
    .then((response)=>{
        res.send(response)
    })
    .then(function(myJson) {
        const data= [];
        let stockList = myJson.data.rows;
        stockList.forEach(stock => {
            for(let key in stock){
              data.push(`${key}:${stock[key]}`)
            }
            data.push(' ');
        });
        res.send(stockList);
    });
    
    
    /*fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        const data= [];
        let stockList = myJson.data.rows;
        stockList.forEach(stock => {
            for(let key in stock){
              data.push(`${key}:${stock[key]}`)
            }
            data.push(' ');
        });
        res.send(stockList);
    });*/
}

const stockSearch = async (req,res)=>{
    const symbol = req.body.symbol;
    console.log(symboy)
    yahooFinance.quote({
        symbol: symbol,
        modules: ['price']
    }, (err, quotes)=>{
        if(err) res.send(err)
        res.send(quotes);
    });
   
}

const addToWatchList = async (req, res)=>{
    jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }
       const user = await User.findById(decoded.userID);
        if(user){
           const { stocks } = req.body.stock;
           const userID = decoded.userID;
           const watchlist = await Watchlist.create({
            stocks,
            userID
           });

           if(watchlist){
            res.send(watchlist._id);
           }

        }
        res.send(decoded)
    })

}

module.exports= { nasdaq, stockSearch,addToWatchList }