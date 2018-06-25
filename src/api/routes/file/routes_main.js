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
                            var filename = guid + '/' + file.originalFilename;

                            var fileUrl = "images/" + filename;

                            console.log("上传的文件是：" + filename);
                            console.log(fileUrl)

                            var data = fs.readFileSync(file.path);
                            data.fileId = filename;
                            data.name = file.originalFilename;
                            data.type = file.headers["content-type"];

                            fs.exists('/' + guid, function (exists) {
                                console.log(exists)
                                if (exists) {
                                    fs.writeFileSync(fileUrl, data, function (err, data) {//保存
                                        if (err) console.error(err);
                                        console.log('异步读取文件数据：' + data.toString());
                                    })
                                } else {
                                    fs.mkdir('images/'+guid, function () {
                                        console.log(222)
                                        fs.writeFileSync(fileUrl, data, function (err, data) {//保存
                                            if (err) console.error(err);
                                            console.log('异步读取文件数据：' + data.toString());
                                        })
                                    });
                                }
                            });

                            // //实用im获取图片的的信息
                            // im.identify(file.path, function (err, features) {

                            //     //console.log("--------------features----------------");
                            //     //console.log(features);

                            //     if (err) {
                            //         //保存文件到GridFs
                            //         fileUpload.insert(data, function (item) {
                            //             var result = {
                            //                 url: fileUrl,
                            //                 contentType: item.contentType,
                            //                 length: item.length,
                            //                 metadata: item.metadata
                            //             };

                            //             //Restify.sendData(result, req, res);

                            //             reply.send(result);
                            //         });
                            //     } else {
                            //         if (features && features.width) {

                            //             metadata.width = features.width;
                            //             metadata.height = features.height;
                            //             metadata.format = features.format;

                            //             //如果文件是图片，则尝试获取exif信息;
                            //             exif(file.path, function (err, obj) {

                            //                 if (!err) {

                            //                     //console.log("Get exif:" + JSON.stringify(obj));

                            //                     var exifdata = {};
                            //                     console.log('Make:' + obj["make"]);
                            //                     console.log('Camera Model Name', obj["camera model name"]);
                            //                     console.log('Create Date:' + obj["create date"]);
                            //                     exifdata.make = obj["make"] || '';
                            //                     exifdata.model = obj["camera model name"] || '';
                            //                     exifdata.create = obj["create date"] || '';
                            //                     exifdata.mime = obj["mime type"] || '';
                            //                     exifdata.description = obj["image description"] || '';
                            //                     exifdata.orientation = obj["orientation"] || '';
                            //                     exifdata.exposure_time = obj["exposure time"] || '';
                            //                     exifdata.f_number = obj["f number"] || '';
                            //                     exifdata.iso = obj["iso"] || '';
                            //                     exifdata.focal_length = obj["focal length"] || '';
                            //                     exifdata.focus_mode = obj["focus mode"] || '';
                            //                     exifdata.width = obj["image width"] || '';
                            //                     exifdata.height = obj["image height"] || '';
                            //                     exifdata.exposure_mode = obj["exposure mode"] || '';
                            //                     exifdata.white_balance = obj["white balance"] || '';
                            //                     exifdata.aperture = obj["aperture"] || '';
                            //                     exifdata.shutter_speed = obj["shutter speed"] || '';
                            //                     exifdata.light_value = obj["light value"] || '';
                            //                     data.metadata.exif = exifdata;
                            //                 }

                            //                 //保存文件到GridFs
                            //                 fileUpload.insert(data, function (item) {

                            //                     //console.log("Save file: " + JSON.stringify(item));

                            //                     var result = {
                            //                         url: fileUrl,
                            //                         contentType: item.contentType,
                            //                         length: item.length,
                            //                         metadata: item.metadata
                            //                     };

                            //                     reply.send(result);
                            //                 });
                            //             });

                            //         } else {
                            //             if (err)
                            //                 throw err;
                            //             throw (new Error("Cannot get width for photo"));
                            //         }
                            //     }
                            // });
                        })
                    });
                }
            }
        },
    ])
};