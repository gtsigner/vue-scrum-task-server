'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {
    async index() {
        const {ctx} = this;
        const pager = ctx.pager;

        let categories = await ctx.model.Category.find(ctx.params)
            .limit(pager.limit).skip(pager.skip).sort({'sort':1}).exec();

        let count = await ctx.model.Category.count();
        pager.total = count;
        ctx.body = {
            list: categories,
            pager: ctx.pager
        };
    }

    async show(){
        const {ctx} = this;
        let category = await ctx.model.Category.findOne({
            _id:ctx.params.id
        });
        ctx.body = category;
    }

    async update(){
        const{ctx} = this;
        let category = ctx.request.body;
        console.info('更新',category);
        let resp= await ctx.model.Category.update(
            {_id:category._id},
            {$set:category}
        );
        ctx.body = resp;
    }

    async create(){
        const{ctx} = this;
        let category = ctx.request.body;
        category = new ctx.model.Category(category);
        await category.save();
        ctx.body = category;
    }

    async destroy(){
        const {ctx} = this;
        let res = await ctx.model.Category.remove({'_id':ctx.params.id},(error)=>{
            console.log('删除错误：',error);
        });

        console.log('删除完成',res);
        ctx.body = res;
    }
}

module.exports = CategoryController;
