const crypto = require("crypto");
const { create, getProductInfo, fullUpdate, partUpdate, deleteProd } = require("./products-helper");
const logger = require("../logger");

function createProduct (req, res) {
  logger.debug("creating product");
    const newproduct = req.body;
    if(!newproduct.name) {
        res.status(400).json({ 
            error: 'required-field',
        });
        return;
    }

    newproduct.id = crypto.randomBytes(16).toString("hex");
    newproduct.date_added = new Date();
    newproduct.date_last_updated = new Date();
    create(newproduct, (err, results) => {
      if (err) {
        logger.error(err);
        return res.status(400).json({
            error: "bad-request",
        });
      }
      return res.status(201).send(results);
    });
}

function getProduct(req, res) {
    const productId = req.params.id;
    getProductInfo(productId, (err, results) => {
        if (err) {
          logger.error(err);
          return res.status(403).json({
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

function updateProductFull(req, res) {
    const newProduct = req.body;
    
    if(
        "name" in newProduct &&
        "description" in newProduct &&
        "sku" in newProduct &&
        "manufacturer" in newProduct &&
        "quantity" in newProduct
    ){
        fullUpdate(req, (err, results) => {
            if (err) {
              logger.error(err);
                return res.status(400).json({
                error: "bad-request",
                });
            }
            return res.status(201).send(results);
        });
    }else{
    return res.status(403).json({
        errror: "bad-request",
    });
    }
}

function updateProductPart(req, res) {
    const newProduct = req.body;
    if(
        "name" in newProduct ||
        "description" in newProduct ||
        "sku" in newProduct ||
        "manufacturer" in newProduct ||
        "quantity" in newProduct
    ){
        partUpdate(req, (err, results) => {
            if (err) {
              logger.error(err);
                return res.status(401).json({
                error: "authentication-failed",
                });
            }
            return res.status(201).send(results);
            });
    }else{
        return res.status(403).json({
            error: "bad-request",
        });
    }
}

function deleteProduct(req, res){
    const prodId = req.params.id;
    deleteProd(prodId, (err, results) => {
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
        return res.status(201).send(results);
      });
}

module.exports = {
    createProduct,
    getProduct,
    updateProductFull,
    updateProductPart,
    deleteProduct
}