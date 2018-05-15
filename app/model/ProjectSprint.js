/*任务迭代表*/
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _projectId: String,//
        _creatorId: String,//创建者ID
        creator: Object,//创建者ID
        title: String,//迭代标题
        desc: String,//描述

        createDate: Date,
        updateDate: Date,
        finishDate: Date,

        sprintStatus: Boolean,//是否已经归档迭代
        taskType: String,//任务类型

        status: Number
    });
    return mongoose.model('ProjectSprint', Schema, 'ey_project_sprints');
};