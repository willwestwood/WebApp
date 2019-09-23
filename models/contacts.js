var db = require('./../db/mysql')
var utils = require('./../utils')

var exports = module.exports = {}

var initialised = false
var cache = []
exports.initialise = function() {
    get().then(obj => {
        cache = obj
        initialised = true
    });
}

async function add(contact) {
    let conn = new db.Contacts()
    var obj = {}
    try {
        conn.begin()
        obj = await conn.insert(
            contact.firstName,
            contact.secondName,
            contact.companyId
        )
    } catch (e) {
        console.log(e)
        throw e
    } finally {
        conn.end()
    }

    var newContact = await get({id: obj.insertId}, true)
    if (newContact.length > 0)
        cache.push(newContact[0])
    return newContact
}
exports.add = add;

async function get(contact = {}, bypassCache = false) {
    if(initialised && !bypassCache)
    {
        console.log('Contacts retrieved')
        console.log('Search params: ')
        console.log(contact)
        return cache.filter(obj => {
            return utils.where(contact, obj)
          });
    }

    let values = [contact.id, contact.firstName, contact.secondName, contact.companyId, contact.isDeleted]

    let conn = new db.Contacts()
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
