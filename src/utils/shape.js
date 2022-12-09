"use script";

/**
 * SHP操作类
 */
(function () {

    const fs = require("fs");
    const shapefile = require("shapefile");

    /**
     * SHP数据格式
     */
    class shpData {
        /**
         * 构造方法
         * @param {object} geom 几何对象
         * @param {object} prop 集合对象属性
         */
        constructor(geom, prop) {
            /**
             * 数据类型
             */
            this.type = geom.type;

            /**
             * 中心点坐标
             */
            this.position = {
                longitude: prop.longitude,
                latitude: prop.latitude
            };

            /**
             * 名称
             */
            this.name = prop.name;

            /**
             * 坐标点
             */
            this.coordinates = geom.coordinates[0]

            /**
             * GEOMETRY
             */
            this.geometry = geom;

            /**
             * 属性
             */
            this.properties = prop;
        }
    }

    /**
     * 读取shp文件
     * @param {array} files 数据文件
     */
    const readSHP = async function (files) {
        //重命名shp文件，添加扩展名
        const shpPath = files.shp.path + ".shp";
        fs.renameSync(files.shp.path, shpPath);

        //重命名dbf文件，添加扩展名
        const dbfPath = files.dbf.path + ".dbf";
        fs.renameSync(files.dbf.path, dbfPath);
        //打开源数据
        const  source = await shapefile.open(shpPath,dbfPath, {
                encoding: "utf-8" //设置中文属性 
        })
        const data = new Array();
        //读取数据源内容
        var result = await source.read();
        while (!result.done) {
            const value = result.value;
            //定义数据对象
            const item = new shpData(value.geometry, value.properties);
            //添加到数组
            data.push(item);
            result = await source.read();
        }
        return data;
    }

    /**
     * 解析SHP数据
     * @param {array} files 数据文件
     */
    const analysisSHP = async function (files) {

        //重命名shp文件，添加扩展名
        const shpPath = files.shp.path + ".shp";
        fs.renameSync(files.shp.path, shpPath);

        //重命名dbf文件，添加扩展名
        const dbfPath = files.dbf.path + ".dbf";
        fs.renameSync(files.dbf.path, dbfPath);

        //打开源数据
        const source = await shapefile.open(shpPath, dbfPath, {
            encoding: "utf-8" //设置中文属性
        });

        const data = new Array();

        //读取数据源内容
        var result = await source.read();
        while (!result.done) {
            data.push(result.value);
            result = await source.read();
        }

        return data;
    }


    module.exports.analysisSHP = analysisSHP;
    module.exports.readSHP = readSHP;
})();