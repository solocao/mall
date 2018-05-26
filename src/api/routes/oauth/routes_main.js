/**
 * Created by leiyin on 2017/03/13.
 */

var hapiToExpress = require('hapi-to-express');
var Boom = require('boom');
var oauthServer = require('oauth2-server');
var Request = oauthServer.Request;
var Response = oauthServer.Response;

module.exports = function(server, models, oauth){
    server.route([
        {
            method: 'POST',
            path: '/oauth/token',
            config: {
                handler: function (request, reply) {
                    var hapress = hapiToExpress(request, reply);
                    var express_req = new Request(hapress.req);
                    var express_res = new Response(hapress.res);
                    oauth.token(express_req, express_res)
                        .then(function (token) {
                            console.log("oauth token:" + JSON.stringify(token));
                            token.expires_in = 3600 * 24 * 7;
                            return reply(token);
                        })
                        .catch(function (err) {
                            console.log("err:" + JSON.stringify(err));
                            return reply.error(Boom.badImplementation(err.message, err));;
                        })
                }
            }
        }
    ])
};