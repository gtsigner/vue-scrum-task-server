module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _userId: mongoose.Schema.Types.ObjectId,
        user: Object,
        money: {
            type: Number,
            get: v => {
                //return (v*100).toFixed(2)
                return v;
            }
        },//金额
        walletType: String,//Enums
        isInc: Boolean,//是否是增加
        date: Date,
        bound: Object,
        note: String,
        mark: String,//备注
        status: Number,//状态
    });
    return mongoose.model('FinanceLogs', Schema, 'ey_finance_logs');
};
