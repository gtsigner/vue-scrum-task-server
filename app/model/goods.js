module.exports = app => {
    const mongoose = app.mongoose;

    const Schema = new mongoose.Schema({
        _userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: 'Required User'
        },
        _categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            required: 'Required _categoryId'
        },
        seller: Object,//卖家
        category: Object,
        title: {
            type: String,
            required: 'Required title',
            minLength: 10,
            maxLength: 30,
        },
        desc: {
            type: String,
            required: 'Required title',
            minLength: 10,
            maxLength: 1000,
        },
        pics: [],//图片
        attributes: Object,//属性表
        priceNote: String,//显示
        price: Number,//原价
        position: Object,//广告位格式 {1:{startTime:'',endTime:''}}
        type: Number,//类型
        lock: Boolean,//加锁
        total: Object,//统计
        dates: {
            publish: Date,//上架事件
            saleOut: Date,//卖出事件
            stockOut: Date,//下架事件
        },
        noticeable: Boolean,//开启通知
        sort: Number,//排序
        status: Number,//状态
    });
    return mongoose.model('Goods', Schema, 'ey_goods');
};
