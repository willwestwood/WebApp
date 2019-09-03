var db = require('./../db/mysql')

var exports = module.exports = {}

exports.add = async function (note, user, contact) {
  var conn = new db.Notes()
  var obj = {}
  try {
    conn.begin()
    obj = await conn.insert(
      note,
      user.id,
      contact.id)
  } catch (e) {
    console.log(e)
    throw e
  } finally {
    conn.end()
  }

  return obj
}

exports.get = async function (note) {
  var names = ['id', 'contactId', 'userId', 'note', 'udpatedAt']
  var values = [note.id, note.contactId, note.userId, note.note, note.updatedAt]

  var conn = new db.Notes()
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
