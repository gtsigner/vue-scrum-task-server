// {app_root}/app/io/controller/default.js
'use strict';

const Controller = require('egg').Controller;
const Enums = require('../../extend/enums')

class ChatController extends Controller {
    async message() {
        const {ctx, app} = this;
        const msg = ctx.args[0] || {};
        const socket = ctx.socket;
        const nsp = app.io.of('/');
        const toSocketId = await app.redis.get('SOCKET_ID_' + msg.payload.to);
        nsp.to(toSocketId).emit('chat.message', ctx.ioParseMsg('chat.message', {
            message: msg.payload.message
        }));
        nsp.to(socket.id).emit('chat.message', ctx.ioParseMsg('chat.message', {
            message: msg.payload.message
        }))
    }

    async group() {

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
