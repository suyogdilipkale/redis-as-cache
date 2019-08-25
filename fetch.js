const mysql      = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'suyog@123',
  database : 'e_shopping'
});

connection.connect();
//get the order details
getOrderDetails(5);

function getOrderDetails(orderid){
  try{
    //insert new product
    connection.query("select om.id, om.customerid, c.customername, od.productid, p.product, od.value from order_master om join order_detail od on om.id = od.orderid join product p on p.id = od.productid join customer c on c.id = om.customerid where om.id = ?",orderid, function (error, results, fields) {
        if (error) throw error;
        console.dir(results);
    });
  }
  catch(e){
    console.log("Exception in getOrderDetails:"+e);
  }
}
