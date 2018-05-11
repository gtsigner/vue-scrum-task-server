'use strict';

const Controller = require('egg').Controller;

class XXController extends Controller {
    async index() {
        const {ctx} = this;
        const _projectId = ctx.request.query._projectId;
        ctx.body = await ctx.model.GitRepository.find({
            _projectId: _projectId
        });
    }

    /**
     * 创建一个新的仓库
     * @returns {Promise<void>}
     */
    async create() {
        const {ctx, app} = this;
        let params = ctx.request.body;

        //Git名称是路径加上
        const project = await ctx.model.Projects.findOne({_id: params._projectId});
        const reposName = `${project.name}/${params.name}`;
        let repos = new ctx.model.GitRepository({
            _projectId: project._id,
            _creatorId: ctx.user._id,
            creator: {
                _id: ctx.user._id,
                nickname: ctx.user.nickname,
                username: ctx.user.username,
                avatar: ctx.user.avatar
            },
            name: reposName,
            path: '',
            url: '',
            reposUrl: `http://team.oeynet.com/${reposName}.git`,
            createAt: new Date(),
            updateAt: new Date(),
            isPublic: false,
            status: 1
        });
        await repos.save();
        app.Git.create(reposName, (err, res) => {
            console.log(err, res);
        });

        ctx.body = repos;
    }


    async show() {
        const {ctx} = this;
        let id = ctx.params.id;
    }

    async files() {

    }


}

module.exports = XXController;