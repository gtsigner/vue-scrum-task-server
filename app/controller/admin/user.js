'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    async index() {
        const {ctx} = this;

        const pager = ctx.pager;
        let users = await ctx.model.User.find(ctx.params)
            .limit(pager.limit).skip(pager.skip).exec();

        let count = await ctx.model.User.count();

        pager.total = count;
        ctx.body = {
            list: users,
            pager: ctx.pager
        }

    }


    async update(){
        const{ctx} = this;
        let user = ctx.request.body;

        console.info('更新',user);

        user = await ctx.model.User.update(
            {_id:user._id},
            {$set:user}
        );
        ctx.body = user;
    }

    async show() {
        const {ctx} = this;
        let user = await ctx.model.User.findOne({
            _id: ctx.params.id
        });
        ctx.body = user;
    }

    async destroy(){
        const {ctx} = this;
        console.log('删除id',ctx.params.id);

        let res = await ctx.model.User.remove({'_id':ctx.params.id},(error)=>{
            console.log('删除错误：',error);
        });

        console.log('删除完成',res);
        ctx.body = res;
    }

}

module.exports = UserController;
