'use strict';

const Controller = require('egg').Controller;

module.exports = class RoomsController extends Controller {
    index() {
        const {ctx} = this;
    }

    //获取ProjectRoom
    async project() {
        const {ctx} = this;
        let room=await ctx.model.ImRooms.findOne({
            boundToObjectType:'project',

        })

    }
}

