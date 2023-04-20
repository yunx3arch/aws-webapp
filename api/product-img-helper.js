const { s3 } = require("../app");
const { Image_meta } = require("./img-meta-model");

function create (data, callBack) {
    Image_meta.create({
      image_id: data.image_id,
      product_id: data.product_id,
      file_name: data.file_name,
      date_created: data.date_created,
      s3_bucket_path: data.s3_bucket_path,
      image_key: data.image_key,
  }).then(res => {
    callBack(null, res);
  }).catch(error => {
    callBack(error);
  });
}

function getImgInfo (imgId, callBack) {
      Image_meta.findOne({
            where: {
                  image_id: imgId
            }
            }).then(result => {
            callBack(null, result);
            }).catch(error => {
            callBack(error, null);
      });
}

function deleteImg (params, callBack) {
      Image_meta.destroy({
            where: {
                image_id: params.Key
            }
        }).then(res => {
            if(res == 1){
                callBack(null, "deleted successfully");
            }
            
        }).catch(error => {
            callBack(error);
      });
}

module.exports = {
      create,
      getImgInfo,
      deleteImg,
  }