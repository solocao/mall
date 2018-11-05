/**
 * Created by leiyin on 2017/03/13.
 */

var Joi = require('joi');

var Status = {
    404: Joi.string().max(50).required().description('未找到服务器资源'),
    500: Joi.string().max(50).required().description('内部服务器错误')
};

const PREFIX = "user";
var Model = {
    record_id: Joi.number().required().description('记录标识'),
    awards: Joi.string().allow(['', null]).description('选择奖项'),
    jobs: Joi.string().allow(['', null]).description('就业意向'),
    tags: Joi.string().allow(['', null]).description('就业意向'),
    skills: Joi.string().allow(['', null]).description('专业'),
    user_id: Joi.number().allow(['', null]).description('用户标示'),
    created_at: Joi.date().allow(null).description('创建日期'),
    updated_at: Joi.date().allow(null).description('更新日期'),
};

var RequestModel = {
    awards: Joi.string().allow(['', null]).description('选择奖项'),
    jobs: Joi.string().allow(['', null]).description('就业意向'),
    tags: Joi.string().allow(['', null]).description('就业意向'),
    skills: Joi.string().allow(['', null]).description('专业'),
    user_id: Joi.number().allow(['', null]).description('用户标示'),
};

module.exports = {
    //获取指定标识对象数据的请求响应消息体
    get : {
        request: {
            params: {
                record_id: Joi.number().min(1).required().description('记录标识')
            }
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().description("返回代码"),
                message: Joi.string().description('返回信息'),
                rows: Joi.object(Model)
                    .meta({ className: PREFIX + "GetResponseData" })
                    .allow(null)
                    .description("用户信息")
            }).meta({ className: PREFIX + "GetResponse" }).required().description("返回消息体")
        }
    },
    //按分页方式获取对象数据的请求响应消息体
    list: {
        request: {
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
                code: Joi.number().integer().description("返回代码"),
                message: Joi.string().description('返回信息'),
                rows: Joi.object(Model)
                    .meta({ className: PREFIX + "GetResponseData" })
                    .allow(null)
                    .description("用户信息")
            }).meta({ className: PREFIX + "GetResponse" }).required().description("返回消息体"),
            status: Status
        }
    },
    //更新指定标识对象数据的请求响应消息体
    put: {
        request: {
            params: {
                record_id: Joi.string().max(10).required().description('记录标识')
            },
            payload: Joi.object(RequestModel).meta({className:  PREFIX + 'PutRequest'})
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
                record_id: Joi.string().max(10).required().description('记录标识')
            }
        },
        response: {
            schema: Joi.object({
                code: Joi.number().integer().required().description("返回代码"),
                message: Joi.string().description('返回信息')
            }).meta({ className:  PREFIX + "DeleteResponse"}).required().description("返回消息体"),
            status: Status
        }
    },
 };