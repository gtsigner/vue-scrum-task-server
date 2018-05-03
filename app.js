// app.js
const moment = require('moment');
const Md5 = require('md5')
module.exports = app => {
    // 使用 app 对象
    app.sessionStore = {
        async get(key) {
            const res = await app.redis.get(key);
            if (!res) return null;
            return JSON.parse(res);
        },
        async set(key, value, maxAge) {
            // maxAge not present means session cookies
            // we can't exactly know the maxAge and just set an appropriate value like one day
            if (!maxAge) maxAge = 24 * 60 * 60 * 1000;
            value = JSON.stringify(value);
            await app.redis.set(key, value, 'PX', maxAge);
        },
        async destroy(key) {
            await app.redis.del(key);
        },
    };
    console.error("#########################################################");
    /**
     * 扩展验证器
     */
    app.validator.addRule('china-phone', (rule, value) => {
        //手机号11位数
        if (!/^1[\d][0-9]\d{8}$/.test(value)) {
            console.log('手机号码错误');
            return '手机号码错误';
        }
    });
    app.md5 = (str, ec = '#!@#$@#') => {
        return Md5(str + ec);
    }
    app.moment = moment;
};
