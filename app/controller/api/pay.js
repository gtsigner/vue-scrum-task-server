'use strict';

const Controller = require('egg').Controller;
const Enums = require('../../extend/enums');

class PayController extends Controller {

    async initPayment() {

        let paymentWallet = new this.ctx.model.Payments({
            name: '余额支付',
            logo: 'https://img-oeygame-com.oss-cn-shenzhen.aliyuncs.com/assets-resource/payment_wallet.png',
            options: {
                driver: 'payments.WxPay',
                //notify_url: 'your notify url',
                //trade_type: 'JSAPI', //APP, JSAPI, NATIVE etc.
            },
            action: '',
            type: 'payments.wallet',
            sort: 0,
            status: 1,
        });
        let paymentAlipay = new this.ctx.model.Payments({
            name: '支付宝支付',
            logo: 'https://img-oeygame-com.oss-cn-shenzhen.aliyuncs.com/assets-resource/payment_alipay.png',
            options: {
                appId: '',
            },
            action: '',
            type: 'payments.alipay',
            certs: {},
            sort: 1,
            status: 1,
        });
        let paymentWeChat = new this.ctx.model.Payments({
            name: '微信支付',
            logo: 'https://img-oeygame-com.oss-cn-shenzhen.aliyuncs.com/assets-resource/payment_wechat.png',
            options: {
                driver: 'payments.WxPay',
                appid: 'wx7483be07f37e62bb',
                mch_id: '1388841602',
                apiKey: '2632a7174ed146a7190304e15cf548d5', //微信商户平台API密钥
                pfx: '',
                //notify_url: 'your notify url',
                //trade_type: 'JSAPI', //APP, JSAPI, NATIVE etc.
            },
            action: '',
            type: 'payments.wechat',
            certs: {},
            sort: 2,
            status: 1,
        });

        await paymentAlipay.save();
        await paymentWeChat.save();
        await paymentWallet.save();
    }

    /**
     * 获取支付方式
     * @returns {Promise<void>}
     */
    async payments() {
        const {ctx} = this;
        //await this.initPayment();
        let payments = await ctx.model.Payments.find({
            status: 1
        }).sort({
            sort: 1
        }).select('_id name type logo status').exec();
        ctx.body = payments;
        ctx.status = 200;
    }

    /**
     * 请求支付，可能直接返回支付成功，可能返回一个packet
     * @returns {Promise<*>}
     */
    async reqPay() {
        const {ctx} = this;
        const id = ctx.params.id;
        let req = ctx.request.body;
        let paymentId = req.paymentId || '';
        let payment = await ctx.model.Payments.findOne({_id: paymentId});
        try {
            let order = await ctx.model.Order.findOne({
                _id: id, _buyerId: ctx.user._id
            });
            if (!order) {
                throw new Error('不存在的订单');
            }
            //寻找支付方式
            if (!payment) {
                throw new Error('不存在的支付方式');
            }
            //只有订单拍下才可以进行付款
            if (order.status !== Enums.OrderSteps.taped.status) {
                throw new Error('该订单不可进行支付');
            }
            let payRes = await ctx.service.pay.doPay(order, payment);
            ctx.body = {
                code: Enums.ApiCodes.SUCCESS,
                action: payment.type,
                data: payRes
            };
        } catch (ex) {
            ctx.body = {action: payment.type, message: ex.message, code: Enums.ApiCodes.FAIL};
            ctx.status = 500;
        }
    }

    async initWxPay() {
        const {ctx} = this;
        ctx.body = ctx.service.weChatPay.getJsSdkConfig();
    }

    /**
     * 微信支付成功后回调
     * @returns {Promise<void>}
     */
    async callback_wx() {
        const {ctx} = this;
        const weixin = ctx.request.weixin;
        try {
            await ctx.service.pay.wxPaySuccessCb(weixin);
            ctx.reply();
        } catch (e) {
            ctx.body = {code: Enums.ApiCodes.FAIL, message: e.message};
            ctx.status = 500;
        }
    }

    async wx_refund() {

    }

    /**
     * 获取自己的订单
     * @returns {Promise<void>}
     */
    async order() {
        const {ctx} = this;
        try {
            const id = ctx.params.id;
            const order = await ctx.model.Order.findOne({
                _buyerId: ctx.user._id,
                _id: id,
                status: Enums.OrderSteps.taped.status//可以支付的状态
            });
            if (!order) {
                throw new Error("Order null");
            }
            ctx.body = order;
        } catch (e) {
            ctx.body = {code: Enums.ApiCodes.FAIL, message: '订单不存在'};
            ctx.status = 404;
        }

    }
}

module.exports = PayController;
