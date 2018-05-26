/**
 * Created by leiyin on 2017/03/13.
 */

var fs = require('fs');
var path = require('path');

module.exports = function (server, models, oauth) {    
    //根目录
    const ROUTES_FOLDER = "routes";
    //读取根目录下文件
    fs.readdirSync(ROUTES_FOLDER)
        .filter(function (filename) {
            //过滤 必须是目录
            return fs.statSync(path.join(ROUTES_FOLDER, filename)).isDirectory();
        })
        .forEach(function (moduleName) {
            var module_folder = path.join(ROUTES_FOLDER, moduleName);
            //读取文件夹下的文件
            fs.readdirSync(module_folder)
                .filter(function (filename) {
                    //过滤 必须是routes_*.js
                    return /^routes_.*\.js$/.test(filename);
                })
                .forEach(function (routes_file) {
                    var routes_file = path.join('..',module_folder,routes_file);
                    console.log("加载Router: " + routes_file);
                    //加载Router对象
                    require(routes_file)(server, models, oauth);
                });
        });

};
