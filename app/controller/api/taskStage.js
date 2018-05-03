'use strict';

const Controller = require('egg').Controller;

class TaskStageController extends Controller {

    constructor(ctx) {
        super(ctx);
    }

    async create() {
        const {ctx} = this;
        let params = ctx.request.body;
        let taskStage = new this.ctx.model.ProjectTaskStage({
            _projectId: params._projectId,
            _taskListId: params._taskListId,
            name: params.name,
            title: params.title,
            sort: params.sort
        });
        await taskStage.save();
        ctx.body = taskStage;
    }

    async update() {

    }

    async sorts() {
        const {ctx} = this;
        let params = ctx.request.body;
        let updateData = [];
        for (let i = 0; i < params.length; i++) {
            let stage = params[i];
            await ctx.model.ProjectTaskStage.updateOne({_id: stage._id}, {sort: stage.sort});
        }
        ctx.body = params;
    }
}

module.exports = TaskStageController;
