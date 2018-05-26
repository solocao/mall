/**
 * Created by leiyin on 2017/03/13.
 */
var Joi = require('joi');
module.exports = function(server, modules){

    server.bind(modules.security.permission.controller);

    server.route([
        {
            method: 'GET',
            path: '/security/v1/permissions',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '分页方式获取权限列表信息',
                validate: modules.security.permission.validator.list.request,
                notes: 'My route notes',
                response: modules.security.permission.validator.list.response,
                handler: modules.security.permission.controller.list
            }
        },
        {
            method: 'POST',
            path: '/security/v1/permissions',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '创建新的权限信息',
                validate: modules.security.permission.validator.create.request,
                notes: '权限是为Web,手机端或其他客户端提供接口的集合',
                response: modules.security.permission.validator.create.response,
                handler: modules.security.permission.controller.create
            }
        },
        {
            method: 'GET',
            path: '/security/v1/permissions/{permission_id}',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '获取指定标识的权限信息',
                validate: modules.security.permission.validator.get.request,
                notes: 'My route notes',
                response: modules.security.permission.validator.get.response,
                handler: modules.security.permission.controller.get
            }
        },
        {
            method: 'PUT',
            path: '/security/v1/permissions/{permission_id}',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '更新指定标识的权限信息',
                validate: modules.security.permission.validator.put.request,
                notes: 'My route notes',
                response: modules.security.permission.validator.put.response,
                handler: modules.security.permission.controller.update
            }
        },
        {
            method: 'DELETE',
            path: '/security/v1/permissions/{permission_id}',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '删除指定标识的权限信息',
                validate: modules.security.permission.validator.delete.request,
                notes: 'My route notes',
                response: modules.security.permission.validator.delete.response,
                handler: modules.security.permission.controller.delete
            }
        }
    ])
};