var users = require('../models/users');
var utils = require('../utils');
var Enums = require('../enums');
var jwt = require('jsonwebtoken');

var exports = module.exports = {}

const privateKey = "384a2d8G86dA713"

exports.getToken = async (username, password) => {
    return new Promise(function (resolve, reject) {
        users.authenticate(username, password)
        .then(function(obj) {
            if (obj.length > 0) {
                let token = jwt.sign(obj[0], privateKey, {
                    expiresIn: 30 * 60 // expires in half an hour
                });
                resolve({
                    token: token,
                    isAdmin: obj[0].isAdmin,
                    isPending: obj[0].isPending
                })
            }
            else {
                if(obj instanceof Error)
                    reject(obj)
                else
                    reject(Error('Could not authenticate'))
            }
        })
        .catch(err => {
            reject(err)
        })
    });
}

exports.authenticate = (req, res) => {
    let username = req.body.user;
    let password = req.body.password;

    exports.getToken(username, password)
    .then(obj => {
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: obj.token,
            isAdmin: obj.isAdmin,
            isPending: obj.isPending
        });
    })
    .catch(async err => {
        let obj = await utils.createErrorObject(err)
        return res.json(obj);
    })
}

exports.validateToken = async (req, res, next) => {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, privateKey, async function(err, decoded) {
            if (err) {
                return res.json(await utils.createErrorObject(Enums.ErrorType.AUTHENTICATION_FAILED))
            } else {
                users.isPending(decoded)
                .then(async function(pending) {
                    if (pending) {
                        return res.json(await utils.createErrorObject(Enums.ErrorType.USER_PENDING))
                    }
                    else {
                        req.user = decoded;
                        next();
                    }
                })
                .catch(async function(err2) {
                    return res.json(await utils.createErrorObject("Approval status unkown"))
                })
            }
        });
    } else {
        // if there is no token, return an error
        return res.json(await utils.createErrorObject(Enums.ErrorType.NO_TOKEN))
    }
}