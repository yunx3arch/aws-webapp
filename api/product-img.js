const crypto = require("crypto");


const { create, getImgInfo, deleteImg } = require("./product-img-helper");
require('dotenv').config();
const util = require('util');
const s3 = require("../s3-config");
const logger = require("../logger");

function createImage (req, res) {
    const imgInfo = req.file;
    logger.debug('creating image');
    if(!imgInfo) {
        res.status(400).json({ 
            error: 'file-required',
        });
        return;
    }

    const imgMeta = {
      image_id : crypto.randomBytes(6).toString("hex"),
      product_id : req.params.id,
      file_name : imgInfo.originalname,
      date_created : new Date(),
      s3_bucket_path : imgInfo.location,
      image_key : imgInfo.key,
    }
    
    create(imgMeta, (err, results) => {
      if (err) {
        logger.error(err);
        return res.status(400).json({
            error: "bad-request",
        });
      }
      return res.status(201).send(results);
    });
}

function getImage(req, res) {
    const imageId = req.params.imgid;
    getImgInfo(imageId, (err, results) => {
      if (err) {
        logger.error(err);
        return res.status(401).json({
          error: "authentication-failed",
        });
      }
      if (!results) {
        return res.status(404).json({
          error: "record-not-found",
        });
      }
      return res.status(201).send(results);
    });

}

async function deleteImage(req, res){
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
      Key: dataValues.image_key,
    });
    await deleteImg(imgId, (err, results) => {
      if (err) {
        logger.error(err);
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

    logger.error(err);
    return res.status(500).send({ message: 'Something went wrong' });

  }
}

module.exports = {
      createImage,
      getImage,
      deleteImage
  }