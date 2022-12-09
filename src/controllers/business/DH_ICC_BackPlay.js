'usr script';


/**
 * 回放
 * @description 回放
 * @author ZY
 */

(function () {

    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const request = require("request");
    const config = require("config");
    const NodeRSA = require("node-rsa")

    /**
     * 回放
     * @param {string} database 数据库
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    module.exports = async function (options, callback) {

        //验证提交数据
        var result = verify.execute(options, {
            channelId: verify.STRING,
            startTime: verify.STRING,
            endTime: verify.STRING
        });

        console.log(options.startTime);
        console.log(options.endTime);
        const startTime = (new Date(options.startTime)).getTime() / 1000;
        const endTime = (new Date(options.endTime)).getTime() / 1000;
        console.log(startTime);
        console.log(endTime);
        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        {
            var getlist;
            var Authorization;
            var list;
            await getCryptKey().then(function (req) {
                getlist = req;
            }, function (err) {
                callback(err);
                return
            });

            var data = { "client_id": config.get("icc.client_id"), "client_secret": config.get("icc.client_secret"), "grant_type": "password", "username": "system", "password": getlist.pwd, "public_key": getlist.publicKey }
            //获取Token
            await GETToken(data).then(function (req) {
                Authorization = req
            }, function (err) {
                callback(err);
                return
            })
            {

            }

            var data1 = { "project": "PSDK", "method": "SS.Playback.StartPlaybackByTime", "data": { "channelId": options.channelId, "startTime": startTime, "endTime": endTime, "playbackMode": "0", "recordSource": "2", "streamType": "1", "recordType": "1" } }

            ////视频回放
            await GETVideoPlayBlack(data1, Authorization).then(function (req) {
                list = req;

            }, function (err) {
                callback(err);
                return
            })

        }
        //rtsp://192.168.7.12:9320/playback/pu/27?token=27&trackID=701
        var PlayBackUrl = list.data.url + "?token=" + list.data.token + "&trackID=701";

        retry.findAll({ "url": PlayBackUrl }, callback);

        // var totallength=endTime-startTime;
        //http://10.88.46.2:7086/vod/device/cameraid/1000136$1$0$18/substream/1/recordtype/1/totallength/3600/begintime/1638936732/endtime/1638940332.m3u8
        // var PlayBackUrl=  config.get("icc.playbackip")+options.channelId+"/substream/1/recordtype/1/totallength/"+totallength+"/begintime/"+startTime+"/endtime/"+endTime+".m3u8"


    }


    //获取token
    function GETToken(data) {
        return new Promise(function (resolve, reject) {
            request({
                url: config.get("icc.ip") + "evo-apigw/evo-oauth/1.0.0/oauth/extend/token",//请求路径
                method: "POST",//请求方式，默认为get
                headers: {
                    'Content-Type': 'application/json'
                },
                //json: true,
                body: JSON.stringify(data),//post参数字符串JSON.stringify()
                strictSSL: false,//判断是否存在证书
            }, function (error, response, body) {
                if (error != null) {
                    reject(error);
                    return;
                }
                var data = JSON.parse(body);
                if (data.success) {
                    resolve("bearer " + data.data.access_token);
                } else {
                    resolve(null);
                }
            });
        });
    }

    //获取公钥
    function getCryptKey() {
        return new Promise(function (resolve, reject) {
            request({
                url: config.get("icc.ip") + "evo-apigw/evo-oauth/1.0.0/oauth/public-key",//请求路径
                method: "GET",//请求方式，默认为get         
                strictSSL: false,//判断是否存在证书
            }, function (error, response, body) {
                if (error != null) {
                    reject(error);
                    return;
                }
                var data = JSON.parse(body);
                if (data.success) {
                    var str = "-----BEGIN PUBLIC KEY-----\n" + data.data.publicKey + "\n-----END PUBLIC KEY-----";

                    const public_key = new NodeRSA(str);
                    public_key.setOptions({ encryptionScheme: 'pkcs1' })
                    const encrypted = public_key.encrypt(config.get("icc.Password"), 'base64');
                    resolve({ "publicKey": data.data.publicKey, "pwd": encrypted });
                } else {
                    resolve(null);
                }

            });
        });
    }


    //回放
    function GETVideoPlayBlack(data, Authorization) {
        console.log(data)
        return new Promise(function (resolve, reject) {
            request({
                url: config.get("icc.ip") + "evo-apigw/admin/API/SS/Playback/StartPlaybackByTime",//请求路径
                method: "POST",//请求方式，默认为get
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Authorization
                },
                //json: true,
                body: JSON.stringify(data),//post参数字符串JSON.stringify()
                strictSSL: false,//判断是否存在证书
            }, function (error, response, body) {
                if (error != null) {
                    reject(error);
                    return;
                }
                var data = JSON.parse(body);
                if (data.desc == "Success") {
                    resolve(data);
                } else {
                    resolve(null);
                }
            });
        });
    }

})()