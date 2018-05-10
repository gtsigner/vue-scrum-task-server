/**
 * 聊天室
 * @param app
 * @returns {*}
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        boundToObjectType: String,
        created: Date,
        isMute: false,
        noReply: false,
        project: Object,
        updated: Date,
        _boundToObjectId: String,
        _projectId: String,
        _userIds: [],
    });
    return mongoose.model('ImRooms', Schema, 'ey_im_rooms');
};
