const mysql = require('mysql');
const config = require("dotenv").config().parsed;

class Sql {
    constructor() {  }

    #createConnection() {
        return mysql.createConnection({
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_NAME
        });
    }

    query(query, params, callback) {
        const con = this.#createConnection();
        
        con.connect(function(err) {
            if(err) throw err;
            
            con.query(query, function (qErr, result, fields) {
                
                // if any error while executing above query, throw error
                if (qErr) throw qErr;
                // if there is no error, you have the result
                return callback(result);
            });
        });
        console.log(params);
        return params;
    }
}

module.exports = Sql;