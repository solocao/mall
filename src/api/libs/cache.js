/**
 * Created by leiyin on 2017/03/13.
 */
var redis = require("redis");

//通过使用bluebird宣告node_redis 它将向所有node_redis函数添加一个Async（例如return client.getAsync().then()）
var bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var client = redis.createClient();//'6379','127.0.0.1'

client.on("error", function (err) {
   console.log("Redis Error " + err);
});

module.exports = {
    client: client,
    redis: redis
}