'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
    async index() {
        const {ctx} = this;

        console.log(ctx.params);

        const pager = ctx.pager;

        let orders = await ctx.model.Order.find(ctx.params)
            .limit(pager.limit).skip(pager.skip).sort({'createDate':-1}).exec();

        let count = await ctx.model.Order.count();

        pager.total = count;
        ctx.body = {
            list: orders,
            pager: ctx.pager
        }

    }


    async update(){
        const{ctx} = this;
        let order = ctx.request.body;

        console.info('更新',order);

        order = await ctx.model.Order.update(
            {_id:order._id},
            {$set:order}
        );
        ctx.body = order;
    }

    async show() {
        const {ctx} = this;
        let order = await ctx.model.Order.findOne({
            _id: ctx.params.id
        });
        ctx.body = order;
    }

    async destroy(){
        const {ctx} = this;
        console.log('删除id',ctx.params.id);

        let res = await ctx.model.Order.remove({'_id':ctx.params.id},(error)=>{
            console.log('删除错误：',error);
        });

        console.log('删除完成',res);
        ctx.body = res;
    }

}

module.exports = OrderController;
