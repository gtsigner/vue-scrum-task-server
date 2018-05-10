'use strict';

const Controller = require('egg').Controller;


module.exports = class ChatController extends Controller {
    async list() {
        const {ctx} = this;
        let chatList = await ctx.service.im.getChatList(ctx.user._id);
        ctx.body = chatList;
    }

    async chatList() {

    }

    //历史消息
    async historyGroupMsg() {
        const {ctx} = this;
        let _projectId = ctx.query._projectId;//组
        let chatList = await ctx.model.ImMessages.find({
            _projectId: _projectId
        }).limit(ctx.pager.limit)
            .skip(ctx.pager.skip)
            .exec();
        ctx.body = chatList;
    }
};
