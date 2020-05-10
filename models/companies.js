var db = require('./../db/mysql')

var exports = module.exports = {}

async function add(company) {
    var conn = new db.Companies()
    var obj = {}
    try {
        conn.begin()
        obj = await conn.insert(
            company.name,
            company.type,
            company.industry)
    } catch (e) {
        console.log(e)
        throw e
    } finally {
        conn.end()
    }

    return await get({id: obj.insertId})
}
exports.add = add;

async function get(company) {
    var values = [company.id, company.name, company.type, company.industry]

    var conn = new db.Companies()
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

async function setDeleted(id) {
    var conn = new db.Companies()
    var obj = {}
    try {
        conn.begin()
        obj = await conn.delete(id)
    } catch (e) {
        console.log(e)
        throw e
    } finally {
        conn.end()
    }

    return await get({id: obj.insertId})
}
exports.setDeleted = setDeleted;