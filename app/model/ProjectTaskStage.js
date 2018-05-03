/*任务阶段*/
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _projectId: String,
        _creatorId: String,
        _taskListId: String,
        name: String,
        title: String,
        isArchived: Boolean,
        sort: Number
    });
    return mongoose.model('ProjectTaskStage', Schema, 'ey_project_task_stages');
};