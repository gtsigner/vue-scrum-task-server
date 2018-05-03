'use strict'
const WxOauth = require('../extend/wechat');


module.exports = (option, app) => {
    return async function oauth(ctx, next) {
        let type = ctx.params.type;
        let options = ctx.app.config.wxPub;
        try {
            if (type === 'wechat') {
                let code = ctx.request.query.code;
                let state = ctx.request.query.state;
                if (!code || !state) {
                    ctx.body = 'ACCESS ERROR';
                    return ctx.status = 500;
                }
                //如果
                let wxIns = new WxOauth(options);
                let res = await wxIns.getAccessToken(code);
                if (!res.access_token) {
                    ctx.logger.error(res);
                    throw new Error('获取AccessToken失败');
                }
                ctx.oauth = res;//设置授权后结果

                ctx.user = await wxIns.getUserInfo(
                    res.openid,
                    res.access_token
                );
                ctx.user.headimgurl = ctx.user.headimgurl.replace(/http:\/\//, 'https://');
                if (ctx.user.errcode) {
                    ctx.body = ctx.user;
                    ctx.status = 500;
                    return false;
                }
                //设置用户信息
            }
            await next();
        } catch (e) {
            console.error(e.message);
            return ctx.redirect('/');
        }
    }
};
