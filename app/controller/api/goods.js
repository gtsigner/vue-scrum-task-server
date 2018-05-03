'use strict';

const Controller = require('egg').Controller;
const Enums = require('../../extend/enums');

class GoodsController extends Controller {

    async index() {
        const {ctx} = this;
        let params = ctx.request.query;
        let $where = {
            status: Enums.GoodsStatus.selling.status
        };
        if (params.categoryId) {
            $where._categoryId = params.categoryId;
        }
        let goodsList = [];
        if (params.position) {
            goodsList = ctx.model.Goods.find($where);
        } else {
            goodsList = ctx.model.Goods.find($where);
        }
        goodsList.select('_id _userId _categoryId total title seller status priceNote price category pics');
        goodsList.limit(ctx.pager.limit).skip(ctx.pager.skip);
        ctx.body = await goodsList.exec();
    }

    async create() {
        const {ctx} = this;
        let goods = ctx.request.body;
        try {
            //Validate
            delete goods._id;
            let category = await ctx.model.Category.findOne({
                _id: goods._categoryId
            }).select('_id name title logo').exec();

            let attributes = {};

            goods.attributes.forEach((attr) => {
                if (attr.type === 'money') {
                    attr.value = Math.abs(attr.value);
                }
                attributes[attr.key] = {
                    key: attr.key,
                    note: attr.note,
                    name: attr.name,
                    value: attr.value,
                    type: attr.type,
                    sort: attr.sort,
                    group: attr.group
                };
                if (attr.required && attr.value === '') {
                    throw new Error(`请检查[${attr.name}]是否填写`);
                }
            });
            goods.priceNote = `${attributes.hour_price.value}元/小时`;
            goods._userId = ctx.user._id;//发不人
            goods.seller = {
                _id: ctx.user._id,
                nickname: ctx.user.nickname,
                avatar: ctx.user.avatar
            };//卖家
            goods.category = category;
            goods.attributes = attributes;
            goods.price = Math.abs(goods.price);
            goods.sort = 100;
            if (goods.price <= 0) {
                throw new Error('商品价格必须>0元');
            }
            goods.total = {
                view: 1,
                collect: 1,
                buy: 0
            };
            //goods.status = Enums.GoodsStatus.banning.status;//默认出售中
            goods.status = Enums.GoodsStatus.selling.status;//默认出售中
            //验证Pics
            let gModel = new ctx.model.Goods(goods);
            ctx.body = await gModel.save();
        } catch (e) {
            console.log(e);
            ctx.body = {
                code: Enums.ApiCodes.FAIL,
                message: '发布商品失败:' + e.message
            }
        }
    }

    async update() {
        const {ctx} = this;
        let goods = ctx.request.body;

        try {
            let oldGoods = await ctx.model.Goods.findOne({
                _id: goods._id,
                _userId: ctx.user._id
            });
            if (!oldGoods) {
                throw new Error('商品不存在');
            }
            //Validate
            let category = await ctx.model.Category.findOne({_id: goods._categoryId}).select('_id name title logo').exec();

            let attributes = {};
            goods.attributes.forEach((attr) => {
                if (attr.type === 'money') {
                    attr.value = Math.abs(attr.value);
                }
                attributes[attr.key] = {
                    key: attr.key,
                    note: attr.note,
                    name: attr.name,
                    value: attr.value,
                    type: attr.type,
                    sort: attr.sort,
                    group: attr.group
                };
                if (attr.required && attr.value === '') {
                    throw new Error(`请检查[${attr.name}]是否填写`);
                }
            });
            goods.priceNote = `${attributes.hour_price.value}元/小时`;
            goods._userId = ctx.user._id;//发不人
            goods.seller = {
                _id: ctx.user._id,
                nickname: ctx.user.nickname,
                avatar: ctx.user.avatar
            };//卖家
            goods.category = category;
            goods.attributes = attributes;
            goods.price = Math.abs(goods.price);
            if (goods.price <= 0) {
                throw new Error('商品价格必须>0元');
            }

            //还原状态
            goods.total = oldGoods.total;
            goods.status = oldGoods.status;

            //验证Pics
            await ctx.model.Goods.updateOne({_id: goods._id, _userId: ctx.user._id}, goods);
            ctx.body = goods;
        } catch (e) {
            ctx.body = {
                code: Enums.ApiCodes.FAIL,
                message: '修改失败,' + e.message
            }
        }
    }

    /**
     * 获取自己发布的信息
     * @returns {Promise<number>}
     */
    async show() {
        const {ctx} = this;
        let id = ctx.params.id;
        try {
            let goods = await ctx.service.goods.findOneMy({
                _id: id,
                _userId: ctx.user._id
            });
            if (null === goods) {
                throw new Error("Not Found");
            }
            ctx.body = goods;
        } catch (e) {
            ctx.body = {
                code: Enums.ApiCodes.FAIL,
                message: '您获取的商品已不存在'
            };
            return ctx.status = 404;
        }
    }

    async visit() {
        const {ctx} = this;
        let id = ctx.params.id;
        try {
            let goods = await ctx.service.goods.visit(id);
            if (null === goods) {
                throw new Error("Not Found");
            }
            ctx.body = goods;
        } catch (e) {
            ctx.body = {code: Enums.ApiCodes.FAIL, message: '您获取的商品已不存在'};
            return ctx.status = 404;
        }
    }

    async outStock() {
        const {ctx} = this;
        const id = ctx.params.id;
        await ctx.model.Goods.updateOne({
            _id: id,
            _userId: ctx.user._id,
            status: Enums.GoodsStatus.selling.status
        }, {
            $set: {
                status: Enums.GoodsStatus.stock.status,
                'dates.publish': new Date(),
                'dates.stockOut': new Date(),
            }
        });
        ctx.body = {
            code: Enums.ApiCodes.SUCCESS
        };
        ctx.status = 200;
    }

    /**
     * 只有下架的商品才可以进行上架处理
     * @returns {Promise<void>}
     */
    async publish() {
        const {ctx} = this;
        const id = ctx.params.id;
        await ctx.model.Goods.updateOne({
            _id: id,
            _userId: ctx.user._id,
            status: Enums.GoodsStatus.stock.status
        }, {
            $set: {
                status: Enums.GoodsStatus.selling.status,
                'dates.publish': new Date(),
                'dates.stockOut': new Date(),
            }
        });
        const newGoods = await ctx.service.goods.findOneGoodsSimple({_id: id, _userId: ctx.user._id});
        ctx.body = {
            data: {
                goods: newGoods
            },
            code: Enums.ApiCodes.SUCCESS
        };
        ctx.status = 200;
    }
}

module.exports = GoodsController;
