'use strict';

const Controller = require('egg').Controller;


module.exports = class CollectionsController extends Controller {
    index() {
        const {ctx} = this;
        const params = ctx.request.query;
        ctx.body = [];
    }

    async create() {
        const {ctx} = this;
        let params = ctx.request.body;
        let folder = new ctx.model.Collections({
            ...params,
            _creatorId: ctx.user._id,
            creator: {
                _id: ctx.user._id,
                nickname: ctx.user.nickname,
                username: ctx.user.username,
                avatar: ctx.user.avatar
            },
            createAt: new Date(),
            updateAt: new Date(),
            fileCount: 0,
            collectionCount: 0,
            status: 1
        });
        await folder.save();
        ctx.body = folder;
    }

    /**
     * 文件夹
     * @returns {Promise<void>}
     */
    async collections() {
        const {ctx} = this;
        const params = ctx.request.query
        let res = await ctx.model.Collections.find({
            ...params
        }).sort({updateAt: -1}).exec();
        ctx.body = res;
    }

    async show() {
        const {ctx} = this;
        const params = ctx.request.query;
        const id = ctx.params.id;

        let data = await Promise.all([
            ctx.model.Collections.findOne({_id: id}),
            ctx.model.Collections.find({_parentId: id}).sort({updateAt: -1}).exec(),
            ctx.model.Files.find({_collectionId: id}).sort({updateAt: -1}).exec()
        ]);
        let folder = data[0];
        let folders = data[1];
        let files = data[2];
        ctx.body = {
            folder: folder,
            children: folders,
            files: files
        };
    }

    /**
     * 检索文件夹下的文件
     * @returns {Promise<void>}
     */
    async files() {
        const {ctx} = this;

    }
};