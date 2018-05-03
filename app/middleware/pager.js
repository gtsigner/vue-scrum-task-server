module.exports = (option, app) => {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }


    return async function pager(ctx, next) {
        let params = ctx.request.query;//
        try {
            let p = parseInt(params.p);
            p = (isNaN(p) || p <= 0) ? 1 : p;
            let limit = ctx.app.config.web.pageLimit;
            delete params.p;

            ctx.params = params;
            ctx.pager = {
                p: p,
                limit: limit,
                skip: (p - 1) * limit
            };
        } catch (ex) {
            ctx.pager = {
                p: 1,
                limit: 10,
                skip: 0
            }

            ctx.params = {}
        }
        //模拟1000
        await sleep(200);
        await next();
    }
};
