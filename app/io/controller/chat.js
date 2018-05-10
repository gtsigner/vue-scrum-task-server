// {app_root}/app/io/controller/default.js
'use strict';

const Controller = require('egg').Controller;
const Enums = require('../../extend/enums')

class ChatController extends Controller {
    /**
     * 接收消息，然后存储转发
     * @returns {Promise<void>}
     */
    async message() {
        const {ctx, app} = this;
        const msg = ctx.args[0] || {};
        const socket = ctx.socket;
        const nsp = app.io.of('/');
        //查看消息类型
        switch (msg.action) {
            case 'chat.room':
                //聊天室信息
                const roomId = `room_${msg.payload.to}`;
                let newMsg = {
                    _senderId: ctx.user._id,
                    sender: {
                        _id: ctx.user._id,
                        username: ctx.user.username,
                        nickname: ctx.user.nickname,
                        avatar: ctx.user.avatar,
                    },
                    _receiverId: msg.payload.projectId,//接受者ID，通过不同的type来定义接受者ID类型
                    _projectId: msg.payload._projectId,
                    receiver: {},
                    type: 3,
                    message: msg.payload.message,
                    notification: {},
                    createdAt: new Date(),
                    status: 1
                };
                nsp.to(roomId).emit('chat.message', ctx.ioParseMsg('chat.message', newMsg));
                await ctx.model.ImMessages.create(newMsg);
                break;
            case 'chat.user':
                //和用户聊天
                const toSocketId = await app.redis.get('SOCKET_ID_' + msg.payload.to);
                nsp.to(toSocketId).emit('chat.message', ctx.ioParseMsg('chat.message', {
                    message: msg.payload.message
                }));
                nsp.to(socket.id).emit('chat.message', ctx.ioParseMsg('chat.message', {
                    message: msg.payload.message
                }))
                break;
        }
    }

    //进入到某个群组
    async group() {

    }

    /**
     * 用户加入某个房间什么的
     * @returns {Promise<void>}
     */
    async room() {
        const {ctx, app} = this;
        const msg = ctx.args[0] || {};
        const socket = ctx.socket;
        const nsp = app.io.of('/');
        const roomId = `room_${msg.payload.projectId}`;

        switch (msg.action) {
            case 'change.room':
                await socket.join(roomId);
                //给房间的人广播消息
                nsp.to(roomId).emit('chat.message', ctx.ioParseMsg('chat.room.join', {
                    message: `用户${ctx.user.nickname}加入了房间`,
                    projectId: msg.payload.projectId
                }));
                break;
        }
    }

    /**
     * 获取在线的用户
     * @returns {Promise<void>}
     */
    async roomOnline() {

    }

    async toUser() {

    }

    /**
     * 准备和某个用户聊天
     * @returns {Promise<void>}
     */
    async user() {
        const {ctx, app} = this;
        const msg = ctx.args[0] || {};
        const socket = ctx.socket;
        const client = socket.id;
        const nsp = app.io.of('/');
        await ctx.service.im.addChatList(ctx.user, msg.user);

        //通知其他的用户,他的聊天表也更新了
        socket.emit('chat.list', {
            action: 'chat.list.update',
            message: 'Update'
        });
        let toUserSid = await app.redis.get(`SOCKET_ID_${msg.user._id}`);
        if (toUserSid) {
            nsp.to(toUserSid).emit('chat.list', {
                action: 'chat.list.update',
                message: 'Update'
            });
        }
    }

    async auth() {
        const {ctx, helper} = this;

    }
}

module.exports = ChatController;
