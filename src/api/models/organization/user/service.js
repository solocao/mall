/**
 * Created by leiyin on 2017/03/13.
 */
var _ = require('lodash');

var Service = function (db) {
    this.db = db;
    this.attributes = ['user_id', 'loginname', 'nickname', 'avatar_url', 'gender', 'email', 'mobile', 'updated_at', 'signature', 'status'];
};

Service.prototype.list = function (where, page_size, page_number, order) {

    var options = {
        attributes: this.attributes,
        include: [{
            association: this.db.User.hasMany(this.db.RoleMember, { foreignKey: 'value', as: 'rolemembers' }),
            required: false,
            include: [{
                model: this.db.Role,
                as: 'role'
            }]
        }],
        where: where,
        order: order
    };
    //如果分页参数中有一个等于0, 则获取全部数据
    if (page_size > 0 && page_number > 0) {
        options.limit = page_size;
        options.offset = page_size * (page_number - 1);
    }
    return this.db.User.findAndCountAll(options);
};

Service.prototype.get = function (where) {

    var option = {
        where: where,
        include: [{
            association: this.db.User.hasMany(this.db.RoleMember, { foreignKey: 'value', as: 'rolemembers' }),
            required: false,
            include: [{
                model: this.db.Role,
                as: 'role'
            }]
        }],
        attributes: this.attributes
    };

    return this.db.User.findOne(option);
};

Service.prototype.create = function (data) {

    var self = this;
    return self.db.User.build(data).save().then(function (item) {
        return self.get({ user_id: item.user_id });
    });
};

Service.prototype.delete = function (where) {

    return this.db.User.findOne({ where: where }).then(function (item) {
        return item.destroy();
    });
};

Service.prototype.update = function (where, data) {
    return this.db.User.update(data, { where: where });
};

module.exports = Service;