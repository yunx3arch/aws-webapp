const crypto = require("crypto");


const { create, getImgInfo, deleteImg } = require("./product-img-helper");


function createImage (req, res) {
  
    const imgInfo = req.file;
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
            console.log(err);
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
            console.log(err);
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

// function deleteImage(req, res){
//       const imgId = req.params.imgid;
//       const deleteParam = {
//             Bucket: 'my-s3-26b626bb-699f-e6d5-6390-56e6407399f0',
//             Delete: {
//               Key: imgId
//             }
//       };
//       console.log(s3);
//       s3.deleteObject(deleteParam, (err, data) => {
//             if (err) {
//                   console.error(err);
//                   res.status(500).send(err);
//             } else {
//                   console.log(data);
//                   res.status(200).send('File deleted successfully');
//             }
//       });
//       deleteImg(deleteParam, (err, results) => {
//           if (err) {
//             return res.status(400).json({
//               error: "bad-request",
//             });
//           }
//           if (!results) {
//             return res.status(404).json({
//               error: "record-not-found",
//             });
//           }
//           return res.status(201).send(results);
//         });
// }

module.exports = {
      createImage,
      getImage,
      // deleteImage
  }