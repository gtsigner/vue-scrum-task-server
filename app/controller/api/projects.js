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
        projects = await ctx.model.Projects.find({
            _creatorId: ctx.user._id
        }).sort({
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
        //验证用户权限

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
        let members = await ctx.model.ProjectMember({
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
        let posts = await this.ctx.model.Posts.find({
            _bindId: projectId,
            type: 'posts.project'
        }).sort({}).exec();
        ctx.body = posts;
    }

    async activities() {
        const {ctx} = this;
        const projectId = ctx.params.id;
        let activities = await this.ctx.model.Activity.find({
            _bindId: projectId,
            type: 'activity.posts.comment'
        }).sort({}).exec();
        ctx.body = activities;
    }

    async create() {
        const {ctx} = this;
        let params = ctx.request.body;
        let res = await this.service.projects.createProject(params);
        ctx.body = res;
    }
}

module.exports = ProjectsController;
