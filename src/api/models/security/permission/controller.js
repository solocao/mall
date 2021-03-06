/**
 * Created by leiyin on 2017/03/13.
 */

var Boom            = require('boom');

var Controller = function (service) {
    this.service = service;
};

Controller.prototype.list = function (request, reply) {

    var where = {
        resource_type: request.query.resource_type,
        credential_type: request.query.credential_type,
        credential_id: request.query.credential_id
    };

    this.service.list( where, request.query.page_size, request.query.page_number ).then(function(list){

        var data = [];
        list.rows.forEach(function(row){
            data.push(row.toJSON());
        });

        reply.send({ total: list.count, items: data });

    }).catch(function(err){
        reply(err.message);
    })
};

Controller.prototype.get = function (request, reply) {

    var where = {
        permission_id: request.params.permission_id
    };

    this.service.get(where).then(function(row){

        if (!row) return reply.error(Boom.notFound("找不到指定标识的数据"));
        reply.send(row);

    })
};

Controller.prototype.create = function (request, reply) {

    this.service.create(request.payload).then(function(result){
        reply({ code : 200, message: "OK", data: result});
    }).catch(function(err){
        reply(err.message);
    })
};

Controller.prototype.delete = function (request, reply) {

    var where = {
        structure_id: request.params.structure_id
    };

    this.service.delete(where).then(function(row){
        reply.send();
    }).catch(function(err){

        reply.error(Boom.badImplementation(err.message, err));
    })
};

Controller.prototype.update = function (request, reply) {

    var where = {
        structure_id: request.params.structure_id
    };

    this.service.update(where, request.payload).then(function(result){
        reply.send();
    }).catch(function(err){
        reply.error(Boom.badImplementation(err.message, err));
    })
};

module.exports = Controller;