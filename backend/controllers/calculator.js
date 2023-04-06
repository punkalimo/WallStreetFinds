const { getCurrentRevenue,getRevenueGrowth, getNetProfitGrowth, getSharesOutstanding, getSharesOutstandingGrowthFraction, getEarningsPerShare, getForwardPE, getScreener }  = require('./calculator-controller/calculator.js');
const getStock = require('./calculator-controller/scapper');


const currentRevenue = async(req,res)=>{
    const symbol = req.body.symbol;
    getCurrentRevenue(symbol, (err, result)=>{
        if(err){
            res.status(500).json({error:err})
        }else{
            console.log(result)
            res.json(result);
        }
    })
}


const stockData = async(req, res)=>{
    getStock(req.body.symbol).then((data) => {
        console.log(data);
        res.send(data);
      }).catch((err) => {
        console.error(err);
      });
}


const revenueGrowth = async(req, res)=>{
    const symbol = req.body.symbol;

    getRevenueGrowth(symbol, (err, result)=>{
        if(err){
            res.status(500).json({ error: err});
        }else{
            res.json(result)
        }
    });
}


const netProfitGrowth = async(req, res)=>{
    const { symbol, industryAverage } = req.body;
    getNetProfitGrowth(symbol, industryAverage, (err, data)=>{
        if(err){
            res.status(500).json({ error: err})
        }else{
            res.json(data);
        }
    })
}

const sharesOutstanding = async(req, res)=>{
    const symbol = req.body.symbol;
    getSharesOutstanding(symbol, (err, result)=>{
        if(err){
            res.status(500).json({ error: err});
        }else{
            res.json(result)
        }
    });
}

const sharesOutstandingGrowthFraction = async(req,res)=>{
    const symbol = req.body.symbol;

    getSharesOutstandingGrowthFraction(symbol, (err, sharesOutstandingGrowthFraction)=>{
        if(err){
            res.status(500).send(err.message);
            return;
        }
        res.send(`Shares Outstanding Growth (Past 5Y = 3%, TTM=0.5%): ${sharesOutstandingGrowthFraction}`)
    })
}

const earningsPerShare = async (req, res)=>{
    const symbol = req.body.symbol;
    getEarningsPerShare(symbol, (err, earningsPerShare) => {
        if (err) {
          res.status(500).send('Error getting earnings per share');
        } else {
          res.send(`Earnings per share for ${symbol}: ${earningsPerShare}`);
        }
      });
}

const forwardPE = async(req, res)=>{
    const { symbol, industryAverage } = req.body;
    getForwardPE(symbol, industryAverage, (err, data)=>{
        if(err){
            res.status(500).json({ error: err})
        }else{
            res.json(data);
        }
    })
}

const screener = async(req, res)=>{
    getScreener((err,result)=>{
        if(err){
            res.status(500).json({ error: err})
        }else{
            res(result)
        }
    })
}



module.exports = { stockData, currentRevenue,revenueGrowth, netProfitGrowth, sharesOutstanding, sharesOutstandingGrowthFraction, earningsPerShare, forwardPE, screener };