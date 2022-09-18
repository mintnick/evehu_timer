const esi = require('./esi.js');
const fs = require('fs/promises');
const path = require('path');

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

// get all systems (id, name, security_class, security_status, constellation_id)
exports.getSystems = async function (app) {
  
}

// export a json file in {id: name} format for localization
exports.generateLocalFile = async function (app, tablename, filename) {
  if (filename == undefined) filename = tablename;
  const id_field = tablename.slice(0, -1) + '_id';
  let ids = await app.mysql.query(`select ${id_field} from ${tablename}`);
  ids = ids.map(x => x[id_field]);
  const obj = {};
  for (const id of ids) obj[id] = "";
  const json = JSON.stringify(obj, null, 4);
  await fs.writeFile(path.join(__dirname, `../localization/${filename}.json`), json);
}

// rename names from localization file
exports.rename = async function (app, tablename, filename) {
  if (filename == undefined) filename = tablename;
  const id_field = tablename.slice(0, -1) + '_id';
  const data = await fs.readFile(path.join(__dirname, `../localization/${filename}.json`));
  const json = JSON.parse(data);

  for (const [id, name] of Object.entries(json)) {
    if (!value) continue;
    const result = await app.mysql.query(`update ${tablename} set name = "${name}" where ${id_field} = "${id}"`);
    if (result.affectedRows == 1) console.log(`rename ${tablename}: ${id} to ${name}`);
  }
}