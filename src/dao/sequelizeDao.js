"use script";

/**
 * 数据库操作
 */
(function () {
    const Sequelize = require("sequelize");
    const config = require("config");
    const tools = require("../utils/tools");

    /**
     * 初始化数据库连接
     * @function
     * @param {String} database 数据库名
     */
    function initDB(database) {

        //读取配置文件中的数据库连接属性
        const dbConfig = {
            username: config.get("database.username"),
            password: config.get("database.password"),
            host: config.get("database.host"),
            port: config.get("database.port"),
            dialect: config.get("database.dialect")
        }

        //判断是否存在数据库名称
        if (config.has("database.dbname")) {
            dbConfig.database = config.get("database.dbname");
        } else {
            dbConfig.database = database
        }

        //创建数据库连接
        const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
            host: dbConfig.host,
            port: dbConfig.port,
            dialect: dbConfig.dialect,
            logging: false,
            timezone: '+08:00', //东八时区
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            query: {
                raw: true
            }
        });


        return new Promise((resolve, reject) => {
            sequelize.authenticate()
                .then(() => {
                    resolve(sequelize);
                }).catch(err => {
                    reject(err);
                });
        });
    }


    /**
     * 创建传入参数
     * @class
     * @public
     */
    class Options {
        constructor() {
            this.options = {
                where: new Object(),
                order: new Array()
            };
            this.values = {};
        }

        /**
         * 设置where属性
         * @param {object} data 参数数据
         * @param {array} fields 字段名称
         */
        setWhere(data, fields) {
            if (tools.isNotEmpty(data) && tools.isNotEmpty(fields)) {
                for (var i = 0; i < fields.length; i++) {
                    const field = fields[i];
                    if (data.hasOwnProperty(field)) {
                        this.options.where[field] = data[field];
                    }
                }
            } else {
                if (tools.isEmpty(fields)) {
                    this.options.where = data;
                }
            }
        }

        /**
         * 获取参数
         */
        getOptions() {
            return this.options;
        }

        /**
         * 对象属性设置
         * @param {object} options 参数数据
         * @param {array} deleteFields 删除的字段
         */
        setValues(options, deleteFields) {
            this.values = options;
            if (tools.isNotEmpty(deleteFields)) {
                for (let i = 0; i < deleteFields.length; i++) {
                    const field = deleteFields[i];
                    delete this.values[field];
                }
            }
        }

        /**
         * 获取参数
         */
        getValues() {
            return this.values;
        }

        setOrder(data) {
            for (var p in data) {
                this.options.order.push([p, data[p]]);
            }
        }
    }

    module.exports = Sequelize;
    module.exports.initDB = initDB;
    module.exports.Options = Options;
})();