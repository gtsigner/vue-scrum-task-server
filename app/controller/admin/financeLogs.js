'use strict';

const Controller = require('egg').Controller;

class FinanceLogsController extends Controller {
    async index() {
        const {ctx} = this;
        const pager = ctx.pager;

        console.log(ctx.params);

        let logs = await ctx.model.FinanceLogs.find(ctx.params)
            .limit(pager.limit).skip(pager.skip).exec();
        ctx.body = {
            list: logs,
            pager:ctx.pager
        }
    }



    async destroy(){
        const {ctx} = this;
        let res = await ctx.model.FinanceLogs.remove({'_id':ctx.params.id},(error)=>{
            console.log('删除错误：',error);
        });
        ctx.body = res;
    }

}

module.exports = FinanceLogsController;
