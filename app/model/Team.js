/**
 * 组织
 * @param app
 * @returns {*}
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        name: String,//群标题
        desc: String,//群描述
        members: Array,
        projects: Array,
        date: Date,//创建日期
    });
    return mongoose.model('Team', Schema, 'ey_teams');
};
