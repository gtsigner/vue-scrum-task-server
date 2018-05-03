//评价
module.exports = app => {
    const mongoose = app.mongoose;
    const schema = new mongoose.Schema({
        _creatorId: mongoose.Schema.Types.ObjectId,
        creator: Object,
        _boundObjectId: mongoose.Schema.Types.ObjectId,
        boundType: String,//UserId
        boundData: Object,
        action: String,//'order.rent.comments'
        comment: Object
    });
    return mongoose.model('Comments', schema, 'ey_comments');
};
