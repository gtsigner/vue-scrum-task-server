const Service = require('egg').Service;

class ProjectsService extends Service {

    get model() {
        return this.ctx.model.Projects;
    }

    async createProject(params) {
        const {ctx} = this;
        let project = {
            _creatorId: ctx.user._id,
            creator: {
                _id: ctx.user._id,
                nickname: ctx.user.username,
                avatar: ctx.user.avatar
            },
            title: params.title,
            description: params.description,
            logo: params.logo,
            templateId: params.templateId,
            isPublic: false,
            taskTypes: [],
            applications: [],
            tags: [],
            status: 1
        };
        const ProjectEnd = new this.model(project);
        let res = await ProjectEnd.save();
        await this._afterCreatedProject(ProjectEnd);

        return ProjectEnd;
    }

    //在创建完成项目后，需要生成一系列的项目模板
    async _afterCreatedProject(project) {
        if (project.templateId === 0) {
            //普通模板
            await this.createNormalTpl(project);

        } else if (project.templateId === 1) {
            //专业模板
            await this.createScrTpl(project);
        }
    }

    async createScrTpl(project) {
        await this.createScrTaskGroups(project);
        //创建普通的TaskList
        let taskList = await this.createTaskList(project, true);
        let taskStages = await this.createTaskStages(project, taskList);
    }

    /**
     * 生成普通面板
     * @param project
     * @returns {Promise<void>}
     */
    async createNormalTpl(project) {
        await this.createTaskGroup(project);
        let taskList = await this.createTaskList(project, false);
        let taskStages = await this.createTaskStages(project, taskList);
    }

    /**
     * 创建任务列表
     * @param project
     * @param isSmartyGroup
     * @returns {Promise<void>}
     */
    async createTaskList(project, isSmartyGroup = false) {
        const taskList = new this.ctx.model.ProjectTaskList({
            _projectId: project._id,
            title: '任务',
            isSmartyGroup: isSmartyGroup,
            sort: 0
        });
        await taskList.save();
        return taskList;
    }

    /**
     * 生成3个Scrum智能面板
     * @param project
     * @returns {Promise<*>}
     */
    async createScrTaskGroups(project) {
        let groups = [{
            _projectId: project._id,
            _creatorId: project._creatorId,
            name: 'sprint',
            title: '迭代',
            view: {type: 'sprint'},
            type: 'sprint',
            description: '',
            filter: 'sprintStatus = active',
            sort: 1,
        }, {
            _projectId: project._id,
            _creatorId: project._creatorId,
            name: 'story',
            title: '需求',
            view: {type: 'story'},
            type: 'story',
            description: '',
            filter: 'taskType = story',
            sort: 2
        }, {
            _projectId: project._id,
            _creatorId: project._creatorId,
            name: 'bug',
            title: '缺陷',
            view: {type: 'bug'},
            type: 'bug',
            description: '',
            filter: 'taskType = bug',
            sort: 3
        }];
        return await this.ctx.model.ProjectTaskGroup.insertMany(groups);
    }

    /**
     * 生成普通任务面板
     * @param project
     * @returns {Promise<*>}
     */
    async createTaskGroup(project) {
        let groups = [{
            _projectId: project._id,
            _creatorId: project._creatorId,
            name: 'taskList',
            title: '任务',
            view: {type: 'taskList'},
            type: 'taskList',
            description: '',
            filter: 'taskType = taskList',
            sort: 3
        }];
        return await this.ctx.model.ProjectTaskGroup.insertMany(groups);
    }

    /**
     * 创建任务阶段
     * @param project
     * @param taskList
     * @returns {Promise<void>}
     */
    async createTaskStages(project, taskList) {
        const $stages = [{
            _projectId: project._id,
            _taskListId: taskList._id,
            name: '待处理',
            title: '待处理',
            isArchived: false,
            sort: 0
        }, {
            _projectId: project._id,
            _taskListId: taskList._id,
            name: '开发中',
            title: '开发中',
            isArchived: false,
            sort: 1
        }, {
            _projectId: project._id,
            _taskListId: taskList._id,
            name: '测试中',
            title: '测试中',
            isArchived: false,
            sort: 2
        }, {
            _projectId: project._id,
            _taskListId: taskList._id,
            name: '已完成',
            title: '已完成',
            isArchived: false,
            sort: 3
        }];
        return await this.ctx.model.ProjectTaskStage.insertMany($stages);
    }

}

module.exports = ProjectsService;