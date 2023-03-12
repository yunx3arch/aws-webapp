const { genSaltSync, hashSync } = require("bcrypt");
const { User } = require("./user-model");

function create (data, callBack) {
    User.create({
      id: data.id,
      username: data.username,
      firstname: data.first_name,
      lastname: data.last_name,
      account_created: data.account_created,
      account_updated: data.account_updated,
      password: data.password,
  }).then(res => {
    callBack(null, res);
  }).catch(error => {
    callBack(error);
  });
}

function getUserInfo(username, callBack) {
  User.findOne({
    where: {
      username: username
    }
  }).then(result => {
    callBack(null, result);
  }).catch(error => {
    callBack(error, null);
  });
}

function update (req, callBack) {
    const username = req.username;
    const newInfo = req.query;
    User.findOne({
      where: {
        username: username
      }
    }).then(results => {
      if (results.dataValues) {
        currentInfo = results.dataValues;
        if(newInfo.password){
          const salt = genSaltSync(10);
          currentInfo.password = hashSync(newuser.password, salt);
        }
        if(newInfo.firstname){
          currentInfo.firstname = newInfo.firstname;
        }
        if(newInfo.lastname && data.lastname != currentInfo.lastname){
          currentInfo.lastname = newInfo.lastname;
        }
        currentInfo.account_updated = new Date();

        User.update({
          password: currentInfo.password,
          firstname: currentInfo.firstname,
          lastname: currentInfo.lastname,
          account_updated: currentInfo.account_updated
        },{
          where: {username: username}
        }).then(() => {
          const message = 
          {
            firstname: currentInfo.firstname,
            lastname: currentInfo.lastname,
            account_updated: currentInfo.account_updated
          };
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

module.exports = {
    getUserInfo,
    create,
    update,
}