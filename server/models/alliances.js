const esi = require('./esi.js');

async function getAlliances(app) {
  try {
    let alli_ids = await esi.getAlliances(app);
    if (!alli_ids) return;

    for (const id of alli_ids) await addAlliance(app, id);
  } catch (e) {
    console.log('error: models/alliances/getAlliances')
    console.log(e);
  }
}

async function addAlliance(app, id) {
  let data = await esi.getAlliance(app, id);
  if (!data) return;

  let result = await app.mysql.query(`insert ignore alliances (alliance_id, name) values (${id}, '${data.name}')`);
  if (result.affectedRows == 1) console.log(`alli ${id} added`);
}

module.exports = {
  getAlliances: getAlliances,
  addAlliance: addAlliance,
}