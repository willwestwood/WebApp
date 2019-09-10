var _ = require('lodash');
var contacts = require('../models/contacts');

var exports = module.exports = {}

exports.get = (req, res) => {
    contacts.get({
        id: req.query.id,
        companyId: req.query.companyId,
        firstName: req.query.firstName,
        secondName: req.query.secondName,
        emailAddress: req.query.emailAddress,
        telephone: req.query.telephone
    })
    .then(function(obj) {
        res.status(200).send({
        success: 'true',
        message: 'retrieved successfully',
        obj: obj
        })
    })
    .catch(err => res.status(200).send({
        success: 'false',
        message: 'not retrieved',
        error: err
    }));
}

exports.add = (req, res) => {
    if (!_.has(req.query, 'companyId')
        || !_.has(req.query, 'firstName')) {
        res.status(200).send({
            success: 'false',
            message: 'missing params',
            obj: req.query
        });
        return
    }

    contacts.add({
        companyId: req.query.companyId,
        firstName: req.query.firstName,
        secondName: req.query.secondName,
        emailAddress: req.query.emailAddress,
        telephone: req.query.telephone
    })
    .then(function(obj) {
        res.status(200).send({
        success: 'true',
        message: 'added successfully',
        obj: obj
        })
    })
    .catch(err => res.status(200).send({
        success: 'false',
        message: 'error',
        error: err.message
    }));
}

exports.initialise = function() {
    contacts.initialise();
}