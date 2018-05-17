'use strict';

const Controller = require('egg').Controller;
const Enums = require('../../extend/enums');

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
        const {ctx} = this;
        const id = ctx.params.id;
        const params = ctx.request.body;
        let res = await ctx.model.ProjectTaskStage.update({
            _id: id
        }, {
            name: params.name
        });

        ctx.body = {code: Enums.ApiCodes.SUCCESS, message: '更新成功'}
    }

    async remove() {
        const {ctx} = this;
        const id = ctx.params.id;

        try {
            //查询是否存在task
            let taskCount = await ctx.model.ProjectTask.count({_stageId: id});
            if (taskCount > 0) {
                throw new Error('请先移出该阶段下得所有任务。');
            }
            let res = await ctx.model.ProjectTaskStage.remove({_id: id});
            ctx.body = {
                message: '删除成功',
                code: Enums.ApiCodes.SUCCESS
            };
        } catch (e) {
            ctx.status = 403;
            ctx.body = {
                message: e.message,
                code: Enums.ApiCodes.FAIL
            }
        }
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
