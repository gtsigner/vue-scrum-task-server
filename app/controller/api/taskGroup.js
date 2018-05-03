'use strict';

const Controller = require('egg').Controller;

class TaskGroupController extends Controller {

    constructor(ctx) {
        super(ctx);

    }

    async index() {
        const {ctx} = this;
        let simpleModel = this.ctx.request.query.simple;
        let categories = [];
        if (simpleModel === true) {
            categories = await ctx.model.Projects.find({}).sort({
                'sort': 1
            }).exec();
        } else {
            //简单模式
            categories = await ctx.model.Projects.find({}).sort({
                'sort': 1
            }).exec();
        }
        ctx.body = categories;

    }

    async show() {
        const {ctx} = this;
        let id = ctx.params.id;
        let category = await ctx.model.Projects.findOne({
            _id: id
        });
        ctx.body = category;
    }

    async update() {

    }


    async create() {
        const {ctx} = this;
        let params = ctx.request.body;
        let res = await this.service.projects.createProject(params);
        ctx.body = res;
    }
}

module.exports = TaskGroupController;
