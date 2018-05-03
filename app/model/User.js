module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        username: {
            type: String,
            unique: true
        },
        nickname: String,
        phone: {
            type: String,
            length: 11
        },
        password: String,
        email: String,
        alias: Array,//匿名登陆信息
        from: Object,
        avatar: String,
        sex: Number,
        createAt: Date,
        lock: Boolean,//加锁
        authToken: String,
        score: Number,
        wallet: {
            //交易账户金额
            money: {
                type: Number,
                required: true,
                min: 0//限制最低金额
            },

            //冻结金额
            freeze: {
                type: Number,
                required: true,
                min: 0
            },
        },
        credit: {
            score: Number,//信誉积分
        },
        counter: {
            goods: Number,
            ordered: Number,
            follower: Number,
            following: Number,
            collect: Number,
        },
        status: Number,//状态
    });
    const model = mongoose.model('User', Schema, 'ey_users');
    return model;
};