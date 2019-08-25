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
  res.sendFile(__dirname + '/web/index.html')
})

app.post('/getOrderDetails', (req, res) => {
    try{
      var orderId =req.body.orderid;
      if(orderId!=null || orderId!=undefined){
          var ReqMilliseconds = (new Date).getTime();
          redis.get("Order:"+orderId,function(error,result){
            if(result===null){
              //fetch order details
              mySQLConnection.query("select om.id, om.customerid, c.customername, od.productid, p.product, od.value from order_master om join order_detail od on om.id = od.orderid join product p on p.id = od.productid join customer c on c.id = om.customerid where om.id = ?",orderId, function (error, results, fields) {
                  if (error) throw error;
                  updateOrderCache(orderId, results);
                  var ResMilliseconds = (new Date).getTime();
                  console.log("[Order:"+orderId+"]Query Response Time from mySQL (ms):"+(ResMilliseconds-ReqMilliseconds));
                  res.render('index.ejs', {order: results});
              });
            }else{
              var ResMilliseconds = (new Date).getTime();
              console.log("[Order:"+orderId+"]Query Response Time from cache (ms):"+(ResMilliseconds-ReqMilliseconds));
              res.render('index.ejs', {order: JSON.parse(result)});
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
    redis.set("Order:"+orderId,JSON.stringify(payload),function(error,result){
      if (error) throw error;
    });
  }
  catch(e){
    console.log("Exception in updateOrderCache:"+e);
  }
}
