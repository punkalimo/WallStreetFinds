const express = require('express');
const dotenv = require('dotenv');
const ConnectDB = require('./config/dataBase');
const authRoute = require('./routes/authentication');
const app = express();
dotenv.config();
ConnectDB();

app.use(express.json());
app.use('/', authRoute);





const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`server started on ${PORT}`));