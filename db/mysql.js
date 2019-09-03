var mysql = require('mysql')

var exports = module.exports = {}

class MySqlConnection {
  constructor(table) {
    this._table = table;
    this._connectionStr = {
      host: 'localhost',
      user: 'root',
      password: 'testtest',
      database: 'crm'
    }
  }

  table() { return this._table }

  begin() {
    this._connection = mysql.createConnection(this._connectionStr);
    this._connection.connect();
  }

  end() {
    this._connection.end();
  }

  executeQuery(query)
  {
    var conn = this._connection
    return new Promise(function (resolve, reject) {
      try {
        conn.query(query, function (err, rows, fields) {
          if (err)
            reject(err)

          resolve(rows)
        });
      } catch (e) {
        reject(e)
      }
    });
  }

  select(names, values) {
    let selectStr = 'SELECT * FROM ' + this._table

    let length = Math.min(names.length, values.length)
    if(length > 0) {
      let validWhereClause = false
      for(let i = 0; i < length; i++) {
        if (names[i] == undefined || values[i] == undefined)
          continue

        if (!validWhereClause) {
          selectStr += ' WHERE'
          validWhereClause = true
        }
        else
          selectStr += ' AND '

        selectStr += ' ' + names[i] + ' = \'' + values[i] + '\''
      }
    }

    return this.executeQuery(selectStr)
  }
}

exports.Users = class Users extends MySqlConnection {
  constructor() {
    super('users')
  }

  columns() {
    return ['id', 'firstName', 'secondName', 'emailAddress', 'isAdmin', 'passwordHash']
  }

  select(names, values) {
    return super.select(names, values)
  }

  insert(firstName, secondName, emailAddress, isAdmin, passwordHash, salt) {
    let insertStr = "INSERT INTO"
    insertStr += ' ' + super.table()
    insertStr += ' (firstName, secondName, emailAddress, isAdmin, passwordHash, salt) '
    insertStr += "VALUES ('" + firstName + "', '" + secondName + "', '" + emailAddress + "', " + isAdmin + ", '" + passwordHash + "', '" + salt + "')"
    return super.executeQuery(insertStr)
  }

  authenticateUser(emailAddress, passwordHash) {
    let selectStr = 'SELECT ID FROM ' + super.table()
    selectStr += ' WHERE emailAddress = "' + emailAddress + '" AND passwordHash = "' + passwordHash + '"'
    return super.executeQuery(selectStr)
  }

  getSalt(emailAddress) {
    let selectStr = 'SELECT salt FROM ' + super.table()
    selectStr += ' WHERE emailAddress = "' + emailAddress + '"'
    return super.executeQuery(selectStr)
  }
}

exports.Notes = class Notes extends MySqlConnection {
  constructor() {
    super('notes')
  }

  columns() {
    return ['id', 'contactId', 'userId', 'note', 'updatedAt']
  }

  select(names, values) {
    return super.select(names, values)
  }

  insert(note, userId, contactId) {
    let insertStr = "INSERT INTO"
    insertStr += ' ' + super.table()
    insertStr += ' (contactId, userId, note) '
    insertStr += "VALUES ('" + contactId + "', '" + userId + "', '" + note + "')"
    return super.executeQuery(insertStr)
  }
}

exports.select = async function select (table, id) {
  var conn
  if (table == 'users')
    onn = new Users()
  else
    conn = new MySqlConnection(table)
  try {
    conn.begin()
    var obj = await conn.select(['id'], [id])
  }
  catch(e) {
    throw e
  }
  finally {
    conn.end()
  }

  return obj
}
