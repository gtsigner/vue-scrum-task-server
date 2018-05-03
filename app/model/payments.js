module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        name: String,
        logo: String,
        options: Object,
        action: String,
        type: String,
        certs: Object,
        sort: Number,
        status: Number,//状态
    });
    const model = mongoose.model('Payments', Schema, 'ey_payments');

    return model;
};