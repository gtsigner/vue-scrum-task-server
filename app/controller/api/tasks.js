'use strict';

const Controller = require('egg').Controller;
const Enums = require('../../extend/enums')

class TaskListController extends Controller {

    constructor(ctx) {
        super(ctx);

    }

    async index() {
        const {ctx} = this;
        const search = {
            _projectId: ctx.query._projectId,
            _stageId: ctx.query._stageId,
            //_creatorId: ctx.user._id
        };
        //简单模式
        let tasks = await ctx.model.ProjectTask.find(search).sort({
            'sort': 1
        }).exec();
        ctx.body = tasks;

    }

    async update() {
        const {ctx} = this;
        const id = ctx.params.id;

        ctx.body = {};
    }

    async status() {
        const {ctx} = this;
        const id = ctx.params.id;
        let task = ctx.request.body;
        let res = await ctx.model.ProjectTask.update({
            _id: id
        }, {status: task.status});
        ctx.body = {};
    }

    async group() {
        const {ctx} = this;
        const params = ctx.request.query;
        let $w = {
            _taskGroupId: params._groupId,
            _projectId: params._projectId
        }
        let tasks = await ctx.model.ProjectTask.find($w);
        ctx.body = tasks;
    }

    async move() {
        const {ctx} = this;
        const taskId = ctx.params.id;
        const params = ctx.request.body;
        try {
            let task = await ctx.model.ProjectTask.findOne({
                _id: taskId
            });
            if (!task) {
                throw new Error('无权限操作这项任务')
            }
            task._stageId = ctx.request.body._stageId;
            await task.save();
            //


            ctx.body = task;
        } catch (e) {
            ctx.body = {
                message: e.message,
                code: Enums.ApiCodes.FAIL
            }
            ctx.status = 500;
        }
    }

    async create() {
        const {ctx, app} = this;
        let params = ctx.request.body;
        let task = new this.ctx.model.ProjectTask({
            ...params,
            _creatorId: ctx.user._id,
            creator: {
                _id: ctx.user._id,
                username: ctx.user.username,
                avatar: ctx.user.avatar
            }
        });
        let res = await task.save();//保存新任务
        ctx.body = task;
    }
}

module.exports = TaskListController;
