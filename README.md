# redis-as-cache
Description: This is nodejs code to demostrate how redis can be used as a cache to improve your application performance.
This application demostrate that user is using some relation database like SQL server/mysql/mongodb etc and runs with performance challeges as database grows.
After adding redis as cache layer it hows how performance is drastically imroved and without any additional code changes and change in application architecture.


Prerequisites: 
  1. make sure you have all the required code and database run on local machine to show that no other factors like network, internet interferring the performance. 
  2. install nodejs on local machine and other npm packages as mentioned in pacakge.js
  3. install mysql database on local machine

Below are the steps to prepare and demostrate the use case:

Step 1: Create scheme in mysql database
1. use the e_shopping_schema.sql to create new schema in your mysql database hosted on your local demo machine

Step 2: Insert dummy data in newly create schema
1. open index.js from root and change the your mysql database connection details
2. execute node code to generate dummy data.(using node command ex. node index.js) for faster data inseration you may execute code in batches
3. for better demostration add millions of order enteries. as more records in your mysql database it will start slowing down the response which creates need of caching layer

Step 3: Run app.js (express npm) to demostrate fetch order details with/without cache
1. open app.js change the connection details to your mysql and redis database
2. run app.js on the port you want to execute using node command ex. node app.js
3. browse application in browser ex. http://localhost:3000
4. enter the order Id (which one already populated with your dummy code in Step 2
5. show console for app.js which will show query time to load data from mysql
6. again request to load same order id data, which will be served this time cache with much faster time
7. show console for app.js which will show query time to load data from redis cache.
8. you can repeat the steps to load for different order ids and compare the results served from mysql and redis database
9. this way you will learn how redis easily solve your performance issue by just adding it as caching layer.

Step 4: Load testing with RedisTimeSeries analytics
1. configure your Redis, RedisTimeSeries and mySQL database connection details (host, ports etc)
2. run the node loadtesting.js
3. once load testing is progress/done you can visualise analytics on RedisInsight below is test query
TS.MRANGE 0 + FILTER server=local






