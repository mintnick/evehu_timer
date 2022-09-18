const esi = require('./esi.js');

// get all regions (id, name)
exports.getRegions = async function (app) {
  const regions = await esi.getRegions(app);
  if (!regions) return;

  for (const id of regions) {
    const data = await esi.getRegion(app, id);
    if (!data) continue;

    const result = await app.mysql.query(`insert ignore regions (region_id, name) values (${id}, '${data.name}')`);
    if (result.affectedRows == 1) console.log(`region ${id} added`);
  }
}

// get all constellations (id, name, region_id)
exports.getConstellations = async function (app) {
  const constellations = await esi.getConstellations(app);
  if (!constellations) return;

  for (const id of constellations) {
    const data = await esi.getConstellation(app, id);
    if (!data) continue;

    const result = await app.mysql.query(`insert ignore constellations (constellation_id, name, region_id) values (${id}, "${data.name}", ${data.region_id})`);
    if (result.affectedRows == 1) console.log(`constellation ${id} added`);
  }
}

// get all systems (id, name, security_status, constellation_id)
exports.getSystems = async function (app) {
  const systems = await esi.getSystems(app);
  if (!systems) return;

  for (const id of systems) {
    // esi get connection problem sometime, skip existing systems after restart
    const exsit = await app.mysql.query(`select 1 from systems where system_id = ${id}`);
    if (exsit.length == 1) continue;

    const data = await esi.getSystem(app, id);
    if (!data) continue;

    const result = await app.mysql.query(`insert ignore systems (system_id, name, security_status, constellation_id) values (${id}, "${data.name}", "${data.security_status}", ${data.constellation_id})`);
    if (result.affectedRows == 1) console.log(`system ${id} added`);
  }
}
