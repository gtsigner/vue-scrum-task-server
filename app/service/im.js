const Service = require('egg').Service;

const Keys = require('../extend/consts/redisKeys');

/**
 * Im服务
 */
class ImService extends Service {

    setUserSocketId(userId, socketId) {

    }

    getUserSocketId(userId) {

    }

    getUserIdFromSocketId(socketId) {

    }

    async getChatList(userId) {
        const {ctx, app} = this;
        let userChatObj = await app.redis.hgetall(Keys.userChatListKey(userId));
        let chatList = [];
        Object.keys(userChatObj).forEach((k) => {
            let chat = JSON.parse(userChatObj[k]);
            chatList.push(chat);
        });
        chatList = chatList.sort((a, b) => {
            return b.timestamp - a.timestamp;
        });
        return chatList;
    }

    async addChatList(fromUser, toUser) {
        const {ctx, app} = this;
        //增加到自己的表
        await app.redis.hset(Keys.userChatListKey(fromUser._id),
            toUser._id,
            //存储
            JSON.stringify({
                timestamp: new Date().getTime(),
                _id: toUser._id,
                type: 'chat',
                avatar: toUser.avatar,
                name: toUser.nickname,
                message: `Hello I'm ${fromUser.nickname}`
            }));
        //增加到对象的表
        await app.redis.hset(Keys.userChatListKey(toUser._id),
            fromUser._id,
            //存储
            JSON.stringify({
                timestamp: new Date().getTime(),
                _id: fromUser._id,
                type: 'chat',
                avatar: fromUser.avatar,
                name: fromUser.nickname,
                message: `Hello I'm ${toUser.nickname}`
            }));
    }

}

module.exports = ImService;
