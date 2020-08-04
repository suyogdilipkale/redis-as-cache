//connection to your mysql database----------------------
const mysql = require('mysql');
const faker = require('faker');
const mySQLConnection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'suyog@123',
  database : 'e_shopping'
});
mySQLConnection.connect();
//connection to your mysql database----------------------

//connection to your redis oss database----------------------
const Redis = require('ioredis');
const redis = new Redis({
  port:6379,
  host:"localhost"
});
//connection to your redis oss database----------------------
//set analytics flag if you want to capture------------------
const captureAnalytics = true;
const redisAnalytics = new Redis({
  port:14390,
  host:"34.93.157.182"
});
setTimeout(function(){
  loadTesting();
},2000);
//TS.MRANGE 0 1596437285319 AGGREGATION min 1000 FILTER server=local WITHLABELS
//TS.MRANGE 0 + AGGREGATION FILTER server=local WITHLABELS
//TS.MRANGE 0 + FILTER server=local
//set analytics flag if you want to capture------------------

function loadTesting(){
    try {
      loadRecord(faker.name.findName());
      //call recursively to load more records
      setTimeout(function(){
        loadTesting();
      },5000);
    }
    catch(e){
      //console.log("Exception in loadTesting:"+e);
    }
}

//load testing get orders by username
function loadRecord(username){
    try {
      var ReqMilliseconds = (new Date).getTime();
      redis.get("User:"+username.replace(/ /g,''),function(error,result){
        if(result===null){
          //fetch order details
          //mySQLConnection.query("select om.id, om.customerid, c.customername, od.productid, p.product, od.value from order_master om join order_detail od on om.id = od.orderid join product p on p.id = od.productid join customer c on c.id = om.customerid where om.id = ?",orderId, function (error, results, fields) {
            mySQLConnection.query("CALL getLatestorderByUser(?)",username, function (error, results, fields) {
              if (error) throw error;
              updateOrderCache("User:"+username.replace(/ /g,''), results[0]);
              var ResMilliseconds = (new Date).getTime();
              console.log("[User:"+username+"] Query Response Time from mySQL (ms):"+(ResMilliseconds-ReqMilliseconds));
              if(captureAnalytics){
                  redisAnalytics.sendCommand(
                  new Redis.Command('TS.CREATE', ["QueryTime:MySQL", "LABELS", "server", "local", "db", "mysql"], 'utf-8', function(err,value) {} )
                  );
                  redisAnalytics.sendCommand(
                  new Redis.Command(
                  'TS.ADD', ["QueryTime:MySQL",Math.floor(Date.now()),(ResMilliseconds-ReqMilliseconds), "LABELS", "server", "local", "db", "mysql"
                  ], 'utf-8', function(err,value) {} ));
              }
              loadRecord(username);
          });
        }else{
          var ResMilliseconds = (new Date).getTime();
          console.log("[User:"+username+"] Query Response Time from redis (ms):"+(ResMilliseconds-ReqMilliseconds));
          if(captureAnalytics){
              redisAnalytics.sendCommand(
              new Redis.Command('TS.CREATE', ["QueryTime:Redis", "LABELS", "server", "local", "db", "redis"], 'utf-8', function(err,value) {} )
              );
              redisAnalytics.sendCommand(
              new Redis.Command(
              'TS.ADD', ["QueryTime:Redis",Math.floor(Date.now()),(ResMilliseconds-ReqMilliseconds), "LABELS", "server", "local", "db", "redis"
              ], 'utf-8', function(err,value) {} ));
          }
        }
      });
  }
  catch(e){
    //console.log("Exception in loadTesting:"+e);
  }
}

//update the order details in cache
function updateOrderCache(orderId, payload){
  try{
    redis.set(orderId,JSON.stringify(payload),"EX",10,function(error,result){
      if (error) throw error;
    });
  }
  catch(e){
    console.log("Exception in updateOrderCache:"+e);
  }
}
