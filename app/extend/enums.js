exports.GameType = {
    0: '全部',
    1: '手游',
    2: '端游',
    3: '影视',
    4: '其他'
};

exports.ErrCodes = {
    1000: '操作成功',
    1040: '操作失败',
};

exports.AttributeType = {
    'select': {},//多选
    'radio': {},//单选
    'check': {},//勾选
    'text': {},//文本
    'number': {},//数字
    'decimal': {},//金额
};

exports.ActivityActions = {
    'pay': 'user.order.pay'
};

exports.PaymentsType = {
    'wallet': 'payments.wallet',
    'alipay': 'payments.alipay',
    'wechat': 'payments.wechat',
};

/*订单类型*/
exports.OrderType = {
    'rent': 'orders.rent',//租号
    'agent': 'orders.agent',//代练
    'play': 'orders.play',//陪玩
    'trade': 'orders.trade'//账号交易
};


exports.BoundObjectIdType = {
    'activity': 'activity._id',
    'order': 'activity._id'
};

exports.GoodsStatus = {
    'banning': {
        note: '未审核',
        status: 0,
    },
    'selling': {
        note: '售卖中',
        status: 1,
    },
    'taped': {
        note: '被拍下',
        status: 2,
    },
    'sold': {
        note: '已出租',
        status: 3,
    },
    'stock': {
        note: '已下架',
        status: 4,
    },
};
/**
 * 交易状态
 * @type {{taped: {note: string, key: string, status: number}, payed: {note: string, key: string, status: number}, shipped: {note: string, key: string, status: number}, taked: {note: string, key: string, status: number}, completed: {note: string, key: string, status: number}, canceled: {note: string, key: string, status: number}, refunded: {note: string, key: string, status: number}}}
 */
exports.OrderSteps = {
    'taped': {
        note: '已拍下',
        key: 'taped',
        status: 1,
    },
    'payed': {
        note: '已付款',
        key: 'payed',
        status: 2,
    },
    'shipped': {
        note: '待收货',
        key: 'shipped',
        status: 3,
    },
    'completed': {
        note: '已完成',
        key: 'completed',
        status: 6,
    },
    'canceled': {
        note: '交易关闭',
        key: 'canceled',
        status: 9,
    },
    'refunded': {
        note: '已退款',
        key: 'refunded',
        status: 10,
    },
};
exports.ApiCodes = {
    SUCCESS: 1001,
    FAIL: 1004,
    NOT_FOUND: 1404,
};

exports.SmsCodesType = {
    LOGIN_CODE: 'login_code',
    REGISTER: 'register',
    BIND_PHONE: 'bind_phone'
};

exports.PartnerType = {
    Wechat: 'partner.wechat',
    Alipay: 'partner.alipay',
    Tecent: 'partner.qq',
}

exports.CommentsType = {
    rent: 'order.rent.comments',
}

exports.UserWalletType = {
    trade: 'wallet.tradeMoney',
    money: 'wallet.money',
    freeze: 'wallet.freeze'
};

exports.REDIS_KEYS = {
    CHAT_USER_STACK: 'chat_user_stack_',
    WX_ACCESS_TOKEN: 'pub_access_token',
    WX_JSSDK_TICKET: 'wx_js_sdk_ticket'
}
