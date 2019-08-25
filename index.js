const mysql      = require('mysql');
const faker = require('faker');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'suyog@123',
  database : 'e_shopping'
});

connection.connect();
//start inserting new products
//insertProduct();

//start inserting new orders
insertOrder();

function insertOrder(){
  try{
    //step 1: insert new customer
    var customer  = {customername: faker.name.findName()};
    connection.query("INSERT INTO customer SET ?",customer, function (error, results, fields) {
        if (error) throw error;
        var customerId = results.insertId;
        console.log('The customer id is: ', customerId);
        //now insert some orders for this customer
        //step 2: first get some random productIds from database for this order
        var productIds = [];
        while(productIds.length < 8){
          var r = Math.floor(Math.random()*1000) + 1;
          if(productIds.indexOf(r) === -1) productIds.push(r);
        }
        //step 3: create order master entry get orderid
        var order_master = {customerid:customerId};
        connection.query("INSERT INTO order_master SET ?",order_master, function (error, results, fields) {
            if (error) throw error;
            var orderId = results.insertId;
            console.log('The new order id is: ', results.insertId);
            //step 4: against this order id enter multiple product purchase order entries in order_detail table
            for(i=1;i<productIds.length;i++){
              var order_detail = {orderid:orderId,productid:productIds[i],value:Math.floor(Math.random() * (+1000 - +10)) + +10};
              connection.query("INSERT INTO order_detail SET ?",order_detail, function (error, results, fields) {
                  if (error) throw error;
                  console.log('The new order detail id is: ', results.insertId);
              });
            }
        });

    });
    //add more orders
    setTimeout(function(){ insertOrder();},1000);
  }
  catch(e){
    console.log("Exception in insertOrders:"+e);
  }
}

//function to insert dummy products into the database
function insertProduct(){
  try{
    //insert new product
    var product  = {product: faker.commerce.productName(), value:faker.commerce.price()};
    connection.query("INSERT INTO product SET ?",product, function (error, results, fields) {
        if (error) throw error;
        var productId = results.insertId;
        console.log('The product id is: ', results.insertId);
    });
    //add more products
    setTimeout(function(){ insertProduct();},300);
  }
  catch(e){
    console.log("Exception in insertProduct:"+e);
  }
}
