module.exports = (option, app) => {
    return async function (ctx, next) {
        await next();
    }
};
