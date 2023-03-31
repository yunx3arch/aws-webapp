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
const { deleteImg, getImgInfo } = require('./api/product-img-helper');
const util = require('util');
const fs = require('fs');
require('dotenv').config();

const Prometheus = require('prom-client');
const register = new Prometheus.Registry();
const http_request_counter = new Prometheus.Counter({
  name: 'myapp_http_request_count',
  help: 'Count of HTTP requests made to my app',
  labelNames: ['method', 'route', 'statusCode'],
});
register.registerMetric(http_request_counter);


// Create a writable stream to the log file
const logStream = fs.createWriteStream('/var/log/webapp/csye6225.log', { flags: 'a' });

// Log a message to the file
const logger = (message) => {
  logStream.write(`${new Date().toISOString()} - ${message}\n`);
}

// Close the stream when the application exits
process.on('exit', () => {
  logStream.end();
});



const s3 = new S3({

    region: process.env.REGION,
    credentials: {

      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

    },
    // region: "us-west-2",
});

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
    http_request_counter.labels({method: req.method, route: req.originalUrl, statusCode: res.statusCode}).inc();

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
        // bucket: "my-s3-f6c5e73e-9212-77f7-eac5-443f52e2375a",
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
app.delete('/v1/product/:id/image/:imgid', async (req, res) => {
    const imgId = req.params.imgid;
    const getImgInfoPromise = util.promisify(getImgInfo);

    try{
        const img = await getImgInfoPromise(imgId);
        const { dataValues } = img;

      console.log("imgkey", dataValues.image_key);

      if (!img) {
        return res.status(404).send({ message: 'Image not found' });
      }
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        // Bucket: "my-s3-f4dfff7e-da2f-0ec9-6590-5d28c99f1bc3",
        Key: dataValues.image_key,
      });

      await deleteImg(imgId, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            error: "bad-request",
          });
        }
        if (!results) {
          return res.status(404).json({
            error: "record-not-found",
          });
        }
      })
      return res.status(200).send({ message: 'Image deleted successfully' });
    }catch(err){
      console.error(err);
      return res.status(500).send({ message: 'Something went wrong' });

    }
  });

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
