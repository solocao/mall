/**
 * Created by leiyin on 2017/03/13.
 */
var _ = require('lodash');
var client = require('restler');
var Service = function (db) {
    this.db = db;
    this.attributes = ['user_id', 'loginname', 'nickname', 'avatar_url', 'gender', 'address', 'email', 'mobile', 'updated_at', 'signature', 'status'];
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
Service.prototype.createwx = function (data) {
    var self = this;
    var url = 'https://api.weixin.qq.com/sns/jscode2session'
    return new Promise(function (resolve, reject) {
        client.post(url, {//调取微信小程序接口获取用户open_id
            headers: {
                'Accept': 'application/json; charset=utf-8', 'Content-Type': 'application/json; charset=utf-8',
            },
            data: { appid: 'wx20c0a95a421191a1', secret: 'ffc32b3b0a7e4741d7679a6d95b648fa', js_code: data.code, grant_type: 'authorization_code' }
        }).on('complete', async function (result) {
            var result = JSON.parse(result)
            if (result.openid) {
                var user;
                data.loginname = result.openid
                data.password = result.openid
                data.status = 1

                user = await self.db.User.findOne({ where: { loginname: result.openid } })//查询用户是否存在

                if (!user) {//用户不存在，创建用户
                    user = await self.db.User.build(data).save();
                    var roledata = {
                        type: 'user',
                        value: user.toJSON().user_id,
                        role_id: 2
                    }

                    await self.db.RoleMember.build(roledata).save()//创建角色
                }
                user = user.toJSON()
                delete user.password

                return resolve(user)
            }
        })
    });
};

module.exports = Service;