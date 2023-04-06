const User = require('../models/userModel');
const Portfolio = require('../models/portfolio');
const jwt = require('jsonwebtoken');
const { result } = require('lodash');

const trimString = (s)=>{
    var l=0, r=s.length -1;
    while(l < s.length && s[l] == ' ') l++;
    while(r > l && s[r] == ' ') r-=1;
    return s.substring(l, r+1);
}

const compareObjects = (o1, o2)=>{
    var k = '';
  for(k in o1) if(o1[k] != o2[k]) return false;
  for(k in o2) if(o1[k] != o2[k]) return false;
  return true;
}
const itemExists = (haystack, needle)=>{
    for(var i=0; i<haystack.length; i++) if(compareObjects(haystack[i], needle)) return true;
  return false;
}

const portfolioName = (symbol)=>{
    let url = 'http://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&exchange=%s&download=true';
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        let objects = myJson.data.rows;
        
        let results = [];
        const toSearch = trimString(symbol); // trim it
          for(var i=0; i<objects.length; i++) {
            for(var key in objects[i]) {
              if(objects[i][key].indexOf(toSearch)!=-1) {
                if(!itemExists(results, objects[i])) results.push(objects[i]);
              }
            }
          }
          return results;
        
    });
};


const createPortfolio = async(req,res)=>{
    console.log(req.cookies.token)
    if(req.cookies.token){
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
            if(err){
                console.log(err);
                res.sendStatus(500).send("Please login");
                return;
            }
           const user = await User.findById(decoded.userID);
            if(user){
                const userID = decoded.userID;
                const name = req.body.name;
                const create = await Portfolio.create({
                    name, userID
                });
                if(create){
                    res.send(create);
                }else{
                    res.send(400)
                }
                
            }else{
                res.sendStatus(404);
            }
        })
    }else{
        res.status(400).send("invalid session. Please login!")
    }
}

const myPortfolios = async (req, res)=>{
    console.log(req.cookies.token);
    if(req.cookies.token){
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
            if(err){
                res.sendStatus(500);
                return;
            }
            const userID = decoded.userID;
            const portfolios = await Portfolio.find({ userID: userID});
            if(portfolios.length === 0){
                res.send(portfolios);
            }else{
                const dayta =[];
                    for(let i = 0; i < portfolios.length; i++){
                        dayta.push({
                            "name":portfolios[i].name,
                            "_id": portfolios[i]._id,
                            "Created": portfolios[i].createdAt,
                            "Last Edited": portfolios[i].updatedAt
                        })
                    }
                res.send(dayta);

            }

        });
    }
}
const addToPortfolio = async (req, res)=>{
    console.log(req.cookies.token);
    if(req.cookies.token){
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
            if(err){
                res.sendStatus(500);
                return;
            }
            if(!req.body.id){
                res.sendStatus(404).send('No Portfolio Created, PLease Create Portfolio');
                return;
            }
            const id = req.body.id;
           /* const portfolio = await Portfolio.findOne({ id});
            if(portfolio.length == 0){
                res.sendStatus(404).send('No Portfolio, Please create new portfolio');
                return;*/
            
                
                const list = req.body;
                const exec = await Portfolio.findOneAndUpdate(
                    { _id: id },
                    { $push: { stocks: { symbol: req.body.symbol, price: req.body.price, shares: req.body.shares } } },
                    { new: true });
                    console.log(exec.stocks)
            
        });
    }
}

const viewPortfolio = async (req, res)=>{
    console.log(req.cookies.token);
    if(req.cookies.token){
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
            if(err) {
                res.status(500).send("Please login");
                return;
            }
            if(!req.body.id){
                res.status(400).send("Please add or create a portfolio");
                return;
            }
            const user = await User.findById(decoded.userID);
            const query = await Portfolio.findById(req.body.id);
            const stocks = query.stocks
            const symbols = stocks.map(stock => stock.symbol);
            let url = 'http://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&exchange=%s&download=true';
            fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                let objects = myJson.data.rows;
                let port= []
                let results = [];
                for(let l=0; l<symbols.length; l++){
                    const toSearch = trimString(symbols[l]); // trim it
                  for(var i=0; i<objects.length; i++) {
                    for(var key in objects[i]) {
                      if(objects[i][key].indexOf(toSearch)!=-1) {
                        if(!itemExists(results, objects[i])) results.push(objects[i]);
                      
                      }
                    }
                  }
                   port.push({
                          "Company Name":results.name,
                          });
                }
                console.log(results)
                //res.send(port)
                
                
            });
            
        })
        
    }
    else{
        res.status(400).send("invalid session. Please login!")
    }
}

const renamePortfolio = async (req,res)=>{
   console.log(req.cookies.token);
   if(req.cookies.token){
    jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
        if(err) {
            res.status(500).send("Please login");
            return;
        }
        if(!req.body.id){
            res.status(400).send("Please add or create a portfolio");
            return;
        }
        const user = await User.findById(decoded.userID);
        
        const update= {$set :{name: req.body.name}};
        Portfolio.updateOne({_id: req.body.id}, update, async (error,done)=>{
            if(error) throw error
            const portfolio = await Portfolio.findById(req.body.id)
            res.send(portfolio)
        })
        
    })
   }
}
const deletePortfolio = async (req,res)=>{
    console.log(req.cookies.token);
   if(req.cookies.token){
    jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
        if(err) {
            res.status(500).send("Please login");
            return;
        }
        if(!req.body.id){
            res.status(400).send("Please add or create a portfolio");
            return;
        }
        const user = await User.findById(decoded.userID);
        
        Portfolio.deleteOne({_id: req.body.id}, (error,done)=>{
            if(error) throw error
            console.log(done)
            res.send('Portfolio Deleted Successfully')
        })
        
    })
   }
}

module.exports = {createPortfolio, viewPortfolio, myPortfolios, addToPortfolio, renamePortfolio, deletePortfolio}