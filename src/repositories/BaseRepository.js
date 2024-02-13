export default class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async all() {
        return await this.model.find().sort({ createdAt: -1 }).exec();
    }
    /**
     * 
     * @param {*} params: model
     * @returns <Promise>
     */
    async store(params) {
        return await this.model.create(params);
    }

    async getById(id, select = '') {
        return await this.model.findOne({ _id: id }, select).exec();
    }

    async getWhere(where) {
        return await this.model.findOne(where).exec();
    }

    async update(id, params) {
        return await this.model.updateOne({ _id: id }, params).exec();
    }
    
    async updateWhere(where, params) {
        return await this.model.updateOne(where, params).exec();
    }

    async findAndUpdate(id, params, option = {}) {
        return await this.model.findOneAndUpdate({ _id: id }, params, option).exec();
    }

    async findWhereAndUpdate(where, params) {
        return await this.model.findOneAndUpdate(where, params).exec();
    }
}
