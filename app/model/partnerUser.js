module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _userId: String,
        bound: Object,
        type: String,//'partner.wechat'
        oauth: Object,
        partner: Object,
        status: Number,//状态
    });
    return mongoose.model('PartnerUser', Schema, 'ey_partner_user');
};
