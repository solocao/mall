/**
 * Created by leiyin on 2017/03/13.
 */
"use strict";
const settings = require('./conf.js');
//初始化数据库连接
const db = require('./libs/database.js')(settings.mysql);
module.exports = function () {
    const models = require("./models")(db);
    return { db: db, models: models };
};