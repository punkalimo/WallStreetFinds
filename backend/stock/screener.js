const Watchlist = require('../models/watchListModel');
const User = require('../models/userModel');
const yahooFinance = require('yahoo-finance');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { isObjectIdOrHexString } = require('mongoose');
const ObjectID =require('mongoose');

const nasdaq= async (req, res)=>{
    let url = 'http://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&exchange=%s&download=true';
    fetch(url)
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
    });
}

const stockSearch = async (req,res)=>{
    const symbol = req.body.symbol;
    console.log(symbol)
    yahooFinance.quote({
        symbol: symbol,
        modules: ['price']
    }, (err, quotes)=>{
        if(err) res.send(err)
        res.send(quotes);
    });
   
}
const createWatchList = async ( req, res)=>{
    if(req.cookies.token){
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, async(err, dedcoded)=>{
            if(err){
                console.log(err);
                res.sendStatus(404)
                return;
            }
            const user = await User.findById(dedcoded.userID);
            if(user){
                const name = req.body.name;
                console.log(name);
                const userID = dedcoded.userID;
                const list_save = await Watchlist.create({
                    name,
                    userID
                });
                if(list_save){
                    res.send(list_save);
                }else{
                    res.status(500).send('Error Unable to Create Watchlist');
                }
            }
        })
    }else{
        res.status(404).send('Please Login or Sign up');
    }
}
const addToWatchList = async (req, res)=>{
    if(req.cookies.token){
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }
           const list = await Watchlist.findById(req.body.ID);
            if(list){
    
               const watchlist  = req.body.stock;
               const updateQuery = { $push:{ watchlist: [...watchlist] }}
               Watchlist.updateOne({'_id':req.body.ID}, updateQuery, (err, done)=>{
                if(err) throw err
                res.status(200).send('Added to watchlist ')
               })
               
    
            }
        })
    }else{
        res.sendStatus(403);
    }

}

const appendWatchlist = async (req, res)=>{
    if(req.cookies.token){
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }
           const list = await Watchlist.findById(req.body.ID);
            if(list){
    
               const watchlist  = req.body.stock;
               const updateQuery = { $push:{ watchlist: watchlist }}
               Watchlist.updateOne({'_id':req.body.ID}, updateQuery, (err, done)=>{
                if(err) throw err
                res.status(200).send('Added to watchlist ')
               })
               
    
            }
        })
    }else{
        res.sendStatus(403);
    }

}

module.exports= { nasdaq, stockSearch,addToWatchList, createWatchList, appendWatchlist }