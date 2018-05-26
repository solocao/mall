/**
 * Created by leiyin on 2017/03/13.
 */
"use strict";
var nconf = require('nconf');
nconf.argv().env();
var app_env = nconf.get('NODE_ENV');
console.log(app_env);
if (app_env == undefined || app_env == '') {
    app_env = 'development';
}
module.exports = require('./config/' + app_env + '.json');