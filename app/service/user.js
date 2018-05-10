const Service = require('egg').Service;

class UserService extends Service {

    get model() {
        return this.ctx.model.User;
    }

    async find() {
        return await this.model.findOne();
    }

    async getUserFromAccessToken(accessToken) {
        const {ctx} = this;
        try {
            let us = await ctx.app.jwt.verify(accessToken,
                ctx.app.config.jwt.secret);
            return await ctx.model.User.findOne({
                _id: us.userId
            });
        } catch (e) {
            return null;
        }
    }

    /**
     * 创建AccessToken
     * @returns {Promise<void>}
     */
    async createAccessToken(user) {
        const {ctx} = this;
        let authToken = ctx.app.jwt.sign({
            userId: user._id,
            phone: user.phone,
        }, ctx.app.config.jwt.secret);
        //授权登陆
        await this.model.updateOne({_id: user._id}, {authToken: authToken});//
        //然后返回AccessToken
        return authToken;
    }

    /**
     * 注册
     * @param params
     * @returns {Promise<void>}
     */
    async register(params) {
        const {ctx} = this;
        let phone = params.phone;
        let user = await this.model.findOne({
            phone: phone
        });
        //Do Login
        let rand = Math.floor(Math.random() * 10) % 9 + 1;
        let avatar = `/static/images/girls/${rand}.jpg`;
        if (!user) {
            user = new this.model({
                phone: phone,
                password: ctx.md5(params.password + ctx.app.config.web.secret),
                username: phone,
                nickname: '手机用户-' + phone,
                from: 'system.register',
                avatar: avatar,
                sex: 0,
                createAt: new Date(),
                lock: false,
                score: 0,
                status: 1,
                counter: {
                    "goods": 0,
                    "ordered": 0,
                    "follower": 1,
                    "following": 1,
                    "collect": 0
                },
                credit: {
                    score: 4,
                },
                wallet: {
                    tradeMoney: 0,
                    money: 0,
                    freeze: 0
                },
                alias: [],
            });
            await user.save();
        } else {
            throw new Error('对不起,用户已经存在');
        }
        return await this.createAccessToken(user);
    }

    /**
     * 通过验证码登陆
     * @param params
     * @returns {Promise<void>}
     */
    async loginByCode(params) {
        let user = await this.model.findOne({
            phone: params.phone
        });
        if (!user) {
            throw new Error('用户不存在,请先注册');
        }
        return await this.createAccessToken(user);
    }

    /**
     * 通过密码登陆
     * @param username
     * @param password
     * @returns {Promise<void>}
     */
    async loginPwd(username, password) {
        const {ctx} = this;
        let user = await this.model.findOne({
            phone: username,
            password: ctx.md5(password + ctx.app.config.web.secret)
        });
        if (null === user) {
            throw new Error('用户名或者密码错误');
        }
        return await this.createAccessToken(user);
    }

    async bindPhone(_userId, params) {
        const {ctx} = this;
        let user = await this.model.findOne({_id: _userId});
        if (null !== await this.model.findOne({phone: params.phone})) {
            throw new Error('该手机号码已绑定了其他用户,请更换');
        }
        const alias = {
            _boundId: '',
            type: 'partner.phone',
            nickname: params.phone,
            data: params.phone
        };
        await this.model.update({_id: _userId}, {
            $set: {
                phone: params.phone,
                password: ctx.md5(params.password + ctx.app.config.web.secret)
            }, $push: {'alias': alias}
        });
        return true;
    }


    /**
     *操作钱包
     * @param _userId
     * @param walletType
     * @param money
     * @param bound
     * @param note
     * @returns {Promise<void>}
     */
    async actionWallet(_userId, walletType, money, bound, note, mark) {
        const {ctx} = this;
        await ctx.model.FinanceLogs.create({
            _userId: _userId,
            money: money,
            walletType: walletType,
            note: note,
            mark: mark,
            isInc: (money > 0),
            bound: bound,
            date: new Date(),
            status: 1
        });
        const mInc = {};
        mInc[walletType] = money;

        let ups = await ctx.model.User.updateOne({_id: _userId}, {$inc: mInc});
        console.log(mInc, ups);
    }
}

module.exports = UserService;
