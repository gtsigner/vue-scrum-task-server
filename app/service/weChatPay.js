const Service = require('egg').Service;
const TenPay = require('../payments/wechat');

class WeChatPayService extends Service {

    get model() {
        return this.ctx.model.Payment;
    }

    async jsApiPay(orderNo, body, money, openId) {
        // 该方法需先调用api.unifiedOrder统一下单, 获取prepay_id;
        let result = await TenPay.getPayParams({
            out_trade_no: '' + orderNo,
            body: body,
            total_fee: money * 100,
            openid: openId
        });
        return result;
    }
};
module.exports = WeChatPayService;
