const Service = require('egg').Service;
const TenPay = require('../payments/wechat');
const WeChat = require('../extend/wechat');
const Enums = require('../extend/enums')
const Sha1 = require('sha1');
const QueryString = require('querystring')

class WxChatService extends Service {

    async getJsSdkConf() {
        const {app} = this;
        let pars = {
            appId: app.config.wxPub.appId, // 必填，公众号的唯一标识
            timestamp: new Date().getTime() / 1000 | 0, // 必填，生成签名的时间戳
            nonceStr: "ogame" + Math.random(), // 必填，生成签名的随机串
        };
        let ticket = await this.getJsSdkTicket();
        pars.signature = WxChatService.signJsSdkConf({
            jsapi_ticket: ticket,
            noncestr: pars.nonceStr,
            timestamp: pars.timestamp,
            url: 'http://game.oeynet.com/'
        });
        pars.debug = false;
        return pars;
    }

    /**
     * 生成签名
     * @param params
     * @returns {string}
     */
    static signJsSdkConf(params) {
        const str = decodeURIComponent(QueryString.stringify(params));
        return Sha1(str);
    }

    async getAccessToken() {
        const {ctx, app, logger} = this;
        let options = ctx.app.config.wxPub;
        let wc = new WeChat(options);
        let token = await app.redis.get(Enums.REDIS_KEYS.WX_ACCESS_TOKEN);
        if (!token) {
            let res = await wc.getCreAccessToken();
            if (!res.access_token) {
                throw new Error(res);
            }
            token = res.access_token;
            await app.redis.set(Enums.REDIS_KEYS.WX_ACCESS_TOKEN, token, 'ex', 7000);
        }
        return token;
    }

    async getJsSdkTicket() {
        const {ctx, app, logger} = this;
        let options = ctx.app.config.wxPub;
        let wc = new WeChat(options);
        let ticket = await app.redis.get(Enums.REDIS_KEYS.WX_JSSDK_TICKET);
        if (!ticket) {
            let token = await this.getAccessToken();
            let res = await wc.getJsSdkTicket(token);
            ticket = res.ticket || false;
            if (!ticket) {
                throw new Error(res);
            }
            await app.redis.set(Enums.REDIS_KEYS.WX_JSSDK_TICKET, ticket, 'ex', 7000);
        }
        return ticket;
    }
}

module.exports = WxChatService;
