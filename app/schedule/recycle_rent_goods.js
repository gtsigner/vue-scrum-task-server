const Subscription = require('egg').Subscription;
const Enums = require('../extend/enums');

class RecycleRentGoods extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '3s', // 1 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    // 回收超过时间未付款的订单
    async subscribe() {

        await this.action();
    }

    async action() {
        const {ctx} = this;
        //查找超时未支付的订单
        let orders = await ctx.model.Order.find({
            status: Enums.OrderSteps.taped.status,//被拍下
        }).lte('dates.recycle', new Date()).exec();
        orders.forEach(async (order) => {
            //取消订单
            await ctx.service.order.cancelBuyerOrder(order._id, order._buyerId);
        })
    }
}

module.exports = RecycleRentGoods;
