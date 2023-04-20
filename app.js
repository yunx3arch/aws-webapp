const express = require('express');
const { getUser, getUserPub, createUser, updateUser } = require('./api/users');
const bodyParser = require('body-parser');
const { basicAuth } = require('./basic-auth');
const { createProduct, getProduct, updateProductFull, updateProductPart, deleteProduct } = require('./api/products');
const { createImage, getImage, deleteImage } = require('./api/product-img');

const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const s3 = require('./s3-config');

const StatsD = require('statsd-client');
const client = new StatsD();

const jsonParser = bodyParser.json();

const app = express();
const PORT = 3000;

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use((req, res, next) =>
{
    // Increment the HTTP request counter
    client.increment({method: req.method, route: req.originalUrl, statusCode: res.statusCode});
    next();
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

let upload = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: process.env.S3_BUCKET_NAME,
        // bucket: "my-s3-174c36d7-8dea-340f-3006-589f351e9195",
        key: function (req, file, cb) {
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
app.delete('/v1/product/:id/image/:imgid', deleteImage);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
