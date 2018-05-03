'use strict';

module.exports = appInfo => {
    const config = exports = {};

    /**
     * Mongo数据库链接
     * @type {{client: {url: string, options: {db: {native_parser: boolean}, authSource: string, auth: {user: string, password: string}}}}}
     */
    // config.mongoose = {
    //     client: {
    //         url: 'mongodb://admin:zhaojun123@115.28.9.200:27017/oey-game-db?authSource=admin',
    //         options: {
    //             db: {
    //                 native_parser: true
    //             },
    //             authSource: 'admin',
    //             auth: {
    //                 user: 'admin',
    //                 password: 'zhaojun123'
    //             },
    //         },
    //     },
    // };

    /**
     * 阿里云OSS
     * @type {{client: {accessKeyId: string, accessKeySecret: string, bucket: string, endpoint: string, timeout: string}}}
     */
    config.oss = {
        client: {
            accessKeyId: 'LTAIjdmHp6hjsKx4',
            accessKeySecret: 'LxxFriSYNBtEch8fWBFbsGIU0Fmjsw',
            bucket: 'img-oeygame-com',
            endpoint: 'oss-cn-shenzhen-internal.aliyuncs.com',
            timeout: '20s',
        },
    };
    config.web = {
        base: 'https://game.oeynet.com',
        wxAuthorizeURL: 'https://game.oeynet.com/api/v1/oauth/callback/wechat?',
        pageLimit: 20,
        secret: '!@#00dssdOEYGAME'
    };
    return config;
};
