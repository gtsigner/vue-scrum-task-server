'use strict';

module.exports = appInfo => {
    const config = exports = {};

    /**
     * Mongo数据库链接
     * @type {{client: {url: string, options: {db: {native_parser: boolean}, authSource: string, auth: {user: string, password: string}}}}}
     */
   
    /**
     * Redis链接
     * @type {{clients: {session: {host: string, port: string, password: string, db: string}}, agent: boolean}}
     */
    config.redis = {
        client: {
            host: 'redis-db',
            port: '6379',
            password: '',
            db: '0',
        },
        agent: true
    };
    exports.io = {
        init: {}, // passed to engine.io
        namespace: {
            '/': {
                connectionMiddleware: ['auth'],
                packetMiddleware: ['packet'],
            },
        },
        redis: {
            host: 'redis-db',
            port: 6379
        }
    };
    config.web = {
        base: 'https://game.oeynet.com',
        wxAuthorizeURL: 'https://game.oeynet.com/api/v1/oauth/callback/wechat?',
        pageLimit: 20,
        secret: '!@#00dssdOEYGAME'
    };
    return config;
};
