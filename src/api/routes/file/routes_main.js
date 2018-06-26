/**
 * Created by leiyin on 18/6/6.
 */

var Joi = require('joi');
var http = require('http');
var fs = require('fs');
var multiparty = require('multiparty');
var Guid = require('guid');
var tmp_dir = require('os').tmpdir();

module.exports = function (server, modules) {

    server.route([
        {
            method: 'POST',
            path: '/storage/v1/files/upload',
            config: {
                tags: ['api'],
                description: '上传文件的处理程序',
                notes: 'My route notes',
                payload: {
                    maxBytes: 209715200,
                    output: 'stream',
                    parse: false
                },
                handler: function (request, reply) {

                    var form = new multiparty.Form();
                    form.parse(request.payload, function (err, fields, files) {
                        if (err) return reply(err);

                        files.file.forEach(function (file) {

                            console.log("--------------file---------------");
                            console.log(file);//文件流
                            console.log(fields);//上传参数
                            console.log(file.originalFilename);//文件原始名
                            var guid = Guid.create();
                            var baseUrl = "../../../../images/";
                            var filename = guid + '/' + file.originalFilename;

                            var fileUrl = baseUrl + filename;

                            console.log("上传的文件是：" + filename);
                            console.log(fileUrl)

                            var data = fs.readFileSync(file.path);
                            data.fileId = filename;
                            data.name = file.originalFilename;
                            data.type = file.headers["content-type"];

                            fs.exists(baseUrl + guid, function (exists) {
                                if (exists) {
                                    fs.writeFileSync(fileUrl, data, function (err, data) {//保存
                                        if (err) throw (new Error("图片保存失败"));
                                        console.log('异步读取文件数据：' + data.toString());
                                    })
                                } else {
                                    fs.mkdir(baseUrl + guid, function () {
                                        console.log(222)
                                        fs.writeFileSync(fileUrl, data, function (err, data) {//保存
                                            if (err) throw (new Error("图片保存失败"));
                                            reply.send('images/' + filename);
                                            console.log('异步读取文件数据：' + data.toString());
                                        })
                                    });
                                }
                            });
                        })
                    });
                }
            }
        },
    ])
};