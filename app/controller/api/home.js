'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        this.ctx.body = 'hi, egg';

    }

    async configs() {
        const {ctx} = this;
        ctx.body = {
            avatarUploadUri: ctx.app.config.web.base + '/api/v1/upload/avatar'
        };
    }

    //*获取短信验证码*//
    async sendSmsCode() {
        const {ctx} = this;
        let params = ctx.request.body;
        try {
            await ctx.service.smsCode.sendSmsCode(params);
            ctx.body = {code: 1001};
        } catch (ex) {
            ctx.body = {code: 1004, message: ex.message};
            ctx.status = 400;
        }
    }

    async wxJsConf() {
        const {ctx} = this;
        ctx.body = await ctx.service.wechat.getJsSdkConf();
    }
}

module.exports = HomeController;
