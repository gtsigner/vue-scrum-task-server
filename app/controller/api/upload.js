'use strict';

const Controller = require('egg').Controller;

const path = require('path');
const uuidv4 = require('uuid/v4');

class UploadController extends Controller {
    async avatar() {
        const {ctx} = this;
        const stream = await ctx.getFileStream();
        let name = 'oey-game-com/' + uuidv4() + '-' + path.basename(stream.filename);
        let result;
        try {
            //进行图片处理
            result = await ctx.oss.put(name, stream);
            result.url = result.url.replace(/\-internal/g, '').replace(/http:\/\//g, 'https://');
        } catch (err) {
            throw err;
        }
        ctx.body = {
            url: result.url + '?x-oss-process=style/product-oey-canvas',
        }
    }
}

module.exports = UploadController;
