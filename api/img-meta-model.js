const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db-sequelize");

const Image_meta = sequelize.define("image-meta", {
   image_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
   },
   product_id: {
     type: DataTypes.STRING,
     allowNull: false,
   },
   file_name: {
     type: DataTypes.STRING,
     allowNull: false,
   },
   date_created: {
     type: DataTypes.DATEONLY,
     allowNull: false
   },
   s3_bucket_path: {
     type: DataTypes.STRING,
     allowNull: false,
   }
});

sequelize.sync().then(() => {
   console.log('Image metadata table created successfully!');
}).catch((error) => {
   console.error('Unable to create image metadata table : ', error);
});

module.exports = {
    Image_meta
}