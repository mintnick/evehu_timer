const mysql = require('../models/mysqldb.js');
const phin = require('phin').defaults({'method': 'get', 'headers': {'User-Agent': 'evehu - timer'}});

const alliances = require('../models/alliances');
const universe = require('../models/universe');

const app = {};
app.mysql = new mysql({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'evehu_timer'
});
app.phin = phin;

// alliances.getAlliances(app);
// universe.getRegions(app);
// universe.getConstellations(app);
universe.getSystems(app);