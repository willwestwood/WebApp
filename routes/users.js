var _ = require('lodash');
var users = require('../models/users');

var exports = module.exports = {}

exports.get = (req, res) => {
    users.get({
        id: req.query.id,
        firstName: req.query.firstName,
        secondName: req.query.secondName,
        emailAddress: req.query.emailAddress,
        isAdmin: req.query.isAdmin
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
        users: err
    }));
}

exports.add = (req, res) => {
    if (!_.has(req.query, 'emailAddress')
        || !_.has(req.query, 'password')
        || !_.has(req.query, 'firstName')
        || !_.has(req.query, 'secondName')) {
        res.status(200).send({
            success: 'false',
            message: 'missing params',
            obj: req.query
        });
    }

    users.add({
        emailAddress: req.query.emailAddress,
        password: req.query.password,
        firstName: req.query.firstName,
        secondName: req.query.secondName,
        isAdmin: true
    })
    .then(function(obj) {
        res.status(200).send({
            success: 'true',
            message: 'registered successfully',
            obj: obj
        })
    })
    .catch(err => res.status(200).send({
        success: 'false',
        message: 'error',
        error: err.message
    }));
}