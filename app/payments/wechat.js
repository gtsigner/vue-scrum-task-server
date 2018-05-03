const fs = require('fs');
const path = require('path');

const read = filename => {
    return fs.readFileSync(path.resolve(__dirname + '/../', filename))
};

const tenpay = require('tenpay');
const config = {
    appid: 'wx7483be07f37e62bb',
    mchid: '1388841602',
    partnerKey: '2632a7174ed146a7190304e15cf548d5',
    pfx: read('./certs/wx/apiclient_cert.p12'),
    notify_url: 'http://game.oeynet.com/api/v1/pay/callback/wx',
    spbill_create_ip: '192.168.1.1'
};
const api = new tenpay(config, true);
api.getConfigs = () => {
    return config;
};
module.exports = api;

