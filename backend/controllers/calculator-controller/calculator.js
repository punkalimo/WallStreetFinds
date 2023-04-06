const { reject } = require('lodash');
const { resolve } = require('path');
const request = require('request');

const apiKey = 'WW5SNUHV8Q4VS7WS';

//Gets the Current Revenue of a Stock Symbol
const getCurrentRevenue = (symbol,callback)=>{

    const apiUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}`;

    request(apiUrl, {json: true}, (err, response, body)=>{
        if(err){
            console.error(err);
            return;
        }
        const incomeStatements = body.annualReports;
        console.log(incomeStatements);
        const currentRevenue = incomeStatements[0].totalRevenue;
        console.log(incomeStatements[0]);
        callback(null, currentRevenue);
    })
}
//Gets the revenue growth of a stock symbol
/*
const getRevenueGrowth =(symbol, callback)=>{
    console.log('getRevenueGrowth called with symbol:', symbol);
  
    const incomeStatement5YUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}&datatype=json&period=annual`;
    const incomeStatementTTMUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}&datatype=json&period=quarter`;
    Promise.all([
      new Promise((resolve, reject)=>{
        request(incomeStatement5YUrl, { json: true}, (err, response, body)=>{
          if (err){
            console.log('Error in incomeStatement5YUrl request:', err);
            reject(err);
          }else{
            resolve(body.annualReports);
          }
        });
      }),
      new Promise((resolve, reject)=>{
        request(incomeStatementTTMUrl, { json: true }, (err, response, body)=>{
          if(err){
            console.log('Error in incomeStatementTTMUrl request:', err);
            reject(err);
          }else{
            resolve(body.quarterlyReports);
          }
        });
      })
    ]).then(([incomeStatement5YUrl, incomeStatementTTMUrl])=>{
      const revenue5Y = incomeStatement5YUrl.slice(0, 5).map((report) => report.totalRevenue);
      const revenueTTM = incomeStatementTTMUrl[0].totalRevenue;
      const revenueGrowth5Y = ((revenue5Y[4] - revenue5Y[0]) / revenue5Y[0]) * 100;

      const revenueGrowthTTM = ((revenueTTM - revenue5Y[0]) / revenue5Y[0]) * 100;
  
      callback(null, {
        revenueGrowth5Y: revenueGrowth5Y.toFixed(2),
        revenueGrowthTTM: revenueGrowthTTM.toFixed(2),
      });
    }).catch((err)=>{
      console.log('Error in getRevenueGrowth:', err);
      callback(err, null);
    });
  }
*/
const getRevenueGrowth = (symbol, callback) => {
  console.log('getRevenueGrowth called with symbol:', symbol);

  const incomeStatement5YUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}&datatype=json&period=annual`;
  const incomeStatementTTMUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}&datatype=json&period=quarter`;
  Promise.all([
    new Promise((resolve, reject) => {
      request(incomeStatement5YUrl, { json: true }, (err, response, body) => {
        if (err) {
          console.log('Error in incomeStatement5YUrl request:', err);
          reject(err);
        } else {
          resolve(body.annualReports);
        }
      });
    }),
    new Promise((resolve, reject) => {
      request(incomeStatementTTMUrl, { json: true }, (err, response, body) => {
        if (err) {
          console.log('Error in incomeStatementTTMUrl request:', err);
          reject(err);
        } else {
          resolve(body.quarterlyReports);
        }
      });
    })
  ]).then(([incomeStatement5Y, incomeStatementTTM]) => {
    const revenue5Y = incomeStatement5Y.slice(0, 5).map((report) => report.totalRevenue);
    const revenueTTM = incomeStatementTTM[0].totalRevenue;
    const revenueGrowth5Y = ((revenue5Y[0] - revenue5Y[4]) / revenue5Y[4]) * 100;
    const revenueGrowthTTM = ((revenueTTM - revenue5Y[0]) / revenue5Y[0]) * 100;

    callback(null, {
      revenueGrowthPast5Y: revenueGrowth5Y.toFixed(2),
      revenueGrowthTTM: revenueGrowthTTM.toFixed(2),
    });
  }).catch((err) => {
    console.log('Error in getRevenueGrowth:', err);
    callback(err, null);
  });
};

  //Gets the Net Profit Growth of the stock symbol
  const getNetProfitGrowth = (symbol, industryAverage, callback) => {
    const incomeStatement5YUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}&datatype=json&period=annual`;
    const incomeStatementTTMUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}&datatype=json&period=quarter`;
    Promise.all([
      new Promise((resolve, reject) => {
        request(incomeStatement5YUrl, { json: true }, (err, response, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(body.annualReports);
          }
        });
      }),
      new Promise((resolve, reject) => {
        request(incomeStatementTTMUrl, { json: true }, (err, response, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(body.quarterlyReports);
          }
        });
      })
    ]).then(([incomeStatements5Y, incomeStatementsTTM]) => {
      const netIncome5Y = incomeStatements5Y
        .slice(0, 5)
        .map((report) => report.netIncome);
      const netIncomeTTM = incomeStatementsTTM[0].netIncome;
      const netIncomeGrowth5Y = ((netIncome5Y[0] - netIncome5Y[4]) / netIncome5Y[4]) * 100;
      const netIncomeGrowthTTM = ((netIncomeTTM - netIncome5Y[0]) / netIncome5Y[0]) * 100;
      const isAboveIndustryAverage5Y = netIncomeGrowth5Y > industryAverage;
      const isAboveIndustryAverageTTM = netIncomeGrowthTTM > industryAverage;
      callback(null, {
        netIncomeGrowth5Y: netIncomeGrowth5Y.toFixed(2),
        netIncomeGrowthTTM: netIncomeGrowthTTM.toFixed(2),
        isAboveIndustryAverage5Y,
        isAboveIndustryAverageTTM
      });
    }).catch((err) => {
      callback(err, null);
    });
  };
  // Gets Shares outstanding of the stock
  const getSharesOutstanding = (symbol, callback) => {
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
  
    request(url, { json: true }, (err, response, body) => {
      if (err) {
        callback(err, null);
        return;
      }
  
      const sharesOutstanding = body.SharesOutstanding;
  
      callback(null, sharesOutstanding);
    });
  };
// Gets Shares outstanding growth fraction
  const getSharesOutstandingGrowthFraction = (symbol, callback)=> {

    const balanceSheet5YUrlForSymbol = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${apiKey}&datatype=json&period=annual`;
    const balanceSheetTTMUrlForSymbol = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${apiKey}&datatype=json&period=quarter`;
    // Build the URLs for retrieving the balance sheets for the past 5 years and TTM
  
    // Make the API requests to retrieve the balance sheets
    request(balanceSheet5YUrlForSymbol, { json: true }, (err, response, body) => {
      if (err) {
        callback(err, null);
        return;
      }
  
      const latestYearBalanceSheet = body.annualReports[0];
  
      request(balanceSheetTTMUrlForSymbol, { json: true }, (err, response, body) => {
        if (err) {
          callback(err, null);
          return;
        }
  
        const latestQuarterBalanceSheet = body.quarterlyReports[0];
  
        // Calculate the shares outstanding growth fraction
        const sharesOutstanding5Y = parseFloat(latestYearBalanceSheet.commonStock);
        const sharesOutstandingTTM = parseFloat(latestQuarterBalanceSheet.commonStock);
        const sharesOutstandingGrowthFraction = (sharesOutstandingTTM - sharesOutstanding5Y) / sharesOutstanding5Y;
  
        // Call the callback function with the shares outstanding growth fraction
        callback(null, sharesOutstandingGrowthFraction);
      });
    });
  }

//Gets the earnings per share
  const getEarningsPerShare = (symbol, callback) => {
    // Build the URLs for retrieving the income statement and shares outstanding data
    const incomeStatementUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}&datatype=json&period=annual`;
    const sharesOutstandingUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
  
    // Make the API requests to retrieve the income statement and shares outstanding data
    request(incomeStatementUrl, { json: true }, (err, response, body) => {
      if (err) {
        callback(err, null);
        return;
      }
  
      const latestYearIncomeStatement = body.annualReports[0];
  
      request(sharesOutstandingUrl, { json: true }, (err, response, body) => {
        if (err) {
          callback(err, null);
          return;
        }
  
        const sharesOutstanding = parseFloat(body.SharesOutstanding);
  
        // Calculate EPS
        const netIncome = parseFloat(latestYearIncomeStatement.netIncome);
        const eps = netIncome / sharesOutstanding;
  
        // Call the callback function with the EPS value
        callback(null, eps);
      });
    });
  };
 //Gets the Forward price-to-earnings
  const getForwardPE = (symbol, industryAverage, callback) => {
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
  
    request(url, { json: true }, (err, response, body) => {
      if (err) {
        callback(err, null);
        return;
      }
  
      const trailingPE = body.TrailingPE;
      console.log(trailingPE);
      const forwardPE = body.ForwardPE;
      
      if (!trailingPE || !forwardPE) {
        callback(new Error(`P/E ratio data not available for ${symbol}`), null);
        return;
      }
      
      const currentPE = forwardPE ? forwardPE : trailingPE;
      const EPS = getEarningsPerShare(symbol, (err, earningsPerShare) => {
        if (err) {
          res.status(500).send('Error getting earnings per share');
        } else {
            return earningsPerShare;
        }
      });
      console.log(`lorem ipsum ${EPS}`)
      const calculatedForwardPE = currentPE / EPS;
      const isAboveIndustryAverage = calculatedForwardPE > industryAverage;
  
      callback(null, {
        forwardPE: calculatedForwardPE.toFixed(2),
        isAboveIndustryAverage
      });
    });
  };
  
  
  const getScreener = (callback)=>{
    const url = `https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${apiKey}`;

    request.get(url, (error, response, body) => {
      if (error) {
        console.error(error);
      } else {
        const result = JSON.parse(body);
        const stockSymbols = Object.keys(result["data"]);
        callback(null, stockSymbols);
      }
    });
    
  }
  
  
  
  
  
module.exports = { getRevenueGrowth, getCurrentRevenue, getNetProfitGrowth, getSharesOutstanding, getSharesOutstandingGrowthFraction, getEarningsPerShare, getForwardPE, getScreener }