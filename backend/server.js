const express = require('express');
const dotenv = require('dotenv');
const ConnectDB = require('./config/dataBase');
const authRoute = require('./routes/authentication');
const session = require('express-session');
const cookies = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
dotenv.config();
ConnectDB();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookies());
app.use(express.json());
app.use('/', authRoute);
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET_KEY
}));







const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`server started on ${PORT}`));