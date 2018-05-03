'use strict';

const Controller = require('egg').Controller;

class GoodsController extends Controller {
    async index() {
        const {ctx} = this;

        const pager = ctx.pager;
        console.log(ctx.params);

        let goods = await ctx.model.Goods.find(ctx.params)
            .limit(pager.limit).skip(pager.skip).sort({'sort':1}).exec();

        let count = await ctx.model.Goods.count();

        pager.total = count;
        ctx.body = {
            list: goods,
            pager: ctx.pager
        }

    }


    async update(){
        const{ctx} = this;
        let goods = ctx.request.body;

        console.info('更新',goods);

        goods = await ctx.model.Goods.update(
            {_id:goods._id},
            {$set:goods}
        );
        ctx.body = goods;
    }

    async show() {
        const {ctx} = this;
        let goods = await ctx.model.Goods.findOne({
            _id: ctx.params.id
        });
        ctx.body = goods;
    }


    async destroy(){
        const {ctx} = this;
        console.log('删除id',ctx.params.id);

        let res = await ctx.model.Goods.remove({'_id':ctx.params.id},(error)=>{
            console.log('删除错误：',error);
        });

        console.log('删除完成',res);
        ctx.body = res;
    }

}

module.exports = GoodsController;
