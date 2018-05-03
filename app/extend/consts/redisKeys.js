const Enums = require('../enums')

exports.userChatListKey = (userId) => {
    return Enums.REDIS_KEYS.CHAT_USER_STACK + userId;
};
