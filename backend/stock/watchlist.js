
const Watchlist = require('../models/watchListModel');
const User = require('../models/userModel');
const yahooFinance = require('yahoo-finance');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');



const getUserWatchlist = async (req, res)=>{
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
                if(!watchlist){
                    res.send('Watchlist empty for this user');
                }
                const symbols = watchlist[0];
                let data = symbols.watchlist;
                const format = [];
               for(let i =0; i<data.length; i++){
                    await yahooFinance.quote({
                        symbol: data[i],
                        modules: ['price']
                    }, (err, result)=>{
                        if(err) throw error;
                        format.push(result)
                    })
                }
                /*const fields = ['a', 'b', 'b2', 'b3', 'p', 'o'];
                await yahooFinance.snapshot({
                    fields: fields,
                    symbols:data
                },(err, result)=>{
                    if(err) throw err
                    res.send(result);
                })*/
                res.send(format)
            }else{
                res.sendStatus(404);
            }
        })
    }else{
        res.sendStatus(403);
    }
};

module.exports = getUserWatchlist;