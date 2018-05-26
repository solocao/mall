/**
 * Created by leiyin on 2017/03/13.
 */
"use strict";
const Hapi = require('hapi');
const hapiToExpress = require('hapi-to-express');
const Path = require('path');
const Boom = require('boom');
const PassThrough = require('stream').PassThrough;
const bootstrap = require('./guide')();

var oauthServer = require('oauth2-server');
var Request = oauthServer.Request;
var Response = oauthServer.Response;

const oauth = new oauthServer({
    model: require('./libs/oauth_model.js')(bootstrap.db),
    accessTokenLifetime: 3600 * 24 * 7,
    refreshTokenLifetime: 3600 * 24 * 7
});

const db = bootstrap.db;
const models = bootstrap.models;

var server = new Hapi.Server();
var port = 3001;
const reply_send = function (data) {
    if (data instanceof Object) {
        if (data.hasOwnProperty('total') && data.hasOwnProperty('items')) {
            return this.response({ code: 200, message: "OK", total: data.total, rows: data.items });
        } else {
            if (data.toJSON) {
                return this.response({ code: 200, message: "OK", rows: data.toJSON() });
            } else {
                return this.response({ code: 200, message: "OK", rows: data });
            }
        }
    }
    return this.response({ code: 200, message: "OK" });
};

const reply_error = function (boom) {
    return this.response({ code: boom.output.statusCode, message: boom.output.payload.message }).code(boom.output.statusCode);
};

//为reply增加扩展方法,增加的两个方法主要为了兼容旧版本
server.decorate('reply', 'send', reply_send);
server.decorate('reply', 'error', reply_error);

server.connection({
    port: port,
    routes: {
        cors: {
            origin: ['*'],
            additionalHeaders: ["Accept-Language"]
        }
    },
    labels: ['api']
})

server.register([
    require('inert'),
    require('vision'),
    {
        register: require('hapi-swaggered'),
        options: {
            tags: {
                'common': "通用功能",
                'meeting': "会议功能",
                'organization': '组织机构',
                'security': '安全',
                'system': "系统功能",
                'oauth': '认证'
            },
            info: {
                title: '企业基础SaaS平台',
                description: '为企业提供基础软件即服务的平台',
                version: '1.0'
            }
        }
    },
    {
        register: require('hapi-swaggered-ui'),
        options: {
            title: '企业基础SaaS平台',
            path: '/docs',
            authorization: {
                field: 'Authorization',
                scope: 'header', // header works as well
                valuePrefix: 'Bearer ',
                defaultValue: 'token',
                placeholder: 'Enter your token here'
            },
            swaggerOptions: {
                validatorUrl: null
            }
        }
    },
    {
        register: require('hapijs-status-monitor'),
        options: {
            title: '状态监控',
            path: '/status',
            spans: [{
                interval: 1,     // Every second
                retention: 60    // Keep 60 datapoints in memory
            },
            {
                interval: 5,     // Every 5 seconds
                retention: 60
            }, {
                interval: 15,    // Every 15 seconds
                retention: 60
            }],
            routeConfig: {
                auth: false
            }
        }
    },
    //Server - Sent Events for hapi with support for streaming events
    require('susie')
], {
        select: 'api'
    }, function (err) {
        if (err) {
            throw err
        }
        //默认跳转到docs
        server.route({
            path: '/',
            method: 'GET',
            handler: function (request, reply) {
                reply.redirect('/docs')
            }
        });
    });

server.on('request-error', function (request, err) {
    console.log("-------------------------------------------");
    console.log(err.message);
    console.log("-------------------------------------------");
});

const scheme = function (server, options) {
    return {
        authenticate: function (request, reply) {
            var hapress = hapiToExpress(request, reply);
            var express_req = new Request(hapress.req);
            var express_res = new Response(hapress.res);
            oauth.authenticate(express_req, express_res, {})
                .then(function (token) {
                    console.log('token')
                    //从token中获取通用的过滤条件
                    request.filter = {
                        app_id: token.App.app_id
                    };
                    request.filter.user = {
                        user_id: token.user.user_id,
                        login_name: token.user.loginname,
                        nickname: token.user.nickname
                    };
                    // console.log("++++++++++filter+++++++++++");
                    // console.log(JSON.stringify(request.filter));
                    // console.log("++++++++++filter+++++++++++");
                    var language = request.headers["accept-language"]
                    if (!language) {
                        language = 'zh-cn';
                    }
                    switch (language) {
                        case 'zh-cn':
                        case 'en-us':
                        case 'ru':
                            request.filter.language = language;
                            break;
                        default:
                            request.filter.language = 'zh-cn';
                    }
                    console.log("------------------on filter------------------");
                    console.log(request.filter.language);
                    console.log("------------------on filter------------------");
                    return reply.continue({ credentials: token });
                })
                .catch(function (err) {
                    console.log('err')
                    console.log(err)
                    return reply(Boom.unauthorized());
                });
        }
    };
};

server.ext({
    type: 'onPreHandler',
    method: function (request, reply) {

        //主机头
        db.host = request.info.host;
        console.log('host:', request.info.host)
        return reply.continue();
    }
});

server.auth.scheme('custom', scheme);
server.auth.strategy('default', 'custom');

require("./routes")(server, models, oauth);

db.sequelize.sync().then(function () {

    server.start(function () {
        console.log('Running on', port)
    })
}).catch(function (err) {
    console.log("model 同步出现错误:" + err.message);
});