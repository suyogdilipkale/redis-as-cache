DROP DATABASE IF EXISTS e_shopping;
CREATE DATABASE e_shopping;
USE e_shopping;

CREATE TABLE product
(
  id         bigint(20) NOT NULL      AUTO_INCREMENT,
  product    varchar(100)             DEFAULT NULL,
  value      float                    DEFAULT NULL,

  PRIMARY KEY (id)
);

CREATE TABLE customer
(
  id             bigint(20)    NOT NULL      AUTO_INCREMENT,
  customername   varchar(100)  DEFAULT NULL,

  PRIMARY KEY (id)
);

CREATE TABLE order_master
(
  id         bigint(20) NOT NULL      AUTO_INCREMENT,
  datetime   timestamp  NULL          DEFAULT CURRENT_TIMESTAMP,
  customerid bigint(20) NOT NULL,

  PRIMARY KEY (id),
  FOREIGN KEY (customerid) REFERENCES customer(id)
);

CREATE TABLE order_detail
(
  id         bigint(20) NOT NULL      AUTO_INCREMENT,
  datetime   timestamp  NULL          DEFAULT CURRENT_TIMESTAMP,
  orderid    bigint(20) NOT Null,
  productid  bigint(20) NOT NULL,
  value      float                    DEFAULT NULL,

  PRIMARY KEY (id),
  FOREIGN KEY (orderid) REFERENCES order_master(id),
  FOREIGN KEY (productid) REFERENCES product(id)
);

USE `e_shopping`;
DROP procedure IF EXISTS `getLatestorderByUser`;

DELIMITER $$
USE `e_shopping`$$
CREATE PROCEDURE getLatestorderByUser
(
IN username varchar(100)
)
BEGIN
select om.id, om.customerid, c.customername, od.productid, p.product, od.value from order_master om
join order_detail od on om.id = od.orderid
join product p on p.id = od.productid
join customer c on c.id = om.customerid
where om.customerid IN (select max(id) from customer where customername like CONCAT('%', username,'%'));
END$$
