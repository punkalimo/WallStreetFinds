const express = require('express');
const dotenv = require('dotenv');
const ConnectDB = require('./config/dataBase');
const authRoute = require('./routes/authentication');
const session = require('express-session');
const cookies = require('cookie-parser');
const bodyParser = require('body-parser');
const { StreamApi } = require('financial-news-api');
const WebSocket = require('ws');
const axios = require('axios');
const cors = require('cors');
const app = express();
dotenv.config();
ConnectDB();


app.use(bodyParser.json());
app.use(cors({
    origin: ['https://localhost:3000','https://wallstreetfinds.netlify.app'],
    credentials: true,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],  
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookies());
app.use(express.json());
app.use('/', authRoute);
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET_KEY
}));

//News API 



// Set up a listener for incoming HTTP connections
const PORT = process.env.PORT || 3000;
const httpServer = app.listen(PORT, () => {
  console.log('Server running on port 3000');
});

// Set up a listener for WebSocket connections and associate them with the HTTP server
httpServer.on('upgrade', (request, socket, head) => {
  server.handleUpgrade(request, socket, head, socket => {
    server.emit('connection', socket, request);
  });
});

