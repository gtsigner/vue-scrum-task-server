'use strict';

const Controller = require('egg').Controller;

class AttributeController extends Controller {
    async index() {
        this.ctx.body = 'hi, egg';
    }
}

module.exports = AttributeController;
