const express = require('express');
const dotenv = require('dotenv');
const ConnectDB = require('./config/dataBase');
const authRoute = require('./routes/authentication');
const session = require('express-session');
const cookies = require('cookie-parser');
const bodyParser = require('body-parser');
const { StreamApi } = require('financial-news-api');
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
const API_KEY = 'fa71713a2541481a94c5d0e961cd1c7fa04067302fa64f5795e005c778b7b405';

const streamApi = StreamApi(API_KEY);

//streamApi.on('articles', (articles)=> console.log(articles[0].title));
streamApi.on('error', (err)=> console.log('Connection error' + err));
streamApi.on('open', ()=> console.log('Connection open'));
streamApi.on('close', ()=> console.log('Connection closed'));



const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`server started on ${PORT}`));