var users = require('../models/users');
var jwt = require('jsonwebtoken');

var exports = module.exports = {}

const privateKey = "384a2d8G86dA713"

exports.authenticate = (req, res) => {
    let username = req.body.user;
    let password = req.body.password;
    let isUserFound = false;

    users.authenticate(username, password).then(function(obj) {
      if (obj.length > 0) {
        let token = jwt.sign(obj[0], privateKey, {
            expiresIn: 30 * 60 // expires in half an hour
        });
        console.log(token);
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
        });
      }
      else {
        if(obj instanceof Error) {
          res.json({
              success: false,
              message: obj.message
          });
        }
        else {
          res.json({
              success: false,
              message: 'Could not authenticate'
          });
        }
      }
    })
}

exports.validateToken = async (req, res, next) => {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, privateKey, function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                users.isPending(decoded)
                .then(function(pending) {
                    if (pending) {
                        return res.status(403).send({
                            success: false,
                            message: 'Awaiting approval'
                        });
                    }
                    else {
                        // if everything is good, save to request for use in other routes
                        console.log("Payload: ")
                        console.log(decoded)
                        req.decoded = decoded;
                        next();
                    }
                })
                .catch(function(err) {
                    return res.status(403).send({
                        success: false,
                        message: 'Approval status unkown',
                        error: err
                    });
                })
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}