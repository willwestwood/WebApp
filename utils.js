var exports = module.exports = {}
var enums = require('./enums.js')
var crypto = require('crypto')

exports.buildCommaSeparatedString = function (names, quotes = false, suffix = '') {
    var res = ""
    if (names.length > 0)
    {
        for(var i = 0; i < names.length; i++)
        {
            if (quotes && !(typeof names[i] === 'boolean'))
                res += "'"
            res += names[i]
            if (quotes && !(typeof names[i] === 'boolean'))
                res += "'"
            res += suffix
            if (i != names.length - 1)
                res += ', '
        }
    }
    return res
}

exports.buildCommaSeparatedQMs = function (size) {
    var res = ""
    if (size > 0)
    {
        for(var i = 0; i < size; i++)
        {
            res += '?'
            if (i != size - 1)
                res += ', '
        }
    }
    return res
}

exports.sanitiseQuery = function (names, values) {
    let length = Math.min(names.length, values.length)
    for(let i = 0; i < length;) {
        if (names[i] == undefined || values[i] == undefined) {
            names.splice(i, 1);
            values.splice(i, 1);
            length--;
        }
        else
            i++;
    }
    
    return {
        names: names,
        values: values,
        length: length
    }
}

exports.where = function(searchQuery, obj)
{
    var match = true
    Object.keys(searchQuery).forEach(e => {
        if (obj[e] != undefined && searchQuery[e] != undefined)
            if (obj[e] != searchQuery[e])
                match = false
    });
    return match
}

exports.getKeyByValue = async function(object, value) {
    return await Object.keys(object).find(key => object[key] == value);
}

exports.createErrorObject = async function(err) {
    let message = ""
    if (err instanceof Error)
        message = err.message
    else
        message = err

    if (enums.isErrorType(message)) {
        let errorString = await enums.getErrorString(message)
        return {
            success: false,
            errorId: Number(message),
            message: errorString
        }
    }
    else
        return {
            success: false,
            errorId: enums.ErrorType.UNKNOWN,
            message: message
        }
}

const iv = Buffer.from([ 161, 17, 176, 78, 45, 107, 43, 50, 29, 39, 169, 76, 149, 12, 200, 17 ])
const key = Buffer.from([ 189, 181, 122, 229, 161, 94, 97, 124, 46, 168, 90, 218, 237, 134, 223, 32, 186, 85, 145, 216, 94, 178, 160, 1, 105, 21, 235, 174, 227, 106, 232, 245 ])

exports.encrypt = async function(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

exports.decrypt = async function(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}