const express = require('express');
const { getUser, getUserPub, createUser, updateUser } = require('./api/users');
const bodyParser = require('body-parser');
const { basicAuth } = require('./basic-auth');
const { createProduct, getProduct, updateProductFull, updateProductPart, deleteProduct } = require('./api/products');
const { createImage, getImage, deleteImage } = require('./api/product-img');
const {
    S3
} = require("@aws-sdk/client-s3");
const multer = require('multer');
const multerS3 = require('multer-s3');
const { deleteImg } = require('./api/product-img-helper');
require('dotenv').config();


const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION,
});

const jsonParser = bodyParser.json();

const app = express();
const PORT = 3000;

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({
    extended: true
}));


let upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: process.env.S3_BUCKET_NAME,
        key: function (req, file, cb) {
            console.log(file);
          cb(null, Date.now().toString() + '-' + file.originalname);
        },
    })
});


app.post('/v1/user', jsonParser, createUser);
app.post('/v1/product', jsonParser, createProduct);
app.get('/healthz', getUserPub);
app.get('/v1/user/:id', basicAuth, getUser).put('/v1/user/:id', jsonParser, updateUser);
app.get('/v1/user', basicAuth, getUser);

app.get('/v1/product/:id', getProduct).put('/v1/product/:id',jsonParser, updateProductFull);
app.patch('/v1/product/:id', jsonParser, updateProductPart);
app.delete('/v1/product/:id', deleteProduct);

app.post('/v1/product/:id/image', upload.single('image'), createImage);
app.get('/v1/product/:id/image/:imgid', getImage);
app.delete('/v1/product/:id/image/:imgid', (req, res) => {
    const imgId = req.params.imgid;

    const deleteParam = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: imgId
  };
  s3.deleteObject(deleteParam, (err, data) => {
        if (err) {
              console.error(err);
              res.status(500).send(err);
        } else {
              console.log('deleted');
        }
  });
  deleteImg(deleteParam, (err, results) => {
      if (err) {
        return res.status(400).json({
          error: "bad-request",
        });
      }
      if (!results) {
        return res.status(404).json({
          error: "record-not-found",
        });
      }
      return res.status(201);
    });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));