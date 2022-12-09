"use script";

/**
 * MapVision_V5 WebAPI
 * 程序主入口
 */
(function () {


    //初始化Restify服务
    const restify = require("./server/restify").init();

  
    //创建WebAPI
    try {
        require("./webapi/main")(restify );
    }
    catch (e) {
        console.log(e);
    }
})();