/**
 * Created by leiyin on 2017/03/13.
 */

var Joi = require('joi');

var Status = {
    404: Joi.string().max(50).required().description('未找到服务器资源'),
    500: Joi.string().max(50).required().description('内部服务器错误')
};

const PREFIX = "Permission";
var Model = {
    permission_id: Joi.number().required().description('权限标识'),
    resource_type: Joi.string().max(50).required().description('资源类型'),
    resource_id: Joi.string().max(50).required().description('资源标识'),
    credential_type: Joi.string().max(50).required().description('凭据类型'),
    credential_id: Joi.string().max(50).required().description('凭据标识'),
    updated_at: Joi.date().allow(null).description('更新日期')
};

var RequestModel = {
    resource_type: Joi.string().max(50).required().description('资源类型'),
    resource_id: Joi.string().max(50).required().description('资源标识'),
    credential_type: Joi.string().max(50).required().description('凭据类型'),
    credential_id: Joi.string().max(50).required().description('凭据标识')
};

module.exports = {
    //获取指定标识对象数据的请求响应消息体
    get : {
        request: {
            params: {
                permission_id: Joi.number().min(1).required().description('房产结构标识')
            }
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息'),
                rows: Joi.object(Model)
                    .meta({ className: PREFIX + "GetResponseData" })
                    .allow(null)
                    .description("设备信息")
            }).meta({ className: PREFIX + "GetResponse" }).required().description("返回消息体")
        }
    },
    //按分页方式获取对象数据的请求响应消息体
    list: {
        request: {
            query: {
                resource_type: Joi.string().required().description('资源标识'),
                credential_type: Joi.string().required().description('证书类型'),
                credential_id: Joi.string().required().description('证书标识'),
                page_size: Joi.number().integer().min(0).default(10).description('分页大小'),
                page_number: Joi.number().integer().min(0).default(1).description('分页页号')
            }
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息'),
                total: Joi.number().integer().description('数据总数'),
                rows: Joi.array().items(Joi.object(Model).meta({className:  PREFIX + "ListResponseData"}))
            }).meta({ className:  PREFIX + "ListResponse"}).required().description("返回消息体")
        }
    },
    //创建新的对象数据的请求响应消息体
    create: {
        request: {
            payload: Joi.object(RequestModel).meta({className:  PREFIX + 'PostRequest'})
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息'),
                data: Joi.object(Model).meta({ className:  PREFIX + "PostResponseData" }).required().description("房产结构信息")
            }).meta({ className:  PREFIX + "PostResponse"}).required().description("返回消息体"),
            status: Status
        }
    },
    //更新指定标识对象数据的请求响应消息体
    put: {
        request: {
            params: {
                permission_id: Joi.number().min(1).required().description('房产结构标识')
            }
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
                permission_id: Joi.number().min(1).required().description('房产结构标识')
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