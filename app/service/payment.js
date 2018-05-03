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
            .select('_id name title logo')
            .sort('sort')
            .exec();
    }

    async findOne(params) {
        return await this.model.findOne(params);
    }

    async create(goods) {

    }
};
module.exports = GoodsService;