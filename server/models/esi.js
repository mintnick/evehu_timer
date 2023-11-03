const prefix = 'https://ali-esi.evepc.163.com/latest/';
const surfix = '/?datasource=serenity&language=zh';

async function sendGet(app, params) {
  let res = await app.phin(prefix + params + surfix);
  if (res.statusCode == 200) return JSON.parse(res.body);
  console.log('esi error: ' + params);
}

exports.getAlliances = async function (app) { return (await sendGet(app, 'alliances')) };

exports.getAlliance = async function (app, id) { return (await sendGet(app, 'alliances/' + id)) };

exports.getRegions = async function (app) { return (await sendGet(app, 'universe/regions')) };

exports.getRegion = async function (app, id) { return (await sendGet(app, 'universe/regions/' + id)) };

exports.getConstellations = async function (app) { return (await sendGet(app, 'universe/constellations')); }

exports.getConstellation = async function (app, id) { return (await sendGet(app, 'universe/constellations/' + id)) };

exports.getSystems = async function (app) { return (await sendGet(app, 'universe/systems')) };

exports.getSystem = async function (app, id) { return (await sendGet(app, 'universe/systems/' + id)) };

exports.getCampaigns = async function(app) { return (await sendGet(app, 'sovereignty/campaigns')) };