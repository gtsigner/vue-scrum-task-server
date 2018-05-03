'use strict';

const Controller = require('egg').Controller;

class CallbackController extends Controller {
    async pay() {
        const {ctx} = this;
        let params = ctx.request.body;
    }
}

module.exports = CallbackController;
