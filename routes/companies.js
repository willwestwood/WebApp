var _ = require('lodash');
var companies = require('../models/companies');

var exports = module.exports = {}

exports.get = (req, res) => {
    companies.get({
        id: req.query.id,
        name: req.query.name,
        type: req.query.type,
        industry: req.query.industry
    })
    .then(function(obj) {
        res.status(200).send({
        success: 'true',
        message: 'retrieved successfully',
        companies: obj
        })
    })
    .catch(err => {
        console.log(err.stack)
        res.status(200).send({
        success: 'false',
        message: 'not retrieved',
        error: err.message
        })
    });
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
        type: req.query.type,
        industry: req.query.industry
    })
    .then(function(obj) {
        res.status(200).send({
        success: 'true',
        message: 'added successfully',
        obj: obj
        })
    })
    .catch(err => {
        console.log(err.stack)
        res.status(200).send({
        success: 'false',
        message: 'error',
        error: err.message
        })
    });
}

exports.update = (req, res) => {
    if (!_.has(req.query, 'name')) {
        res.status(200).send({
            success: 'false',
            message: 'missing params',
            obj: req.query
        });
        return
    }

    companies.update({
        id: req.query.id,
        name: req.query.name,
        type: req.query.type,
        industry: req.query.industry
    })
    .then(function(obj) {
        res.status(200).send({
        success: 'true',
        message: 'updated successfully',
        obj: obj
        })
    })
    .catch(err => {
        console.log(err.stack)
        res.status(200).send({
        success: 'false',
        message: 'error',
        error: err.message
        })
    });
}

exports.delete = (req, res) => {
    if (!_.has(req.query, 'id')) {
        res.status(200).send({
            success: 'false',
            message: 'missing params',
            obj: req.query
        });
        return
    }
    companies.setDeleted(req.query.id)
    .then(function(obj) {
        res.status(200).send({
        success: 'true',
        message: 'added successfully',
        obj: obj
        })
    })
    .catch(err => {
        console.log(err.stack)
        res.status(200).send({
        success: 'false',
        message: 'error',
        error: err.message
        })
    });
}