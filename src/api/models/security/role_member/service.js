/**
 * Created by leiyin on 2017/03/13.
 */

var _ = require('lodash');
var Promise = require('bluebird');

var Service = function (db) {
    this.db = db;
    this.attributes = ['member_id', 'title', 'type', 'value', 'updated_at'];
};

/**
 * 获取指定条件的角色列表数据
 * @param where
 * @param page_size
 * @param page_number
 * @returns {*}
 */
Service.prototype.list = function ( where, page_size, page_number) {

    var options = {
        attributes: this.attributes,
        where: where,
        order: 'updated_at desc'
    };

    //如果分页参数中有一个等于0, 则获取全部数据
    if (page_size > 0 && page_number > 0){
        options.limit = page_size;
        options.offset = page_size * (page_number - 1);
    }

    return this.db.RoleMember.findAndCountAll(options);
};

/**
 * 获取指定条件的角色数据
 * @param where
 * @returns {Query|*}
 */
Service.prototype.get = function (where) {

    var options = {
        attributes: this.attributes,
        where: where
    };

    return this.db.RoleMember.findOne(options);
};

/**
 * 创建角色
 * @param data
 * @returns {*}
 */
Service.prototype.create = function (data) {

    var self = this;
    return self.db.RoleMember.build(data).save().then(function(item){
        return self.get({ role_id: item.role_id });
    });
};

/**
 * 删除角色
 * @param where
 * @returns {Promise}
 */
Service.prototype.delete = function (where){

    return this.db.RoleMember.findOne({ where: where }).then(function(item){
        return item.destroy();
    });
};

/**
 * 编辑角色
 * @param where
 * @param data
 * @returns {*}
 */
Service.prototype.update = function (where, data) {
    return this.db.RoleMember.update(data, { where: where });
};

module.exports = Service;