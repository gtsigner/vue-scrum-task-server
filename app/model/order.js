module.exports = app => {
    const mongoose = app.mongoose;
    const mSchema = mongoose.Schema;

    const StepSchema = new mongoose.Schema({
        step: String,
        name: String,
        date: Date,//完成日期
        note: String,
        finish: Boolean,
        status: Number,
    });
    const GoodsSchema = new mongoose.Schema({
        _id: mSchema.Types.ObjectId,
        pic: String,
        title: String,
        price: Number,
        count: Number,
        hour: Number
    });

    /**
     * 订单信息
     * @type {mongoose.Schema}
     */
    const Schema = new mongoose.Schema({
        orderNo: {
            type: String,
            unique: true
        },
        _buyerId: String,//购买人
        _sellerId: String,//售卖人
        _paymentId: String,//支付方式ID

        buyer: Object,
        seller: Object,

        type: String,//'shop.game.rent'//Enums.OrderType

        goodsList: [GoodsSchema],//商品信息
        money: Number,//付款总额

        dates: {
            finish: Date,
            recycle: Date,//回收时间
        },
        comments: {
            buyer: Object,
            seller: Object
        },
        boundData: Object,
        address: Object,//收货地址
        payment: Object,//付款方式

        createDate: Date,

        canceled: Object,//取消
        steps: [StepSchema],
        status: Number,//状态
    });
    return mongoose.model('Order', Schema, 'ey_orders');
};
