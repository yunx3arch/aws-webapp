const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db-sequelize");


const Product = sequelize.define("products", {
   id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
   },
   name: {
     type: DataTypes.STRING,
     allowNull: false,
   },
   description: {
     type: DataTypes.STRING,
   },
   sku: {
     type: DataTypes.STRING,
   },
   manufacturer: {
     type: DataTypes.STRING,
   },
   quantity: {
     type: DataTypes.INTEGER,
   },
   date_added: {
     type: DataTypes.DATEONLY,
     allowNull: false
   },
   date_last_updated: {
     type: DataTypes.DATEONLY,
     allowNull: false
   },
   owner_user_id: {
     type: DataTypes.STRING,
   }
});

sequelize.sync().then(() => {
   console.log('Product table created successfully!');
}).catch((error) => {
   console.error('Unable to create product table : ', error);
});

module.exports = {
    Product
}