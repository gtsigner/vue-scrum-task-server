module.exports = () => {
    return async (ctx, next) => {
        const {app, socket, logger, helper} = ctx;
        const socketId = socket.id;
        const mt = ctx.packet[0];
        if (mt === 'auth.login') {
            //如果是授权信息，就跳过
            return await next();
        }
        let user = await app.redis.get(`USER_SOCKET_ID_${socketId}`);
        if (!user) {
            //如果不存在认证信息,通知客户端进行认证
            return socket.emit('auth.deny', {message: 'no auth'});
        }
        ctx.user = JSON.parse(user);
        await next();
    }
};
