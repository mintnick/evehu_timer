const esi = require('../models/esi')
const alliances = require('../models/alliances');

const camp_key = "campaigns";

module.exports = async function (app) {
  const data = await esi.getCampaigns(app);
  if (!data) return;

  for (const record of data) {
    let {
    constellation_id,
    defender_id,
    event_type,
    solar_system_id,
    start_time
    } = record;

    const region_name = await app.mysql.queryField('region_name', `select r.name region_name from constellations c left join regions r on c.region_id = r.region_id where c.constellation_id = ${constellation_id}`, []);
    if (region_name) record.region_name = region_name;

    const constellation_name = await app.mysql.queryField('name', `select name from constellations where constellation_id = ${constellation_id}`, []);
    if (constellation_name) record.constellation_name = constellation_name;

    const system_name = await app.mysql.queryField('name', `select name from systems where system_id = ${solar_system_id}`);
    if (system_name) record.system_name = system_name;

    let alli_name = await app.mysql.queryField('name', `select name from alliances where alliance_id = ${defender_id}`, []);
    if (alli_name) {
      record.alli_name = alli_name;
    } else {
      await alliances.addAlliance(app, defender_id);
      alli_name = await app.mysql.queryField('name', `select name from alliances where alliance_id = ${defender_id}`, []);
      record.alli_name = alli_name;
    }

    const local_datetime = (new Date(start_time)).toLocaleString('zh-CN', {hourCycle: 'h23'});
    const date_params = local_datetime.split(' ')[0].split('/');
    const local_date = date_params[1] + '月' + date_params[2] + '日';
    const local_time = local_datetime.split(' ')[1];
    record.local_date = local_date;
    record.local_time = local_time;
    
    if (event_type.startsWith('ihub')) {
      event_type = "基础"
    } else if (event_type.startsWith('tcu')) {
      event_type = "主权"
    }

    record.event_type = event_type;

    // delete unused keys
    delete record.campaign_id;
    delete record.constellation_id;
    // delete record.defender_id;
    delete record.solar_system_id;
    // delete record.start_time;
    delete record.structure_id;
  }
  data.sort( (a, b) => {
    const keyA = Date.parse(a.start_time);
    const keyB = Date.parse(b.start_time);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  })
  // const json_str = JSON.stringify(data);
  // await app.redis.setex(camp_key, 600, json_str);
  return data;
}