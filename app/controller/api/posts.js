'use strict';

const Controller = require('egg').Controller;

class PostsController extends Controller {
    index() {
        const {ctx} = this;

    }

    async create() {
        const {ctx} = this;
        let params = ctx.request.body;
        let post = new this.ctx.model.Posts({
            ...params,
            _creatorId: ctx.user._id,
            creator: {
                _id: ctx.user._id,
                username: ctx.user.username,
                nickname: ctx.user.nickname,
                avatar: ctx.user.avatar,
            }
        });
        await post.save();
        ctx.body = post;
    }

    async show() {
        const {ctx} = this;
        let id = ctx.params.id;
        //TODO 验证是否有查看权限
        let post = await this.ctx.model.Posts.findOne({
            _id: id
        });
        ctx.body = post;
    }

    async comments() {
        const {ctx} = this;
        let postId = ctx.params.id;
        let comments = await this.ctx.model.Activity.find({
            _boundId: postId
        });
        ctx.body = comments;
    }

    async comment() {
        const {ctx} = this;
        let postId = ctx.params.id;
        let params = ctx.request.body;
        let comment = new this.ctx.model.Activity({
            ...params,
            _boundId: postId,
            _creatorId: ctx.user._id,
            action: 'post.comment',
            type: 'comment',
            creator: {
                _id: ctx.user._id,
                nickname: ctx.user.nickname,
                username: ctx.user.username,
                avatar: ctx.user.avatar
            },
            createDate: new Date()
        });
        await comment.save();
        ctx.body = comment;
    }
}

module.exports = PostsController;