var _ = require('lodash');
var users = require('../models/users');
var authentication = require('./authentication')

var exports = module.exports = {}

exports.get = (req, res) => {
    users.get({
        id: req.query.id,
        firstName: req.query.firstName,
        secondName: req.query.secondName,
        emailAddress: req.query.emailAddress,
        isAdmin: req.query.isAdmin,
        isPending: req.query.isPending
    })
    .then(function(obj) {
        res.status(200).send({
        success: 'true',
        message: 'retrieved successfully',
        users: obj
        })
    })
    .catch(err => res.status(200).send({
        success: 'false',
        message: 'not retrieved',
        error: err.message
        })
    );
}

exports.add = async (req, res) => {
    console.log('REGISTER')
    console.log(req.query)

    if (!_.has(req.query, 'emailAddress')
        || !_.has(req.query, 'password')
        || !_.has(req.query, 'firstName')
        || !_.has(req.query, 'secondName')) {
        res.status(200).send({
            success: 'false',
            message: 'missing params',
            obj: req.query
        });
        return
    }

    users.add({
        emailAddress: req.query.emailAddress,
        password: req.query.password,
        firstName: req.query.firstName,
        secondName: req.query.secondName,
        isAdmin: false
    })
    .then(async function(obj) {
        let username = req.query.emailAddress
        let password = req.query.password

        var obj = await authentication.getToken(username, password)
        //.then(obj => {
            if (obj instanceof Error) {
                res.json({
                    success: false,
                    message: 'error',
                    error: obj.message
                });
            }
            else {
                console.log(obj)
                res.json({
                    success: true,
                    message: 'registered successfully',
                    token: obj.token,
                    isPending: false,
                    isAdmin: false
                });
            }
        // })
        // .catch(err => {
        //     res.status(200).send({
        //         success: 'false',
        //         message: 'error',
        //         error: err.message
        //     });
        // });
    })
    .catch(err => res.status(200).send({
        success: 'false',
        message: 'error',
        error: err.message
    }));
}

exports.initialise = async function() {
    await users.initialise();
}