'use strict';

const Controller = require('egg').Controller;

class TaskListController extends Controller {

    constructor(ctx) {
        super(ctx);

    }

    async index() {
        const {ctx} = this;
        const search = {
            _projectId: ctx.query._projectId,
            _stageId: ctx.query._stageId,
            _creatorId: ctx.user._id
        };
        //简单模式
        let tasks = await ctx.model.ProjectTask.find(search).sort({
            'sort': 1
        }).exec();
        ctx.body = tasks;

    }

    async update() {

    }

    async move() {
        const {ctx} = this;
        const taskId = ctx.params.id;
        ctx.body = {
            _id: taskId
        };
    }

    async create() {
        const {ctx} = this;
        let params = ctx.request.body;
        let task = new this.ctx.model.ProjectTask({
            ...params,
            _creatorId: ctx.user._id,
        });
        await task.save();
        ctx.body = task;
    }
}

module.exports = TaskListController;
