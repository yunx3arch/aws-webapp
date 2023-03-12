const { Product } = require("./product-model");

function create (data, callBack) {
    Product.create({
      id: data.id,
      name: data.name,
      description: data.description,
      sku: data.sku,
      manufacturer: data.manufacturer,
      quantity: data.quantity,
      date_added: data.date_added,
      date_last_updated: data.date_last_updated,
      owner_user_id: data.owner_user_id,
  }).then(res => {
    callBack(null, res);
  }).catch(error => {
    callBack(error);
  });
}

function getProductInfo(productId, callBack) {
    Product.findOne({
      where: {
        id: productId
      }
    }).then(result => {
      callBack(null, result);
    }).catch(error => {
      callBack(error, null);
    });
}

function fullUpdate(req, callBack) {
    const reqInfo = req.body;
    reqInfo.date_last_updated = new Date();

    Product.update({
        name: reqInfo.name,
        sku: reqInfo.sku,
        manufacturer: reqInfo.manufacturer,
        quantity: reqInfo.quantity,
        description: reqInfo.description,
        date_last_updated: reqInfo.date_last_updated
    },{
        where: {id: req.params.id}
    }).then(() => {
        const message = reqInfo;
        callBack(null, message);
    }).catch(error => {
        callBack(error, null);
    })
}

function partUpdate(req, callBack) {
    const reqInfo = req.body;
    Product.findOne({
        where: {
          id: req.params.id
        }
      }).then(results => {
        if (results.dataValues) {
          currentInfo = results.dataValues;
          if(reqInfo.name){
            currentInfo.name = reqInfo.name;
          }
          if(reqInfo.sku){
            currentInfo.sku = reqInfo.sku;
          }
          if(reqInfo.manufacturer){
            currentInfo.manufacturer = reqInfo.manufacturer;
          }
          if(reqInfo.description){
            currentInfo.description = reqInfo.description;
          }
          if(reqInfo.quantity){
            currentInfo.quantity = reqInfo.quantity;
          }
          
          currentInfo.date_last_updated = new Date();
  
          Product.update({
            name: currentInfo.name,
            sku: currentInfo.sku,
            manufacturer: currentInfo.manufacturer,
            quantity: currentInfo.quantity,
            description: currentInfo.description,
            date_last_updated: currentInfo.date_last_updated
          },{
            where: {id: req.params.id}
          }).then(() => {
            const message = currentInfo;
            callBack(null, message);
          }).catch(error => {
            callBack(error, null);
          })
        }else{
          return new Error("No record");
        }
      }).catch(error => {
        callBack(error, null);
      });
}

function deleteProd(prodId, callBack) {
    Product.destroy({
        where: {
            id: prodId
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
    getProductInfo,
    fullUpdate,
    partUpdate,
    deleteProd
}