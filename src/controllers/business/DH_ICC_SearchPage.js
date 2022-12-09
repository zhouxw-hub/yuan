'usr script';

const corsMiddleware = require("restify-cors-middleware");


/**
 * 以图搜图
 * @description 以图搜图
 * @author ZY
 */

(function () {

    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const request = require("request");
    const config = require("config");
    const NodeRSA = require("node-rsa")
    const Sequelize = require("../../dao/sequelizeDao");
    /**
     * 以图搜图
     * @param {string} database 数据库
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    module.exports = async function (options, callback) {

        //验证提交数据
        var result = verify.execute(options, {
            startTime: verify.STRING,
            endTime: verify.STRING,
            database:verify.STRING
        });

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

      


        var getlist;
        var Authorization;
        var list;
        await getCryptKey().then(function (req) {
            getlist = req;
        }, function (err) {
            callback(err);
            return
        });



        
        var data = { "client_id": config.get("icc.client_id"), "client_secret": config.get("icc.client_secret"), "grant_type": "password", "username": "system", "password": getlist.pwd, "public_key": getlist.publicKey }
        //获取Token
        await GETToken(data).then(function (req) {
            Authorization = req
        }, function (err) {
            callback(err);
            return
        })

    
       var info = [];
       var totalPage=0;    
       var data={
        "pageNum": 1,
        "pageSize": 1000,
        "ordered": 3
        };
   
     
      // 提交查询
      await SearchPage(data, Authorization).then(function (req) {
      
        totalPage=req.totalPage;
        info=  info.concat(req.pageData);
        }, function (err) {
            callback(err);
            return
        })
     
        if(data.pageNum<totalPage){
            data.pageNum++;    
            for (; data.pageNum <= totalPage; data.pageNum++) {
                await   SearchPage(data, Authorization).then(function (req) {
                   info= info.concat(req.pageData);
               }, function (err) {
                   retry.findAll(err, callback);
                   return;
               });    
           }
        }
        console.log("info.length:"+info.length)
        if(info.length==0){
            retry.findAll(info, callback);
            return;
        }
     
        try {
            var sql = "select * from \"device_camera\" where ";
            for (let index = 0; index < info.length; index++) {
                info[index].faceImgUrl=config.get("icc.ip")+"evo-pic/"+info[index].faceImgUrl+"?token="+Authorization+"&oss_addr="+config.get("icc.oss_addr");
             
                    if(index==0){
                        sql+="  device_code='"+info[index].channelId+"'"
                    }else {
                        sql+=" or device_code='"+info[index].channelId+"'"
                    }    
            }
            console.log(sql);
            const sequelize = await Sequelize.initDB(options.database);
            var  device_info = await sequelize.query(sql);
            var  devices=[];     datelist=[];
            if(device_info[0].length>0){
             for (let i = 0; i < info.length; i++) {
                 var item1 = info[i];
                 item1.time=new Date(item1.recTime).getTime();
                 item1.captureTime=dateFormat(new Date(item1.recTime));
                 for (let j = 0; j < device_info[0].length; j++) {
                    var item2 = device_info[0][j];
                     if(item1.channelId==item2.device_code){
                         item1.device_name=item2.device_name;
                         item1.center=item2.center;
                         item1.build_id=item2.build_id;
                         item1.floor_id=item2.floor_id;
                         item1.indoor=item2.indoor;
                         item1.position=item2.position;
                         item1.detail_info=item2.detail_info;
                         devices.push(item1);
                     }    
                 }
             }
        
             devices.sort((a,b)=>{ return a.recTime-b.recTime})//升序
             var stime = options.startTime.substr(0, options.startTime.indexOf(" "));//开始时间
             var etime = options.endTime.substr(0, options.endTime.indexOf(" ")); // 结束时间
             if(new Date(stime).getTime()<=new Date(etime).getTime()){
                while (new Date(stime).getTime()<=new Date(etime).getTime()) {
                    var   arry=[];
                  for (let index = 0; index < devices.length; index++) {
                        if(devices[index].time>=new Date(stime).getTime()&&devices[index].time<new Date(stime).getTime()+86400000)
                            arry.push(devices[index]);
                  }
                  datelist.push({"time":stime,"list":arry});
                  stime= new Date(stime).getTime()+86400000;
                  b=new Date(stime);
                  stime=(b.getFullYear() + "-" + (b.getMonth() + 1 >= 10 ? b.getMonth() + 1 : "0" + (b.getMonth() + 1)) + "-" + (b.getDate() >= 10 ? b.getDate() : "0" + b.getDate())); 
            }
             }else{
                datelist.push({"time":stime,"list":devices});
             }
             retry.findAll(datelist, callback);
            }else{
                retry.findAll(datelist, callback);
            }
        } catch (error) {
            console.log(error);
            retry.findAll(info, callback);
        }        
    }

    function dateFormat(now) { 
        var year=now.getFullYear(); 
        var month=now.getMonth(); 
        var date=now.getDate(); 
        var hour=now.getHours(); 
        var minute=now.getMinutes(); 
        var second=now.getSeconds(); 
        return year + "-" + (month + 1 >= 10 ? month + 1 : "0" + (month+1)) + "-" + (date >= 10 ? date : "0" + date)+" "+(hour >= 10 ? hour  : "0" + (hour))+":"+(minute >= 10 ? minute  : "0" + (minute))+":"+(second >= 10 ? second  : "0" + (second))
    } 


    //获取token
    function GETToken(data) {
        return new Promise(function (resolve, reject) {
            request({
                url: config.get("icc.ip") + "evo-apigw/evo-oauth/1.0.0/oauth/extend/token",//请求路径
                method: "POST",//请求方式，默认为get
                headers: {
                    'Content-Type': 'application/json'
                },
                //json: true,
                body: JSON.stringify(data),//post参数字符串JSON.stringify()
                strictSSL: false,//判断是否存在证书
            }, function (error, response, body) {
                if (error != null) {
                    reject(error);
                    return;
                }
                var data = JSON.parse(body);
                if (data.success) {
                    resolve("bearer " + data.data.access_token);
                } else {
                    resolve(null);
                }
            });
        });
    }


    //获取公钥
    function getCryptKey() {
        return new Promise(function (resolve, reject) {
            request({
                url: config.get("icc.ip") + "evo-apigw/evo-oauth/1.0.0/oauth/public-key",//请求路径
                method: "GET",//请求方式，默认为get         
                strictSSL: false,//判断是否存在证书
            }, function (error, response, body) {
                if (error != null) {
                    reject(error);
                    return;
                }
                var data = JSON.parse(body);
                if (data.success) {
                    var str = "-----BEGIN PUBLIC KEY-----\n" + data.data.publicKey + "\n-----END PUBLIC KEY-----";

                    const public_key = new NodeRSA(str);
                    public_key.setOptions({ encryptionScheme: 'pkcs1' })
                    const encrypted = public_key.encrypt(config.get("icc.Password"), 'base64');
                    resolve({ "publicKey": data.data.publicKey, "pwd": encrypted });
                } else {
                    resolve(null);
                }

            });
        });
    }
    

    //查结果
    function SearchPage(data,Authorization){
        return new Promise(function (resolve, reject) {
            request({
                url: config.get("icc.ip") + "evo-apigw/evo-face/thirdFaceSearch/page",//请求路径
                method: "POST",//请求方式，默认为get
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Authorization
                },
                //json: true,
                body: JSON.stringify(data),//post参数字符串JSON.stringify()
                strictSSL: false,//判断是否存在证书
            }, function (error, response, body) {
                if (error != null) {
                    reject(error);
                    return;
                }
                var data = JSON.parse(body);
                if (data.success == true) {
                    resolve(data.data);
                } else {
                    resolve(data);
                }
            });
        });
    }
})()