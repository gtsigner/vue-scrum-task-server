'use strict';

const Controller = require('egg').Controller;
const WxOauth = require('../../extend/wechat');
const Enums = require('../../extend/enums');

class OauthController extends Controller {
    constructor(ctx) {
        super(ctx);
    }

    index() {
        const {ctx} = this;
        let params = ctx.request.query;
        const wx = new WxOauth({
            appId: 'wx7483be07f37e62bb',
            appSecret: '3060ea260748cd6908b0fa574f65b9d2',
            token: 'zhaojunlike',
            encodingAesKey: '7ZyC2YpPDCuHKx1Cm4uue7WL2MPrVj0b8ca8hPSO7sF',
        });
        let redUrl = wx.getAuthorizeURL(ctx.app.config.web.wxAuthorizeURL, 'wechat');
        ctx.body = {redirect: redUrl};
        ctx.redirect(redUrl);
    }

    async callback() {
        const {ctx} = this;
        //验证用户
        let partnerUser = await ctx.model.PartnerUser.findOne({
            type: 'partner.wechat',
            'bound.openid': ctx.user.openid,
        });
        let user = null;
        //生成PartnerUser
        if (!partnerUser) {
            partnerUser = new ctx.model.PartnerUser({
                _userId: null,
                type: 'partner.wechat',
                bound: ctx.user,
                partner: {},
                status: 1,//状态
            });
            await partnerUser.save();
        } else {
            user = await ctx.model.User.findOne({_id: partnerUser._userId});
        }
        if (!user) {
            //创建用户
            user = new ctx.model.User({
                username: ctx.user.nickname,
                nickname: ctx.user.nickname,
                password: '',
                phone: '',
                email: '',
                alias: [],
                from: 'partner.wechat',
                avatar: ctx.user.headimgurl,
                sex: ctx.user.sex,
                createAt: new Date(),
                lock: false,
                authToken: '',
                score: 0,
                wallet: {
                    tradeMoney: 0,
                    money: 0,
                    freeze: 0,
                },
                credit: {
                    score: 4,
                    money: 0
                },
                counter: {
                    goods: 0,
                    ordered: 0,
                    follower: 1,
                    following: 1,
                    collect: 0
                },
                status: 1,
            });
            await user.save();
            //创建第三方用户
            partnerUser._userId = user._id;
            await partnerUser.save();
            user.alias = [{
                _boundId: partnerUser._id,
                type: partnerUser.type,
                nickname: ctx.user.nickname
            }];
            await user.save();
        }
        //Login
        let authToken = ctx.app.jwt.sign({
            userId: partnerUser._userId,
            openId: ctx.user.openid
        }, ctx.app.config.jwt.secret);
        //授权登陆
        await ctx.model.User.updateOne({_id: partnerUser._userId,}, {authToken: authToken});

        //回调到地址
        ctx.session.accessToken = authToken;
        ctx.session.wxOpenId = ctx.user.openid;
        ctx.cookies.set('access_token', authToken, {
            maxAge: 60 * 60 * 24 * 2
        });
        ctx.cookies.set('wxOpenId', ctx.user.openid, {
            maxAge: 60 * 60 * 24 * 2
        });
        let callUrl = '/';
        //判断用户是否已经绑定了手机号,然后强制绑定手机号
        if (user.phone === '' || !user.phone) {
            callUrl = "/user/bind/phone?access_token=" + authToken;
        } else {
            callUrl = "/user/center?access_token=" + authToken
        }
        console.log("Callback:", callUrl, "OpenId:", ctx.user.openid);
        ctx.redirect(callUrl);
    }

    async login() {
        const {ctx} = this;
        let params = ctx.request.body;
        params.phone = params.username;
        try {
            const sms = ctx.session['PHONE_SMS_CODE'] || null;
            let accessToken = null;
            switch (params.type) {
                case 'LOGIN_PASSWORD':
                    accessToken = await ctx.service.user.loginPwd(params.phone, params.password);
                    break;
                case 'LOGIN_CODE':
                    if (!sms) {
                        throw new Error('请先获取验证码');
                    }
                    if (sms.phone !== params.phone) {
                        throw new Error('与验证手机号码不符');
                    }
                    if (sms.code !== params.code) {
                        throw new Error('验证码验证失败');
                    }
                    accessToken = await ctx.service.user.loginByCode(params);
                    break;
                case 'REGISTER':
                    try {
                        ctx.validate({
                            password: 'password'
                        }, params);
                    } catch (e) {
                        console.log(e);
                        throw new Error('密码要求6-24位数字+字母组合');
                    }
                    if (!sms) {
                        throw new Error('请先获取验证码');
                    }
                    if (sms.phone !== params.phone) {
                        throw new Error('与验证手机号码不符');
                    }
                    if (sms.code !== params.code) {
                        throw new Error('验证码验证失败');
                    }
                    accessToken = await ctx.service.user.register(params);
                    break;
            }
            ctx.cookies.set('access_token', accessToken, {
                maxAge: 60 * 60 * 24 * 2
            });
            ctx.body = {code: Enums.ApiCodes.SUCCESS, access_token: accessToken};
        } catch (ex) {
            ctx.body = {code: Enums.ApiCodes.FAIL, message: ex.message};

            ctx.status = 500;
        }
    }
}

module.exports = OauthController;
