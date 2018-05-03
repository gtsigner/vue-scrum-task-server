const Service = require('egg').Service;
const Enums = require('../extend/enums');
const moment = require('moment');

class PayService extends Service {

    get model() {
        return this.ctx.model.Pay;
    }

    async doPay(order, payment) {
        const {ctx} = this;
        switch (payment.type) {
            case Enums.PaymentsType.wallet:
                return await this._payByWallet(order._buyerId, order);
                break;
            case Enums.PaymentsType.alipay:
                return await this._payByWeChat(order._buyerId, order);
                break;
            case Enums.PaymentsType.wechat:
                return await this._payByWeChat(order._buyerId, order);
                break;
            default:
                break;
        }
        return false;
    }

    async _payByWallet(userId, order) {
        const {ctx} = this;
        order.money = Math.abs(order.money);
        //Step1://扣除用户余额

        //TODO 高并发 Important
        if (ctx.user.wallet.tradeMoney < order.money) {
            throw new Error('账户余额不足,请前往充值');
        }

        await ctx.service.user.actionWallet(userId,
            Enums.UserWalletType.trade,
            -1 * order.money,
            {
                oldMoney: ctx.user.wallet.tradeMoney,
                _orderId: order._id,
                _buyerId: order._buyerId,
                _sellerId: order._sellerId
            }, `用户支付订单[${order._id}]消费[${order.money}]元`, '租号订单消费');

        const newStep = {
            step: Enums.OrderSteps.payed.key,
            name: '待发货',
            action: '',
            date: new Date(),
            note: '用户已完成订单支付',
            status: Enums.OrderSteps.payed.status,
            finish: true
        };
        //Step3:修改交易订单
        await ctx.model.Order.update({_id: order._id},
            {
                $set: {
                    status: Enums.OrderSteps.payed.status,//已经付款
                },
                $push: {
                    steps: newStep
                }
            });
        order.status = Enums.OrderSteps.payed.status;
        await this._afterPaySuccess(order);
        return {success: true};
    }

    async _payByWeChat(userId, order) {
        const {ctx} = this;
        let partner = await ctx.model.PartnerUser.findOne({
            type: Enums.PartnerType.Wechat,
            _userId: ctx.user._id
        });
        if (!partner) {
            throw new Error('对不起,该用户不是微信公众号用户');
        }
        return await ctx.service.weChatPay.jsApiPay(order._id, '充值', 1, partner.bound.openid);
    }

    async wxPaySuccessCb(weixin) {
        const {ctx} = this;
        const orderId = weixin.out_trade_no;
        const money = weixin.total_fee / 100;
        let order = await ctx.model.Order.findOne({
            _id: orderId
        });
        if (!order) {
            throw new Error('不存在订单');
        }
        //cash_fee

        //TODO 如果用户中途取消了订单
        if (order.status === Enums.OrderSteps.canceled.status) {
            //判断是否是用户未付款之前进行的取消
            //退款
            await ctx.model.User.updateOne({
                _id: order._buyerId
            }, {
                $inc: {
                    'wallet.money': order.money
                }
            });
            await ctx.service.User.actionWallet(order._buyerId, Enums.UserWalletType.money,
                order.money, {
                    _orderId: order._id,
                    ...weixin
                },
                `用户微信支付订单[${order._id}]退款${money}元`, '缺货退款');
            //登记日志
            //标记订单退款状态
            order.status = Enums.OrderSteps.refunded.status;
        }
        if (order.status === Enums.OrderSteps.taped.status) {
            order.status = Enums.OrderSteps.payed.status;//已经付款
        }
        await order.save();


        //#region   查看是否需要自动发货
        await this._afterPaySuccess(order);
        //#endregion
    }

    /**
     * 在支付过后进行的事情
     * @param order
     * @returns {Promise<Boolean>}
     * @private
     */
    async _afterPaySuccess(order) {
        const {ctx} = this;
        //直接发货
        if (order.type === Enums.OrderType.rent && order.status === Enums.OrderSteps.payed.status) {
            return await ctx.service.order.shipOrder(order._id, order._sellerId);
        }
    }

}

module.exports = PayService;
