var db = require('./../db/mysql')

var exports = module.exports = {}

exports.authenticate = async function (emailAddress, passwordHash) {
  var conn = new db.Users()
  conn.begin()
  var obj = await conn.authenticateUser(emailAddress, passwordHash)
  conn.end()

  return obj
}

exports.add = async function (newUser) {
  var conn = new db.Users()
  var obj = {}
  try {
    conn.begin()
    obj = await conn.insert(
      newUser.firstName,
      newUser.secondName,
      newUser.emailAddress,
      newUser.isAdmin,
      newUser.passwordHash)
  } catch (e) {
    console.log(e)
    throw e
  } finally {
    conn.end()
  }

  return obj
}

exports.get = async function (user) {
  var names = ['id', 'firstName', 'secondName', 'emailAddress', 'isAdmin', 'passwordHash']
  var values = [user.id, user.firstName, user.secondName, user.emailAddress, user.isAdmin, user.passwordHash]

  var conn = new db.Users()
  var obj = {}
  try {
    conn.begin()
    obj = await conn.select(names, values)
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
