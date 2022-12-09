'usr script';


/**
 * 播放预览
 * @description 播放预览
 * @author ZY
 */

(function () {

    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const request = require("request");
    const config = require("config");
    const NodeRSA = require("node-rsa")

    /**
     * 播放预览
     * @param {string} database 数据库
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    module.exports = async function (options, callback) {

        //验证提交数据
        var result = verify.execute(options, {
            channelId: verify.STRING,
        });

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        var arr=options.channelId.split("$");

        var rtsp= config.get("icc.rtsp")+"cameraid="+arr[0]+"%24"+arr[arr.length-1]+"&substream=1"
    
        retry.findAll({"url":rtsp}, callback);

     
    }

})()