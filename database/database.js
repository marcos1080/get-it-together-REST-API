var mysql = require("mysql");

function createConnection(host, port, database, user, password) {
    return mysql.createConnection({
        host:       host,
        port:       port,
        database:   database,
        user:       user,
        password:   password
    });
}

function createConnectionMultipleStatement(host, port, database, user, password) {
    return mysql.createConnection({
        multipleStatements  : true,
        host:       host,
        port:       port,
        database:   database,
        user:       user,
        password:   password
    });
}

function performQuery(query, connection) {
    connection.connect(err => {
        if (err) {
            console.error('Could not connect to the database!\n' + err.message);
            throw err;
        }

        connection.query(query, (err, results, fields) => {
            if (err) {
                console.log(err.message);
                throw err;
            }
        });

        connection.end(err => {
            if (err) {
                console.error('Error disconnecting from the database!\n' + err.message);
                throw err;
            }
        });
    });
}

class Database {
    constructor(host, port, database, user, password) {
        console.log('Initialising database');
        // Set config variables.
        this.host = host;
        this.port = port;
        this.database = database;
        this.user = user;
        this.password = password;
    }

    // Initialise database;
    initialise() {
        // Load schemas
        const schemas = require(__dirname + '/schema.js');

        let connection = createConnectionMultipleStatement(
            this.host,
            this.port,
            this.database,
            this.user,
            this.password
        );

        performQuery(schemas, connection);
    }

    destroy() {
        let connection = createConnectionMultipleStatement(
            this.host,
            this.port,
            this.database,
            this.user,
            this.password
        );

        const query = `
            SET FOREIGN_KEY_CHECKS = 0;\n
            SET GROUP_CONCAT_MAX_LEN=32768;\n
            SET @tables = NULL;\n
            SELECT GROUP_CONCAT('\`', table_name, '\`') INTO @tables\n
                FROM information_schema.tables\n
                WHERE table_schema = (SELECT DATABASE());\n
            SELECT IFNULL(@tables,'dummy') INTO @tables;\n

            SET @tables = CONCAT('DROP TABLE IF EXISTS ', @tables);\n
            PREPARE stmt FROM @tables;\n
            EXECUTE stmt;\n
            DEALLOCATE PREPARE stmt;\n
            SET FOREIGN_KEY_CHECKS = 1;\n`;

        performQuery(query, connection);
    }
}

module.exports = (host, port, database, user, password) => {
    return new Database(host, port, database, user,password);
};