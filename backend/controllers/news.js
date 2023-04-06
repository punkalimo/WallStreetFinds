const axios = require('axios');
const WebSocket = require('ws');

const API_KEY = 'WW5SNUHV8Q4VS7WS';
const STOCKS = 'TSLA';
const NEWS_API_URL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${STOCKS}&apikey=${API_KEY}`;


// Set up a WebSocket server that listens for incoming connections
const server = new WebSocket.Server({ noServer: true });

// Make an initial HTTP request to retrieve the latest news articles
axios.get(NEWS_API_URL)
  .then(response => {
    // Extract the relevant data from the response
    const data = response.data;

    // Send the data to all connected clients
    server.clients.forEach(client => {
      client.send(JSON.stringify(data));
    });
  })
  .catch(error => {
    console.error(error);
  });

// Set up a periodic timer to retrieve new news articles every minute
setInterval(() => {
  axios.get(NEWS_API_URL)
    .then(response => {
      // Extract the relevant data from the response
      const data = response.data;

      // Send the data to all connected clients
      server.clients.forEach(client => {
        client.send(JSON.stringify(data));
      });
    })
    .catch(error => {
      console.error(error);
    });
}, 60000);

// Set up a route handler for the /news endpoint
const news = async (req, res) => {
  // Make an HTTP request to retrieve the latest news articles
  axios.get(NEWS_API_URL)
    .then(response => {
      // Extract the relevant data from the response
      const data = response.data;
      console.log(response.data);
      // Send the data as a JSON response
      res.json(data);
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
};
module.exports = news
