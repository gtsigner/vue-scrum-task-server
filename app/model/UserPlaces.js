module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _userId: mongoose.Schema.Types.ObjectId,
        user: Object,
        lat: Number,
        lng: Number,
        position: Object,
        address: Object,
        date: Date
    });
    return mongoose.model('UserPlaces', Schema, 'ey_user_places');
};
