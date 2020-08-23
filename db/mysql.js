var mysql = require('mysql')
var utils = require('./../utils.js')
var fs = require('fs').promises

var exports = module.exports = {}
var decryptedPassword = undefined

exports.initialise = async function()
{
    console.log('Initialising...')
    if (decryptedPassword == undefined)
        decryptedPassword = await utils.decrypt(await JSON.parse(await fs.readFile('db/pswd.txt', 'utf8')))
    console.log('Initialisation finished')
}

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

    async begin() {
        let connectionStr = {
            host: 'localhost',
            user: 'root',
            password: decryptedPassword,
            database: 'crm'
        }

        this._connection = mysql.createConnection(connectionStr);
        this._connection.connect();
    }

    end() {
        this._connection.end();
    }

    executeQuery(query, params)
    {
        console.log(query)

        var conn = this._connection
        return new Promise(function (resolve, reject) {
            try {
                conn.query(query, params, function (err, rows, fields) {
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

                selectStr += ' ' + queryParameters.where.names[i] + ' = ?'
            }
        }

        return this.executeQuery(selectStr, queryParameters.where.values)
    }

    insert(values) {
        let query = utils.sanitiseQuery(this.insertColumns(), values)

        let insertStr = "INSERT INTO"
        insertStr += ' ' + this.table()
        insertStr += ' ('
        insertStr += utils.buildCommaSeparatedString(query.names)
        insertStr += ") VALUES ("
        insertStr += utils.buildCommaSeparatedQMs(query.values.length)
        insertStr += ")"
        return this.executeQuery(insertStr, query.values)
    }

    update(id, values) {
        let query = utils.sanitiseQuery(this.insertColumns(), values)

        let updateStr = "UPDATE"
        updateStr += ' ' + this.table()
        updateStr += ' SET '
        updateStr += utils.buildCommaSeparatedString(query.names, false, " = ?")
        updateStr += " WHERE"
        updateStr += " ID"
        updateStr += " = ?"

        query.values.push(id)
        return this.executeQuery(updateStr, query.values)
    }

    delete(id) {
        let insertStr = "UPDATE"
        insertStr += ' ' + this.table()
        insertStr += ' SET'
        insertStr += "  isDeleted"
        insertStr += " ="
        insertStr += " TRUE"
        insertStr += " WHERE"
        insertStr += " ID"
        insertStr += " = ?"
        return this.executeQuery(insertStr, id)
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

    update(id, firstName, secondName, emailAddress, isAdmin, passwordHash, salt, isPending = true) {
        return super.update(id, [firstName, secondName, emailAddress, passwordHash, salt, isAdmin, isPending])
    }

    authenticateUser(emailAddress, passwordHash) {
        return super.select({
            whereNames: [super.columns().emailAddress, super.columns().passwordHash, super.columns().isAdmin, super.columns().isPending], 
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

    update(id, note, userId, contactId) {
        return super.update(id, [contactId, userId, note])
    }
}

exports.Companies = class Companies extends MySqlConnection {
    constructor() {
        var columns = {
            id: 'id',
            name: 'name',
            type: 'type',
            industry: 'industry',
            isDeleted: 'isDeleted'
        }

        var selectCols = [columns.id, columns.name, columns.type, columns.industry, columns.isDeleted]
        var insertCols = [columns.name, columns.type, columns.industry]
        super('companies', columns, selectCols, insertCols)
    }

    insert(name, type, industry) {
        return super.insert([name, type, industry])
    }

    update(id, name, type, industry) {
        return super.update(id, [name, type, industry])
    }
}

exports.Contacts = class Contacts extends MySqlConnection {
    constructor() {
        var columns = {
            id: 'id',
            firstName: 'firstName',
            secondName: 'secondName',
            companyId: 'companyId',
            isDeleted: 'isDeleted'
        }

        var selectCols = [columns.id, columns.firstName, columns.secondName, columns.companyId, columns.isDeleted]
        var insertCols = [columns.firstName, columns.secondName, columns.companyId]
        super('contacts', columns, selectCols, insertCols)
    }

    insert(firstName, secondName, companyId) {
        return super.insert([firstName, secondName, companyId])
    }

    update(id, firstName, secondName, companyId) {
        return super.update(id, [firstName, secondName, companyId])
    }
}

exports.PhoneNumbers = class PhoneNumbers extends MySqlConnection {
    constructor() {
        var columns = {
            id: 'id',
            contactId: 'contactId',
            companyId: 'companyId',
            phoneNumber: 'phoneNumber',
            label: 'label',
            precedence: 'precedence',
            isDeleted: 'isDeleted'
        }

        var selectCols = [columns.id, columns.contactId, columns.companyId, columns.phoneNumber, columns.label, columns.precedence, columns.isDeleted]
        var insertCols = [columns.contactId, columns.companyId, columns.phoneNumber, columns.label, columns.precedence]
        super('phoneNumbers', columns, selectCols, insertCols)
    }

    insert(contactId, companyId, phoneNumber, label, precedence) {
        return super.insert([contactId, companyId, phoneNumber, label, precedence])
    }

    update(id, contactId, companyId, phoneNumber, label, precedence) {
        return super.update(id, [contactId, companyId, phoneNumber, label, precedence])
    }
}