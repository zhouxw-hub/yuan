"use script";

/**
 * Excel操作类
 */
(function () {

    const tools = require("./tools");
    const xlsx = require("node-xlsx");

    /**
     * 读取Excel
     * @param {string} filePath 文件路径 
     * @param {number} index 数据表下标
     * @param {array} fields 匹配的字段
     * @returns 返回数据表信息
     * 
     * @example
     * const tools = require("./utils/tools");
     * const sheetData = tools.readSheets(files[""].path, ["id", "node_name", "pid"]);
     */
    function readSheets(filePath, index = 0, fields) {

        var sheets = xlsx.parse(filePath);

        if (!tools.isNumber(index)) {
            fields = index;
            index = 0;
        }

        if (tools.isEmpty(fields)) {
            return sheets[index]["data"];
        } else {
            var sheet = sheets[index];
            var list = [];
            for (var i = 1; i < sheet["data"].length; i++) {
                var row = sheet["data"][i];
                var obj = {};
                for (let j = 0; j < fields.length; j++) {
                    const field = fields[j];
                    obj[field] = row[j];
                }
                list.push(obj);
            }
            return list;
        }
    }

    module.exports.readSheets = readSheets;
})(); 