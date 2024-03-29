const express = require('express');
const dotenv = require('dotenv');
const ConnectDB = require('./config/dataBase');
const authRoute = require('./routes/authentication');
const session = require('express-session');
const cookies = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const https = require('https');
const http = require('http');
const { options } = require('./routes/authentication');
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

/*http.createServer(app).listen(5001);
https.createServer(options, app).listen(5000);

app.listen = ()=>{
    const server = http.createServer(this);
    return server.listen.apply(server, arguments);
}*/


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`server started on ${PORT}`));