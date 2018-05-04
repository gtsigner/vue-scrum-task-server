'use strict';

const Controller = require('egg').Controller;


module.exports = class ActivityController extends Controller {
    index() {
        const {ctx} = this;
    }

    create() {
        const {ctx} = this;
        let params = ctx.request.body;
    }

    show() {
        const {ctx} = this;
        let id = ctx.params.id;
    }
}
