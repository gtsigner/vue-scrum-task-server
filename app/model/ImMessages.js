/**
 * 消息库
 * @param app
 * @returns {*}
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _senderId: String,//发送者ID
        sender: Object,
        _receiverId: String,//接受者ID，通过不同的type来定义接受者ID类型
        receiver: Object,
        type: Number,//1.单聊,2.群组,3.聊天室
        _projectId: String,
        message: String,//消息体
        notification: {
            title: String,
            content: String,
            enabled: Boolean,
        },
        createdAt: Date,
        status: Number//消息状态
    });
    return mongoose.model('ImMessages', Schema, 'ey_im_messages');
};
