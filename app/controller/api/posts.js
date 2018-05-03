'use strict';

const Controller = require('egg').Controller;

class PostsController extends Controller {
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

module.exports = PostsController;