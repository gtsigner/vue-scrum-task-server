/**
 * 聊天室
 * @param app
 * @returns {*}
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({});
    return mongoose.model('ImRooms', Schema, 'ey_im_rooms');
};
