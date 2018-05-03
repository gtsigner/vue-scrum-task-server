/**
 * 群组
 * @param app
 * @returns {*}
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        title: String,//群标题
        desc: String,//群描述
        users: [String],
        avatar: String,
        count: {
            user: Number,
            online: Number
        },
        date: Date,//创建日期
    });
    return mongoose.model('ImGroups', Schema, 'ey_im_groups');
};
