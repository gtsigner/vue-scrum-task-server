/**
 * POST
 * @param app
 * @returns {*}
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _creatorId: String,
        creator: Object,
        title: String,
        content: String,
        links: String,
        joiners: Array,
        status: Number,//状态
    });
    const model = mongoose.model('Posts', Schema, 'ey_posts');
    return model;
};