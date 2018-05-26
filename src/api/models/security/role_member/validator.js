/**
 * Created by leiyin on 2017/03/13.
 */

var Joi = require('joi');

var Status = {
    404: Joi.string().max(50).required().description('未找到服务器资源'),
    500: Joi.string().max(50).required().description('内部服务器错误')
};

const PREFIX = "RoleMember";

var Model = {
    title: Joi.string().max(255).required().description('名称'),
    type: Joi.string().max(255).allow(null).allow('').description('类型'),
    value: Joi.string().max(255).allow(null).allow('').description('成员标识值')
};

var ResponseModel = {
    member_id: Joi.number().integer().required().description('成员标识'),
    role: Joi.object({
        role_id: Joi.number().required().description("角色标识"),
        title: Joi.string().description('标题')
    }).meta({ className: PREFIX + "Project"}).allow(null).description("角色摘要"),
    title: Joi.string().max(255).required().description('名称'),
    type: Joi.string().max(255).allow(null).allow('').description('类型'),
    value: Joi.string().max(255).allow(null).allow('').description('成员标识值'),
    updated_at: Joi.date().allow(null).description('更新日期')
};

module.exports = {
    //获取指定标识对象数据的请求响应消息体
    get : {
        request: {
            params: {
                role_id: Joi.number().integer().required().description('角色标识'),
                member_id: Joi.number().integer().required().description('角色成员标识')
            }
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息'),
                data: Joi.object(ResponseModel)
                    .meta({ className: PREFIX + "GetResponseData" })
                    .allow(null)
                    .description("角色信息")
            }).meta({ className: PREFIX + "GetResponse"}).required().description("返回消息体")
        }
    },
    //按分页方式获取对象数据的请求响应消息体
    list: {
        request: {
            params: {
                role_id: Joi.number().integer().required().description('角色标识')
            },
            query: {
                page_size: Joi.number().integer().min(0).default(10).description('分页大小'),
                page_number: Joi.number().integer().min(0).default(1).description('分页页号')
            }
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息'),
                total: Joi.number().integer().description('数据总数'),
                rows: Joi.array().items(Joi.object(ResponseModel).meta({className:  PREFIX + "ListResponseData"}))
            }).meta({ className:  PREFIX + "ListResponse"}).required().description("返回消息体")
        }
    },
    //创建新的对象数据的请求响应消息体
    create: {
        request: {
            params: {
                role_id: Joi.number().integer().required().description('角色标识')
            },
            payload: Joi.object(Model).meta({className:  PREFIX + 'PostRequest'})
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息'),
                data: Joi.object(ResponseModel).meta({ className:  PREFIX + "PostResponseData" }).required().description("应用信息")
            }).meta({ className:  PREFIX + "PostResponse"}).required().description("返回消息体"),
            status: Status
        }
    },
    //更新指定标识对象数据的请求响应消息体
    put: {
        request: {
            params: {
                role_id: Joi.number().integer().required().description('角色标识'),
                member_id: Joi.number().integer().required().description('角色成员标识')
            },
            payload: Joi.object(Model).meta({className:  PREFIX + 'PutRequest'})
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息, 默认:OK')
            }).meta({ className:  PREFIX + "PutResponse"}).required().description("返回消息体"),
            status: Status
        }
    },
    //删除指定标识对象数据的请求响应消息体
    delete: {
        request: {
            params: {
                role_id: Joi.number().integer().required().description('角色标识'),
                member_id: Joi.number().integer().required().description('角色成员标识')
            }
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息')
            }).meta({ className:  PREFIX + "DeleteResponse"}).required().description("返回消息体"),
            status: Status
        }
    }
};