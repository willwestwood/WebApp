var _ = require('lodash');
var notes = require('../models/notes');

var exports = module.exports = {}

exports.get = (req, res) => {
    notes.get({
        id: req.query.id,
        contactId: req.query.contactId,
        userId: req.query.userId,
        note: req.query.note,
        updatedAt: req.query.updatedAt
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
    if (!_.has(req.query, 'note')
        || !_.has(req.query, 'contactId')) {
        res.status(200).send({
            success: 'false',
            message: 'missing params',
            obj: req.query
        });
        return
    }

    notes.add({
        note: req.query.note,
        userId: req.user.id,
        contactId: req.query.contactId
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