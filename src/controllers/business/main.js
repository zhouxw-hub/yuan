"use script";

(function () {

    const ICCDevice = require("./DH_ICC_Device");
    const ICCBlackPlay = require("./DH_ICC_BackPlay");
    // const ICCPlay=require("./DH_ICC_Play");
    //const ICCMqinfo = require("./DH_ICC_Mqinfo");
    //const ICCFace=require("./DH_ICC_FaceRecognition");
    //const ICCFaceSearch=require("./DH_ICC_FaceSearch");
    //const SearchPage=require("./DH_ICC_SearchPage");
    const RtspPlay = require("./DH_ICC_RtspPlay");
    // const ICCFaceSearchs=require("./DH_ICC_FaceSearchs");
    module.exports.ICCPlay = async function (options, callback) {
        await ICCPlay(options, callback);
    }

    module.exports.ICCBlackPlay = async function (options, callback) {
        await ICCBlackPlay(options, callback)
    }

    module.exports.ICCDevice = async function (options, callback) {
        await ICCDevice(options, callback)
    }

    module.exports.ICCDevice = async function (options, callback) {
        await ICCDevice(options, callback)
    }

    module.exports.ICCMqinfo = async function (options, callback) {
        await ICCMqinfo(options, callback)
    }

    module.exports.ICCFace = async function (options, callback) {
        await ICCFace(options, callback)
    }

    module.exports.ICCFaceSearch = async function (options, callback) {
        await ICCFaceSearch(options, callback)
    }
    module.exports.SearchPage = async function (options, callback) {
        await SearchPage(options, callback)
    }
    module.exports.RtspPlay = async function (options, callback) {
        await RtspPlay(options, callback)
    }
    module.exports.ICCFaceSearchs = async function (options, callback) {
        await ICCFaceSearchs(options, callback)
    }




})();