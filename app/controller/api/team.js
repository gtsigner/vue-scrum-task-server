'use strict';

const Controller = require('egg').Controller;
const Enums = require('../../extend/enums');
module.exports = class TeamController extends Controller {
    async index() {
        const {ctx} = this;
        try {
            //拿到TeamMembers后就可
            const teamMembers = await ctx.model.TeamMember.find({
                _userId: ctx.user._id,
                status: 1
            });
            //TO Redis
            console.log(teamMembers);
            ctx.body = teamMembers;
        } catch (e) {
            ctx.status = 500;
            ctx.body = {
                message: e.message,
                code: Enums.ApiCodes.FAIL
            }
        }
    }

    async create() {
        const {ctx} = this;
        let params = ctx.request.body;

        let team = new ctx.model.Team({
            _creatorId: ctx.user._id,
            creator: {
                _id: ctx.user._id,
                username: ctx.user.username,
                nickname: ctx.user.nickname,
                avatar: ctx.user.avatar
            },
            name: params.name,
            region: params.region,
            createAt: new Date(),
            status: 1
        });
        //Team Member
        await team.save();
        await ctx.model.TeamMember.create({
            _teamId: team._id,
            team: {
                _id: team._id,
                name: team.name,
                region: team.region
            },
            _userId: ctx.user._id,
            user: team.creator,
            roles: ['admin'],//权限
            status: 1
        });
        ctx.body = team;
        ctx.status = 200;
    }

    async addMember() {
        const {ctx} = this;
        let params = ctx.request.body;
        const id = ctx.params.id;


    }

    async removeMember() {

    }

    async projects() {

    }

    show() {
        const {ctx} = this;
        let id = ctx.params.id;
    }
};

