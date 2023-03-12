const { User } = require("./api/user-model");
const bcrypt = require("bcrypt");

function basicAuth(req, res, next) {
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf("Basic ") === -1
  ) {
    return res.status(401).json({ message: "Missing Authorization Header" });
  }

  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );

  const [username, password] = credentials.split(":");

  if (!username || !password) {
    return res.status(401).json({
      message: "Missing Username or Password in Authorization Header",
    });
  }

  req.username = username;
  req.password = password;

  User.findOne({
    where: {
      username: username
    }
  }).then(result => {
    bcrypt.compare(
      password,
      result.dataValues.password,
      function (err, isMatch) {
        if (isMatch) {
          req.param = result.dataValues.id;
          next();
        }else{
          res.status(401).json({
            message: "Wrong password",
          });
        }
      }
    );
  }).catch(error => {
    console.log(error);
    return res.status(401).json({
      message: "No record",
    });
  });


}

module.exports = {
    basicAuth,
}