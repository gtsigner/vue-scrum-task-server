/*任务表*/
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _projectId: String,//
        _taskListId: String,//任务表
        _creatorId: String,//创建者ID
        _taskGroupId: String,
        _stageId: String,//阶段ID

        creator: Object,//创建者ID
        executor: Array,//执行者
        title: String,
        content: String,

        createDate: Date,
        updateDate: Date,
        finishDate: Date,
        deleteDate: Date,

        sprintStatus: Boolean,//是否已经归档迭代
        taskType: String,//任务类型

        status: Number
    });
    return mongoose.model('ProjectTask', Schema, 'ey_project_tasks');
};