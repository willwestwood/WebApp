var db = require('./../db/mysql')

var exports = module.exports = {}

async function add(contact) {
    var conn = new db.Contacts()
    var obj = {}
    try {
        conn.begin()
        obj = await conn.insert(
            contact.firstName,
            contact.secondName,
            contact.emailAddress,
            contact.companyId)
    } catch (e) {
        console.log(e)
        throw e
    } finally {
        conn.end()
    }

    return await get({id: obj.insertId})
}
exports.add = add;

async function get(contact) {
    var values = [contact.id, contact.firstName, contact.secondName, contact.emailAddress, contact.companyId, contact.isDeleted]

    var conn = new db.Contacts()
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
