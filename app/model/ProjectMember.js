/*项目关联会员*/
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _projectId: String,//
        _userId: String,
        nickname: String,
        username: String,
        avatar: String,
        roles: [Object],
        status: Number
    });
    return mongoose.model('ProjectMember', Schema, 'ey_project_members');
};