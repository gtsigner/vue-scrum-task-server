// {app_root}/app/io/controller/default.js
'use strict';

const Controller = require('egg').Controller;

class MessageController extends Controller {
    async ping() {
        const {ctx, app} = this;
        const message = ctx.args[0];
        //广播
        await ctx.socket.emit('res', `Hi! I've got your message: ${message}`);
    }
}

module.exports = MessageController;
