const Service = require('egg').Service;

class CategoryService extends Service {

    get model() {
        return this.ctx.model.Category;
    }

    async find(params) {
        return await this.model.find(params);
    }

    async simple(params) {
        return await this.model.find(params)
            .select('_id name title logo type')
            .sort({
                sort: 1
            }).exec();
    }

    async findOne(params) {
        return await this.model.findOne(params);
    }
};
module.exports = CategoryService;
