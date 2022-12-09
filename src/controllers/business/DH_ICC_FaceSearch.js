'usr script';

const corsMiddleware = require("restify-cors-middleware");


/**
 * 以图搜图
 * @description 以图搜图
 * @author ZY
 */

(function () {

    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const request = require("request");
    const config = require("config");
    const NodeRSA = require("node-rsa")

    /**
     * 以图搜图
     * @param {string} database 数据库
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    module.exports = async function (options, callback) {

        //验证提交数据
        var result = verify.execute(options, {
            threshold: verify.STRING,
            base64Img: verify.STRING,
            startTime: verify.STRING,
            endTime: verify.STRING
        });

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        if(options.base64Img.indexOf("http")!=-1){
            await  http.get(options.base64Img, function (res) {
                var chunks = [];
                var size = 0;
                res.on('data', function (chunk) {
                    chunks.push(chunk);
                    size += chunk.length;　　//累加缓冲数据的长度
                });
                res.on('end', function (err) {
                    var data = Buffer.concat(chunks, size);
                    var base64Img = data.toString('base64');
                    options.base64Img=base64Img;
                });
            });
        }



        var getlist;
        var Authorization;
        var falg;
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

        var data1={deviceCodeList: "1000135"};
        var deviceChannels={"1000135":[]};
        var arr=[];
        //查询设备
        await FaceDevice(data1, Authorization).then(function (req) {
            var devicelist=req;
            devicelist.forEach(element => {
                arr.push(element.channelCodeStr)
            });
            deviceChannels={"1000135":arr}
        }, function (err) {
            callback(err);
            return
        })
       
        options.deviceChannels=deviceChannels;
        options.callBackMethod=config.get("icc.callBackMethod");
        options.timeStamp=new Date().getTime();
      // 提交查询
        await Search(options, Authorization).then(function (req) {
            falg = req;
        }, function (err) {
            callback(err);
            return
        })
        falg.timeStamp=options.timeStamp;
        retry.findAll(falg, callback);
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

    //获取人脸设备
    function FaceDevice(data,Authorization){
        return new Promise(function (resolve, reject) {
            request({
                url: config.get("icc.ip") + "evo-apigw/evo-face/faceSearch/channelList",//请求路径
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
                if (data.success == true) { 
                    resolve(data.data);
                } else {
                    resolve(data);
                }
            });
        });
    }
    



    //查询
    function Search(data, Authorization) {
     //console.log(Authorization);
        return new Promise(function (resolve, reject) {

            request({
                url: config.get("icc.ip") + "evo-apigw/evo-face/thirdFaceSearch/search",//请求路径
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

                if (data.success == true) {

                    resolve(data);
                } else {
                    resolve(data);
                }
            });
        });
    }

    //查结果
    function SearchPage(data,Authorization){
        return new Promise(function (resolve, reject) {
            request({
                url: config.get("icc.ip") + "evo-apigw/evo-face/thirdFaceSearch/page",//请求路径
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
                if (data.success == true) {
                    resolve(data);
                } else {
                    resolve(data);
                }
            });
        });
    }
})()