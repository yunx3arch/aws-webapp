const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db-sequelize");


const User = sequelize.define("users", {
   id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
   },
   username: {
     type: DataTypes.STRING,
     allowNull: false,
     unique: true
   },
   firstname: {
     type: DataTypes.STRING,
     allowNull: false
   },
   lastname: {
     type: DataTypes.STRING,
   },
   password: {
     type: DataTypes.STRING.BINARY,
     allowNull: false
   },
   account_created:{
    type: DataTypes.DATEONLY,
    allowNull: false
   },
   account_updated:{
    type: DataTypes.DATEONLY,
    allowNull: false
   }
});

sequelize.sync().then(() => {
   console.log('User table created successfully!');
}).catch((error) => {
   console.error('Unable to create user table : ', error);
});

module.exports = {
    User
}