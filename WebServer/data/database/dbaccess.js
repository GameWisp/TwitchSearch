var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'pw',
    database: 'db'
});

module.exports.start = function(){
    conn.connect();
    console.log('Connection to database established');
};

module.exports.end = function(){
    conn.end();
    console.log('Connection to database closed');
};

module.exports.query = function(query, params, success_callback, error_callback) {
    var dataset = [];
    conn.query(query, params).on('error', function (err) {
        error_callback(err);
    }).on('result', function (row) {
        conn.pause();
        dataset.push(row);
        conn.resume();
    }).on('end', function () {
        success_callback(dataset);
    });
};