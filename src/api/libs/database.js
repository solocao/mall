/**
 * Created by leiyin on 2017/03/13.
 */
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
// var cache = require('./cache.js');//缓存配置文件

    
//数据模块文件的根目录
var MODULES_FOLDER = 'models';

module.exports = function (settings) {
    var sequelize = new Sequelize(settings.database, settings.username, settings.password, settings.options);
    var db = {  sequelize: sequelize, Sequelize: Sequelize };
    //读取根目录下文件
    fs.readdirSync(MODULES_FOLDER)
        .filter(function (filename) {
            //过滤 必须是文件夹
            return fs.statSync(path.join(MODULES_FOLDER, filename)).isDirectory();
        })
        .forEach(function (moduleName) {
            var module_folder = path.join(MODULES_FOLDER, moduleName);
            //读取文件夹下的文件
            fs.readdirSync(module_folder)
                .filter(function (filename) {
                    //过滤 必须是文件夹
                    return fs.statSync(path.join(module_folder, filename)).isDirectory();
                })
                .forEach(function (moduleDirectory) {
                    //读取文件夹下的文件
                    var model_folder = path.join(module_folder, moduleDirectory);
                    fs.readdirSync(model_folder)
                        .filter(function (filename) {
                            //过滤 文件名必须叫model.js
                            return /^model\.js$/.test(filename);
                        })
                        .forEach(function (modelFilename) {
                            var modelPath = path.join('..',module_folder,moduleDirectory,modelFilename);
                            console.log("加载 model 定义: " + moduleDirectory);
                            var model = sequelize.import(modelPath);
                            db[model.name] = model;
                        });
                })
        });

    //配置OAuth2验证相关模型
    db.OAuthAccessToken = sequelize.import('../models/oauth/oauth_access_token/model');
    db.OAuthAuthorizationCode = sequelize.import('../models/oauth/oauth_authorization_code/model');
    db.OAuthClient = sequelize.import('../models/oauth/oauth_client/model');
    db.OAuthRefreshToken = sequelize.import('../models/oauth/oauth_refresh_token/model');
    db.OAuthScope = sequelize.import('../models/oauth/oauth_scope/model');

    Object.keys(db).forEach(function (modelName) {
        if ('associate' in db[modelName]) {
            db[modelName].associate(db);
        }
    });
    return db;
};