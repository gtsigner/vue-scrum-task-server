/**
 * Collections
 * @param app
 * @returns {*}
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _creatorId: String,
        _projectId: String,
        _collectionId: String,//父文件夹ID
        _organizationId: String,//组织ID
        creator: Object,
        fileName: String,
        fileKey: String,//MD5 KEY值或者HASH标识文件唯一
        fileCategory: String,//分类，类似：exe,images,word,等
        fileType: String,//后缀
        fileSize: Number,//文件大小
        downloadUrl: String,
        description: String,
        visible: Boolean,
        imageHeight: Number,
        imageWidth: Number,
        thumbnailUrl: String,
        source: String,
        createAt:Date,
        updateAt:Date,
        status: Number,//状态
    });
    return mongoose.model('Files', Schema, 'ey_collection_files');
};