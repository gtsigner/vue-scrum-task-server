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
        let map = {};
        map._teamId = ctx.request.query._teamId || '';
        projects = await ctx.model.Projects.find({
            //_creatorId: ctx.user._id
            ...map,
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
        const {ctx} = this;
        let id = ctx.params.id;
        let params = ctx.request.body;
        await ctx.model.Projects.update({
            _id: id,
        }, {name: params.name, title: params.title});
        let project = await ctx.model.Projects.findOne({_id: id});
        ctx.body = project;
    }


    /**
     * 统计
     * @returns {Promise<void>}
     */
    async total() {
        const {ctx} = this;
        const id = ctx.params.id;
        let taskNoDone = await ctx.model.ProjectTask.count({
            _projectId: id,
            status: 0
        });
        let taskDone = await ctx.model.ProjectTask.count({
            _projectId: id,
            status: 1
        });
        let taskTotal = taskNoDone + taskDone;


        ctx.body = [
            {title: '未完成', count: taskNoDone, rate: taskNoDone / taskTotal * 100 || 0, color: '#77C2F8'},
            {title: '已完成', count: taskDone, rate: taskDone / taskTotal * 100 || 0, color: '#9ED979'},
            {title: '任务总量', count: taskTotal, rate: taskDone / taskTotal * 100 || 0, color: '#77C2F8'},
            {title: '今日到期', count: 0, rate: 0, color: '#ff0a05'},
            {title: '已逾期', count: 0, rate: 0, color: '#ff5b0f'},
            {title: '待认领', count: 0, rate: 0, color: '#FFC774'},
            {title: '按时完成', count: 0, rate: 0, color: '#9ED979'},
            {title: '逾期完成', count: 0, rate: 0, color: '#ff7e09'},
        ];
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
        try {
            let params = ctx.request.body;
            let res = await this.service.projects.createProject(params);
            ctx.body = res;
        } catch (e) {
            ctx.body = {
                code: Enums.ApiCodes.FAIL,
                message: '项目创建失败,信息填写不完整.' + e.message
            };
            ctx.status = 403;
        }
    }
}

module.exports = ProjectsController;
