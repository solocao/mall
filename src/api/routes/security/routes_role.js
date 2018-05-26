/**
 * Created by leiyin on 2017/03/13.
 */
var Joi = require('joi');
module.exports = function(server, modules){

    server.bind(modules.security.role.controller);

    server.route([
        {
            method: 'GET',
            path: '/security/v1/roles',
            config: {
                //auth: 'default',
                tags: ['api'],
                description: '分页方式获取角色列表信息',
                validate: modules.security.role.validator.list.request,
                notes: 'My route notes',
                response: modules.security.role.validator.list.response,
                handler: modules.security.role.controller.list
            }
        },
        {
            method: 'POST',
            path: '/security/v1/roles',
            config: {
               // auth: 'default',
                tags: ['api'],
                description: '创建新的角色信息',
                validate: modules.security.role.validator.create.request,
                notes: '角色是为Web,手机端或其他客户端提供接口的集合',
                response: modules.security.role.validator.create.response,
                handler: modules.security.role.controller.create
            }
        },
        {
            method: 'GET',
            path: '/security/v1/roles/{role_id}',
            config: {
                //auth: 'default',
                tags: ['api'],
                description: '获取指定标识的角色信息',
                validate: modules.security.role.validator.get.request,
                notes: 'My route notes',
                response: modules.security.role.validator.get.response,
                handler: modules.security.role.controller.get
            }
        },
        {
            method: 'PUT',
            path: '/security/v1/roles/{role_id}',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '更新指定标识的角色信息',
                validate: modules.security.role.validator.put.request,
                notes: 'My route notes',
                response: modules.security.role.validator.put.response,
                handler: modules.security.role.controller.update
            }
        },
        {
            method: 'DELETE',
            path: '/security/v1/roles/{role_id}',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '删除指定标识的角色信息',
                validate: modules.security.role.validator.delete.request,
                notes: 'My route notes',
                response: modules.security.role.validator.delete.response,
                handler: modules.security.role.controller.delete
            }
        }
    ])
};