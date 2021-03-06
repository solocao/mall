/**
 * Created by leiyin on 2017/03/13.
 */

var Joi = require('joi');
module.exports = function(server, modules){

    server.bind(modules.security.role_member.controller);

    server.route([
        {
            method: 'GET',
            path: '/security/v1/roles/{role_id}/members',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '分页方式获取角色成员列表信息',
                validate: modules.security.role_member.validator.list.request,
                notes: 'My route notes',
                response: modules.security.role_member.validator.list.response,
                handler: modules.security.role_member.controller.list
            }
        },
        {
            method: 'POST',
            path: '/security/v1/roles/{role_id}/members',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '创建新的角色成员信息',
                validate: modules.security.role_member.validator.create.request,
                notes: '角色成员是为Web,手机端或其他客户端提供接口的集合',
                response: modules.security.role_member.validator.create.response,
                handler: modules.security.role_member.controller.create
            }
        },
        {
            method: 'GET',
            path: '/security/v1/roles/{role_id}/members/{member_id}',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '获取指定标识的角色成员信息',
                validate: modules.security.role_member.validator.get.request,
                notes: 'My route notes',
                response: modules.security.role_member.validator.get.response,
                handler: modules.security.role_member.controller.get
            }
        },
        {
            method: 'PUT',
            path: '/security/v1/roles/{role_id}/members/{member_id}',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '更新指定标识的角色成员信息',
                validate: modules.security.role_member.validator.put.request,
                notes: 'My route notes',
                response: modules.security.role_member.validator.put.response,
                handler: modules.security.role_member.controller.update
            }
        },
        {
            method: 'DELETE',
            path: '/security/v1/roles/{role_id}/members/{member_id}',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '删除指定标识的角色成员信息',
                validate: modules.security.role_member.validator.delete.request,
                notes: 'My route notes',
                response: modules.security.role_member.validator.delete.response,
                handler: modules.security.role_member.controller.delete
            }
        }
    ])
};