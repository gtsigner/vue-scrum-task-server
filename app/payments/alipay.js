const fs = require('fs');
const Alipay = require('alipay-mobile');
const path = require('path');

const read = filename => {
    return fs.readFileSync(path.resolve(__dirname + '/../../', filename))
};

//app_id: 开放平台 appid
//appPrivKeyFile: 你的应用私钥
//alipayPubKeyFile: 蚂蚁金服公钥
const options = {
    app_id: '2016122704662248',
    appPrivKeyFile: read('./certs/alipay/pri_key.pem'),
    alipayPubKeyFile: read('./certs/alipay/pub_key.pem')
};
const service = new Alipay(options);


// const params = {
//     out_biz_no: "1234123123",
//     payee_type: 'ALIPAY_LOGONID',
//     payee_account: "1716771371@qq.com",
//     amount: "0.1"
// }
// let order = service.toaccountTransfer(params).then(result => {
//     console.log(result);
// });

module.exports = service;