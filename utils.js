var exports = module.exports = {}

exports.buildCommaSeparatedString = function (names, quotes = false) {
    var res = ""
    if (names.length > 0)
    {
        for(var i = 0; i < names.length; i++)
        {
            if (quotes && !(typeof names[i] === 'boolean')) res += "'"
            res += names[i]
            if (quotes && !(typeof names[i] === 'boolean')) res += "'"
            if (i != names.length - 1)
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