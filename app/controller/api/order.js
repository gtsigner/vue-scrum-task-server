'use strict';

const Controller = require('egg').Controller;
const OrderNo = require('order-no');
const Moment = require('moment');
const Enums = require('../../extend/enums');

class OrderController extends Controller {
    async index() {
        this.ctx.status = 404;
    }

    /**
     * 创建订单
     * @returns {Promise<*>}
     */
    async create() {
        const {ctx} = this;
        try {
            let params = ctx.request.body;
            let goods = await ctx.model.Goods.findOne({
                _id: params._goodsId
            });
            if (null === goods) {
                return ctx.body = null;
            }
            if (ctx.equalsSI(goods._userId, ctx.user._id)) {
                ctx.body = {code: Enums.ApiCodes.FAIL, message: '不能购买自己的商品'};
                return ctx.status = 400;
            }
            if (goods.status !== Enums.GoodsStatus.selling.status) {
                ctx.body = {code: Enums.ApiCodes.FAIL, message: '商品已下架或者已经出售'};
                return ctx.status = 400;
            }

            goods.status = Enums.GoodsStatus.taped.status;//被拍下

            let order = new ctx.model.Order();
            order.orderNo = Moment().format('YYYYMMDDHHss') + OrderNo.makeOrderNo(1, 5);
            order.goodsList = [];
            order._buyerId = ctx.user._id;
            order.buyer = {
                _id: ctx.user._id,
                nickname: ctx.user.nickname,
                avatar: ctx.user.avatar
            };
            order._sellerId = goods._userId;
            order.seller = goods.seller;//seller
            //计算价格
            order._paymentsId = '';
            order.payment = {};
            order.steps = [];//处于的阶段
            order.type = Enums.OrderType.rent;//租号
            order.status = Enums.OrderSteps.taped.status;//已拍下
            order.address = {};
            order.createDate = new Date();
            let goodsPrice = goods.attributes[params.price.key];
            if (params.price.key === 'hour_price'
                && params.price.count < goods.attributes.min_hour_count) {
                throw new Error('购买商品失败');
            }
            if (params.price.key !== 'hour_price') {
                params.price.count = 1;
            }
            order.money = goodsPrice.value * params.price.count;//费用
            let buyGoods = {
                _id: goods._id,
                pic: goods.pics[0],
                title: goods.title,
                price: params.price.price,//单价
                count: params.price.count,//购买数量
                hour: ctx.helper.parseHour(params.price.key)
            };
            order.goodsList.push(buyGoods);
            order.boundData = {};//其他的一些数据信息

            //默认接下来需要做那些事情
            order.steps.push({
                step: Enums.OrderSteps.taped.key,
                name: '已拍下',
                date: new Date(),
                note: '用户下单',
                finish: true,
                status: Enums.OrderSteps.taped.status
            });
            order.dates = {
                recycle: Moment().add('5', 'm').toDate()//5分钟未付款回收商品
            };

            await order.save();
            await goods.save();
            ctx.body = {
                data: {_id: order._id},
                code: Enums.ApiCodes.SUCCESS
            };
        } catch (ex) {
            ctx.body = ex;
            ctx.status = 402;
        }
    }

    async buyer() {
        const {ctx} = this;
        let params = ctx.request.query;
        let userId = ctx.user._id;

        let $where = {
            _buyerId: userId
        };

        if (params.status !== '') {
            $where.status = parseInt(params.status);
        }
        let orders = await ctx.model.Order.find($where)
            .sort({createDate: -1})
            .limit(ctx.pager.limit)
            .skip(ctx.pager.skip)
            .exec();

        ctx.body = orders;
    }

    async seller() {
        const {ctx} = this;
        let params = ctx.request.query;
        let userId = ctx.user._id;

        let $where = {
            _sellerId: userId
        };

        if (params.status !== '') {
            $where.status = parseInt(params.status);
        }
        let orders = await ctx.model.Order.find($where)
            .sort({createDate: -1})
            .limit(ctx.pager.limit)
            .skip(ctx.pager.skip)
            .exec();
        ctx.body = orders;
    }


    //确认收货
    async sureReced() {

    }

    //确认发货
    async sureSended() {

    }


    /**
     * 获取订单信息
     * @returns {Promise<void>}
     */
    async show() {
        const {ctx} = this;
        try {
            const order = await ctx.model.Order.findOne({
                _id: ctx.params.id,
            });
            if (!order) {
                throw new Error('未找到相关订单信息');
            }
            if (!ctx.equalsSI(order._buyerId, ctx.user._id) && !ctx.equalsSI(order._sellerId, ctx.user._id)) {
                throw new Error('您无权获取此订单信息');
            }
            ctx.body = order;
            ctx.status = 200;
        } catch (e) {
            ctx.body = {message: e.message, code: Enums.ApiCodes.FAIL};
            ctx.status = 500;
        }
    }

    async search() {

    }

    async delete() {

    }

    /**
     * 取消订单
     * @returns {Promise<number>}
     */
    async cancel() {
        const {ctx} = this;
        let params = ctx.params;
        let order = await ctx.model.Order.findOne({_id: params.id});
        try {
            if (!order) {
                throw new Error("找不到订单");
            }
            if (order.status !== Enums.OrderSteps.taped.status) {
                throw new Error('订单已经付款或已取消');
            }
            //如果是买家取消订单
            if (ctx.equalsSI(order._buyerId, ctx.user._id)) {
                await ctx.service.order.cancelBuyerOrder(order._id);
            }
            //如果是卖家取消订单
            if (ctx.equalsSI(order._sellerId, ctx.user._id)) {
                await ctx.service.order.cancelSellerOrder(order._id);
            }
            ctx.body = {
                code: Enums.ApiCodes.SUCCESS,
                message: '订单取消成功'
            };
        } catch (e) {
            ctx.body = {
                code: Enums.ApiCodes.FAIL,
                message: e.message
            };
            ctx.status = 500;
        }
    }

    /**
     * 确认收货
     * @returns {Promise<void>}
     */
    async received() {
        const {ctx} = this;
        const params = ctx.params;
        try {
            let id = params.id;
            let order = await ctx.model.Order.findOne({
                _buyerId: ctx.user._id,
                _id: id
            });
            if (order.status !== Enums.OrderSteps.shipped.status) {
                throw new Error("商品不可以调整状态");
            }
            //给用户余额账户打款
            await ctx.service.order.received(order);
            ctx.body = {code: Enums.ApiCodes.SUCCESS};
            ctx.status = 200;
        } catch (e) {
            ctx.body = {
                code: Enums.ApiCodes.FAIL,
                message: e.message
            };
            ctx.status = 404;
        }
    }

    /**
     * 发货
     * @returns {Promise<void>}
     */
    async shipped() {
        const {ctx} = this;
        const params = ctx.params;
        try {
            const id = params.id;
            let order = await ctx.model.Order.findOne({
                _id: id,
                _sellerId: ctx.user._id,//买家权限
            });
            if (!order) {
                throw new Error('未找到相关订单');
            }
            if (order.type === Enums.OrderType.rent && order.status === Enums.OrderSteps.payed.status) {
                await ctx.service.order.shipOrder(order._id, order._sellerId);
            }
            ctx.body = {message: "发货成功", code: Enums.ApiCodes.SUCCESS};
        } catch (e) {
            ctx.body = {message: e.message, code: Enums.ApiCodes.FAIL};
            ctx.status = 500;
        }
    }

    async comment() {
        const {ctx} = this;
        const id = ctx.params.id;
        try {
            const comment = ctx.request.body;
            //#region 数据验证
            ctx.validate({
                rate: {
                    type: 'int',
                    min: 0,
                    max: 5
                },
                content: {
                    type: 'string',
                    min: 5,
                    max: 100,
                }
            }, comment);
            //#endregion 数据验证
            comment.content = ctx.helper.escape(comment.content);
            comment.date = new Date();
            comment.nickname = ctx.user.nickname;
            comment.avatar = ctx.user.avatar;
            //获取订单
            let order = await ctx.model.Order.findOne({_id: id}).select('_id _buyerId _sellerId comments').exec();

            //验证是否是卖家或者买家
            if (ctx.equalsSI(order._buyerId, ctx.user._id)) {
                //买家评价
                await ctx.model.Order.updateOne({_id: id}, {
                    $set: {
                        'comments.buyer': comment
                    }
                });
            } else if (ctx.equalsSI(order._sellerId, ctx.user._id)) {
                //卖家评价
                await ctx.model.Order.updateOne({_id: id}, {
                    $set: {
                        'comments.seller': comment
                    }
                });
            } else {
                throw new Error('您无权访问');
            }
            //增加一条评论记录
            await new ctx.model.Comments({
                _creatorId: ctx.user._id,
                _boundObjectId: order._id,
                boundType: 'order._id',
                boundData: {
                    _orderId: order._id,
                    _sellerId: order._sellerId,
                    _buyerId: order._buyerId,
                    money: order.money
                },
                action: Enums.CommentsType.rent,
                comment: comment
            }).save();
            ctx.body = {
                code: Enums.ApiCodes.SUCCESS,
            };
            ctx.status = 200;
        } catch (e) {
            ctx.body = {
                code: Enums.ApiCodes.FAIL,
                message: e.message
            };
            ctx.status = 500;
        }
    }
}

module.exports = OrderController;
