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

  table() {
    return this._table;
  }

  begin()
  {
    this._connection = mysql.createConnection(this._connectionStr);
    this._connection.connect();
  }

  end()
  {
    this._connection.end();
  }

  select(cols = ['*'], id = undefined)
  {
    var selectStr = 'SELECT'

    for(var i = 0; i < cols.length; i++)
    {
      selectStr += ' ' + cols[i]
      if(i < cols.length - 1)
        selectStr += ','
    }

    selectStr += ' FROM ' + this.table()

    if(id >= 0 && id != undefined)
      selectStr += ' WHERE id = ' + id

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

  insert(insertStr)
  {
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

class Users extends MySqlConnection
{
  constructor()
  {
    super('users')
  }

  select(cols = ['*'], id = undefined)
  {
    console.log('Derived class')
    return super.select(cols, id)
  }

  insert(firstName, secondName, emailAddress, isAdmin, passwordHash)
  {
    var insertStr = "INSERT INTO"
    insertStr += ' ' + super.table()
    insertStr += ' (firstName, secondName, emailAddress, isAdmin, passwordHash) '
    insertStr += "VALUES ('" + firstName + "', '" + secondName + "', '" + emailAddress + "', " + isAdmin + ", '" + passwordHash + "')"

    console.log(insertStr)

    return super.insert(insertStr)
  }

  authenticateUser(emailAddress, passwordHash)
  {
    var selectStr = 'SELECT ID FROM ' + this.table()
    selectStr += ' WHERE emailAddress = "' + emailAddress + '" AND passwordHash = "' + passwordHash + '"'

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
}

exports.select = async function (table, id) {
  var conn
  if (table == 'users')
    conn = new Users()
  else
    conn = new MySqlConnection(table)
  conn.begin()
  try
  {
    var obj = await conn.select(['*'], id)
  }
  catch(e)
  {
    return e
  }
  finally
  {
    conn.end()
  }

  return obj
}

exports.insert = async function (table, id) {
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

exports.authenticateUser = async function (emailAddress, passwordHash) {
  var conn = new Users()
  conn.begin()
  var obj = await conn.authenticateUser(emailAddress, passwordHash)
  conn.end()

  return obj
}

exports.insertUser = async function (firstName, secondName, emailAddress, isAdmin, passwordHash) {
  var conn = new Users()
  conn.begin()
  var obj
  try {
    obj = await conn.insert(firstName, secondName, emailAddress, isAdmin, passwordHash)
  } catch (e) {
    obj = e
  } finally {
    conn.end()
  }

  return obj
}
