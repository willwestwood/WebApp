var mysql = require('mysql')

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
}

export default async function select(table, id) {
  var conn = new MySqlConnection(table)
  conn.begin()
  var obj = await conn.select(['*'], id)
  conn.end()

  return obj
}
