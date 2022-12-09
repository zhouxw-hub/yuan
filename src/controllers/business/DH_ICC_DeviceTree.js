'usr script';


/**
 * 获取组织目录
 * @description 获取组织目录
 * @author ZY
 */

(function () {

    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const request = require("request");
    const config = require("config");
    const NodeRSA = require("node-rsa")

    /**
     * 查询获取组织目录
     * @param {string} database 数据库
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    module.exports = async function (options, callback) {




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
            var data1 = { "type": "001;1" };

            //获取tree
            await GEtDeviceTree(data1, Authorization).then(function (req) {
                list = req;

            }, function (err) {
                callback(err);
                return
            })
            // retry.findAll(list, callback);
            // return


            //获取   { "pageNum": 1, "pageSize": 1000 }
            await GETDeviceList(options, Authorization).then(function (req) {
                list = req;

            }, function (err) {
                callback(err);
                return
            })
        }

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

    var datas = { "username": "system", "password": getlist.pwd }
    //获取公钥
    function getCryptKey(datas) {
        return new Promise(function (resolve, reject) {
            request({
                url: config.get("icc.ip") + "videoService/accounts/authorize",//请求路径
                method: "POST",//请求方式，默认为get
                headers: {
                    'Content-Type': 'application/json'
                },
                //json: true,
                body: JSON.stringify(datas),//post参数字符串JSON.stringify()
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

    //获取tree
    function GEtDeviceTree(data, Authorization) {

        return new Promise(function (resolve, reject) {

            request({
                url: config.get("icc.ip") + "evo-apigw/evo-brm/1.0.0/tree",//请求路径
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
                if (data.success) {

                    resolve(data);
                } else {
                    resolve(null);
                }
            });
        });
    }

    //获取组织目录
    function GETDeviceList(data, Authorization) {
        return new Promise(function (resolve, reject) {

            request({
                url: config.get("icc.ip") + "evo-apigw/evo-brm/1.2.0/device/channel/subsystem/page",//请求路径
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

                if (data.success) {

                    resolve(data);
                } else {
                    resolve(null);
                }
            });
        });
    }
})()