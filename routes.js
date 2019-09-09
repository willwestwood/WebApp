var exports = module.exports = {}

exports.authentication = require('./routes/authentication');
exports.users = require('./routes/users');
exports.notes = require('./routes/notes');

exports.test = function(req, res) {
    return res.json({
        success: true,
        message: "You are authenticated and all set to consume our services."
    });
}