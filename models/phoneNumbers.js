var db = require('../db/mysql')
var utils = require('../utils')

var exports = module.exports = {}

var initialised = false
var cache = []
exports.initialise = function() {
    get().then(obj => {
        cache = obj
        initialised = true
    });
}

async function add(phoneNumber) {
    let conn = new db.PhoneNumbers()
    var obj = {}
    try {
        conn.begin()
        obj = await conn.insert(
            phoneNumber.contactId,
            phoneNumber.companyId,
            phoneNumber.phoneNumber,
            phoneNumber.label,
            phoneNumber.precedence
        )
    } catch (e) {
        console.log(e)
        throw e
    } finally {
        conn.end()
    }

    var newPhoneNumber = await get({id: obj.insertId}, true)
    if (newPhoneNumber.length > 0)
        cache.push(newPhoneNumber[0])
    return newPhoneNumber
}
exports.add = add;

async function get(phoneNumber = {}, bypassCache = false) {
    if(initialised && !bypassCache)
    {
        console.log('Phone Numbers retrieved')
        console.log('Search params: ')
        console.log(phoneNumber)
        return cache.filter(obj => {
            return utils.where(phoneNumber, obj)
          });
    }

    let values = [phoneNumber.id, phoneNumber.contactId, phoneNumber.companyId, phoneNumber.phoneNumber, phoneNumber.label, phoneNumber.precedence, phoneNumber.isDeleted]

    let conn = new db.PhoneNumbers()
    var obj = {}
    try {
        conn.begin()
        obj = await conn.select({whereValues: values})
    }
    catch (e) {
        console.log(e)
        throw e
    }
    finally {
        conn.end()
    }
    return obj
}
exports.get = get;
