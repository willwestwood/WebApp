var db = require('./../db/mysql')

var exports = module.exports = {}

async function add(company) {
  var conn = new db.Companies()
  var obj = {}
  try {
    conn.begin()
    obj = await conn.insert(
        company.name,
        company.address,
        company.telephone)
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
  var names = ['id', 'name', 'address', 'telephone']
  var values = [company.id, company.name, company.address, company.telephone]

  var conn = new db.Companies()
  var obj = {}
  try {
    conn.begin()
    obj = await conn.genericSelect(names, values)
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
