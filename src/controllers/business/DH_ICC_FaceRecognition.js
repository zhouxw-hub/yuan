'usr script';


/**
 * 面部识别记录
 * @description 面部识别记录
 * @author ZY
 */

(function () {

    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const request = require("request");
    const config = require("config");
    const NodeRSA = require("node-rsa");


    /**
     * 面部识别记录
     * @param {string} database 数据库
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    module.exports = async function (options, callback) {

        //验证提交数据
        var result = verify.execute(options, {
            pageNum:verify.STRING,
            pageSize:verify.STRING,
            startTime:verify.STRING,
            endTime:verify.STRING
        });

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

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
        await GETToken(data,Authorization).then(function (req) {
            Authorization = req
        }, function (err) {
            callback(err);
            return
        })


      
        // 面部识别记录
        await GETFace(options,Authorization).then(function (req) {
            list = req;

        }, function (err) {
            callback(err);
            return
        })

        list.forEach(element => {
            element.faceMinUrl=config.get("icc.ip")+"evo-pic/"+element.faceMinUrl+"?token="+Authorization+"&oss_addr="+config.get("icc.oss_addr");
            element.imageUrl=config.get("icc.ip")+"evo-pic/"+element.imageUrl+"?token="+Authorization+"&oss_addr="+config.get("icc.oss_addr");
        });
        retry.findAll(list, callback);
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


    //获取智能面部识别记录
    function GETFace(data) {
        var suffix="?pageNum="+data.pageNum+"&pageSize="+data.pageSize+"&searchType=2&startTime="+data.startTime+"&endTime="+data.endTime+"&screenPlaceIds="+data.screenPlaceIds
        //console.log(suffix)
        return new Promise(function (resolve, reject) {

            request({
                url: config.get("icc.ip") + "evo-apigw/evo-face/faceQuery/page"+suffix,//请求路径
                method: "GET",//请求方式，默认为get
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
                    resolve(data.data.pageData);
                } else {
                    resolve(data);
                }
            });
        });
    }

})()