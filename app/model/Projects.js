module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;


    const Attribute = new mongoose.Schema({
        key: String,
        note: String,
        name: String,//
        type: String,//类型
        options: Array,//提示
        required: Boolean,//必填
        rules: Array,//验证规则
        placeholder: String,//提示
        sort: Number,
        group: Number,//1:价格属性,2:普通属性
        value: String//默认值
    });

    const ProjectsSchema = new Schema({
        _creatorId: String,
        creator: Object,
        title: String,
        description: String,
        logo: String,
        templateId: Number,
        isPublic: Boolean,//是否公开
        taskTypes: Array,//任务烈性表
        applications: Array,//绑定开启的程序
        tags: Array,//标签组
        attributes: [Attribute],
        startDate: Date,
        finishDate: Date,
        lock: Boolean,
        status: Number,//  1:进行中，2:暂停，3:取消，4:完成
    });
    return mongoose.model('Projects', ProjectsSchema, 'ey_projects');
};
