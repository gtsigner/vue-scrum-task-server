//属性模型
module.exports = app => {
    const mongoose = app.mongoose;
    const schema = new mongoose.Schema({
        key: {
            type: String,
            unique: true
        },
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
    const model = mongoose.model('Attribute', schema, 'ey_attributes');


    // model.create({
    //     key: 'username',
    //     name: '帐号',
    //     note: '帐号',
    //     type: 'text',//类型
    //     options: [],//提示
    //     required: true,//必填
    //     rules: [],//验证规则
    //     placeholder: '请输入帐号',//提示
    //     sort: 5,
    //     group: 2,
    //     value: ''//默认值
    // });
    return model
};
