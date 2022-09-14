const esi = require('./esi.js');
const fs = require('fs/promises');
const path = require('path');

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

exports.generateLocalFile = async function (app, tablename, filename) {
  if (filename == undefined) filename = tablename;
  let names = await app.mysql.query(`select name from ${tablename}`);
  names = names.map(x => x.name);
  const obj = {};
  for (const name of names) obj[name] = "";
  const json = JSON.stringify(obj, null, 4);
  await fs.writeFile(path.join(__dirname, `../localization/${filename}.json`), json);
}

exports.rename = async function (app, tablename, filename) {
  if (filename == undefined) filename = tablename;
  const data = await fs.readFile(path.join(__dirname, `../localization/${filename}.json`));
  const json = JSON.parse(data);

  for (const [key, value] of Object.entries(json)) {
    if (!value) continue;
    const result = await app.mysql.query(`update ${tablename} set name = "${value}" where name = "${key}"`);
    if (result.affectedRows == 1) console.log(`rename ${tablename}: ${key} to ${value}`);
  }
}