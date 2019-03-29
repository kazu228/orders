var express = require('express');
var router = express.Router();

var mysql = require('mysql');

//mysql of config
var mysql_setting = {
    host: '192.168.0.220',
    user: 'root',
    password: 'kikaku',
    database: 'my-nodeapp-db'
};

// get access of prosec]s\\
router.get('/', (req, res, next) => {
    // ready connection
    var connection = mysql.createConnection(mysql_setting);
    // connect base
    connection.connect();

    // read data
    connection.query('SELECT * from mydata', function (error, results, fields) {
        if (error == null) {
            var data = {
                title: 'mysql',
                content: results
            };
            res.render('mytable', data);
        }
    });

    connection.end();
});

module.exports = router;