const paypal = require('paypal-rest-sdk');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const Payment = require('../models/payment')

const maxAge = 3 * 24 * 60 * 60;

const generateToken = (id)=>{
  const token = jwt.sign({ id }, process.env.SECRET_KEY, {
  algorithm: "HS256",
  expiresIn: maxAge,
});
  console.log(token)
  return token;
};

paypal.configure({
    'mode':'sandbox',
    'client_id': 'AQI0kZ4X5QS5w5JmVhztqIe7ZSoNgZpp2giQ_2-t8fu4aNi6ZkaneGYTm6_zCSiPSWm5_f--Jl507FKU',
    'client_secret': 'EHFVWO9PCAdMwVK5jdLcMhxAEYUtix7lwvG05LW3S_Uv0H74ZhH-zCAncRndeuJUwDeROble7_ofgBEf'

})

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
               const payment ={
                'intent': 'ORDER',
                'payer': {
                  'payment_method': 'paypal'
                },
                'redirect_urls': {
                  'development': {
                    'return_url': 'https://localhost:3000/subscription/success',
                    'cancel_url': 'https://localhost:3000/subscription/cancel'
                  },
                  'production': {
                    'return_url': 'https://wallstreetfinds.netlify.app/subscription/success',
                    'cancel_url': 'https://wallstreetfinds.netlify.app/subscription/cancel'
                  }
                }[process.env.NODE_ENV || 'development'],
                'transactions': [{
                  'amount': {
                    'total': req.body.price,
                    'currency': 'USD'
                  },
                  'description': 'Calculator Subscription'
                }]
              };
            paypal.payment.create(payment, (error, payment)=>{
                if(error){
                    res.status(500).send('An error occurred while processing the payment contact admin');
                    return;
                }else{
                  
                    for(let i =0; i< payment.links.length; i++){
                        if(payment.links[i].rel === 'approval_url'){
                            console.log(payment.links[i].href)
                            res.send({ approvalUrl: payment.links[i].href, paymentId: payment.id, price: req.body.price });
                            return;
                            // res.redirect(payment.links[i].href)
                        }
                    }
                }
            });
                
            }else{
                res.status(403).send('Invalid token, are you logged in')
            }
        })
    }else{
      res.status(404).send('Error please login');
    }
}
const success = async(req, res)=>{

  const paymentId = req.query.paymentId;
  const total = req.query.price;

  paypal.payment.get(paymentId, function (error, payment) {
    if (error) {
     console.log(error);
    }
    console.log(payment);
  });

  const payerId = req.query.PayerID;
  const executePayment = {
        'payer_id': payerId,
        'transactions': [{
          'amount': {
            'currency': 'USD',
            'total': total
          }
        }]
      };

      if(req.cookies.token){
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
          paypal.payment.execute(paymentId, executePayment, (error, payment) => {
            if (error) {
              res.status(500).send('An error occurred while processing the payment');
            } else {
              // Payment was successful
              const transaction = new Payment({
                userID: decoded.userID,
                paymentId: req.cookies.paymentId,
                payerId: req.query.PayerID,
                paymentToken: req.query.token,
                paymentAmount: payment.transactions[0].amount.total,
                paymentCurrency: payment.transactions[0].amount.currency,
                paymentStatus: payment.state
              });

              transaction.save((err) => {
                if (err) {
                  console.log(err);
                  return res.sendStatus(500);
                }
                // Payment saved successfully
                res.send({success:true});
              });

            }
          });

        });
      }else{
        res.status(503).send('Please login, invalid JWT')
      }


}

const cancel = async (req,res)=>{
    res.send('Payment was canceled');
}

module.exports = {subscribe, cancel, success}