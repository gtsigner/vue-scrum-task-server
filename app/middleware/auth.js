module.exports = (option, app) => {
    return async function auth(ctx, next) {
        let accessToken = ctx.header['access-token'];
        let user = null;
        try {
            user = await ctx.service.user.getUserFromAccessToken(accessToken);
            console.log("Auth User:", user.username || '');
            ctx.user = user;
        } catch (ex) {
            user = null;
        }
        console.log(accessToken);
        if (null === user) {
            ctx.body = {message: '请先登录后操作', code: 401}
            ctx.cookies.set('access_token', null);
            ctx.session.access_token = null;
            return ctx.status = 401;
        }
        await next();
    }
};
