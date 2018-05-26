/**
 * Created by leiyin on 2017/03/13.
 */
var Boom            = require('boom');
var _               = require('underscore');

var Controller = function (service) {
    this.service = service;
};

Controller.prototype.list = function (request, reply) {

    var where = { role_id: request.params.role_id };

    if (request.query.keyword && request.query.keyword.trim() !== ""){
        where.title = {  $like: '%' + request.query.title + '%'}
    }

    this.service.list(where, request.query.page_size, request.query.page_number, "created_at asc").then(function(list) {

        var data = [];
        list.rows.forEach(function(row){
            data.push(row.toJSON());
        });
        reply.send({ total: list.count, items: data });

    }).catch(function(err){

        reply.error(Boom.badImplementation(err.message, err));
    })
};

Controller.prototype.get = function (request, reply) {

    var where = { role_id: request.params.role_id };

    this.service.get(where).then(function(row){

        if (!row) return reply.error(Boom.notFound("找不到指定标识的数据"));

        var item = row.get({ plain: true});
        reply.send(item);

    }).catch(function(err){

        reply.error(Boom.badImplementation(err.message, err));

    })
};

Controller.prototype.create = function (request, reply) {

    request.payload.role_id = request.params.role_id;
    this.service.create(request.payload).then(function(result){
        reply.send(result);
    }).catch(function(err){
        reply(err.message);
    })
};

Controller.prototype.delete = function (request, reply) {

    var where = {
        role_id: request.params.role_id,
        member_id: request.params.member_id
    };

    this.service.delete(where).then(function(row){
        reply.send();
    }).catch(function(err){

        reply.error(Boom.badImplementation(err.message, err));
    })

};

Controller.prototype.update = function (request, reply) {

    var where = {
        role_id: request.params.role_id
    };

    this.service.update(where, request.payload).then(function(result){
        reply.send();
    }).catch(function(err){
        reply.error(Boom.badImplementation(err.message, err));
    })

};

module.exports = Controller;