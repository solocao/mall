/**
 * Created by leiyin on 2017/03/13.
 */
var _       = require('lodash');
var Promise = require('bluebird');

var Service = function (db) {
    this.db = db;
    this.attributes = ['permission_id', 'resource_type', 'resource_id', 'credential_type', 'credential_id', 'updated_at'];
};

Service.prototype.list = function (where, page_size, page_number) {

    var options = {
        attributes: this.attributes,
        where: where,
        order: 'updated_at DESC'
    };

    //如果分页参数中有一个等于0, 则获取全部数据
    if (page_size > 0 && page_number > 0){
        options.limit = page_size;
        options.offset = page_size * (page_number - 1);
    }

    return this.db.Permission.findAndCountAll(options);
};

Service.prototype.get = function (where) {

    var option = {
        where: where,
        attributes: this.attributes
    };
    return this.db.Permission.findOne(option);
};

Service.prototype.create = function (data) {

    var self = this;

    var tasks = [];

    var options = {
        where: {
            resource_type: data.resource_type,
            credential_type: data.credential_type,
            credential_id: data.credential_id
        }
    };

    return self.db.Permission.findAndCountAll(options).then(function(list){

        if (!list || list.rows.length == 0)
            return null;

        tasks = [];
        list.rows.forEach(function(row){
            tasks.push(row.destroy())
        });

        return Promise.all(tasks);

    }).then(function(result){

        tasks = [];

        data.resources.forEach(function(resource){

            var permission = {
                resource_type: data.resource_type,
                resource_id: resource,
                credential_type: data.credential_type,
                credential_id: data.credential_id,
                right: "1"
            };

            tasks.push(
                //这里确保操作都能执行完毕, 如果保存数据发生错误, 例如: 重复数据, 就返回null
                self.db.Permission.build(permission).save().then(function(item){
                    return item;
                }).catch(function(){
                    return null;
                })
            );
        });

        return Promise.all(tasks);
    });
};

Service.prototype.delete = function (where){

    return this.db.Permission.findOne({ where: where }).then(function(item){
        return item.destroy();
    });
};

Service.prototype.update = function (where, data) {
    return this.db.Permission.update(data, { where: where });
};

module.exports = Service;