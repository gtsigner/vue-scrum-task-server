const Service = require('egg').Service;

class GoodsService extends Service {

    get model() {
        return this.ctx.model.Goods;
    }

    async find(params) {
        return await this.model.find(params);
    }

    async simple(params) {
        return await this.model.find(params)
            .select('_id name title logo category')
            .sort('sort')
            .exec();
    }

    async findOne(params) {
        return await this.model.findOne(params);
    }

    async create(goods) {

    }

    async findOneMy(params) {
        const {ctx} = this;
        return await this.model.findOne(params)
            .select('_id _userId _categoryId name title logo seller pics desc category attributes  priceNote price total status').exec();
    }

    async visit(_id) {
        const {ctx} = this;
        let goods = await this.model.findOne({
            _id: _id
        }).select('_id _userId _categoryId name title logo seller pics desc category attributes  priceNote price total status').exec();
        try {
            delete goods.attributes.username;
            delete goods.attributes.password;
        } catch (ex) {

        }
        return goods;
    }

    async findOneGoodsSimple(params, fields) {
        return await this.model.findOne(params).select('_id _userId _categoryId category title desc logo price priceNote total status').sort('sort').exec();
    }
};
module.exports = GoodsService;
