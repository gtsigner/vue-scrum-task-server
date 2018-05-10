'use strict';

const Controller = require('egg').Controller;

const path = require('path');
const uuidv4 = require('uuid/v4');
const Enums = require('../../extend/enums')

class UploadController extends Controller {

    async file() {
        const {ctx} = this;
        try {
            const stream = await ctx.getFileStream();
            let name = 'oey-team-com/' + uuidv4() + '-' + path.basename(stream.filename);
            let result;
            //进行图片处理
            result = await ctx.oss.put(name, stream);
            //Result上传成功，保存到本地
            result.url = result.url.replace(/\-internal/g, '').replace(/http:\/\//g, 'https://');
            let collectionId = ctx.request.headers['collection-id'];
            let collection = await ctx.model.Collections.findOne({_id: collectionId});
            let fileEntry = new ctx.model.Files({
                _collectionId: collectionId,
                _creatorId: ctx.user._id,
                creator: {
                    _id: ctx.user._id,
                    nickname: ctx.user.nickname,
                    username: ctx.user.username,
                    avatar: ctx.user.avatar
                },
                fileName: stream.filename,
                category: 'file',
                fileType: stream.mimeType,
                fileSize: Math.floor(Math.random() * 1000),
                type: stream.mimeType,
                downloadUrl: result.url,
                visible: true,
                createAt: new Date(),
                updateAt: new Date(),
                status: 1,
            });
            await fileEntry.save();
            ctx.body = fileEntry
        } catch (err) {
            ctx.body = {
                message: err.message,
                code: Enums.ApiCodes.FAIL
            };
            ctx.status = 500;
        }

    }
}

module.exports = UploadController;
