/**
 * Created by leiyin on 2017/03/13.
 */
var _ = require('lodash');
var Promise = require("bluebird");
var client = require('restler');
var bcrypt = require('bcrypt');
var Boom = require('boom');
module.exports = function (db) {

    var User = db.User;
    var App = db.App;
    var Role = db.Role;
    var RoleMember = db.RoleMember;
    var OAuthClient = db.OAuthClient;
    var OAuthAccessToken = db.OAuthAccessToken;
    var OAuthAuthorizationCode = db.OAuthAuthorizationCode;
    var OAuthRefreshToken = db.OAuthRefreshToken;

    function getAccessToken(bearerToken) {
        console.log('getAccessToken')
        return OAuthAccessToken
            .findOne({
                where: { access_token: bearerToken },
                attributes: [['access_token', 'accessToken'], ['expires', 'accessTokenExpiresAt'], 'scope', 'type', 'user_id'],
                include: [App]
            })
            .then(function (accessToken) {
                if (!accessToken) return false;
                return User.findOne({
                    where: { user_id: accessToken.user_id },
                    include: [{
                        association: User.hasMany(RoleMember, { foreignKey: 'value', as: 'rolemembers' }),
                        required: false,
                        include: [{
                            model: Role,
                            as: 'role'
                        }]
                    }]
                }).then(function (item) {
                    if (!item) return false;
                    var token = accessToken.toJSON();
                    var user = item.toJSON();
                    delete user.password;
                    token.user = user;
                    token.client = token.App;
                    token.scope = token.scope;
                    return token;
                })
            })
            .catch(function (err) {
                console.log("----------------------check token error:-----------------------------");
                console.log(err);
            });
    }

    function getClient(clientId, clientSecret) {
        console.log('getClient')
        const options = {
            where: { app_id: clientId },
            attributes: ['app_id', 'name']
        };
        if (clientSecret) options.where.secret = clientSecret;
        return App
            .findOne(options)
            .then(function (client) {
                if (!client) return new Error("client not found");
                var clientWithGrants = client.toJSON();
                clientWithGrants.grants = ['authorization_code', 'password', 'refresh_token', 'client_credentials'];
                clientWithGrants.redirectUris = [clientWithGrants.redirect_uri];
                delete clientWithGrants.redirect_uri;
                return clientWithGrants
            }).catch(function (err) {
                console.log("getClient - Err: ", err)
            });
    }

    function getUser(username, password) {
        console.log('getUser')
        return User.findOne({
            where: { loginname: username },
            include: [{
                association: User.hasMany(RoleMember, { foreignKey: 'value', as: 'rolemembers' }),
                required: false,
                include: [{
                    model: Role,
                    as: 'role'
                }]
            }]
        }).then(function (user) {
            if (!user) return false;
            var item = user.toJSON();
            if (item.loginname == 'admin' && password == 'admin') {//系统默认管理员
                delete item.password;
                return item;
            }
            if (bcrypt.compareSync(password, user.password)) {
                delete item.password;
                return item;
            } else {
                return false;
            }
        })
    }

    function revokeAuthorizationCode(code) {
        console.log('revokeAuthorizationCode')
        return OAuthAuthorizationCode.findOne({
            where: {
                authorization_code: code.code
            }
        }).then(function (rCode) {
            var expiredCode = code
            expiredCode.expiresAt = new Date('2015-05-28T06:59:53.000Z')
            return expiredCode
        }).catch(function (err) {
            console.log("getUser - Err: ", err)
        });
    }

    function revokeToken(token) {
        console.log('token')
        return OAuthRefreshToken.findOne({
            where: {
                refresh_token: token.refreshToken
            }
        }).then(function (rT) {
            if (rT) rT.destroy();
            var expiredToken = token
            expiredToken.refreshTokenExpiresAt = new Date('2015-05-28T06:59:53.000Z')
            return expiredToken
        }).catch(function (err) {
            console.log("revokeToken - Err: ", err)
        });
    }

    function saveToken(token, client, user) {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log(token);
        console.log(client);
        console.log(user);
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++");
        return Promise.all([
            OAuthAccessToken.create({
                access_token: token.accessToken,
                expires: token.accessTokenExpiresAt,
                app_id: client.app_id,
                type: user.type,
                user_id: user.user_id,
                scope: token.scope
            }),
            token.refreshToken ? OAuthRefreshToken.create({ // no refresh token for client_credentials
                refresh_token: token.refreshToken,
                expires: token.refreshTokenExpiresAt,
                app_id: client.app_id,
                type: user.type,
                user_id: user.user_id,
                scope: token.scope
            }) : [],

        ])
            .then(function (resultsArray) {
                return _.assign(  // expected to return client and user, but not returning
                    {
                        client: client,
                        user: user,
                        access_token: token.accessToken, // proxy
                        refresh_token: token.refreshToken, // proxy
                    },
                    token
                )
            })
            .catch(function (err) {
                console.log("revokeToken - Err: ", err)
            });
    }

    function getAuthorizationCode(code) {
        console.log('getAuthorizationCode')
        return OAuthAuthorizationCode
            .findOne({
                attributes: ['client_id', 'expires', 'user_id', 'scope'],
                where: { authorization_code: code },
                include: [OAuthClient]
            })
            .then(function (authCodeModel) {
                if (!authCodeModel) return false;
                var client = authCodeModel.OAuthClient.toJSON()
                var user = authCodeModel.User.toJSON()
                return reCode = {
                    code: code,
                    client: client,
                    expiresAt: authCodeModel.expires,
                    redirectUri: client.redirect_uri,
                    user: user,
                    scope: authCodeModel.scope,
                };
            }).catch(function (err) {
                console.log("getAuthorizationCode - Err: ", err)
            });
    }

    function saveAuthorizationCode(code, client, user) {
        console.log('saveAuthorizationCode')
        return OAuthAuthorizationCode
            .create({
                expires: code.expiresAt,
                client_id: client.id,
                authorization_code: code.authorizationCode,
                user_id: user.id,
                scope: code.scope
            })
            .then(function () {
                code.code = code.authorizationCode
                return code
            }).catch(function (err) {
                console.log("saveAuthorizationCode - Err: ", err)
            });
    }

    function getUserFromClient(client) {
        console.log('getUserFromClient')
        var options = {
            where: { client_id: client.client_id },
            attributes: ['id', 'client_id', 'redirect_uri'],
        };
        if (client.client_secret) options.where.client_secret = client.client_secret;

        return OAuthClient
            .findOne(options)
            .then(function (client) {
                return {};
            }).catch(function (err) {
                console.log("getUserFromClient - Err: ", err)
            });
    }

    function getRefreshToken(refreshToken) {
        console.log('getRefreshToken')
        if (!refreshToken || refreshToken === 'undefined') return false

        return OAuthRefreshToken
            .findOne({
                attributes: ['app_id', 'user_id', 'type', 'expires'],
                where: { refresh_token: refreshToken },
                include: [{
                    model: db.App,
                    as: "app",
                    required: false
                }]
            }).then(function (token) {
                return User.findOne({
                    where: { user_id: token.user_id },
                    include: [{
                        association: User.hasMany(RoleMember, { foreignKey: 'value', as: 'rolemembers' }),
                        required: false,
                        include: [{
                            model: Role,
                            as: 'role'
                        }]
                    }]
                }).then(function (item) {
                    console.log("-----------------get fresh user------------------");
                    if (!item) return false;
                    var user = item.toJSON()
                    delete user.password;
                    token.user = user;
                    return token;
                });
            }).then(function (token) {

                console.log("-----------------get fresh token------------------");
                console.log(token);

                var tokenTemp = {
                    user: token.user,
                    client: token.app,
                    refreshTokenExpiresAt: token ? new Date(token.expires) : null,
                    refreshToken: refreshToken,
                    refresh_token: refreshToken,
                    scope: token.scope
                };

                return tokenTemp;

            }).catch(function (err) {
                console.log("getRefreshToken - Err: ", err)
            });
    }

    function validateScope(token, scope) {
        return true;//token.scope === scope
    }

    return {
        getAccessToken: getAccessToken,
        getAuthorizationCode: getAuthorizationCode,
        getClient: getClient,
        getRefreshToken: getRefreshToken,
        getUser: getUser,
        getUserFromClient: getUserFromClient,
        revokeAuthorizationCode: revokeAuthorizationCode,
        revokeToken: revokeToken,
        saveToken: saveToken,//saveOAuthAccessToken, renamed to
        saveAuthorizationCode: saveAuthorizationCode, //renamed saveOAuthAuthorizationCode,
        validateScope: validateScope
    };

};


