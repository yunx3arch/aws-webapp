const Sequelize = require("sequelize");
require('dotenv').config();
const mysql = require('mysql2/promise');

// console.log('host', process.env.DB_HOSTNAME);
// console.log('user', process.env.DB_USERNAME);
// console.log('passwords', process.env.DB_PASSWORD);

mysql.createConnection({
   //  user     : process.env.DB_USERNAME,
   //  password : process.env.DB_PASSWORD,
   //  host     : process.env.DB_HOSTNAME,
   user:'root',
   password:'xuyun030089'
}).then((connection) => {
    connection.query('CREATE DATABASE IF NOT EXISTS csye6225;').then(() => {
      console.log('created databased');
    }) .catch(err => {
      console.log(err);
    })
})

const sequelize = new Sequelize(
   'csye6225',
   // process.env.DB_USERNAME,
   // process.env.DB_PASSWORD,
   'root',
   'xuyun030089',
 
   {
      // host: process.env.DB_HOSTNAME,
      host: '127.0.0.1',
      dialect: 'mysql'
   }
);
sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});



module.exports = {
    sequelize
};