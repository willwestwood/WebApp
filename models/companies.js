var db = require('./../db/mysql')
var utils = require('./../utils')

var exports = module.exports = {}

var initialised = false
var cache = []
exports.initialise = async function() {
    await db.initialise()
    get().then(obj => {
        cache = obj
        initialised = true
    });
}

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

    var newCompany = await get({id: obj.insertId}, false, true)
    if (newCompany.length > 0)
        cache.push(newCompany[0])
    return newCompany
}
exports.add = add;

async function get(company = {}, isDeleted = false, bypassCache = false) {
    if(initialised && !bypassCache)
    {
        console.log('Companies retrieved')
        console.log('Search params: ')
        console.log(company)
        return cache.filter(obj => utils.where(company, obj))
    }

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
    await cache.filter(obj => utils.where({id: company.id}, obj))
    .forEach(obj => {
        obj.name = company.name; 
        obj.type = company.type; 
        obj.industry = company.industry;
    })

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
    await cache.filter(obj => utils.where({id: id}, obj))
    .forEach(obj => {
        obj.isDeleted = true; 
    })

    cache.splice(cache.findIndex(obj => utils.where({id: id}, obj)),1);

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