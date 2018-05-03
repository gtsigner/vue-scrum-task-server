'use strict';

// had enabled by egg
// exports.static = true;
exports.session = true;

exports.mongoose = {
    enable: true,
    package: 'egg-mongoose',
};
exports.validate = {
    enable: true,
    package: 'egg-validate',
};
exports.cors = {
    enable: true,
    package: 'egg-cors',
};
exports.jwt = {
    enable: true,
    package: "egg-jwt"
};
exports.sessionRedis = {
    enable: true,
    package: 'egg-session-redis',
};
exports.redis = {
    enable: true,
    package: 'egg-redis',
};
exports.oss = {
    enable: true,
    package: 'egg-oss',
};
exports.validate = {
    package: 'egg-validate',
};

exports.io = {
    enable: true,
    package: 'egg-socket.io',
};
//QL
exports.graphql = {
    enable: true,
    package: 'egg-graphql',
};
