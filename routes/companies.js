var _ = require('lodash');
var companies = require('../models/companies');

var exports = module.exports = {}

exports.get = (req, res) => {
    companies.get({
        id: req.query.id,
        name: req.query.name,
        address: req.query.address,
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
    if (!_.has(req.query, 'name')) {
        res.status(200).send({
            success: 'false',
            message: 'missing params',
            obj: req.query
        });
        return
    }

    companies.add({
        name: req.query.name,
        address: req.query.address,
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