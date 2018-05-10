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
        _parentId: String,//父文件夹ID
        _organizationId: String,//组织ID
        creator: Object,

        type: String,//Init
        title: String,
        updateAt: Date,
        createAt: Date,
        fileCount: Number,
        color: String,
        icon: String,
        collectionCount: Number,//子文件夹数量
        status: Number,//状态
    });
    return mongoose.model('Collections', Schema, 'ey_project_collections');
};