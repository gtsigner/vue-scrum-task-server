'use strict';
const Md5 = require('md5');
module.exports = {
    /**
     * validate data with rules
     *
     * @param  {Object} rules  - validate rule object, see [parameter](https://github.com/node-modules/parameter)
     * @param  {Object} [data] - validate target, default to `this.request.body`
     */
    validate(rules, data) {
        data = data || this.request.body;
        const errors = this.app.validator.validate(rules, data);
        if (errors) {
            this.throw(422, '验证失败', {code: '参数验证失败', errors});
        }
    },
    md5(str, ec = '#!@#$@#') {
        return Md5(str + ec);
    },
    /**
     * Equals String ObjectId
     * @param v1
     * @param v2
     * @returns {boolean}
     */
    equalsSI(v1, v2) {
        return v1.toString() === v2.toString();
    },

    /**
     * 解析IO数据
     * @param action
     * @param payload
     * @param metadata
     * @returns {{meta: *, data: {action: *, payload}}}
     */
    ioParseMsg(action, payload = {}, metadata = {}) {
        const meta = Object.assign({}, {
            timestamp: Date.now(),
        }, metadata);

        return {
            meta,
            data: {
                action,
                payload,
            },
        };
    },
};
