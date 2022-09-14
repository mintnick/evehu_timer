const baseUrl = 'https://esi.evepc.163.com/latest/';

async function sendGet(app, surfix) {
  let res = await app.phin(baseUrl + surfix);
  if (res.statusCode == 200) return JSON.parse(res.body);
  console.log('esi error: ' + surfix);
}

exports.getAlliances = async function getAlliances (app) { return (await sendGet(app, 'alliances'))};

exports.getAlliance = async function getAlliance(app, id) { return (await sendGet(app, 'alliances/' + id))};

exports.getRegions = async function getRegions(app) {return (await sendGet(app, 'universe/regions'))};

exports.getRegion = async function getRegion(app, id) {return (await sendGet(app, 'universe/regions/' + id))};