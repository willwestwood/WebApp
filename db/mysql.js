var mysql = require('mysql')

var connectionStr = {
  host: 'localhost',
  user: 'root',
  password: 'testtest',
  database: 'crm'
}

function select(id, cb) {
  var connection = mysql.createConnection(connectionStr)
  connection.connect()

  var selectStr = 'SELECT * FROM users'

  if(id >= 0 && id != undefined)
    selectStr += ' WHERE id = ' + id

  connection.query(selectStr, function (err, rows, fields) {
    if (err) throw err

    cb(rows)
  })

  connection.end()
}

export default select;
