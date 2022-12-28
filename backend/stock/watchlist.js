
const Watchlist = require('../models/watchListModel');
const User = require('../models/userModel');
const yahooFinance = require('yahoo-finance');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const util = require('util');
const _ = require('lodash');



const getUserWatchlist = async (req, res)=>{
    console.log(req.cookies)
    if(req.cookies.token){
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }
           const user = await User.findById(decoded.userID);
            if(user){
               const userID = decoded.userID;
                const watchlist = await Watchlist.find({ userID: userID});
                if(watchlist.length === 0){
                    res.send(watchlist);
                } else {
                    const dayta =[];
                    for(let i = 0; i < watchlist.length; i++){
                        dayta.push({
                            "name":watchlist[i].name,
                            "list_id": watchlist[i]._id,
                            "createdAt": watchlist[i].createdAt,
                            "watchlist": watchlist[i].watchlist
                        })
                    }
    
                    res.send(dayta)
                }
                
            }else{
                res.sendStatus(404);
            }
        })
    }else{
        res.sendStatus(403);
    }
};

const getList = async (req, res)=>{
    console.log(req.body.id);
   const id = req.body.id;
  const query = await Watchlist.findById(id);
   if(!query){
    res.sendStatus(404).send('Error Watchlist No in DB');
    
   }else{
     const SYMBOLS = query.watchlist;
     const FIELDS = ['a', 'b', 'b2', 'b3', 'p', 'o'];
  await yahooFinance.snapshot({
    fields: FIELDS,
    symbols: SYMBOLS
    }, (err, result)=>{
        if(err) throw err;

        res.send(result)
    })
    
   }
   
   
}

module.exports = { getUserWatchlist, getList };