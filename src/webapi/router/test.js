"use script";

/**
 * 平台配置
 */
(function () {
    /**
     * 接口定义方式
     * @param {object}      [api={}]
     * @param {string}      [api.method] 提交方式
     * @param {string}      [api.routor] 路由地址
     * @param {string}      [api.describe] 接口描述
     * @param {boolean}     [api.msgsend=false] 是否进行转发
     * @param {boolean}     [api.writelog=false] 是否写入日志
     * @param {string}      [api.operation=0] 操作类型
     * @param {funcction}   [api.callback] 回调方法
     * 
     * @example
     * api = {
     *      method : "post"
     *      routor : "/webapi/service/test"
     *      describe : "webapi服务测试"
     *      msgsend: true,
     *      writelog: true,
     *      operation: 0,
     *      callback : async function (req, res, database) {
     *          await @todo
     *      }
     * }
     */

    /**********************************平台测试接口*************************************/
    const webapi = {
        method: "post",
        routor: "/webapi/service/test",
        describe: "平台测试接口",
        callback: async function (req, res, database) {
            res.send({
                success: true,
                msg: "API is OK!!!",
                database: database,
                req: req.body
            });
        }
    }

    /**********************************外部测试接口*************************************/
    const openapi = {
        method: "post",
        routor: "/openapi/service/test",
        describe: "外部测试接口",
        msgsend: true,
        callback: async function (req, res, database) {
            res.send({
                success: true,
                msg: "WebSocket API is OK!",
                database: database,
                req: req.body
            });
            return req.body
        }
    }

    module.exports.webapi = webapi;
    module.exports.openapi = openapi;
    module.exports.description = "测试接口";
})();