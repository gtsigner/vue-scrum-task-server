const Subscription = require('egg').Subscription;
const Enums = require('../extend/enums');

class AutoFinishOrder extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '5s', // 1 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    // 回收超过时间未付款的订单
    async subscribe() {
        await this.handleGoodsOrder();
    }

    async handleGoodsOrder() {
        const {ctx} = this;
        //未确认收货的
        let orders = await ctx.model.Order.find({
            type: Enums.OrderType.rent,
            status: Enums.OrderSteps.shipped.status//已发货
        }).lte('dates.endDate', new Date()).exec();
    }
}

module.exports = AutoFinishOrder;
