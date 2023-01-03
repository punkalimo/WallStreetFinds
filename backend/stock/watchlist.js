
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
                            "_id": watchlist[i]._id,
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
    if(!req.body.id){
        res.status(403)
    }
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
const deleteWatchList = async (req, res)=>{
    if(req.cookies.token){
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }else{
                const listId = req.body.id;
                const result = await Watchlist.findById(listId);
                if(!result){
                    res.status(500).send('Invalid Watchlist');
                }else{
                    Watchlist.findByIdAndRemove(listId, (err, doc)=>{
                        if(!err){
                            res.status(201).send('delete successful')
                        }else{
                            console.log(err);
                        }
                    })
                }
            }
           
        });
    } else {
        res.status(400).send('Please Login');
    }
}
module.exports = { getUserWatchlist, getList, deleteWatchList };