const baseUrl = 'https://esi.evepc.163.com/latest/';

async function sendGet(app, surfix) {
  let res = await app.phin(baseUrl + surfix);
  if (res.statusCode == 200) return JSON.parse(res.body);
  console.log('esi error: ' + surfix);
}

exports.getAlliances = async function (app) { return (await sendGet(app, 'alliances'))};

exports.getAlliance = async function (app, id) { return (await sendGet(app, 'alliances/' + id))};

exports.getRegions = async function (app) {return (await sendGet(app, 'universe/regions'))};

exports.getRegion = async function (app, id) {return (await sendGet(app, 'universe/regions/' + id))};

exports.getConstellations = async function (app) {return (await sendGet(app, 'universe/constellations'));}

exports.getConstellation = async function (app, id) {return (await sendGet(app, 'universe/constellations/' + id))};

exports.getSystems = async function (app) {return (await sendGet(app, 'universe/systems'))};

exports.getSystem = async function (app, id) {return (await sendGet(app, 'universe/systems/' + id))};