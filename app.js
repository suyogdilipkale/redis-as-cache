const express = require('express')
const app = express()
const port = 3000
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

//connection to your mysql database----------------------
const mysql = require('mysql');
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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/getLatestOrderDetailsByUser', (req, res) => {
  res.render('searchbyuser.ejs', {order: {}});
})

app.get('/getOrderDetailsById', (req, res) => {
  res.render('searchbyid.ejs', {order: {}});
})

app.post('/getLatestOrderDetailsByUser', (req, res) => {
    try{
      var username =req.body.username;
      if(username!=null || username!=undefined){
          var ReqMilliseconds = (new Date).getTime();
          redis.get("User:"+username.replace(/ /g,''),function(error,result){
            if(result===null){
              //fetch order details
              mySQLConnection.query("CALL getLatestorderByUser(?)",username, function (error, results, fields) {
                  if (error) throw error;
                  updateOrderCache("User:"+username.replace(/ /g,''), results[0]);
                  res.render('searchbyuser.ejs', {order: results[0]});
                  var ResMilliseconds = (new Date).getTime();
                  console.log("[User:"+username+"] Query Response Time from mySQL (ms):"+(ResMilliseconds-ReqMilliseconds));
              });
            }else{
              var ResMilliseconds = (new Date).getTime();
              console.log("[User:"+username+"] Query Response Time from redis (ms):"+(ResMilliseconds-ReqMilliseconds));
              res.render('searchbyuser.ejs', {order: JSON.parse(result)});
            }
          });

      }
    }
    catch(e){
      console.log("Exception in getLatestOrderDetailsByUser:"+e);
    }
})

app.post('/getOrderDetailsById', (req, res) => {
    try{
      var orderId =req.body.orderid;
      if(orderId!=null || orderId!=undefined){
          var ReqMilliseconds = (new Date).getTime();
          redis.get("Order:"+orderId,function(error,result){
            if(result===null){
              //fetch order details
              mySQLConnection.query("select om.id, om.customerid, c.customername, od.productid, p.product, od.value from order_master om join order_detail od on om.id = od.orderid join product p on p.id = od.productid join customer c on c.id = om.customerid where om.id = ?",orderId, function (error, results, fields) {
                  if (error) throw error;
                  updateOrderCache("Order:"+orderId, results);
                  res.render('searchbyid.ejs', {order: results});
                  var ResMilliseconds = (new Date).getTime();
                  console.log("[Order:"+orderId+"] Query Response Time from mySQL (ms):"+(ResMilliseconds-ReqMilliseconds));
              });
            }else{
              var ResMilliseconds = (new Date).getTime();
              console.log("[Order:"+orderId+"] Query Response Time from redis (ms):"+(ResMilliseconds-ReqMilliseconds));
              res.render('searchbyid.ejs', {order: JSON.parse(result)});
            }
          });

      }
    }
    catch(e){
      console.log("Exception in getOrderDetails:"+e);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


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
