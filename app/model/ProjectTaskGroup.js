/**
 * TaskGroup   这个分组是smarty的，可以分组也可以不进行分组
 * @param app
 * @returns {*}
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _projectId: String,
        _creatorId: String,
        name: String,//sprint,story,bug
        title: String,
        view: Object,
        type: String,
        description: String,
        filter: String
    });
    return mongoose.model('ProjectTaskGroup', Schema, 'ey_project_task_groups');
};