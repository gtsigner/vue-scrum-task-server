'use strict';

const Controller = require('egg').Controller;

class ProjectsController extends Controller {

    constructor(ctx) {
        super(ctx);

    }

    async index() {
        const {ctx} = this;
        let simpleModel = this.ctx.request.query.simple;
        let projects = [];
        projects = await ctx.model.Projects.find({}).sort({
            'sort': 1
        }).exec();
        ctx.body = projects;
    }

    async show() {
        const {ctx} = this;
        let id = ctx.params.id;
        let project = await ctx.model.Projects.findOne({
            _id: id
        });
        //获取任务列表
        let taskList = await ctx.model.ProjectTaskList.findOne({
            _projectId: id
        });
        let taskStages = await ctx.model.ProjectTaskStage.find({
            _projectId: id
        }).sort({sort: 1}).exec();
        let taskGroups = await ctx.model.ProjectTaskGroup.find({
            _projectId: id
        });
        ctx.body = {
            project: project,
            taskList: taskList,
            taskStages: taskStages,
            taskGroups: taskGroups
        };
    }

    async update() {

    }

    async posts() {
        const {ctx} = this;
        const projectId = ctx.params.id;
        ctx.body = [];
    }

    async create() {
        const {ctx} = this;
        let params = ctx.request.body;
        let res = await this.service.projects.createProject(params);
        ctx.body = res;
    }
}

module.exports = ProjectsController;
