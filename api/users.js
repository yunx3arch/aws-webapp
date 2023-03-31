const { genSaltSync, hashSync } = require("bcrypt");
const crypto = require("crypto");
const logger = require("../logger");
const { getUserInfo, create, update } = require("./user-helper");

async function getUser (req, res) {
    const username = req.username;
    logger.debug("getting user");
    await getUserInfo(username, (err, results) => {
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
      const id = results.id;
      console.log(id);
      return res.send(results);
    });
}

function getUserPub (req, res) {
  const username = req.query.username;
  getUserInfo(username, (err, results) => {
    if (err) {
      return res.status(401).json({
        error: "authentication-failed",
      });
    }
    if (!results) {
      return res.status(404).json({
        error: "record-not-found",
      });
    }
    const id = results.id;
    console.log(id);
    return res.send(results);
  });
}

function createUser (req, res) {
  logger.debug("creating user");

    const newuser = req.body;
    if(!newuser.username) {
      res.status(400).json({ 
        error: 'required-username',
      });
      return;
    }
    if(!newuser.password) {
      res.status(400).json({
        error: 'required-password',
      });
      return;
    }

    const salt = genSaltSync(10);
    newuser.password = hashSync(newuser.password, salt);
    newuser.id = crypto.randomBytes(16).toString("hex");
    newuser.account_created = new Date();
    newuser.account_updated = new Date();

    create(newuser, (err, results) => {
      if (err) {
        if (err.name == 'SequelizeUniqueConstraintError') {
          return res.status(400).json({
            error: "username-exists",
          });
        } else {
          return res.status(500).json({
            error: "processing-error",
          });
        }
      }
      return res.status(201).send(results);
    });

}

function updateUser (req, res) {
  if(
    "id" in req.body ||
    "username" in req.body ||
    "account_created" in req.body ||
    "account_updated" in req.body
  ){
    return res.status(403).json({
      message:
        "Can't update id, username, account_created or account_updated fields",
    });
  }
  update(req, (err, results) => {
    if (err) {
      return res.status(401).json({
        error: "authentication-failed",
      });
    }
    return res.status(201).send(results);
  });
}

module.exports = {
  createUser,
  getUser,
  getUserPub,
  updateUser,
};
