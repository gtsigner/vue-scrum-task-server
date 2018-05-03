'use strict';

const Controller = require('egg').Controller;

/**
 * 记录位置信息
 */
class PlaceController extends Controller {
    index() {
        const {ctx} = this;
    }

    async log() {
        const {ctx} = this;
        const params = ctx.request.body;
        const userId = params.userId;
        const position = params.position;
        try {
            await ctx.model.UserPlaces.create({
                _userId: userId,
                position: position,
                lng: position.center.lng,
                lat: position.center.lat,
                date: new Date()
            });
            ctx.body = {message: 'OK'};
            ctx.status = 200;
        } catch (e) {
            ctx.body = {
                message: e.message
            };
            ctx.status = 500;
        }

    }

    async nearby() {

    }
}

module.exports = PlaceController;
