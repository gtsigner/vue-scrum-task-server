/**
 * Git仓库
 * @param app
 * @returns {*}
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _projectId: String,
        _repositoryId: String,//仓库ID
        _creatorId: String,
        creator: Object,
        name: String,
        createAt: Date,
        updateAt: Date,
        reposName: String,//仓库名称
        reposUrl: String,//仓库Http地址
        reposGitUrl: String,//Git协议地址
        isPublic: Boolean,//是否公开访问
        maxSize: Number,//最大文件大小

        status: Number,
    });
    return mongoose.model('GitRepository', Schema, 'ey_git_repositories');
};
