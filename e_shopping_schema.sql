DROP DATABASE IF EXISTS e_shopping;
CREATE DATABASE e_shopping;
USE e_shopping;

CREATE TABLE order_master
(
  id         bigint(20) NOT NULL      AUTO_INCREMENT,
  datetime   timestamp  NULL          DEFAULT CURRENT_TIMESTAMP,
  customerid bigint(20) NOT NULL,

  PRIMARY KEY (id)
);

CREATE TABLE order_detail
(
  id         bigint(20) NOT NULL      AUTO_INCREMENT,
  datetime   timestamp  NULL          DEFAULT CURRENT_TIMESTAMP,
  orderid    bigint(20) NOT Null,
  productid  bigint(20) NOT NULL,
  value      float                    DEFAULT NULL,

  PRIMARY KEY (id)
);

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
