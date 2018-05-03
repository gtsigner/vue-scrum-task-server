const queryString = require('querystring');
const axios = require('axios');

class Oauth {
    get Config() {
        return this._config;
    }

    get http() {
        return this._http;
    }

    constructor(options) {
        this._config = {
            appId: '',
            appSecret: '',
            token: '',
            encodingAesKey: '',
            debug: true
        };
        Object.keys(options).forEach((k) => {
            this._config[k] = options[k];
        });
        this._http = new axios.create({
            baseURL: 'https://api.weixin.qq.com/',
            timeout: 3000,
            headers: []
        });
    }

    /**
     * 获取信用AccessToken
     */
    async getCreAccessToken() {
        const url = '/cgi-bin/token?';
        const params = {
            grant_type: 'client_credential',
            appid: this._config.appId,
            secret: this._config.appSecret
        };
        let res = await this.http.get(url + queryString.stringify(params));
        return res.data;
    }

    /**
     *
     * 1.获取跳转的Url
     * @param redirect
     * @param state
     * @param scope
     * @returns {string}
     */
    getAuthorizeURL(redirect, state, scope) {
        const url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
        const params = {
            appid: this._config.appId,
            redirect_uri: redirect,
            response_type: 'code',
            scope: scope || 'snsapi_userinfo',
            state: state || ''
        };
        return url + '?' + queryString.stringify(params) + '#wechat_redirect';
    }

    async getAccessToken(code) {
        const params = {
            appid: this._config.appId,
            secret: this._config.appSecret,
            code: code,
            grant_type: 'authorization_code'
        };
        let res = await this.http.get('sns/oauth2/access_token?' + queryString.stringify(params));
        return res.data;
    }

    /**
     * 刷新AccessToken
     * @param refreshToken
     * @param callback
     */
    async refreshAccessToken(refreshToken, callback) {
        const params = {
            appid: this.appid,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        };
        let res = await this.http.get('/sns/oauth2/refresh_token?' + queryString.stringify(params));
        return res.data;
    }

    /**
     * 获取用户信息
     * @param openid
     * @param accessToken
     * @returns {Promise<void>}
     */
    async getUserInfo(openid, accessToken) {
        const params = {
            access_token: accessToken,
            openid: openid,
            lang: 'zh_CN'
        };
        let res = await this.http.get('/sns/userinfo?' + queryString.stringify(params));
        return res.data;
    }

    /**
     * 验证token是否有效
     * @param openid
     * @param accessToken
     * @returns {Promise<void>}
     */
    async verifyToken(openid, accessToken) {
        const params = {
            access_token: accessToken,
            openid: openid
        };
        let res = await this.http.get('/sns/auth?' + queryString.stringify(params));
        return res.data;
    }


    async getJsSdkTicket(ceAccessToken) {
        const url = '/cgi-bin/ticket/getticket?';
        const params = {
            //access_token=ACCESS_TOKEN&type=jsapi
            type: 'jsapi',
            access_token: ceAccessToken
        };
        let res = await this.http.get(url + queryString.stringify(params));
        return res.data;
    }

    async signJsSdkConf() {

    }
}

module.exports = Oauth;
