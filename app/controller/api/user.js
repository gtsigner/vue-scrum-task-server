'use strict';

const Controller = require('egg').Controller;
const Enums = require('../../extend/enums');

class UserController extends Controller {

    //验证ID
    async index() {
        const {ctx} = this;
    }

    async me() {
        const {ctx} = this;
        ctx.body = ctx.user;
    }

    async show() {
        const {ctx} = this;
    }

    async visit() {
        const {ctx} = this;
        let id = ctx.params.id;
        let user = await ctx.model.User.findOne({
            _id: id
        }).select('nickname avatar counter credit').exec();
        if (null === user) {
            ctx.body = {
                code: Enums.ApiCodes.FAIL,
                message: 'User not found'
            }
            return ctx.status = 404;
        } else {
            ctx.body = user;
        }
    }

    async bindPhone() {
        const {ctx} = this;
        let params = ctx.request.body;
        const sms = ctx.session['PHONE_SMS_CODE'] || null;
        try {
            if (!sms) {
                throw new Error('验证码失效');
            }
            if (params.code !== sms.code || sms.type !== 'BIND_PHONE') {
                throw new Error('验证码失效或者错误');
            }
            ctx.validate({phone: 'china-phone'}, params);
            if (!/^[A-Za-z0-9]{6,20}$/.test(params.password)) {
                throw new Error('密码要求大于6-20位的英文+数字组合');
            }
            await ctx.service.user.bindPhone(ctx.user._id, params);
            ctx.body = {
                code: Enums.ApiCodes.SUCCESS
            };
        } catch (ex) {
            ctx.body = {code: Enums.ApiCodes.FAIL, message: ex.message};
            ctx.status = 422;
        }

    }

    async create() {

    }

    async recharge() {
        const {ctx} = this;
        ctx.body = {
            code: 1,
        };
    }

    /**
     * 我发布的信息
     * @returns {Promise<void>}
     */
    async publishes() {
        const {ctx} = this;
        try {
            const userId = ctx.params.id || ctx.user._id;
            const $map = {
                _userId: userId
            };
            ctx.body = await ctx.model.Goods.find($map).select('_id title desc _categoryId _userId status total price pics priceNote category price')
                .limit(ctx.pager.limit).skip(ctx.pager.skip).exec();
        } catch (e) {
            ctx.body = [];
            ctx.status = 500;
        }
    }

    /**
     * 搜索
     * @returns {Promise<void>}
     */
    async search() {
        const {ctx} = this;
        let params = ctx.request.query;
        let $where = {
            status: Enums.GoodsStatus.selling.status
        };
        let users = [];
        users = ctx.model.User.find($where);
        users.select('_id avatar nickname');
        users.limit(ctx.pager.limit).skip(ctx.pager.skip);
        ctx.body = await users.exec();
    }

    async finances() {
        const {ctx} = this;
        let financesLogs = await ctx.model.FinanceLogs.find({
            _userId: ctx.user._id
        }).sort({
            date: -1
        }).limit(ctx.pager.limit).skip(ctx.pager.skip).exec();
        ctx.body = financesLogs;
    }

    /**
     * 粉丝
     * @returns {Promise<void>}
     */
    async doFollow() {
        const {ctx} = this;
        const id = ctx.params.id;
        try {


        } catch (e) {
            ctx.status = 500;
        }
    }

    async followers() {

    }
}

module.exports = UserController;
