const Service = require('egg').Service;
const Enums = require('../extend/enums');

class OrderService extends Service {

    get model() {
        return this.ctx.model.Goods;
    }

    find(params) {
        return this.model.find(params);
    }

    simple(params) {
        return this.model.find(params)
            .select('_id name title logo')
    }

    async findOne(params) {
        return await this.model.findOne(params);
    }

    async create(goods) {

    }

    /**
     * 取消一个没有支付的订单
     * @param orderId
     * @param _buyerId
     * @returns {Promise<boolean>}
     */
    async cancelBuyerOrder(orderId, _buyerId) {
        const {ctx} = this;
        const newStep = {
            step: Enums.OrderSteps.canceled.key,
            name: '已取消',
            action: '',
            date: new Date(),
            note: '买家取消订单',
            status: Enums.OrderSteps.canceled.status,
            finish: true
        };

        let order = await ctx.model.Order.findOne({
            _id: orderId,
            _buyerId: _buyerId || ctx.user._id,
            status: Enums.OrderSteps.taped.status
        });
        let goods = order.goodsList[0];
        await ctx.model.Order.updateOne({
            _id: orderId
        }, {
            $push: {
                steps: newStep
            },
            $set: {
                status: Enums.OrderSteps.canceled.status
            }
        });
        await ctx.model.Goods.update({
            _id: goods._id
        }, {
            $set: {
                status: Enums.GoodsStatus.selling.status
            }
        });
    }

    /**
     * 卖家主动取消订单
     * @param orderId
     * @returns {Promise<void>}
     */
    async cancelSellerOrder(orderId) {
        const {ctx} = this;
        const newStep = {
            step: Enums.OrderSteps.canceled.key,
            name: '已取消',
            action: '',
            date: new Date(),
            note: '卖家取消订单',
            status: Enums.OrderSteps.canceled.status,
            finish: true
        };

        let order = await ctx.model.Order.findOne({
            _id: orderId,
            _sellerId: ctx.user._id,
            status: Enums.OrderSteps.taped.status
        });
        let goods = order.goodsList[0];
        await ctx.model.Order.updateOne({
            _id: orderId
        }, {
            $push: {
                steps: newStep
            },
            $set: {
                status: Enums.OrderSteps.canceled.status
            }
        });
        await ctx.model.Goods.update({
            _id: goods._id
        }, {
            $set: {
                status: Enums.GoodsStatus.selling.status//还原商品状态
            }
        });
    }


    /**
     * 发货一个订单
     * @param orderId
     * @param sellerId
     * @returns {Promise<boolean>} Boolean
     */
    async shipOrder(orderId, sellerId) {
        const {ctx} = this;
        let order = await ctx.model.Order.findOne({
            _id: orderId,
            _sellerId: sellerId,
            status: Enums.OrderSteps.payed.status
        });
        if (!order) {
            throw new Error("不能操作此订单");
        }
        //1.获取商品信息添加到BoundData
        let goodsItem = order.goodsList[0];
        let goods = await ctx.model.Goods.findOne({
            _id: order.goodsList[0]._id
        });
        let boundData = {
            username: goods.attributes.username.value,
            password: goods.attributes.password.value,
            hour: goodsItem.hour * goodsItem.count,
            startDate: new Date(),
            endDate: ctx.app.moment().add(goodsItem.hour * goodsItem.count, 'hours').toDate()
        };
        goods.status = Enums.GoodsStatus.sold.status;//已出售
        await goods.save();
        //给用户发送通知消息
        const newStep = {
            step: Enums.OrderSteps.shipped.key,
            name: '待收货',
            action: '',
            date: new Date(),
            note: '已发货',
            status: Enums.OrderSteps.shipped.status,
            finish: true
        };
        await this.ctx.model.Order.update({_id: order._id}, {
            $set: {
                status: Enums.OrderSteps.shipped.status,//已经付款
                boundData: boundData
            },
            $push: {
                steps: newStep
            }
        });
        return true;
    }

    /**
     * 一个订单进行收货处理
     * @param order
     * @returns {Promise<void>}
     */
    async received(order) {
        const {ctx} = this;
        order.money = Math.abs(order.money);
        /*打款给用户*/
        await ctx.service.user.actionWallet(order._sellerId,
            Enums.UserWalletType.money,
            order.money, {
                _orderId: order._id, _buyerId: order._buyerId
            }, `租号交易订单[${order._id}]交易成功到账[${order.money}]元`, '租号交易收入');

        //标记交易完成,但是未评价
        order.status = Enums.OrderSteps.completed.status;
        await order.save();

        //将商品置于下架状态，需要他们修改密码后重新上架
        await ctx.model.Goods.update({
            _id: order.goodsList[0]._id,
        }, {
            $set: {
                status: Enums.GoodsStatus.stock.status
            },//下架商品
        });
    }
}

module.exports = OrderService;
