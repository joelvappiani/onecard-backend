require('dotenv').config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const authRouter = require('./routes/auth');
const settingsRouter = require('./routes/settings');
const qrsRouter = require('./routes/qrs')
const transactionsRouter = require('./routes/transactions')
const fileUpload = require('express-fileupload')


const app = express();

const cors = require('cors')

app.use(fileUpload())
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/auth', authRouter);
app.use('/settings', settingsRouter);
app.use('/qrs', qrsRouter)
app.use('/transactions', transactionsRouter);


module.exports = app;
