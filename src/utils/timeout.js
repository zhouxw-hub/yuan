const async = require('async');
 
const asyncWrapper = (fn, interval, ...args) =>{
  let final_callback = args[args.length-1];
  async.parallel([
    function(callback){
      args[args.length - 1] = callback;
      fn.apply(this, args);
    },
    function(callback){
      setTimeout(function(){
        callback(408);
      }, interval);
    }
  ],
  function(err, results){
    if(err==408 && results[0])err = null;
    final_callback.apply(this,[err].concat([results[0]]));
  });
}
 
if(module.parent){
  exports.asyncWrapper = asyncWrapper;
}else{
  let myfn = (arg_1, arg_2, callback) => {
    setTimeout(function(){
      callback(null,'value 1: '+arg_1,'value 2: '+arg_2);
    }, 1000);
  }
  asyncWrapper(myfn, 2000, 10, 20, (err, values)=>{
    console.log(`${err}, ${values}`);
  });
}




//调用方法


const asyncWrapper = require('./async-timer.js').asyncWrapper
 
 
const fn = (arg1, arg2, callback) => {
   //...假设这里过程很漫长，有可能超时
   callback(null, result_1, result_2);
}
 
asyncWrapper(
   fn,//异步函数
   10000,//超时时间
   'arg1_value',//异步函数的参数1
   'arg2_value',//异步函数的参数2，有多个参数就在后面继续加
   (err, results)=>{
    //results : [result_1, result_2]
    //最后的回调,results比较特殊，fn有多个返回值时，results会以数组的形式返回给你
   }
);