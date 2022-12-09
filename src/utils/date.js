"use script";

/**
 * 日期工具类
 */
(function () {

    const tools = require("./tools");

    /**
     * 格式化时间
     * @param {object} date 时间
     * @param {string} format 日期格式
     */
    function dateFormat(date, format = "yyyy-MM-dd hh:mm:ss") {

        if (typeof date == "string") {
            //验证时间格式
            if (!tools.isDate(date) && !tools.isDateTime(date)) {
                return;
            }
            date = Date.parse(date);
            date = new Date(date);
        }
        var map = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S+": date.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }

        for (var k in map) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? map[k] : ("00" + map[k]).substr(("" + map[k]).length));
            }
        }
        return format;
    }

    /**
     * 东八区当前时间
     */
    function UTC_8() {
        var date = new Date();
        date.setHours(date.getHours() + 8);
        return date;
    }

    /**
     * 获取当前日期时间
     * @param {string} format 日期格式
     * @returns yyyy-MM-dd HH:mm:ss
     */
    function now(format) {
        if (tools.isEmpty(format)) {
            format = "yyyy-MM-dd hh:mm:ss";
        }
        return dateFormat(new Date(), format);
    }

    /**
     * 获取当前日期
     * @param {string} format 日期格式
     * @returns yyyy-MM-dd
     */
    function nowDate(format) {
        if (tools.isEmpty(format)) {
            format = "yyyy-MM-dd";
        }
        return dateFormat(new Date(), format);
    }

    /**
     * 获取当前时间
     * @param {string} format 日期格式
     * @returns HH:mm:ss
     */
    function nowTime(format) {
        if (tools.isEmpty(format)) {
            format = "hh:mm:ss";
        }
        return dateFormat(new Date(), format);
    }

    module.exports.UTC_8 = UTC_8;
    module.exports.dateFormat = dateFormat;
    module.exports.now = now;
    module.exports.nowDate = nowDate;
    module.exports.nowTime = nowTime;
})();