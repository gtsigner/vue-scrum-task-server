'use strict';

const Controller = require('egg').Controller;

class AttributeController extends Controller {
    async index() {
        const {ctx} = this;

        let attributes = await ctx.model.Attribute.find({}).sort({'sort':1}).exec();

        console.log(attributes);
        ctx.body = {
            list: attributes,
        }
    }
}

module.exports = AttributeController;
