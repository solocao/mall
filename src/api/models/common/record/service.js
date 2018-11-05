/**
 * Created by leiyin on 2017/03/13.
 */
var Service = function (db) {
    this.db = db;
    this.attributes = ['record_id', 'awards', 'jobs', 'tags', 'skills', 'user_id', 'updated_at'];
};

Service.prototype.list = function (where, page_size, page_number, order) {

    var options = {
        attributes: this.attributes,
        where: where,
        order: order
    };
    //如果分页参数中有一个等于0, 则获取全部数据
    if (page_size > 0 && page_number > 0) {
        options.limit = page_size;
        options.offset = page_size * (page_number - 1);
    }
    return this.db.Record.findAndCountAll(options);
};

Service.prototype.get = function (where) {

    var option = {
        where: where,
        attributes: this.attributes
    };

    return this.db.Record.findOne(option);
};

Service.prototype.create = function (data) {

    var self = this;
    return self.db.Record.build(data).save().then(function (item) {
        return self.get({ record_id: item.record_id });
    });
};

Service.prototype.delete = function (where) {

    return this.db.Record.findOne({ where: where }).then(function (item) {
        return item.destroy();
    });
};

Service.prototype.update = function (where, data) {
    return this.db.Record.update(data, { where: where });
};

module.exports = Service;