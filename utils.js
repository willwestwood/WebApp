var exports = module.exports = {}
var enums = require('./enums.js')

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