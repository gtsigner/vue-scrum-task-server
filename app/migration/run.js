class mig {
    constructor() {
        let paymentAlipay = new this.ctx.model.Payments({
            name: '支付宝支付',
            logo: 'https://img-oeygame-com.oss-cn-shenzhen.aliyuncs.com/assets-resource/payment_alipay.png',
            options: {
                appId: '',
            },
            type: 'payments.*',
            certs: {},
            status: 1,
        });
        let paymentWeChat = new this.ctx.model.Payments({
            name: '微信支付',
            logo: 'https://img-oeygame-com.oss-cn-shenzhen.aliyuncs.com/assets-resource/payment_wechat.png',
            options: {
                appId: '',
            },
            type: 'payments.*',
            certs: {},
            status: 1,
        });
    }
}