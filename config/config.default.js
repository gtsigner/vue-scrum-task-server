'use strict';

module.exports = appInfo => {
    const config = exports = {};

    /**
     * 国际化
     * @type {{defaultLocale: string, queryField: string, cookieField: string, cookieMaxAge: string}}
     */
    config.i18n = {
        // 默认语言，默认 "en_US"
        defaultLocale: 'zh-CN',
        // URL 参数，默认 "locale"
        queryField: 'locale',
        // Cookie 记录的 key, 默认："locale"
        cookieField: 'locale',
        // Cookie 默认 `1y` 一年后过期， 如果设置为 Number，则单位为 ms
        cookieMaxAge: '1y',
    };

    /**
     * 阿里云SMS配置
     * @type {{accessKeyId: string, secretAccessKey: string}}
     */
    config.aliSms = {
        accessKeyId: 'LTAIayLRis1k7B4c',
        secretAccessKey: 'qfUPLzxHFCYkZqwDg6HZ4QB91L9rpw',
    };

    config.bodyParser = {
        enableTypes: ['json', 'form', 'text'],
        extendTypes: {
            text: ['text/xml', 'application/xml']
        }
    };

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1521810734419_3786';

    /**
     * 全局中间件
     * @type {string[]}
     */
    config.middleware = ['pager', 'graphql'];

    /**
     * Mongo数据库链接
     * @type {{client: {url: string, options: {db: {native_parser: boolean}, authSource: string, auth: {user: string, password: string}}}}}
     */
    config.mongoose = {
        client: {
            url: 'mongodb://127.0.0.1:27017/oey-team-db',
            options: {
                db: {
                    native_parser: true
                },
                //authSource: 'admin',
                // auth: {
                //     user: 'admin',
                //     password: 'zhaojun123'
                // },
            },
        },
    };
    /**
     * 跨域
     * @type {{allowMethods: string, credentials: boolean}}
     */
    config.cors = {
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
        credentials: true,
    };
    /**
     * 安全
     * @type {{csrf: {enable: boolean, ignoreJSON: boolean}, methodnoallow: {enable: boolean}, domainWhiteList: string[]}}
     */
    config.security = {
        csrf: {
            enable: false,
            ignoreJSON: true
        },
        methodnoallow: {
            enable: false
        },
        // 白名单
        domainWhiteList: [
            'http://192.168.10.161',
            'http://192.168.10.106',
            'http://192.168.10.106:3000',
            'http://pay.oeynet.com:3000',
            'http://127.0.0.1:3000',
            //
            '.oeynet.com',
            '.oeygame.com',
            '.oeyteam.com',
            '192.168.10.161',
            '192.168.10.106',
            '.qq.com',
        ]
    };
    /**
     * 静态资源
     * @type {{maxAge: number, prefix: string}}
     */
    config.static = {
        maxAge: 60 * 60 * 24 * 2,
        prefix: '/'
    };
    /**
     * JWT
     * @type {{secret: string}}
     */
    config.jwt = {
        secret: "!@#!23412341241234"
    };
    /**
     * 自定义
     * @type {{loginCallback: string}}
     */
    config.webClient = {
        loginCallback: 'http://game.oeynet.com/?access_token=',
        //loginCallback: 'http://godtoy.s1.natapp.cc:3000/#/login/',
    };
    /**
     * Redis链接
     * @type {{clients: {session: {host: string, port: string, password: string, db: string}}, agent: boolean}}
     */
    config.redis = {
        client: {
            host: '127.0.0.1',
            port: '6379',
            password: '',
            db: '0',
        },
        agent: true
    };
    /**
     * 网站配置
     * @type {{base: string, pageLimit: number, wxAuthorizeURL: string}}
     */
    config.web = {
        base: 'http://game.oeynet.com',
        wxAuthorizeURL: 'http://game.oeynet.com/api/v1/oauth/callback/wechat?state=wx',
        pageLimit: 20,
        secret: '!@#00dssdOEYGAME'
    };
    /**
     * SessionRedis配置
     * @type {{name: string}}
     */
    config.sessionRedis = {
        name: 'session', // specific instance `session` as the session store
    };

    /**
     * 上传文件
     * @type {{fileSize: string, whitelist: string[]}}
     */
    config.multipart = {
        fileSize: '5mb',
        whitelist: [
            // images
            '.jpg', '.jpeg', // image/jpeg
            '.png', // image/png, image/x-png
            '.gif', // image/gif
            '.bmp', // image/bmp
            '.wbmp', // image/vnd.wap.wbmp
            '.webp',
            '.tif',
            '.psd',
            // text
            '.svg',
            '.js', '.jsx',
            '.json',
            '.css', '.less',
            '.html', '.htm',
            '.xml',
            // tar
            '.zip',
            '.gz', '.tgz', '.gzip',
            // video
            '.mp3',
            '.mp4',
            '.avi',
        ],
    };

    /**
     * 阿里云OSS
     * @type {{client: {accessKeyId: string, accessKeySecret: string, bucket: string, endpoint: string, timeout: string}}}
     */
    config.oss = {
        client: {
            accessKeyId: 'LTAIjdmHp6hjsKx4',
            accessKeySecret: 'LxxFriSYNBtEch8fWBFbsGIU0Fmjsw',
            bucket: 'img-oeygame-com',
            endpoint: 'oss-cn-shenzhen.aliyuncs.com',
            timeout: '60s',
        },
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
            host: '127.0.0.1',
            port: 6379
        }
    };

    /**
     * 微信公众号配置
     * @type {{appId: string, appSecret: string, token: string, encodingAesKey: string}}
     */
    config.wxPub = {
        appId: 'wx7483be07f37e62bb',
        appSecret: '3060ea260748cd6908b0fa574f65b9d2',
        token: 'zhaojunlike',
        encodingAesKey: '7ZyC2YpPDCuHKx1Cm4uue7WL2MPrVj0b8ca8hPSO7sF',
    };

    exports.graphql = {
        router: '/graphql',
        // 是否加载到 app 上，默认开启
        app: true,
        // 是否加载到 agent 上，默认关闭
        agent: false,
    };
    return config;
};
