"use script";

/**
 * WebAPI相关
 * 创建API接口
 */
(function () {
    const colors = require("colors-console");
    const tools = require("../utils/tools");
    const date = require("../utils/date");


 

    /**
    * 创建服务接口
    * @author LYW
    * @private
    * @function createAPI
    * @param {object} restify Restify服务
    * @param {object} websocket WebSocket服务
    * @param {object} routor 路由对象
    * @example
    * createAPI(restify, webapi);
    * createAPI(restify, websocket, openapi);
    */
    function createAPI(restify, routor) {

        console.log(colors("cyan", "--------------" + routor.description + "--------------"));

        //back
        for (var property in routor) {
            if (property === "description") {
                return;
            }
            /**
             * @description 此处使用闭包方式处理
             */
            (function (api) {
                //API对象
                if (tools.isEmpty(api)) {
                    api = websocket;
                    websocket = null;
                }

                if (tools.isNotEmpty(api.describe)) {
                    console.log("%s：%s", colors("white", api.describe), colors("yellow", api.routor));
                } else {
                    // console.log("%s：%s", colors("red", "未知接口"), colors("yellow", api.routor));
                }


                if (restify[api.method] != undefined) {
                    restify[api.method](api.routor, function (req, res, next) {
                      
                       
                       

                        //保存request
                        const request = req;

                      
                      
                        if (tools.isEmpty(req.body) && api.method.toUpperCase() === "GET") {
                            req = res;
                          
                        }

                        //所调用的接口
                        console.log("%s:%s", colors("cyan", date.now()), colors("yellow", api.routor));
                        api.callback(req, res).then(function (result) {

                           

                        
                        });
                        return next();
                    });
                }
            })(routor[property]);
        }
    }

  

    /*****************************business 业务数据*****************************/
    const business = require("./router/business/main");


    module.exports = function (restify) {

        createAPI(restify, business);  
        console.log("MapVision_V5 WebAPI接口：%s", colors("green", "发布成功"));
    }
})();