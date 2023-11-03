var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var phin = require('phin').defaults({'method': 'get', 'headers': {'User-Agent': 'evehu - timer'}});
var mysql = require('./models/mysqldb.js');
var cors = require('cors');
require('dotenv').config({path: __dirname + '.env'})

const router = require('./routes.js');
const update_campaigns = require('./tasks/update_campaigns.js');

var app = express();
app.phin = phin;
app.mysql = new mysql({
  host: process.env.AWS_RDS_HOST,
  user: process.env.AWS_RDS_USER,
  password: process.env.AWS_RDS_PASSWORD,
  database: process.env.AWS_RDS_EVEHU_TIMER_DB
});
app.campaigns = [];

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', router);

// util functions
isDowntime = () => {
  const date = new Date();
  const hour = ('0' + date.getHours()).slice(-2);
  const minute = ('0' + date.getMinutes()).slice(-2);
  const time = hour + minute;
  return (time >= '1055' && time <= '1115');
}

sleep = (sec) => { return new Promise(resolve => { setTimeout(resolve, sec*1000)})};

// start data update
setTimeout(() => {update(app)}, 1);

async function update(app) {
  if (isDowntime()) {
    console.log('server down, wait 10 min');
    await sleep(600);
  } else {
    const data = await update_campaigns(app);
    if (data) app.campaigns = data;
  }

  await sleep(60);
  update(app);
}

module.exports = app;
