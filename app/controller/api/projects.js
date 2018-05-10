'use strict';

const Controller = require('egg').Controller;
const Enums = require('../../extend/enums')

class ProjectsController extends Controller {

    constructor(ctx) {
        super(ctx);

    }

    async index() {
        const {ctx} = this;
        let simpleModel = this.ctx.request.query.simple;
        let projects = [];
        //获取有权限的项目
        projects = await ctx.model.Projects.find({
            //_creatorId: ctx.user._id
            members: {
                $elemMatch: {_id: ctx.user._id}
            }
        }).sort({
            'sort': 1
        }).exec();
        ctx.body = projects;
    }

    async addUser() {
        const {ctx} = this;
        let id = ctx.params.id;
        //把用户添加到项目里面，需要先判断当前用户是否有权限
        try {
            let userId = ctx.request.body.userId;
            let project = await ctx.model.Projects.findOne({_id: id});
            //权限判断
            if (!project) {
                throw new Error("项目未找到");
            }
            let user = await ctx.model.User.findOne({_id: userId});
            if (!user) {
                throw new Error('不存在该用户');
            }
            let ret = project.members.filter((item) => {
                return item._id.toString() === userId;
            });
            if (ret.length === 0) {
                await  ctx.model.Projects.updateOne({_id: project._id}, {
                    $push: {
                        members: {
                            _id: user._id,
                            username: user.username,
                            nickname: user.nickname,
                            email: user.email,
                            avatar: user.avatar,
                            roles: ['user']
                        }
                    }
                })
            }
            ctx.body = project.members;
        } catch (e) {
            ctx.body = {code: Enums.ApiCodes.FAIL, message: e.message};
            ctx.status = 500;
        }
    }

    async removeMember() {
        const {ctx} = this;
        let id = ctx.params.id;
        //把用户添加到项目里面，需要先判断当前用户是否有权限
        try {
            let userId = ctx.request.body.userId;
            let project = await ctx.model.Projects.findOne({_id: id});
            //权限判断
            if (!project) {
                throw new Error("项目未找到");
            }
            ctx.body = project.members;
        } catch (e) {
            ctx.body = {code: Enums.ApiCodes.FAIL, message: e.message};
            ctx.status = 500;
        }
    }

    async members() {
        const {ctx} = this;
        let id = ctx.params.id;
        try {
            let project = await ctx.model.Projects.findOne({
                _id: id
            });
            if (!project) {

            }
            ctx.body = project.members;
        } catch (e) {
            ctx.body = {
                code: Enums.ApiCodes.FAIL,
                message: e.message
            }
        }
    }


    async show() {
        const {ctx} = this;
        let id = ctx.params.id;
        let project = await ctx.model.Projects.findOne({
            _id: id
        });
        //验证用户权限

        //获取任务列表
        //TODO  使用PromiseAll
        let data = await Promise.all([
            //获取任务List
            ctx.model.ProjectTaskList.findOne({
                _projectId: id
            }),
            //获取任务阶段
            ctx.model.ProjectTaskStage.find({
                _projectId: id
            }).sort({sort: 1}).exec(),
            ctx.model.ProjectTaskGroup.find({
                _projectId: id
            }),
            ctx.model.ProjectMember({
                _projectId: id
            }),
            ctx.model.Collections.findOne({
                _projectId: id,
                type: 'default'
            })
        ]);
        let taskList = data[0];
        let taskStages = data[1];
        let taskGroups = data[2];
        let members = data[3];
        let folder = data[4];
        ctx.body = {
            folder: folder,
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
