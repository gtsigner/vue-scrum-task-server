/**
 * 任务列表
 * @param app
 * @returns {*}
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _projectId: String,
        _creatorId: String,
        title: String,//sprint,story,bug
        _stageIds: Array,//阶段id
        isSmartyGroup: Boolean
    });
    return mongoose.model('ProjectTaskList', Schema, 'ey_project_task_lists');
};