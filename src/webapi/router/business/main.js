"use script";

/**
 * 平台配置
 */
(function () {

    const controller = require("../../../controllers/business/main");
    const response = require("../../../middleware/response");

    const ICCDevice = {
        method: "post",
        routor: "/ICC/Device",
        describe: "ICC获取设备列表",
        callback: async function (req, res) {
            await controller.ICCDevice(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    const ICCBlackPlay = {
        method: "post",
        routor: "/ICC/BlackPlay",
        describe: "ICC视频回放Rtsp视频流",
        callback: async function (req, res) {
            await controller.ICCBlackPlay(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }




    // const ICCMqinfo = {
    //     method: "post",
    //     routor: "/ICC/Mqinfo",
    //     describe: "ICC事件订阅",
    //     callback: async function (req, res) {
    //         await controller.ICCMqinfo( req.body, function (result) {
    //             res.send(response.jsonData(result));
    //         });
    //     }
    // }

    // const ICCFace = {
    //     method: "post",
    //     routor: "/ICC/Face",
    //     describe: "ICC面部识别记录",
    //     callback: async function (req, res) {
    //         await controller.ICCFace( req.body, function (result) {
    //             res.send(response.jsonData(result));
    //         });
    //     }
    // }

    // const ICCFaceSearch = {
    //     method: "post",
    //     routor: "/ICC/FaceSearch",
    //     describe: "ICC以图搜图",
    //     callback: async function (req, res) {
    //         await controller.ICCFaceSearch( req.body, function (result) {
    //             res.send(response.jsonData(result));
    //         });
    //     }
    // }

    // const SearchPage = {
    //     method: "post",
    //     routor: "/ICC/SearchPage",
    //     describe: "ICC以图搜图分页请求",
    //     callback: async function (req, res) {
    //         await controller.SearchPage( req.body, function (result) {
    //             res.send(response.jsonData(result));
    //         });
    //     }
    // }
    // const RequestMe = {
    //     method: "get",
    //     routor: "/Alarm/RequestMe",
    //     describe: "别人发送的信息",
    //     callback: async function (req, res) {
    //         await controller.RequestMe( req.body, function (result) {
    //             res.send(response.jsonData(result));
    //         });
    //     }
    // }

    const RtspPlay = {
        method: "post",
        routor: "/ICC/Rtsp",
        describe: "ICC实时预览Rtsp视频流",
        callback: async function (req, res) {
            await controller.RtspPlay(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }



    module.exports.ICCDevice = ICCDevice;
    module.exports.ICCBlackPlay = ICCBlackPlay;
    //module.exports.ICCMqinfo = ICCMqinfo;
    //module.exports.ICCFace = ICCFace;
    //module.exports.ICCFaceSearch = ICCFaceSearch;
    //module.exports.SearchPage = SearchPage;
    module.exports.RtspPlay = RtspPlay;
    // module.exports.RequestMe=RequestMe;
    module.exports.description = "ICC对接业务接口";
})();