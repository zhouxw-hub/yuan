# 接口定义方式

```js

    /**
     * 接口定义方式
     * 参数定义：request.body
     * 接口请求无需参数时，method为get
     * 接口请求需要参数时，methon为post
     * 参数从request.body进行获取
     * 
     * @param {object}      [api={}]
     * @param {string}      [api.method] 提交方式
     * @param {string}      [api.routor] 路由地址
     * @param {string}      [api.describe] 接口描述
     * @param {boolean}     [api.msgsend=false] 是否进行转发
     * @param {boolean}     [api.writelog=false] 是否写入日志
     * @param {string}      [api.operation=0] 操作类型
     * @param {funcction}   [api.callback] 异步回调方法
     * 
     * @example
     * const enumerate = require("./middleware/enumerate");
     * api = {
     *      method : "post"
     *      routor : "/webapi/service/test"
     *      describe : "webapi服务测试"
     *      msgsend: true,
     *      writelog: true,
     *      operation: enumerate.Operation.Create,
     *      callback : async function (req, res, database) {
     *          await @todo
     *      }
     * }
     */
    
    /**
     * get
     */
    const webapi = {
        method: "get",
        routor: "/webapi/test",
        describe: "平台测试接口",
        callback: async function (res, database) {
            await controller.todo(database, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * post
     */
    const webapi = {
        method: "post",
        routor: "/webapi/test",
        describe: "平台测试接口",
        callback: async function (req, res, database) {
            await controller.todo(database, req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

```