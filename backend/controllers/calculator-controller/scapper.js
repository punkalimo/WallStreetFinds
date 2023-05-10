const finviz = require('../calculator-controller/backEndScrapper');
const axios = require('axios');

/*function calculateScore(data) {
    let score = 0;
  
    // P/E ratio
    if (data["P/E"] < 20) {
      score += 1;
    } else if (data["P/E"] >= 20 && data["P/E"] < 25) {
      score += 0.5;
    }
  
    // Forward P/E ratio
    if (data["Fwd P/E"] < 20) {
      score += 1;
    } else if (data["Fwd P/E"] >= 20 && data["Fwd P/E"] < 25) {
      score += 0.5;
    }
  
    // PEG ratio
    if (data.PEG < 1.5) {
      score += 1;
    } else if (data.PEG >= 1.5 && data.PEG < 3) {
      score += 0.5;
    }
  
    // P/B ratio
    if (data["P/B"] < 1.5) {
      score += 1;
    } else if (data["P/B"] >= 1.5 && data["P/B"] < 3) {
      score += 0.5;
    }
  
    // P/S ratio
    if (data["P/S"] < 2) {
      score += 1;
    } else if (data["P/S"] >= 2 && data["P/S"] < 3) {
      score += 0.5;
    }
  
    // Profit margin
    if (data["Profit M"] > 10) {
      score += 1;
    } else if (data["Profit M"] >= 7 && data["Profit M"] < 10) {
      score += 0.5;
    }
  
    // Operating margin
    if (data.OMargin > 10) {
      score += 1;
    } else if (data.OMargin >= 7 && data.OMargin < 10) {
      score += 0.5;
    }
  
    // Debt to Equity ratio
    if (data["Debt/Eq"] < 0.5) {
      score += 1;
    } else if (data["Debt/Eq"] >= 0.5 && data["Debt/Eq"] < 1) {
      score += 0.5;
    }
  
    // Return on Equity
    if (data.ROE > 15) {
      score += 1;
    } else if (data.ROE >= 10 && data.ROE < 15) {
      score += 0.5;
    }
  
    // Current Ratio
    if (data["Curr R"] > 2) {
      score += 1;
    } else if (data["Curr R"] >= 1.5 && data["Curr R"] < 2) {
      score += 0.5;
    }
  
    return score;
  }
  
*/
const getStock = async(symbol)=> {
    let stockData={}
    try {
        const response = await axios.get(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=summaryProfile`);
        const quote = response.data.quoteSummary.result[0].summaryProfile;
        
    await finviz.getStockData(symbol)
    .then(data => {
     const calculateNetProfit=(data)=> {
        const sales = parseFloat(data.Sales.replace(/,/g, ''));
        console.log(sales)
        const profitMargin = parseFloat(data['Profit Margin'].replace(/%/g, '')) / 100;
        console.log(data['Profit Margin'])
        const netProfit = sales * profitMargin;
        return netProfit;
      }
      console.log(calculateNetProfit(data));
      stockData = {
        'Ticker': symbol,
        'Company': quote.companyName,
        'Industry': quote.industry,
        'Country': quote.country,
        "Market Cap": data["Market Cap"],
        "P/E": data["P/E"],
        "Fwd P/E": data["Forward P/E"],
        'PEG': data.PEG,
        "P/S": data["P/S"],
        "P/B": data["P/B"],
        "P/C": data["P/C"],
        "P/FCF": data["P/FCF"],
        'Dividend': `${data.Dividend}`,
        'EPS': data["EPS (ttm)"],
        "EPS this Y": data["EPS this Y"],
        "EPS next Y": data["EPS next Y"],
        "EPS past 5Y": data["EPS past 5Y"],
        "EPS next 5Y": data["EPS next 5Y"],
        "Sales past 5Y": data["Sales past 5Y"],
        "Sales Q/Q": data["Sales Q/Q"],
        'Outstanding': data["Shs Outstand"],
        "Float Short": data["Shs Float"],
        'ROE': data.ROE,
        "Curr R": data["Current Ratio"],
        "LTDebt/Eq": data["LT Debt/Eq"],
        "Debt/Eq": data["Debt/Eq"],
        "Profit M": data["Profit Margin"],
        'RSI': data["RSI (14)"],
        'Price': data.Price,
        'Revenue':data['Sales'],
        'Shares Outstanding':data['Shs Float'],
        'Net Profit': calculateNetProfit(data),
        'EPS (ttm)':data['EPS (ttm)']
      };
      console.log(data);
     // console.log(calculateScore(stockData));
    })
    .catch(err => console.error(err.stack ? err.stack : err));
    
        return stockData;
    
      } catch (err) {
        console.error(err);
        throw new Error(`unable to fetch data for ${symbol}`);
      }
    
}

module.exports = getStock;