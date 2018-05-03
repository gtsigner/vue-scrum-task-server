'use strict';

const Controller = require('egg').Controller;

class ChatController extends Controller {
    async list() {
        const {ctx} = this;
        let chatList = await ctx.service.im.getChatList(ctx.user._id);
        ctx.body = chatList;
    }
}

module.exports = ChatController;
