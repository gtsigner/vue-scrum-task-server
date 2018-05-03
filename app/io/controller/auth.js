// {app_root}/app/io/controller/default.js
'use strict';

const Controller = require('egg').Controller;

class AuthController extends Controller {
    async login() {
        const {ctx, app} = this;
        const message = ctx.args[0] || {};
        try {
            const at = message.payload.accessToken;
            const user = await ctx.service.user.getUserFromAccessToken(at);
            if (!user) {
                throw new Error("Auth.login: NotFoundUser");
            }
            const socket = ctx.socket;
            //过期时间不用太久,Web停留时间本身就不是很长
            await app.redis.set(`SOCKET_ID_${user._id}`, socket.id, 'ex', 60 * 1000);//绑定SocketId
            await app.redis.set(`USER_SOCKET_ID_${socket.id}`, JSON.stringify({
                _id: user._id,
                nickname: user.nickname,
                avatar: user.avatar
            }), 'ex', 60 * 1000);
            //通知授权成功
            const nsp = app.io.of('/');
            console.log("Login:", user.nickname, socket.id);
            nsp.to(socket.id).emit('notice.auth', {code: 1});
        } catch (e) {
            console.log(e.message);
        }
    }
}

module.exports = AuthController;
