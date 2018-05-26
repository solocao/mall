/**
 * Created by leiyin on 2017/03/13.
 */

var Joi = require('joi');

var Joipermissions = require('../permission/validator');

var Status = {
    404: Joi.string().max(50).required().description('未找到服务器资源'),
    500: Joi.string().max(50).required().description('内部服务器错误')
};

const PREFIX = "Role";

var Model = {
    name: Joi.string().max(255).required().description('名称'),
    description: Joi.string().max(255).allow(null).allow('').description('描述'),
    permissions: Joi.array().allow(null).description("权限列表")
};



var ResponseModel = {
    role_id: Joi.number().integer().required().description('角色标识'),
    name: Joi.string().max(255).required().description('名称'),
    description: Joi.string().max(255).allow(null).allow('').description('描述'),
    updated_at: Joi.date().allow(null).description('更新日期')
    
};

module.exports = {
    //获取指定标识对象数据的请求响应消息体
    get: {
        request: {
            params: {
                role_id: Joi.number().integer().required().description('角色标识')
            }
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息'),
                rows: Joi.object(ResponseModel)
                    .meta({ className: PREFIX + "GetResponseData" })
                    .allow(null)
                    .description("角色信息")
            }).meta({ className: PREFIX + "GetResponse" }).required().description("返回消息体")
        }
    },
    //按分页方式获取对象数据的请求响应消息体
    list: {
        request: {
            query: {
                search: Joi.string().max(50).allow([null, '']).description('关键字'),
                page_size: Joi.number().integer().min(0).default(10).description('分页大小'),
                page_number: Joi.number().integer().min(0).default(1).description('分页页号'),
                sort: Joi.string().max(50).allow([null, '']).description('排序字段'),
                order: Joi.string().max(50).allow([null, '']).description('排序方式')
            }
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息'),
                total: Joi.number().integer().description('数据总数'),
                rows: Joi.array().items(Joi.object(ResponseModel).meta({ className: PREFIX + "ListResponseData" }))
            }).meta({ className: PREFIX + "ListResponse" }).required().description("返回消息体")
        }
    },
    //创建新的对象数据的请求响应消息体
    create: {
        request: {
            payload: Joi.object(Model).meta({ className: PREFIX + 'PostRequest' }),
           
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息'),
                rows: Joi.object(ResponseModel).meta({ className: PREFIX + "PostResponseData" }).required().description("应用信息")
            }).meta({ className: PREFIX + "PostResponse" }).required().description("返回消息体"),
            status: Status
        }
    },
    //更新指定标识对象数据的请求响应消息体
    put: {
        request: {
            params: {
                role_id: Joi.number().integer().required().description('角色标识')
            },
            payload: Joi.object(Model).meta({ className: PREFIX + 'PutRequest' })
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息, 默认:OK')
            }).meta({ className: PREFIX + "PutResponse" }).required().description("返回消息体"),
            status: Status
        }
    },
    //删除指定标识对象数据的请求响应消息体
    delete: {
        request: {
            params: {
                role_id: Joi.number().integer().required().description('角色标识')
            }
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息')
            }).meta({ className: PREFIX + "DeleteResponse" }).required().description("返回消息体"),
            status: Status
        }
    }
};