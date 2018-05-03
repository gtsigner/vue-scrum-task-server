/**
 * 群组
 * @param app
 * @returns {*}
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _userId: String,
        users: [Object]
    });
    return mongoose.model('ImChatList', Schema, 'ey_im_chats');
};
