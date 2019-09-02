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

  select(names, values) {
    var selectStr = 'SELECT * FROM ' + this._table

    var length = Math.min(names.length, values.length)
    if(length > 0) {
      var validWhereClause = false
      for(var i = 0; i < length; i++) {
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

    console.log(selectStr)

    var conn = this._connection
    return new Promise(function (resolve, reject) {
      try {
        conn.query(selectStr, function (err, rows, fields) {
          if (err)
            reject(err)

          resolve(rows)
        });
      } catch (e) {
        reject(e)
      }
    });
  }

  insert(insertStr) {
    var conn = this._connection
    return new Promise(function (resolve, reject) {
      try {
        conn.query(insertStr, function (err, result, fields) {
          if (err)
            reject(err)

          resolve(result)
        });
      } catch (e) {
        reject(e)
      }
    });
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

  insert(firstName, secondName, emailAddress, isAdmin, passwordHash) {
    var insertStr = "INSERT INTO"
    insertStr += ' ' + super.table()
    insertStr += ' (firstName, secondName, emailAddress, isAdmin, passwordHash) '
    insertStr += "VALUES ('" + firstName + "', '" + secondName + "', '" + emailAddress + "', " + isAdmin + ", '" + passwordHash + "')"
    return super.insert(insertStr)
  }

  authenticateUser(emailAddress, passwordHash) {
    var selectStr = 'SELECT ID FROM ' + super.table()
    selectStr += ' WHERE emailAddress = "' + emailAddress + '" AND passwordHash = "' + passwordHash + '"'

    var conn = this._connection
    return new Promise(function (resolve, reject) {
      try {
        conn.query(selectStr, function (err, rows, fields) {
          if (err)
            reject(err)
          else
            resolve(rows)
        });
      } catch (e) {
        reject(e)
      }
    });
  }
}

exports.select = async function select (table, id) {
  var conn
  if (table == 'users')
    conn = new Users()
  else
    conn = new MySqlConnection(table)
  try {
    conn.begin()
    var obj = await conn.select(['*'], id)
  }
  catch(e) {
    throw e
  }
  finally {
    conn.end()
  }

  return obj
}

exports.insert = async function insert (table, id) {
  var conn
  if (table == 'users')
    conn = new Users()
  else
    conn = new MySqlConnection(table)
  conn.begin()
  var obj = await conn.insert(['*'], id)
  conn.end()

  return obj
}
