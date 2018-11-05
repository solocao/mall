/**
 * Created by leiyin on 2017/03/13.
 */
var Joi = require('joi');

module.exports = function (server, models) {

    server.bind(models.common.record.controller);

    server.route([
        {
            method: 'POST',
            path: '/common/v1/records',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '创建新的记录信息',
                validate: models.common.record.validator.create.request,
                response: models.common.record.validator.create.response,
                handler: models.common.record.controller.create
            }
        },
        {
            method: 'GET',
            path: '/common/v1/records',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '分页方式获取获取记录列表信息',
                validate: models.common.record.validator.list.request,
                response: models.common.record.validator.list.response,
                notes: 'My route notes',
                handler: models.common.record.controller.list
            }
        },
        {
            method: 'GET',
            path: '/common/v1/records/{record_id}',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '获取指定标识的记录信息',
                validate: models.common.record.validator.get.request,
                response: models.common.record.validator.get.response,
                notes: 'My route notes',
                handler: models.common.record.controller.get
            }
        },
        {
            method: 'PUT',
            path: '/common/v1/records/{record_id}',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '更新指定标识的记录信息',
                validate: models.common.record.validator.put.request,
                response: models.common.record.validator.put.response,
                notes: 'My route notes',
                handler: models.common.record.controller.update
            }
        },
        {
            method: 'DELETE',
            path: '/common/v1/records/{record_id}',
            config: {
                auth: 'default',
                tags: ['api'],
                description: '删除指定标识的记录信息',
                validate: models.common.record.validator.delete.request,
                response: models.common.record.validator.delete.response,
                notes: 'My route notes',
                handler: models.common.record.controller.delete
            }
        }
    ])
};