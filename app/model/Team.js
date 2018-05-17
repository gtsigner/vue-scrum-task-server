/**
 * 组织
 * @param app
 * @returns {*}
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _creatorId: String,//创建者
        creator: Object, /*创始人*/
        name: String,//群标题
        region: String,
        desc: String,//群描述
        date: Date,//创建日期
    });
    return mongoose.model('Team', Schema, 'ey_teams');
};
