/*team关联会员*/
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema({
        _teamId: String,
        team: Object,
        _userId: String,
        user: Object,
        roles: [String],//权限
        status: Number
    });
    return mongoose.model('TeamMember', Schema, 'ey_team_members');
};