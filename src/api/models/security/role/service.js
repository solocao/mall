/**
 * Created by leiyin on 2017/03/13.
 */
var _ = require('lodash');
var Promise = require('bluebird');

var Service = function (db) {
    this.db = db;
    this.attributes = ['role_id', 'name', 'description', 'updated_at'];
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

    return this.db.Role.findAndCountAll(options);
};

/**
 * 获取指定条件的角色数据
 * @param where
 * @returns {Query|*}
 */
Service.prototype.get = function (where) {
    var self = this;
    var options = {
        attributes: this.attributes,
        where: where
    };

    return self.db.Role.findOne(options);
};

 



/**
 * 创建角色
 * @param data
 * @returns {*}
 */
//Service.prototype.create = function (data) {

//    var self = this;
//    return self.db.Role.build(data).save().then(function(item){
//        return self.get({ role_id: item.role_id });
//    });
//};
  
Service.prototype.create = function (data) {

    var self = this;
    var permissions = data.permissions;
    delete data.permissions;
     
    return self.db.Role.build(data).save().then(function (item) {
         for (var i = 0; i < permissions.length; i++) {
             permissions[i].credential_id = item.role_id;
            }
         self.db.Permission.bulkCreate(permissions);
           
         return self.get({ role_id: item.role_id });
    }); 

};

/**
 * 删除角色
 * @param where
 * @returns {Promise}
 */
Service.prototype.delete = function (where){

    return this.db.Role.findOne({ where: where }).then(function(item){
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
    var self = this; 

    var permissions = data.permissions;
    delete data.permissions;


    self.db.Permission.destroy({ where: { credential_id: where.role_id } });

    return self.db.Role.update(data, { where: where }).then(function (item)
    {
        for (var i = 0; i < permissions.length; i++) {

            permissions[i].credential_id = where.role_id;
        }
        self.db.Permission.bulkCreate(permissions);


    });
};

/**
 * 导入角色数据
 * @param data
 * @returns {Promise}
 */
Service.prototype.import = function (data) {

    var self = this;

    return self.db.Role.findOne({ where: { object_id: data.object_id }}).then(function(role){

        if (!role){
            var item = {
                object_id: data.object_id,
                name: data.name,
                description: data.description
            };

            return self.db.Role.build(item).save();
        } else {
            return this.db.Role.update(data, { where: { object_id: data.object_id }});
        }

    });
};

module.exports = Service;