var utils = require('./utils.js')

const ErrorType = {
    NONE: 0,
    UNKNOWN: 1,
    INCORRECT_PASSWORD: 2, 
    UNKNOWN_EMAIL_ADDRESS: 3, 
    USER_PENDING: 4,
    NO_TOKEN: 5,
    AUTHENTICATION_FAILED: 6,
    COUNT: 7
}
Object.freeze(ErrorType)
module.exports.ErrorType = ErrorType

module.exports.isErrorType = message => {
    return message >= 0 && message < ErrorType.COUNT
}

module.exports.getErrorString = async id => {
    return await utils.getKeyByValue(ErrorType, id)
}