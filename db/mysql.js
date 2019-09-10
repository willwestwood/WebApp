var mysql = require('mysql')
var utils = require('./../utils.js')

var exports = module.exports = {}

class MySqlConnection {
    constructor(table, columns, selectCols, insertCols) {
        this._table = table;
        this._columns = columns
        this._selectCols = selectCols
        this._insertCols = insertCols
    }

    table() { return this._table }
    columns() { return this._columns }
    selectColumns() { return this._selectCols }
    insertColumns() { return this._insertCols }

    begin() {
        let connectionStr = {
            host: 'localhost',
            user: 'root',
            password: 'testtest',
            database: 'crm'
        }

        this._connection = mysql.createConnection(connectionStr);
        this._connection.connect();
    }

    end() {
        this._connection.end();
    }

    executeQuery(query)
    {
        console.log(query)

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

    select(queryParameters) {
        // initialise undefined properties
        if(queryParameters.selectCols == undefined) queryParameters.selectCols = this.selectColumns();
        if(queryParameters.whereNames == undefined) queryParameters.whereNames = this.selectColumns();
        if(queryParameters.whereValues == undefined) queryParameters.whereValues = [];

        let selectStr = 'SELECT '
        selectStr += utils.buildCommaSeparatedString(queryParameters.selectCols)
        selectStr += ' FROM ' + this._table

        queryParameters.where = utils.sanitiseQuery(queryParameters.whereNames, queryParameters.whereValues)

        if(queryParameters.where.length > 0) {
            selectStr += ' WHERE'
            for(let i = 0; i < queryParameters.where.length; i++) {
                if (i > 0)
                    selectStr += ' AND'

                selectStr += ' ' + queryParameters.where.names[i] + ' = \'' + queryParameters.where.values[i] + '\''
            }
        }

        return this.executeQuery(selectStr)
    }

    insert(values) {
        let query = utils.sanitiseQuery(this.insertColumns(), values)

        let insertStr = "INSERT INTO"
        insertStr += ' ' + this.table()
        insertStr += ' ('
        insertStr += utils.buildCommaSeparatedString(query.names)
        insertStr += ") VALUES ("
        insertStr += utils.buildCommaSeparatedString(query.values, true)
        insertStr += ")"
        return this.executeQuery(insertStr)
    }
}

exports.Users = class Users extends MySqlConnection {
    constructor() {
        var columns = {
            id: 'id',
            firstName: 'firstName',
            secondName: 'secondName',
            emailAddress: 'emailAddress',
            passwordHash: 'passwordHash',
            salt: 'salt',
            isAdmin: 'isAdmin',
            isPending: 'isPending',
            isDeleted: 'isDeleted'
        }

        var selectCols = [columns.id, columns.firstName, columns.secondName, columns.emailAddress, columns.isAdmin, columns.isPending, columns.isDeleted]
        var insertCols = [columns.firstName, columns.secondName, columns.emailAddress, columns.passwordHash, columns.salt, columns.isAdmin, columns.isPending]
        super('users', columns, selectCols, insertCols)
    }

    insert(firstName, secondName, emailAddress, isAdmin, passwordHash, salt, isPending = true) {
        return super.insert([firstName, secondName, emailAddress, passwordHash, salt, isAdmin, isPending])
    }

    authenticateUser(emailAddress, passwordHash) {
        return super.select({
            whereNames: [super.columns().emailAddress, super.columns().passwordHash], 
            whereValues: [emailAddress, passwordHash]
        })
    }

    getSalt(emailAddress) {
        return super.select({
            selectCols: [super.columns().salt], 
            whereNames: [super.columns().emailAddress], 
            whereValues: [emailAddress]
        })
    }
}

exports.Notes = class Notes extends MySqlConnection {
    constructor() {
        var columns = {
            id: 'id',
            contactId: 'contactId',
            userId: 'userId',
            note: 'note',
            updatedAt: 'updatedAt',
            isDeleted: 'isDeleted'
        }

        var selectCols = [columns.id, columns.contactId, columns.userId, columns.note, columns.updatedAt, columns.isDeleted]
        var insertCols = [columns.contactId, columns.userId, columns.note]
        super('notes', columns, selectCols, insertCols)
    }

    insert(note, userId, contactId) {
        return super.insert([contactId, userId, note])
    }
}

exports.Companies = class Companies extends MySqlConnection {
    constructor() {
        var columns = {
            id: 'id',
            name: 'name',
            address: 'address',
            telephone: 'telephone',
            isDeleted: 'isDeleted'
        }

        var selectCols = [columns.id, columns.name, columns.address, columns.telephone, columns.isDeleted]
        var insertCols = [columns.name, columns.address, columns.telephone]
        super('companies', columns, selectCols, insertCols)
    }

    insert(name, address, telephone) {
        return super.insert([name, address, telephone])
    }
}

exports.Contacts = class Contacts extends MySqlConnection {
    constructor() {
        var columns = {
            id: 'id',
            firstName: 'firstName',
            secondName: 'secondName',
            emailAddress: 'emailAddress',
            companyId: 'companyId',
            isDeleted: 'isDeleted'
        }

        var selectCols = [columns.id, columns.firstName, columns.secondName, columns.emailAddress, columns.companyId, columns.isDeleted]
        var insertCols = [columns.firstName, columns.secondName, columns.emailAddress, columns.companyId]
        super('contacts', columns, selectCols, insertCols)
    }

    insert(firstName, secondName, emailAddress, companyId) {
        return super.insert([firstName, secondName, emailAddress, companyId])
    }
}