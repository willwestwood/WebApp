var _ = require('lodash');
var phoneNumbers = require('../models/phoneNumbers');

var exports = module.exports = {}

exports.get = (req, res) => {
    phoneNumbers.get({
        id: req.query.id,
        companyId: req.query.companyId,
        contactId: req.query.contactId,
        phoneNumber: req.query.phoneNumber,
        label: req.query.label,
        isDeleted: req.query.isDeleted
    })
    .then(function(obj) {
        res.status(200).send({
        success: 'true',
        message: 'retrieved successfully',
        phoneNumbers: obj
        })
    })
    .catch(err => res.status(200).send({
        success: 'false',
        message: 'not retrieved',
        error: err.message
    }));
}

exports.add = (req, res) => {
    if ((!_.has(req.query, 'companyId')
    && !_.has(req.query, 'contactId'))
        || !_.has(req.query, 'phoneNumber')) {
        res.status(200).send({
            success: 'false',
            message: 'missing params',
            obj: req.query
        });
        return
    }

    phoneNumbers.add({
        companyId: req.query.companyId,
        firstName: req.query.firstName,
        secondName: req.query.secondName
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
    phoneNumbers.initialise();
}