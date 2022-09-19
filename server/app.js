var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var phin = require('phin').defaults({'method': 'get', 'headers': {'User-Agent': 'evehu - timer'}});
var mysql = require('./models/mysqldb.js');
const ws = require('ws');

const router = require('./routes.js');
const update_campaigns = require('./tasks/update_campaigns.js');

var app = express();
app.phin = phin;
app.mysql = new mysql({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'evehu_timer'
});
app.campaigns = {};

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

// util functions
isDowntime = () => {
  const date = new Date();
  const hour = ('0' + date.getHours()).slice(-2);
  const minute = ('0' + date.getMinutes()).slice(-2);
  const time = hour + minute;
  return (time >= '1055' && time <= '1130');
}

sleep = (sec) => { return new Promise(resolve => { setTimeout(resolve, sec*1000)})};

// start data update
setTimeout(() => {update(app)}, 1);

async function update(app) {
  if (isDowntime()) {
    console.log('server down, wait 5 min');
    await sleep(600);
  } else {
    app.campaigns = await update_campaigns(app);
  }

  await sleep(60);
  update(app);
}

// websocket
const wss = new ws.WebSocketServer({port: 9090});
wss.on('connection', function connection(ws) {
  ws.send(app.campaigns);

  ws.on('message', function message(data) {
    if (data == "update") {
      ws.send(app.campaigns)
    }
  })
})

module.exports = app;
