var exports = module.exports = {}

exports.authentication = require('./routes/authentication');
exports.users = require('./routes/users');
exports.notes = require('./routes/notes');
exports.companies = require('./routes/companies');
exports.contacts = require('./routes/contacts');

exports.test = function(req, res) {
    return res.json({
        success: true,
        message: "You are authenticated and all set to consume our services."
    });
}