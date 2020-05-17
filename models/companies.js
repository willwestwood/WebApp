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

async function get(company, isDeleted = false) {
    var values = [company.id, company.name, company.type, company.industry, isDeleted]

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

async function update(company) {
    let id = company.id
    var conn = new db.Companies()
    var obj = {}
    try {
        conn.begin()
        let updatedCompany = await conn.select({whereValues: [id]})
        if (updatedCompany.length == 0)
            throw new Error("Internal error")
        updatedCompany = updatedCompany[0]

        for (var key in company)
            if (company.hasOwnProperty(key) && company[key] != undefined)
                updatedCompany[key] = company[key]
                
        obj = await conn.update(id, updatedCompany.name, updatedCompany.type, updatedCompany.industry)
    } catch (e) {
        console.log(e)
        throw e
    } finally {
        conn.end()
    }

    return await get({id: obj.insertId})
}
exports.update = update;

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