const Service = require('egg').Service;
const SMSClient = require('@alicloud/sms-sdk');

const accessKeyId = 'LTAIayLRis1k7B4c';
const secretAccessKey = 'qfUPLzxHFCYkZqwDg6HZ4QB91L9rpw';
let smsClient = new SMSClient({accessKeyId, secretAccessKey});

class SmsCodeService extends Service {

    get model() {
        return this.ctx.model.activity;
    }

    async sendSmsCode(params) {
        const {ctx} = this;
        try {
            ctx.validate({phone: 'china-phone'}, params);
        } catch (ex) {
            throw new Error('请填写正确的手机号码');
        }
        //TODO 验证手机号和IP当日发送的次数,然后做发送限制
        let code = ctx.helper.randomSMSCode();
        let tpl = {
            PhoneNumbers: params.phone,
            SignName: '易游互娱',
            TemplateCode: 'SMS_5027058',
            TemplateParam: `{"code":"${code}","product":"安全"}`
        };
        //存放Session
        ctx.session['PHONE_SMS_CODE'] = {
            phone: params.phone,
            type: params.type,
            code: code,
            time: new Date().getTime()
        };
        await smsClient.sendSMS(tpl);
    }
};
module.exports = SmsCodeService;
