var exports = module.exports = {}

exports.authentication = require('./routes/authentication');
exports.users = require('./routes/users');
exports.notes = require('./routes/notes');
exports.companies = require('./routes/companies');
exports.contacts = require('./routes/contacts');
exports.phoneNumbers = require('./routes/phoneNumbers');

exports.test = function(req, res) {
    return res.json({
        success: true,
        message: "You are authenticated and all set to consume our services."
    });
}

exports.initialise = function() {
    exports.contacts.initialise();
    exports.users.initialise();
}