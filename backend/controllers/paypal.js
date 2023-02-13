const paypal = require('paypal-rest-sdk');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');



const subscribe = async (req, res)=>{
    if(req.cookies.token){
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }
           const user = await User.findById(decoded.userID);
            if(user){
               const firstname = decoded.firstname;
               const userID = decode.userID;
               const price = req.body.price;
               const payment = {
                "intent": "Subscription",
                "payer":{
                    "payment_method": "paypal"
                },
                "payer_id":userID,
                "redirect_urls":{
                    "return_url":"http://localhost:5000/suceess",
                    "cancel_url":"http://localhost:5000/fail"
                },
                "transactions":[{
                    "item_list":{
                        "items":[{
                            "name":"Premium",
                            "sku":"0.1",
                            "price":price,
                            "currency":"USD",
                            "quantity": "1"
                        }]
                    },
                    "amount":{
                        "currency":"USD",
                        "total":price
                    },
                    "description":"This is the payment for premium"
                }]
            };
            paypal.payment.create(payment, (error, payment)=>{
                if(error){
                    throw error
                }else{
                    for(let i =0; i< payment.links.length; i++){
                        if(payment.links[i].rel === 'approval_url'){
                            res.redirect(payment.links[i].href)
                        }
                    }
                }
            })
                
            }else{
                res.sendStatus(404);
            }
        })
    }
}

module.exports = subscribe