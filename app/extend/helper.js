const moment = require('moment')

// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD hh:mm:ss')

// 处理成功响应
exports.success = ({ctx, res = null, msg = '请求成功'}) => {
    ctx.body = {
        code: 0,
        data: res,
        msg
    };
    ctx.status = 200
};
//INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的
exports.invalid = ({ctx, res = null, code = 0, error = '请求失败'}) => {
    ctx.body = {
        code: code,
        data: res,
        error: error,
    };
    ctx.status = 400
};

exports.fail = ({ctx, res = null, code = 1040, error = '操作失败'}) => {
    ctx.body = {
        code: code,
        data: res,
        error: error,
    };
    ctx.status = 400
};

exports.parseHour = (key) => {
    let h = 0;
    switch (key) {
        case 'week_price':
            h = 7 * 24;
            break;
        case 'day_price':
            h = 24;
            break;
        case '10hour_price':
            h = 10;
            break;
        case 'night_price':
            h = 8;
            break;
        case 'hour_price':
            h = 1;
            break;
    }
    return h;
};

/**
 * 生成SMS codes
 * @returns {string}
 */
exports.randomSMSCode = () => {
    let nums = "0123456789".split('').sort(() => {
        return Math.random() > .5 ? -1 : 1;
    });
    return nums.splice(0, 6).join('');
}