module.exports = (option, app) => {

    /**
     * 管理员权限鉴别
     */
    return async function auth(ctx, next) {
        let accessToken = ctx.header['Access-Token'] || ctx.session.accessToken;
        if (undefined === accessToken) {
            ctx.body = {code: 401, message: 'please login'};
            return ctx.status = 401;
        }
        let user = null;
        try {
            user = await ctx.app.jwt.verify(accessToken, ctx.app.config.jwt.secret);
            user = await ctx.model.User.findOne({
                _id: user.userId
            });
            ctx.user = user;
        } catch (ex) {
            user = null;
        }
        if (null === user) {
            ctx.body = {
                url: 'http://192.168.1.154:7001/api/v1/oauth',
                type: 'wechat',
                version: '2.0',
                partner: 'wechat',
                message: '授权AccessToken失效',
                code: 401,
            };
            return ctx.status = 401;
        }

        await next();
    }
};